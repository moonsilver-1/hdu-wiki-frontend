"""Render the voiced friendship story; run generate-story-audio.py first.

Uses existing sticker PNGs, a generated final-stage illustration and real site captures.
The subtle instrumental bed and applause are synthesized locally from scratch.
"""
from pathlib import Path
import argparse
import functools
import json
import math
import subprocess
import wave

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
W, H, FPS, RATE = 1280, 720, 24, 48000
PAPER, INK, GREEN = '#F8F4EA', '#4D3C2D', '#607258'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--audio', type=Path, default=ROOT / 'output/story-audio')
    parser.add_argument('--stickers', type=Path, default=ROOT / 'public/stickers')
    parser.add_argument('--output', type=Path, default=ROOT / 'public/promo')
    parser.add_argument('--checks-only', action='store_true')
    parser.add_argument('--scene', type=int, nargs='+', help='One-based scene numbers for targeted still-frame checks')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    timeline = json.loads((args.audio / 'timeline.json').read_text(encoding='utf-8'))
    scenes, duration = timeline['scenes'], timeline['duration']
    selected = {n-1 for n in args.scene} if args.scene else set(range(len(scenes)))
    if args.scene and (not args.checks_only or not selected.issubset(range(len(scenes)))):
        parser.error('--scene requires --checks-only and valid one-based scene numbers')
    fonts = {size:ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',size) for size in [16,18,20,22,26,28,32,36,42,48,64]}
    bold = {size:ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc',size) for size in [18,22,26,30,32,36,40,48,64]}
    stage = ImageOps.fit(Image.open(Path(__file__).with_name('story-art') / 'stage.png').convert('RGB'), (W,H))
    logo = Image.open(ROOT / 'public/mascot-wiki-64.png').convert('RGBA').resize((32,32))
    stickers = {}
    for i,scene in enumerate(scenes):
        if i not in selected:
            continue
        if scene['setting'] == 'stage':
            continue
        for role in ('boy','girl'):
            key = (role,scene[role])
            if key not in stickers:
                file = args.stickers / role / f'{scene[role]}.png'
                if not file.exists():
                    file = ROOT / 'public/stickers' / role / f'{scene[role]}.png'
                stickers[key] = Image.open(file).convert('RGBA')
    captures = {s['screen']:Image.open(Path(__file__).with_name('captures')/s['screen']).convert('RGB')
                for s in scenes if 'screen' in s}

    def center(d, text, y, font, fill=INK, x=W/2):
        d.text((x-d.textlength(text,font=font)/2,y),text,font=font,fill=fill)

    def wrapped(d, text, width, font):
        lines, current = [], ''
        for char in text:
            if current and d.textlength(current+char,font=font)>width:
                lines.append(current)
                current=char
            else:
                current+=char
        return lines+[current]

    @functools.lru_cache(maxsize=200)
    def character(role, number, size):
        return ImageOps.contain(stickers[(role,number)],(size,size),Image.Resampling.LANCZOS)

    def frame_for(index,t):
        s=scenes[index]
        elapsed=t-s['start']
        if s['setting']=='stage':
            # Stay on the same shared stage all the way through the last frame.
            stage_start=next(x['start'] for x in scenes if x['setting']=='stage')
            amount=1+.015*(t-stage_start)/(duration-stage_start)
            enlarged=stage.resize((round(W*amount),round(H*amount)),Image.Resampling.BICUBIC)
            im=ImageOps.fit(enlarged,(W,H))
            d=ImageDraw.Draw(im)
            center(d,s['chapter'],24,bold[30])
            if index==len(scenes)-1:
                d.rounded_rectangle((430,78,850,113),16,fill='#FFF9EB')
                center(d,'杭电 Wiki · www.hdu-wiki.cn',83,fonts[22],GREEN)
            if s['role']=='crowd':
                for j,(x,y) in enumerate([(160,407),(1094,394),(269,511),(1020,530)]):
                    lift=round(6*math.sin(elapsed*5+j))
                    d.rounded_rectangle((x-82,y+lift,x+82,y+66+lift),18,fill='#FFF9EB',outline='#B78A4B',width=2)
                    center(d,'GOAT!',y+7+lift,bold[36],GREEN,x=x)
        else:
            im=Image.new('RGB',(W,H),PAPER)
            d=ImageDraw.Draw(im)
            # Quiet paper set; character reactions and dialogue carry the story.
            d.ellipse((-140,310,560,950),fill='#E9EEDC')
            d.ellipse((810,300,1460,950),fill='#F5E1C8')
            im.paste(logo,(43,27),logo)
            d.text((87,30),'杭电 Wiki · 好朋友的小故事',font=fonts[18],fill=GREEN)
            d.text((1080,32),'SHEEP → GOAT',font=fonts[16],fill=GREEN)
            center(d,s['chapter'],100,bold[36])
            active=s['role']
            bubble=(230,170,1050,290)
            d.rounded_rectangle(bubble,24,fill='#FFFEF9',outline='#DFD8C8',width=2)
            tipx=395 if active=='boy' else 885
            d.polygon([(tipx-18,288),(tipx+18,288),(tipx,312)],fill='#FFFEF9')
            lines=wrapped(d,s['text'],750,fonts[28])
            for j,line in enumerate(lines):
                center(d,line,190+(2-len(lines))*14+j*39,fonts[28])
            if s['setting'] in ('desk','notes'):
                d.rounded_rectangle((440,437,840,579),12,fill='#C9B59B')
                d.rounded_rectangle((482,331,798,526),12,fill='#857C6C')
                d.rounded_rectangle((493,341,787,512),5,fill='#FDFCF7')
                if s.get('screen'):
                    shot=ImageOps.fit(captures[s['screen']],(286,163),centering=(.5,0))
                    im.paste(shot,(497,345))
                elif index==7:
                    d.ellipse((600,367,680,447),fill=GREEN)
                    d.line([(619,408),(634,423),(661,391)],fill='#FFFFFF',width=7,joint='curve')
                    center(d,'运行成功',460,fonts[20],GREEN)
                else:
                    for row,width in enumerate([173,209,137,192]):
                        d.rounded_rectangle((520,365+row*28,520+width,373+row*28),3,fill='#B3BDA4' if row!=2 else '#D3A38A')
                d.polygon([(475,523),(805,523),(826,541),(454,541)],fill='#A39988')
            else:
                d.rounded_rectangle((478,336,804,542),15,fill='#FFFDF6',outline='#C9B59B',width=3)
                center(d,'分享练习',355,bold[26],GREEN)
                for j,label in enumerate(['01  我们遇到了什么','02  我们怎么解决','03  还可以怎样改进']):
                    d.text((505,410+j*36),label,font=fonts[18],fill=INK)
            for role,x in [('boy',82),('girl',842)]:
                speaking=active==role
                size=358 if speaking else 338
                sprite=character(role,s[role],size)
                bob=round(3*math.sin(elapsed*5)) if speaking else 0
                y=598-sprite.height+bob
                im.paste(sprite,(x+(358-sprite.width)//2,y),sprite)
                d.rounded_rectangle((x+88,594,x+269,623),14,fill=GREEN if role=='boy' else '#B47B51')
                center(d,'小羊学长' if role=='boy' else '小羊学姐',597,fonts[18],'#FFFFFF',x=x+178)
        # Burned-in captions remain readable in shared MP4s without a sidecar file.
        overlay=Image.new('RGBA',(W,H),(0,0,0,0))
        od=ImageDraw.Draw(overlay)
        od.rounded_rectangle((40,641,1240,702),16,fill=(39,42,33,224))
        name={'boy':'学长','girl':'学姐','crowd':'台下的同学们'}[s['role']]
        caption=f'{name}：{s["text"]}'
        font=fonts[26] if od.textlength(caption,font=fonts[26])<1150 else fonts[22]
        center(od,caption,656,font,'#FFFFFF')
        im=Image.alpha_composite(im.convert('RGBA'),overlay).convert('RGB')
        return im

    def frame(t):
        index=next((i for i,s in enumerate(scenes) if s['start']<=t<s['end']),len(scenes)-1)
        im=frame_for(index,t)
        elapsed=t-scenes[index]['start']
        if index and elapsed<.20 and scenes[index]['setting']!=scenes[index-1]['setting']:
            im=Image.blend(frame_for(index-1,scenes[index]['start']-.001),im,elapsed/.20)
        return im

    checks=ROOT/'output/story-checks'
    checks.mkdir(parents=True,exist_ok=True)
    for i,s in enumerate(scenes):
        if i not in selected:
            continue
        frame((s['start']+s['end'])/2).save(checks/f'{i+1:02d}.jpg',quality=92)
    poster=frame_for(len(scenes)-1,duration-2)
    poster.save(args.output/'hdu-friends-poster.jpg',quality=90,optimize=True)
    def stamp(t):
        ms=round(t*1000)
        return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'
    vtt=['WEBVTT','']
    for s in scenes:
        name={'boy':'学长','girl':'学姐','crowd':'台下的同学们'}[s['role']]
        vtt.extend([f'{stamp(s["start"])} --> {stamp(s["end"])}',f'{name}：{s["text"]}',''])
    (args.output/'hdu-friends.zh.vtt').write_text('\n'.join(vtt),encoding='utf-8')
    if args.checks_only:
        print(f'Checked {len(selected)} scenes; duration {duration:.2f}s')
        return
    with wave.open(str(args.audio/'dialogue.wav'),'rb') as wav:
        voice=np.frombuffer(wav.readframes(wav.getnframes()),dtype='<i2').astype(np.float32)/32768
    music=np.zeros(len(voice),dtype=np.float32)
    # Original quiet arpeggio; voice is foreground throughout.
    notes=[261.63,329.63,392,523.25,220,261.63,329.63,440,174.61,220,261.63,349.23,196,246.94,293.66,392]
    for i,onset in enumerate(np.arange(0,duration,.72)):
        start=int(onset*RATE)
        n=min(int(2.3*RATE),len(music)-start)
        tt=np.arange(n)/RATE
        envelope=(1-np.exp(-tt*80))*np.exp(-tt*2.7)
        freq=notes[i%len(notes)]
        tone=(np.sin(2*np.pi*freq*tt)+.28*np.sin(4*np.pi*freq*tt)+.08*np.sin(6*np.pi*freq*tt))*envelope
        music[start:start+n]+=.018*tone
    crowd_scene=next(s for s in scenes if s['role']=='crowd')
    rng=np.random.default_rng(2026)
    for onset in np.arange(crowd_scene['start'],duration,.14):
        start=int((onset+rng.uniform(0,.08))*RATE)
        n=min(3600,len(music)-start)
        if n<=0:continue
        noise=rng.normal(0,1,n)
        noise=np.convolve(noise,[.25,.5,.25],mode='same')
        envelope=np.exp(-np.arange(n)/(RATE*.014))
        music[start:start+n]+=(noise*envelope*.035).astype(np.float32)
    fade=min(int(RATE*1.2),len(music))
    music[:fade]*=np.linspace(0,1,fade)
    music[-fade:]*=np.linspace(1,0,fade)
    mix=voice+music
    mix*=min(1,.95/np.max(np.abs(mix)))
    mixed=args.audio/'mixed.wav'
    with wave.open(str(mixed),'wb') as wav:
        wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(RATE)
        wav.writeframes((mix*32767).astype('<i2').tobytes())
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
    target=args.output/'hdu-friends.mp4'
    process=subprocess.Popen([ffmpeg,'-y','-v','warning','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}',
        '-r',str(FPS),'-i','-','-i',str(mixed),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','fast',
        '-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',str(target)],stdin=subprocess.PIPE)
    try:
        for i in range(math.ceil(duration*FPS)):
            process.stdin.write(np.asarray(frame(i/FPS)).tobytes())
            if i%(FPS*10)==0: print(f'Rendered {i/FPS:.0f}/{duration:.0f}s',flush=True)
    finally:
        process.stdin.close()
    if process.wait()!=0:raise SystemExit('Video encoding failed')
    print(f'Created {target} ({target.stat().st_size:,} bytes)',flush=True)


if __name__=='__main__':
    main()
