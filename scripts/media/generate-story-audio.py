"""Generate two synthetic character voices, crowd chant and a sample-accurate timeline.

Requires edge-tts, imageio-ffmpeg and numpy. Reuses clips with matching text/voice.
Only the authored dialogue is sent to Microsoft's speech synthesis service.
"""
import argparse
import asyncio
import hashlib
import json
import os
import socket
from pathlib import Path
import subprocess
import wave

import edge_tts
import aiohttp
import imageio_ffmpeg
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
RATE = 48000


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT / 'output/story-audio')
    parser.add_argument('--offline', action='store_true', help='Require cached speech clips; never contact the synthesis service')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    story = json.loads((Path(__file__).with_name('story.json')).read_text(encoding='utf-8'))
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    async def download(text, voice, mp3):
        for attempt in range(8):
            try:
                await edge_tts.Communicate(text, voice, rate='+3%', connect_timeout=10,
                                          connector=aiohttp.TCPConnector(family=socket.AF_INET),
                                          proxy=os.environ.get('STORY_TTS_PROXY')).save(str(mp3))
                return
            except Exception:
                mp3.unlink(missing_ok=True)
                if attempt == 7:
                    raise
                await asyncio.sleep(2)

    def speech(text, voice):
        key = hashlib.sha256(f'{text}|{voice}|+3%'.encode()).hexdigest()[:16]
        mp3 = args.output / f'{key}.mp3'
        if not mp3.exists() or mp3.stat().st_size < 1000:
            if args.offline:
                raise FileNotFoundError(f'Missing cached speech clip: {mp3}')
            asyncio.run(download(text, voice, mp3))
        pcm = subprocess.run([ffmpeg, '-v', 'error', '-i', str(mp3), '-f', 'f32le',
                              '-ac', '1', '-ar', str(RATE), '-'], capture_output=True, check=True)
        return np.frombuffer(pcm.stdout, dtype='<f4').copy()

    tracks, timeline, cursor = [], [], 0
    for i, scene in enumerate(story['scenes']):
        if scene['role'] == 'crowd':
            # Layer separately synthesized voices, then repeat the cheering group.
            male = speech('GOAT!', story['voices']['boy'])
            female = speech('GOAT!', story['voices']['girl'])
            chant = np.zeros(RATE * 6, dtype=np.float32)
            for onset in (0.2, 1.9, 3.6):
                for voice, delay, gain, speed in [(male, 0, .32, 1), (female, .09, .32, 1),
                                                  (male, .16, .18, .94), (female, .22, .18, 1.06)]:
                    data = np.interp(np.arange(0, len(voice), speed), np.arange(len(voice)), voice)
                    start = int((onset + delay) * RATE)
                    stop = min(len(chant), start + len(data))
                    chant[start:stop] += gain * data[:stop-start]
            spoken = chant
        else:
            spoken = speech(scene['text'], story['voices'][scene['role']])
        duration = max(scene.get('min_duration', 0), len(spoken) / RATE + .75)
        count = int(np.ceil(duration * 24) / 24 * RATE)
        clip = np.zeros(count, dtype=np.float32)
        # A short pause lets each new reaction register before the voice starts.
        offset = int(.16 * RATE)
        clip[offset:offset+len(spoken)] = spoken
        timeline.append({**scene, 'start':cursor / RATE, 'end':(cursor + count) / RATE})
        tracks.append(clip)
        cursor += count
        print(f"Voice {i+1}/{len(story['scenes'])}: {scene['role']} ({count/RATE:.2f}s)", flush=True)
    mix = np.concatenate(tracks)
    peak = np.max(np.abs(mix))
    if peak:
        mix *= min(1.4, .87 / peak)
    with wave.open(str(args.output / 'dialogue.wav'), 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
    result = {'title':story['title'], 'duration':len(mix)/RATE, 'voices':story['voices'],
              'voice_type':'synthetic', 'scenes':timeline}
    (args.output / 'timeline.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Created {len(mix)/RATE:.2f}s dialogue with crowd chant.', flush=True)


if __name__ == '__main__':
    main()
