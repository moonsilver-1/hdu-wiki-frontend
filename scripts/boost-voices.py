# 语音祝福响度统一：public/welcome/voices/*.m4a 两遍式线性响度归一到 -10 LUFS（手机外放清亮有力）
# 用法: python scripts/boost-voices.py   （新语音进来后跑一遍即可）
import glob, os, subprocess, sys, json
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
TARGET = "public/welcome/voices"
TARGET_I, TARGET_TP, TARGET_LRA = "-10", "-1.0", "9"

files = sorted(glob.glob(os.path.join(TARGET, "*.m4a")))
if not files:
    sys.exit("voices 目录里没有 .m4a 文件")

def measure(f):
    r = subprocess.run([FFMPEG, "-hide_banner", "-i", f,
                        "-af", f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA={TARGET_LRA}:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True)
    stderr = r.stderr
    js = stderr[stderr.rfind("{"):stderr.rfind("}") + 1]
    return json.loads(js)

print(f"两遍式处理 {len(files)} 个语音文件（loudnorm 线性归一 → {TARGET_I} LUFS）")
for f in files:
    m = measure(f)
    tmp = f + ".tmp.m4a"
    af = (f"loudnorm=I={TARGET_I}:TP={TARGET_TP}:LRA={TARGET_LRA}"
          f":measured_I={m['input_i']}:measured_TP={m['input_tp']}"
          f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
          f":offset={m['target_offset']}:linear=true")
    subprocess.run([FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-i", f,
                    "-af", af, "-c:a", "aac", "-b:a", "96k", tmp], check=True)
    before = os.path.getsize(f)
    os.replace(tmp, f)
    print(f"  {os.path.basename(f)}: {m['input_i']} -> {TARGET_I} LUFS ({before//1024}KB -> {os.path.getsize(f)//1024}KB) ✓")
print("完成")
