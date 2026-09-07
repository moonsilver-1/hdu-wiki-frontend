# 语音祝福响度统一：把 public/welcome/voices/*.m4a 全部响度归一到 -13 LUFS（手机外放开得清亮）
# 用法: python scripts/boost-voices.py   （新语音进来后跑一遍即可）
import glob, os, subprocess, sys
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
TARGET = "public/welcome/voices"

files = sorted(glob.glob(os.path.join(TARGET, "*.m4a")))
if not files:
    sys.exit("voices 目录里没有 .m4a 文件")
print(f"处理 {len(files)} 个语音文件（loudnorm → -13 LUFS）")
for f in files:
    tmp = f + ".tmp.m4a"
    cmd = [
        FFMPEG, "-y", "-hide_banner", "-loglevel", "error",
        "-i", f,
        "-af", "loudnorm=I=-13:TP=-1.5:LRA=9",
        "-c:a", "aac", "-b:a", "96k",
        tmp,
    ]
    subprocess.run(cmd, check=True)
    before = os.path.getsize(f)
    os.replace(tmp, f)
    print(f"  {os.path.basename(f)}: {before//1024}KB -> {os.path.getsize(f)//1024}KB ✓")
print("完成")
