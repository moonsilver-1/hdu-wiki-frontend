# 网站一分钟演示

成片：`public/promo/hdu-wiki-tour.mp4`，60 秒、1280×720、24 fps、H.264、无音轨，约 1.96 MB。中文字幕已经烧录，另附 WebVTT 字幕供需要时开启。`/tour` 使用原生播放器，首页入口不会预加载影片。

## 镜头

| 时间 | 内容 |
| --- | --- |
| 0–4 秒 | 现有小羊标志与片名 |
| 4–17 秒 | 网站首页、打开搜索、搜索 Strassen |
| 17–30 秒 | 进入笔记、目录跳转、公式推导 |
| 30–40 秒 | 新生指南与选课段落 |
| 40–48 秒 | 手机亮色 / 暗色阅读 |
| 48–54 秒 | 投稿入口（没有提交文章） |
| 54–60 秒 | 网站地址 |

素材是本次用浏览器实际操作本地生产版网站采集的截图，位于 `scripts/media/captures/`。影片通过转场、镜头平移和操作指针重现流程，没有虚构文章或页面，也不是连续录屏。使用仓库已有小羊标志，没有新增第三方音乐或配音。

## 重新生成

需要 Python、Pillow、numpy、imageio-ffmpeg，以及可供本机使用的中文字库：

```powershell
python scripts/media/render-tour.py --captures scripts/media/captures
```

脚本默认使用 Windows 微软雅黑；其他系统用 `--font`、`--bold-font` 指定本机字体路径。字体文件不随项目分发。输出 MP4、海报和 VTT；抽帧验收图保存在 `output/tour-checks/`。

网站内容大幅调整后，应重新通过浏览器采集这些实际页面再导出。日常网站构建直接使用已导出的影片，不要求安装 Python 或 FFmpeg。
