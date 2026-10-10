# 把像素素材的白纸底转成透明底（替代运行时的 SVG 滤镜，大幅降低渲染开销）
# 用法: python scripts/make-sprites-transparent.py
from PIL import Image
import os

FILES = ["public/welcome/walk-atlas.png", "public/welcome/assets.png"]
BACKUP = ".welcome-originals"
# 白纸底约 #f7f3ea(≈247)；≥HIGH 全透明，LOW~HIGH 之间线性过渡（保住描边抗锯齿）
LOW, HIGH = 225, 247

os.makedirs(BACKUP, exist_ok=True)
for path in FILES:
    name = os.path.basename(path)
    backup = os.path.join(BACKUP, name)
    if not os.path.exists(backup):
        with open(path, "rb") as src, open(backup, "wb") as dst:
            dst.write(src.read())
    im = Image.open(backup).convert("RGB")
    rgba = Image.new("RGBA", im.size)
    px = im.load()
    out = rgba.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b = px[x, y]
            lum = (r + g + b) / 3
            if lum >= HIGH:
                out[x, y] = (r, g, b, 0)
            elif lum >= LOW:
                alpha = int(255 * (HIGH - lum) / (HIGH - LOW))
                out[x, y] = (r, g, b, alpha)
            else:
                out[x, y] = (r, g, b, 255)
    rgba.save(path, optimize=True)
    print(f"{name}: 白底已转透明（备份在 {BACKUP}/{name}）")
