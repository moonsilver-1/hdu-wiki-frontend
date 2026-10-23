"""Validate and publish exactly 50 original PNGs per character, without resizing.

Full-size originals are retained. The website offers one ZIP per character to
keep each static file below Git's 100 MiB limit; a combined ZIP is local output.
"""
from pathlib import Path
import hashlib
import json
import shutil
import zipfile

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
WORKSPACE = ROOT.parent


def main():
    old = json.loads((WORKSPACE/'sheep-stickers-200/captions.json').read_text(encoding='utf-8'))
    draft = json.loads((WORKSPACE/'sheep-stickers-200/captions-full-draft.json').read_text(encoding='utf-8'))
    extra = json.loads((Path(__file__).with_name('stickers')/'expansion.json').read_text(encoding='utf-8'))
    reused = [x for x in draft if x['id'] in {'004','005','006','008','009','010'}]
    catalog = sorted(old+reused+[{k:x[k] for k in ('id','category','caption')} for x in extra],key=lambda x:x['id'])
    assert len(catalog)==50 and len({x['id'] for x in catalog})==50
    staged = WORKSPACE/'output/media-v2/stickers'
    published = ROOT/'public/stickers'
    rows, hashes = [], set()
    for role in ('boy','girl'):
        for item in catalog:
            source = (staged if int(item['id'])>=101 else WORKSPACE/'sheep-stickers-200')/role/f'{item["id"]}.png'
            if not source.exists():
                raise SystemExit(f'Missing original: {source}')
            with Image.open(source) as im:
                assert im.mode=='RGBA', f'RGBA required: {source}'
                assert min(im.size)>=512, f'Original resolution required: {source}'
                alpha=im.getchannel('A')
                assert alpha.getextrema()==(0,255), f'Transparent background required: {source}'
            digest=hashlib.sha256(source.read_bytes()).hexdigest()
            assert digest not in hashes, f'Duplicate: {source}'
            hashes.add(digest)
            rows.append({**item,'role':role,'source':str(source),'sha256':digest,'bytes':source.stat().st_size})
    # Complete preflight before updating either the website catalog or originals.
    packs=[]
    readme='小羊学长 / 小羊学姐表情包\n每位角色50张，共100张。\n每张均为独立的透明PNG原图。\n手机可打开原图长按保存。\n图像由内置ImageGen生成。\n'
    def write_zip(target, selected):
        with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
            for row in selected:
                folder='学长' if row['role']=='boy' else '学姐'
                archive.write(row['source'],f'{folder}/{row["id"]}-{row["caption"]}.png')
            archive.writestr('使用说明.txt',readme)
            archive.writestr('清单.json',json.dumps([{k:v for k,v in row.items() if k!='source'} for row in selected],ensure_ascii=False,indent=2))
        with zipfile.ZipFile(target) as archive:
            assert archive.testzip() is None
            for row in selected:
                folder='学长' if row['role']=='boy' else '学姐'
                data=archive.read(f'{folder}/{row["id"]}-{row["caption"]}.png')
                assert hashlib.sha256(data).hexdigest()==row['sha256']
    for role,label in [('boy','学长'),('girl','学姐')]:
        filename=f'sheep-{role}-50.zip'
        target=staged/filename
        write_zip(target,[r for r in rows if r['role']==role])
        assert target.stat().st_size<100*1024*1024,'Split archive exceeds hosting limit'
        packs.append({'role':role,'label':f'下载{label} 50 张','url':f'/stickers/{filename}',
                      'size':f'{target.stat().st_size/1_000_000:.1f} MB','count':50})
    write_zip(staged/'sheep-stickers-100.zip',rows)
    for row in rows:
        destination=published/row['role']/f'{row["id"]}.png'
        if not destination.exists():
            shutil.copy2(row['source'],destination)
        else:
            assert hashlib.sha256(destination.read_bytes()).hexdigest()==row['sha256']
    for pack in packs:
        shutil.copy2(staged/Path(pack['url']).name,published/Path(pack['url']).name)
    (ROOT/'lib/sticker-captions.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (ROOT/'lib/sticker-packs.json').write_text(json.dumps(packs,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (staged/'validation.json').write_text(json.dumps({'count':len(rows),'packs':packs,'images':rows},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'Validated {len(rows)} original transparent PNGs; published two role ZIPs.',flush=True)


if __name__=='__main__':
    main()
