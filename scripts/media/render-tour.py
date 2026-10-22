"""Render the 60-second site tour from screenshots captured through the browser UI.

Usage: python scripts/media/render-tour.py --captures scripts/media/captures
Requires Pillow, numpy and imageio-ffmpeg. No network access or browser automation.
"""
from pathlib import Path
import argparse
import subprocess

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
W, H, FPS = 1280, 720, 24
PAPER, INK, GREEN, MUTED = '#F7F5ED', '#293A2C', '#516C43', '#687360'
SCENES = [
    (0, 4, 'intro', '', '杭电 Wiki，用一分钟看看怎么用。'),
    (4, 9, '01-home.jpg', '01  找文章', '课程笔记、校园指南、技术文章，都在这里。'),
    (9, 11, '02-search-empty.jpg', '01  找文章', '点开搜索，输入你想找的内容。'),
    (11, 17, '03-search-results.jpg', '01  找文章', '比如搜 Strassen，找到这篇矩阵乘法笔记。'),
    (17, 23, '04-article.jpg', '02  看笔记', '打开文章，正文、章节和目录放在一起。'),
    (23, 30, '05-math.jpg', '02  看笔记', '点一下目录，直接跳到公式推导。'),
    (30, 34, '07-guide.jpg', '03  查经验', '刚来杭电，可以从这份新生指南看起。'),
    (34, 40, '08-guide-section.jpg', '03  查经验', '选课、科研、社团，按目录找到需要的部分。'),
    (40, 48, 'mobile', '04  手机上看', '手机也能读。白天用亮色，晚上可以切成暗色。'),
    (48, 54, '09-contribute.jpg', '05  一起写', '有自己的经验，点“投稿”就能开始写。'),
    (54, 60, 'outro', '', '打开 www.hdu-wiki.cn，找一篇你现在用得上的。'),
]


def ease(x):
    x = min(1, max(0, x))
    return x * x * (3 - 2 * x)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--captures', type=Path, required=True)
    parser.add_argument('--font', type=Path, default=Path('C:/Windows/Fonts/msyh.ttc'))
    parser.add_argument('--bold-font', type=Path, default=Path('C:/Windows/Fonts/msyhbd.ttc'))
    parser.add_argument('--output', type=Path, default=ROOT / 'public/promo')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    fonts = {size: ImageFont.truetype(str(args.font), size) for size in [16, 18, 20, 24, 27, 30, 36]}
    bold = {size: ImageFont.truetype(str(args.bold_font), size) for size in [22, 28, 40, 48, 58, 72]}
    captures = {p.name: Image.open(p).convert('RGB') for p in args.captures.glob('*.jpg')}
    required = {s[2] for s in SCENES if s[2].endswith('.jpg')} | {'10-mobile-reading.jpg', '11-mobile-dark.jpg'}
    missing = required - captures.keys()
    if missing:
        raise SystemExit(f'Missing real screenshots: {sorted(missing)}')
    logo = Image.open(ROOT / 'public/mascot-wiki-512.png').convert('RGBA')
    logo_small = logo.resize((38, 38), Image.Resampling.LANCZOS)
    logo_large = logo.resize((240, 240), Image.Resampling.LANCZOS)
    # Resize screenshots once. The video pans over their real pixels; it never redraws page text.
    screens = {}
    for name, shot in captures.items():
        width = 1160 if not name.startswith(('10-', '11-')) else 250
        screens[name] = shot.resize((width, round(shot.height * width / shot.width)), Image.Resampling.LANCZOS)
    mask = Image.new('L', (1160, 530), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 1159, 529), 12, fill=255)

    def centered(draw, y, text, font, fill=INK):
        draw.text(((W - draw.textlength(text, font=font)) / 2, y), text, font=font, fill=fill)

    def base(t, chapter=''):
        im = Image.new('RGB', (W, H), PAPER)
        d = ImageDraw.Draw(im)
        im.paste(logo_small, (52, 25), logo_small)
        d.text((103, 29), '杭电 Wiki', font=bold[22], fill=INK)
        d.text((1090, 34), '一分钟介绍', font=fonts[16], fill=MUTED)
        if chapter:
            d.text((275, 34), chapter, font=fonts[18], fill=GREEN)
        d.line((54, 698, 1226, 698), fill='#D9DDCD', width=2)
        d.line((54, 698, 54 + 1172 * t / 60, 698), fill=GREEN, width=3)
        return im

    def cursor(im, x, y, pulse=0):
        layer = Image.new('RGBA', im.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        if pulse > 0:
            r = 12 + 24 * pulse
            d.ellipse((x-r, y-r, x+r, y+r), outline=(78, 105, 57, round(180*(1-pulse))), width=3)
        points = [(x,y),(x+3,y+25),(x+9,y+18),(x+15,y+28),(x+20,y+25),(x+14,y+15),(x+24,y+14)]
        d.polygon(points, fill='#FFFFFF', outline=INK, width=2)
        return Image.alpha_composite(im.convert('RGBA'), layer).convert('RGB')

    def render_scene(index, t):
        start, end, key, chapter, caption = SCENES[index]
        elapsed = t - start
        p = ease(elapsed / (end-start))
        im = base(t, chapter)
        d = ImageDraw.Draw(im)
        if key in ('intro', 'outro'):
            offset = round(18 * (1-ease(elapsed/1.0)))
            im.paste(logo_large, (190, 210+offset), logo_large)
            if key == 'intro':
                d.text((490, 220+offset), '杭电 Wiki', font=bold[72], fill=INK)
                d.text((495, 325+offset), '怎么找文章？怎么看笔记？', font=fonts[30], fill=GREEN)
                d.text((495, 383+offset), '60 秒，实际演示给你看。', font=fonts[24], fill=MUTED)
            else:
                d.text((490, 223+offset), '打开看看。', font=bold[58], fill=INK)
                d.text((495, 325+offset), 'www.hdu-wiki.cn', font=fonts[36], fill=GREEN)
                d.text((495, 390+offset), '课程笔记 / 校园生活 / 技术 / 社团', font=fonts[24], fill=MUTED)
            centered(d, 620, caption, fonts[24])
        elif key == 'mobile':
            d.text((70, 190), '用手机，', font=bold[48], fill=INK)
            d.text((70, 255), '也能好好看。', font=bold[48], fill=INK)
            d.text((74, 350), '正文、公式、目录都在。', font=fonts[27], fill=GREEN)
            d.text((74, 401), '亮色和暗色，按习惯来。', font=fonts[24], fill=MUTED)
            for j, name in enumerate(['10-mobile-reading.jpg','11-mobile-dark.jpg']):
                shot = screens[name]
                x, y = 626+j*292, 96+round((1-ease((elapsed-j*.3)/.8))*14)
                d.rounded_rectangle((x-7,y-7,x+257,y+shot.height+7), 22, fill='#343B31')
                pm = Image.new('L', shot.size, 0)
                ImageDraw.Draw(pm).rounded_rectangle((0,0,249,shot.height-1),17,fill=255)
                im.paste(shot,(x,y),pm)
            centered(d, 660, caption, fonts[24])
        else:
            shot = screens[key]
            max_pan = max(0, shot.height-530)
            pan = round(min(max_pan, 86)*p) if key in ('01-home.jpg','05-math.jpg','08-guide-section.jpg') else 0
            region = shot.crop((0,pan,1160,pan+530))
            d.rounded_rectangle((57,87,1223,623),14,fill='#DDE1D4')
            im.paste(region,(60,90),mask)
            centered(d, 647, caption, fonts[27])
            # Pointer cues correspond to actual search / result / TOC / submit controls in these captures.
            if key == '01-home.jpg' and elapsed>2.4:
                q=ease((elapsed-2.4)/1.7); im=cursor(im,590+327*q,420-298*q, max(0,(elapsed-4.35)/.65))
            elif key == '03-search-results.jpg' and elapsed>2.8:
                q=ease((elapsed-2.8)/2); im=cursor(im,790-385*q,410-134*q,max(0,(elapsed-5.3)/.7))
            elif key == '04-article.jpg' and elapsed>2.5:
                q=ease((elapsed-2.5)/2); im=cursor(im,780+270*q,425-143*q,max(0,(elapsed-5.3)/.7))
        return im

    def frame(t):
        index = next(i for i,s in enumerate(SCENES) if s[0] <= t < s[1])
        im = render_scene(index, t)
        # Short paper-like dissolves retain readable pauses between each real operation.
        if index and t-SCENES[index][0] < .35:
            previous=render_scene(index-1,SCENES[index][0]-.001)
            im=Image.blend(previous, im, ease((t-SCENES[index][0])/.35))
        return im

    # The cover is a real film frame. Keep file size modest for the watch page.
    frame(2).save(args.output/'hdu-wiki-tour-poster.jpg', quality=90, optimize=True)
    vtt=['WEBVTT','']
    stamp=lambda n: f'00:{int(n)//60:02d}:{int(n)%60:02d}.000'
    for start,end,_,_,caption in SCENES:
        vtt.extend([f'{stamp(start)} --> {stamp(end)}',caption,''])
    (args.output/'hdu-wiki-tour.zh.vtt').write_text('\n'.join(vtt),encoding='utf-8')
    checks = ROOT / 'output/tour-checks'
    checks.mkdir(parents=True, exist_ok=True)
    for t in [2, 6, 14, 20, 26, 36, 44, 51, 57]:
        frame(t).save(checks/f'film-check-{t:02}.jpg',quality=92)
    exe=imageio_ffmpeg.get_ffmpeg_exe()
    target=args.output/'hdu-wiki-tour.mp4'
    cmd=[exe,'-y','-loglevel','warning','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
         '-an','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',str(target)]
    process=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(FPS*60):
            process.stdin.write(np.asarray(frame(i/FPS)).tobytes())
            if i % (FPS*10)==0: print(f'Rendered {i//FPS}/60 seconds',flush=True)
    finally:
        process.stdin.close()
    if process.wait()!=0:
        raise SystemExit('Video encoding failed')
    print(f'Created {target} ({target.stat().st_size:,} bytes)',flush=True)


if __name__=='__main__':
    main()
