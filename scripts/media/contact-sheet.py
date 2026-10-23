"""Make labelled inspection sheets, leaving original artwork untouched."""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

parser=argparse.ArgumentParser()
parser.add_argument('paths',nargs='+',type=Path)
parser.add_argument('--output',type=Path,required=True)
args=parser.parse_args()
font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',18)
files=[]
for item in args.paths:
    files.extend(sorted(item.glob('*.png')) if item.is_dir() else [item])
args.output.mkdir(parents=True,exist_ok=True)
for page in range(0,len(files),12):
    sheet=Image.new('RGB',(1200,980),'#F3EFE5')
    draw=ImageDraw.Draw(sheet)
    for i,file in enumerate(files[page:page+12]):
        x,y=(i%4)*300,(i//4)*325
        source=Image.open(file).convert('RGBA')
        art=ImageOps.contain(source,(284,285))
        sheet.paste(art,(x+(300-art.width)//2,y+8),art)
        label=f'{file.parent.name}/{file.stem}'
        draw.text((x+14,y+299),label,font=font,fill='#493E31')
    sheet.save(args.output/f'sheet-{page//12+1:02d}.jpg',quality=94)
print(f'{len(files)} images on {(len(files)+11)//12} sheets')
