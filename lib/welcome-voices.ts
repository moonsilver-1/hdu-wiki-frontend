// 专属语音祝福：幸运儿的姓名哈希 → 语音文件与文案。
// 明天新增语音时：把音频放到 public/welcome/voices/<姓名哈希>.m4a，再在这里加一条即可。
// 响度统一：放好后跑一遍 python scripts/boost-voices.py（loudnorm -13 LUFS，手机外放清亮）。
// 幸运儿姓名 ↔ 哈希对照表由 scripts/build-welcome-roster.py 运行时本地输出，不入库。

export const VOICE_BLESSINGS: { h: string; from: string; text: string; file: string }[] = [
  {
    h: "020a09e2",
    from: "王佳诺学姐",
    text: "愿你在崭新的大学时光里学有所获，奔赴属于自己的熠熠星光。保持热爱勇敢探索，收获充实且热烈的青春！",
    file: "/welcome/voices/020a09e2.m4a",
  },
  {
    h: "123600b7",
    from: "陈佳燚学姐",
    text: "大学是一个充满无限可能的阶段，在这里没有标准答案。愿你大胆探索，试错、沉淀、成长，好好感受生活，找到属于你自己的方向，将这四年过得精彩自在！",
    file: "/welcome/voices/123600b7.m4a",
  },
  {
    h: "41e82f79",
    from: "张航宁学长",
    text: "愿你的 deadline 永远赶得上，周末永远睡得够！",
    file: "/welcome/voices/41e82f79.m4a",
  },
];
