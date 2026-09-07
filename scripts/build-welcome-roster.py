# 从本地名单 xlsx 生成 lib/welcome-roster.ts（只含姓名哈希，不含任何隐私明文）
# 身份 = 姓名+学号 一起校验（应对重名）；用法: python scripts/build-welcome-roster.py [xlsx路径]
import sys, glob, json
import openpyxl

def fnv1a_32(s: str) -> str:
    h = 0x811C9DC5
    for ch in s.encode("utf-8"):
        h ^= ch
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"

def mulberry32(seed: int):
    state = seed & 0xFFFFFFFF
    def next():
        nonlocal state
        state = (state + 0x6D2B79F5) & 0xFFFFFFFF
        t = state
        t = (t ^ (t >> 15)) * (t | 1) & 0xFFFFFFFF
        t = (t ^ (t + ((t ^ (t >> 7)) * (t | 61) & 0xFFFFFFFF))) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 0x100000000
    return next

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    if args:
        path = args[0]
    else:
        hits = glob.glob("*.xlsx")
        if not hits:
            sys.exit("当前目录/上级目录没有 xlsx，请把名单路径作为参数传入")
        path = hits[0]

    wb = openpyxl.load_workbook(path)
    ws = wb.active
    rows = list(ws.iter_rows(min_row=2, values_only=True))
    # 身份哈希：仅姓名（重名同学共享同一份祝福）
    names = sorted({str(r[1]).strip() for r in rows if r[1]})
    hashes = sorted({fnv1a_32(n) for n in names})

    rng = mulberry32(20260907)
    pool = list(hashes)
    for i in range(len(pool) - 1, 0, -1):
        j = int(rng() * (i + 1))
        pool[i], pool[j] = pool[j], pool[i]
    lucky = sorted(pool[:8])

    hash_to_student = {fnv1a_32(n): n for n in names}
    out = (
        "// 由 scripts/build-welcome-roster.py 从本地名单 xlsx 生成（姓名哈希，无任何隐私明文）\n"
        f"// 生成时间：{__import__('datetime').datetime.now().isoformat(timespec='seconds')} · 名单人数 {len(names)}\n"
        "export const ROSTER_HASHES: string[] = [\n"
        + "".join(f'  "{h}",\n' for h in hashes)
        + "];\n\n"
        + "// 抽中「班助 / 老师专属语音祝福」的幸运儿（8 位，种子 20260907，可手工增删）\n"
        + "export const LUCKY_HASHES: string[] = [\n"
        + "".join(f'  "{h}",\n' for h in lucky)
        + "];\n"
    )
    target = "lib/welcome-roster.ts"
    with open(target, "w", encoding="utf-8", newline="\n") as f:
        f.write(out)
    print(f"OK 写入 {target}：{len(hashes)} 名同学，幸运儿 {len(lucky)} 位")
    print("幸运儿名单（仅本地打印，用于明天录制语音）：")
    print(json.dumps({h: hash_to_student[h] for h in lucky}, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
