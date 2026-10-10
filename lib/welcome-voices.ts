// 语音祝福：23 位班助/老师的投稿，全员随机平均分配（每位同学固定绑定一段）。
// 音频文件：public/welcome/voices/seq01.m4a ~ seq23.m4a（序号对应下表）。
// 缺失的文件前端会自动显示「语音整理中」；新文件放入后跑 python scripts/boost-voices.py 统一响度即可。

export type VoiceItem = { seq: number; from: string; role: string; text: string; file: string };

export const VOICES: VoiceItem[] = [
  { seq: 1, from: "张航宁", role: "自动化2班班助", text: "愿你的DDL永远赶得上，你的周末永远睡得够。", file: "/welcome/voices/seq01.m4a" },
  { seq: 2, from: "陈佳燚", role: "人工智能1班班助", text: "大学是一个充满无限可能的阶段，在这里没有标准答案。愿你大胆探索，试错、沉淀、成长，好好感受生活，找到属于你自己的方向，将这四年过得精彩自在！", file: "/welcome/voices/seq02.m4a" },
  { seq: 3, from: "张明月", role: "自动化6班班助", text: "hellohello非常高兴能遇见你，祝你在杭电天天开心、所念所想即所得。", file: "/welcome/voices/seq03.m4a" },
  { seq: 4, from: "叶雨臻", role: "自动化5班班助", text: "新的旅程已经开始。愿你们不被答案定义，在探索中寻找热爱，在积累中形成自己的节奏，走好属于自己的大学之路。", file: "/welcome/voices/seq04.m4a" },
  { seq: 5, from: "韩冰", role: "26级电气辅导员", text: "追光的人，终会光芒万丈；向山而行的人，必将俯瞰云端。", file: "/welcome/voices/seq05.m4a" },
  { seq: 6, from: "于萧阳", role: "智科4班班助", text: "希望大家在大学里不仅能学到知识、增长本领，也能认识更多有趣的人，经历更多有意义的事，带着热爱和勇气，开启属于自己的崭新篇章！", file: "/welcome/voices/seq06.m4a" },
  { seq: 7, from: "王佳诺", role: "自动化1班班助", text: "新序已启，愿你学有所获，岁岁皆有新成长。保持热烈，勇敢拥抱大学生活的无限可能。", file: "/welcome/voices/seq07.m4a" },
  { seq: 8, from: "庄舒蕊", role: "智科3班班助", text: "题海收帆，山海启程。踏入大学新途，愿你岁岁明朗，万事胜意。有独当一面的勇敢，也有永远天真的快乐。", file: "/welcome/voices/seq08.m4a" },
  { seq: 9, from: "王赛", role: "自动化3班班助", text: "青春正好，逐梦前行，祝新生们学业有成，未来可期！", file: "/welcome/voices/seq09.m4a" },
  { seq: 10, from: "施星合", role: "智科1班新生班助", text: "欢迎26级新同学来到杭电！希望大家多尝试、多体验，在学习和生活里慢慢找到节奏，充实度过属于自己的大学时光。", file: "/welcome/voices/seq10.m4a" },
  { seq: 11, from: "柴怡琼", role: "人工智能3班班助", text: "26级的新同学们，你们好，欢迎来到杭电开启新旅程，愿你们保持好奇，大胆去尝试热爱的事，在这里遇见更好的自己。", file: "/welcome/voices/seq11.m4a" },
  { seq: 12, from: "肖敏", role: "人工智能1班班助", text: "哈喽26级的新同学们～欢迎来到杭电！愿你们开启充实又热烈的大学生活，学有所获，祝大家一切顺利！", file: "/welcome/voices/seq12.m4a" },
  { seq: 13, from: "姜博恩", role: "辅导员", text: "同学你好啊！我是辅导员姜博恩，欢迎到杭电来，希望杭电能符合你对大学的所有期望，也希望接下来你能顺顺利利、开开心心！", file: "/welcome/voices/seq13.m4a" },
  { seq: 14, from: "吕承泽", role: "智科2班班助", text: "26级的小伙伴们大家好呀，欢迎来到杭电自动化大家庭，愿大家奔赴热爱，收获闪闪发光的大学时光！", file: "/welcome/voices/seq14.m4a" },
  { seq: 15, from: "周晨宇", role: "自动化四班班助", text: "流水不争先，争的是滔滔不绝。愿你在杭电潜心积淀，奔赴自己的山海。", file: "/welcome/voices/seq15.m4a" },
  { seq: 16, from: "陈乐观", role: "电气3班班助", text: "26级自动化学院的小萌新们，欢迎加入大家庭！愿你们上课听得懂，实验不翻车，代码少bug，吃好喝好快乐玩耍，顺利解锁大学生活新地图。有任何问题随时找班助，祝大家开学快乐～", file: "/welcome/voices/seq16.m4a" },
  { seq: 17, from: "时正浩", role: "电气4班班助", text: "刚刚步入大学的校门，大家心里多少会有些忐忑，但是没关系，这四年的生活将会成为各位人生当中最值得回味的一段时光。大家在大学校园中只管往前走——不管往哪儿走都是往前走。总之，喜欢您来！", file: "/welcome/voices/seq17.m4a" },
  { seq: 18, from: "华伟", role: "电气一班班助", text: "祝同学们玩在杭电，学在杭电，天天开心。", file: "/welcome/voices/seq18.m4a" },
  { seq: 19, from: "萧雅丹", role: "电气2班班助", text: "愿你们如旷野上的夏日长风，永远热烈、自由。", file: "/welcome/voices/seq19.m4a" },
  { seq: 20, from: "倪睿婷", role: "人工智能2班班助", text: "没有绝对的最优选项，只有最适合自己的道路，请谨记“国家大事，千万尽力”的嘱托。", file: "/welcome/voices/seq20.m4a" },
  { seq: 21, from: "黄明杰", role: "人工智能4班班助", text: "未来已来，希望大家永远满怀期待。", file: "/welcome/voices/seq21.m4a" },
  { seq: 22, from: "黄启超", role: "自动化1班班助", text: "欢迎大家加入杭电这个大家庭，开启属于你们的大学生活。愿大家多多大胆尝试，都能在这里找到所爱，收获成长，度过充实又快乐的四年！", file: "/welcome/voices/seq22.m4a" },
  { seq: 23, from: "黄祯琪", role: "辅导员", text: "嗨，恭喜你开到隐藏版祝福，我是辅导员黄祯琪。欢迎你加入自动化，祝你以后代码少bug，考试不挂科，热爱有回应，青春有答案。我们杭电见！", file: "/welcome/voices/seq23.m4a" },
];

export function voiceByIndex(index: number): VoiceItem {
  return VOICES[((index % VOICES.length) + VOICES.length) % VOICES.length];
}
