'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';
import WatchaCanvas from './WatchaCanvas';
import CloudsHero from './CloudsHero';
import BirdsBackground from './BirdsBackground';
import './watcha.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * WatchaPage — 观猹文化墙主页
 *
 * 4 个板块：
 *   01 杭电 × 观猹共建 AI 育人生态
 *   02 玩 AI，上观猹
 *   03 好用产品馆
 *   04 互动展区
 */

// ============ 滚动辅助：详情弹层纵向滚动（阻止 Lenis / 背景页面滚动） ============
const bindVerticalScroll = (node: HTMLDivElement | null) => {
  if (!node) return;
  node.addEventListener('wheel', (e) => {
    e.stopPropagation();
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 横向滚轮交给原生处理
    e.preventDefault();
    const atTop = node.scrollTop <= 0;
    const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
    if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) return;
    node.scrollTop += e.deltaY;
  }, { passive: false });
};

// ============ 滚动辅助：横向滚动容器（滚轮纵向 → 横向滑动，到边缘后回落为纵向） ============
const bindHorizontalScroll = (node: HTMLDivElement | null) => {
  if (!node) return;
  node.addEventListener('wheel', (e) => {
    e.stopPropagation();
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const atStart = node.scrollLeft <= 0;
    const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 1;
    if ((d < 0 && atStart) || (d > 0 && atEnd)) return; // 到边缘 → 冒泡给外层详情页纵向滚动
    e.preventDefault();
    node.scrollLeft += d;
  }, { passive: false });
};

// ============ 板块一数据：校企发展时间线 ============
type TimelineEvent = { year: string; title: string; desc: string };

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2020 年 9 月',
    title: '仲泰入学',
    desc: '仲泰进入杭州电子科技大学卓越学院人工智能专业，开启在杭电的校园学习与 AI 实践。',
  },
  {
    year: '2021 年',
    title: '未央学社成立',
    desc: '针对高数、线代、概率论和专业课程中的学习困难，未央学社成立，在校内推进资料共享、课程答疑以及各类学习活动。',
  },
  {
    year: '2023 年 10 月',
    title: '特工宇宙成立',
    desc: '十余位 00 后组成创业团队，较早专注于 AI Agent 的研究与研发，逐步从内容研究走向技术和产品探索。',
  },
  {
    year: '2024 年 5 月 21 日',
    title: '似一科技成立',
    desc: '团队以公司化方式进一步深耕 AI Agent，开展内容研究、产品研发和解决方案实践，推动行业观察与技术探索走向项目落地。',
  },
  {
    year: '2025 年初',
    title: '捐赠育人基金',
    desc: '团队向母校捐赠 5 万元，设立"AI+思政"育人基金，支持学生参与 AI 活动、科研探索和创新赛事。',
  },
  {
    year: '2025 年 7 月 16 日',
    title: '观猹上线',
    desc: '团队发布观猹，定位为 AI 产品领域的"大众点评"，连接 AI 产品、真实用户与行业讨论，让优质产品被更多人看见。',
  },
  {
    year: '2025 年',
    title: '特工宇宙项目获金奖',
    desc: '"特工宇宙——领先级 AI Agent 开发平台与全链路解决方案供应商"项目获得中国国际大学生创新大赛（2025）金奖。',
  },
  {
    year: '2026 年 1 月',
    title: '环球黑客松',
    desc: '环球黑客松 Global Hackathon Tour 杭州站与上海站相继落地，两站均获得央视主动报道。',
  },
  {
    year: '2026 年 3 月',
    title: 'TokenDance 推出',
    desc: '为开发者和企业提供主流大模型的一站式接入、统一计费与智能调度服务，通过 Token 实体卡将模型算力带入更多实际场景。',
  },
  {
    year: '2026 年 4 月',
    title: '入选杭州"AI 五小凤"',
    desc: '观猹获评杭州"AI 五小凤"代表企业，并获得 CCTV2《经济半小时》专题报道。',
  },
  {
    year: '2026 年 4 月',
    title: '"猹与猹"推出',
    desc: '围绕策划统筹、品牌营销与商业增长，为 AI 产品提供从发掘、孵化到推广和长期陪伴的全周期服务。',
  },
  {
    year: '2026 年 5 月',
    title: '捐赠 2020 亿 Tokens',
    desc: '支持学生体验 Agent 产品，开展 AI 学习、项目开发和创新实践，让创业资源持续回流校园。',
  },
];

const STORY_CARDS = [
  {
    id: 'weiyang',
    title: '成立未央学社：回应真实学习需求',
    intro: '15000+ 社群，辐射全校 3w+ 师生。学业帮扶、答疑活动、学习资料共享，把散落在校园各处的学习者凝聚成真正的学习共同体。',
    paragraphs: [
      '未央学社的诞生，源于一群学生最真实的学习困惑——高数、线代、概率论以及专业课程，上课听不太懂、课后没人问、资料找不到。于是有人把课堂笔记整理成文档、有人拉群做每日答疑、有人组织线下刷题。',
      '从零到一，从十几人到 15000+ 社群，未央学社成了杭电最大的学习共同体之一。资料共享、积分赛、高数辅导讲座……只要是能帮同学把学习这件事变得更轻松的事，学社都愿意尝试。',
      '团队邀请过百万粉丝博主李天意为杭电学生开展高数辅导，组织 Integration Bee 积分赛让严肃的数学比拼也能有趣起来。学习不该只是一个人的事，它可以是一群人一起发光。',
    ],
    images: ['/images/未央学社 Integration Bee 积分赛.png', '/images/邀请百万粉丝博主李天意为杭电学生开展高数辅导.png', '/images/杭州黑客松活动现场.jpg'],
  },
  {
    id: 'fund',
    title: '设立育人基金：支持学生创新实践',
    intro: '捐赠 5 万元育人基金，支持学生科研赛事与创新实践，让更多有想法的同学能够大胆试错、勇敢创造。',
    paragraphs: [
      '2025 年初，团队向母校捐赠 5 万元，设立"AI + 思政"育人基金。',
      '这笔基金专门用来支持杭电学生参与 AI 相关的活动、科研探索和创新赛事。团队希望，每一位对 AI 感兴趣的同学都能找到一个让想法落地的出口。',
      '捐赠不只是钱的事，更是一种承诺：我们从校园走出来，就一定要把资源带回校园。',
    ],
    images: ['/images/仲泰与指导老师李甫.png', '/images/捐赠育人基金.jpg'],
  },
  {
    id: 'teagent',
    title: '特工宇宙获金奖：推动校园实践走向创业',
    intro: '中国国际大学生创新大赛金奖获得者。从校园实践到全国舞台，特工宇宙用实力证明——杭电学子能做最前沿的 AI 产品。',
    paragraphs: [
      '中国国际大学生创新大赛（2025）上，"特工宇宙——领先级 AI Agent 开发平台与全链路解决方案供应商"项目获得全国金奖。',
      '这个奖项的背后，是十余位 00 后组成的创业团队在 AI Agent 方向上的持续深耕。从内容研究到技术探索、从产品原型到企业解决方案，他们用实际成果回应了市场与业界的期待。',
      '对杭电来说，这不仅仅是一枚奖牌——它证明：学生团队完全有能力把课堂上学到的知识，变成真正领先的产品与平台。',
    ],
    images: ['/images/特工宇宙项目路演现场.png', '/images/产学研协同与校企合作成果展示.png', '/images/中国国际大学生创新大赛（2025）金奖证书.jpg'],
  },
  {
    id: 'tokens',
    title: '捐赠 2020 亿 Tokens：让 AI 资源持续回流',
    intro: '2026 年 5 月，团队向杭电捐赠 2020 亿 Tokens，支持学生尝试 Agent 产品，开展学习、项目开发和创新实践。',
    paragraphs: [
      '"2020"对应团队成员进入杭电、开启大学生活的年份。这份捐赠不只是提供一项资源，也希望让学生从了解 AI，进一步走向使用 AI、做出作品、完成项目。',
      '除 Token 补助外，团队还将提供实习校招、项目孵化、赛事承办和前沿教程等支持。',
      '过去从校园开始的经历，正在转化为今天更多学生可以使用的 AI 学习和实践机会。',
    ],
    images: ['/images/杭电 × 观猹 2020 亿 Tokens 捐赠活动.jpg', '/images/杭电 × 观猹 2020 亿 Tokens 捐赠活动.jpeg', '/images/青年 AI 互学成长共同体.png'],
  },
];

const VISIT_DETAIL = {
  lead: '7 月 10 日，杭州电子科技大学党委书记王尧祥、党委副书记钱波，杭州学军中学党委书记杨凯锋一行莅临观猹团队调研交流，深入了解团队创业历程、业务布局与人工智能创新实践，并围绕 AI 技术赋能教育教学等话题展开交流。',
  paragraphs: [
    '各方结合学校人才培养和团队产品实践，就 AI 教育应用、学生创新实践与项目共创等方向交换了想法。',
    '此次调研进一步连接了中学、高校与青年创业团队，也为未来推动人工智能技术进入真实教学和学习场景打开了更多合作空间。',
  ],
  images: ['/images/杭电、学军中学领导与观猹团队座谈交流.jpg', '/images/观猹创始人仲泰与调研嘉宾合影.jpg', '/images/调研交流人员与观猹团队合影.jpg'],
};

// ============ 板块二数据：观猹生态 ============
type Business = { id: string; name: string; desc: string; logo: string; logoExtra?: string };

const BUSINESSES: Business[] = [
  { id: 'platform', name: '观猹平台', desc: 'AI 产品的大众点评——发现、评分、讨论、体验，一站式 AI 产品探索社区。', logo: '/images/观猹logo.jpg', logoExtra: '/images/观猹文字logo.png' },
  { id: 'tokendance', name: 'TokenDance 词元跳动', desc: 'AI 产品增长服务与 MCN，围绕策划、品牌营销与商业增长，为 AI 产品提供从发掘、孵化到推广的全周期服务。', logo: '/images/TokenDance 词元跳动logo.png' },
  { id: 'chacha', name: '猹与猹增长服务', desc: 'AI 产品增长服务与 MCN，围绕策划、品牌营销与商业增长，为 AI 产品提供从发掘、孵化到推广的全周期服务。', logo: '/images/猹与猹logo.png' },
  { id: 'teagentmedia', name: '特工宇宙媒体', desc: '国内头部科技账号，首个聚焦智能体领域的 AI 科技媒体，致力于打造 AI 垂直媒体矩阵，广泛覆盖 AI 从业者与内容者。', logo: '/images/特工宇宙 AgentUniverse.png' },
  { id: 'hackathon', name: '环球黑客松', desc: '观猹旗下黑客松品牌，布局全球，致力于让值得尝试的创意落地生长，让每一份认真与热爱都得到回应。', logo: '/images/156.jpg' },
];

const PLATFORM_SHOTS = [
  '/images/观猹首页｜热门产品、榜单与活动推荐.png',
  '/images/产品详情页｜真实评分、猹评与创作者说.png',
  '/images/瓜棚｜瓜子积分兑换实物周边与邀请码.png',
  '/images/猹馆｜AI动态与案例分享社区.png',
  '/images/排行榜｜热议周榜、口碑飙升榜、活跃用户榜.png',
];

const TOKEN_DANCE_ABILITIES = [
  { key: '全', title: '全｜模型品类全', points: ['覆盖对话、生图、视频、语音、多模态、Web Search 等能力。', '多协议原生兼容，常用模型与工具 API 一站直连。'] },
  { key: '快', title: '快｜模型接入快', points: ['热门新模型力争 T+0、T+1 同步上线。', 'Playground 开箱即用，无需写代码即可选模型、调参数、测效果。'] },
  { key: '稳', title: '稳｜调用服务稳', points: ['聚合多个供应商端点，智能选择稳定、低价的调用线路。', '支持自动容错、故障切换和模型降级，也可自主设置路由规则。'] },
  { key: '省', title: '省｜调用成本省', points: ['同等稳定性下，自动选择价格更低的端点。', '不定期的福利发放，另有折扣、兑换券及各类活动 Token 赞助支持。'] },
];

const CHACHA_SERVICES = [
  { title: 'Orchestration丨策划统筹', desc: '品牌定位、产品叙事、市场方案与活动落地' },
  { title: 'Marketing丨品牌营销', desc: '内容传播、媒体合作、活动营销与社群资源' },
  { title: 'Growth丨商业增长', desc: '产品冷启动、种子用户、增长路径与资源对接' },
];

const TEAGENT_MEDIA_BLOCKS = [
  { title: '科技媒体', desc: '面向 AI 从业者、开发者与内容创作者，持续输出 AI Agent 领域内容，连接国内外科技企业、AI 独角兽与社区伙伴。' },
  { title: 'Agent 研发', desc: '截至 2025 年 2 月，已合作 200+ 个 Agent 开发落地项目；围绕具体场景与需求定制开发 Agent，并结合科技媒体与社区资源，支持产品推广和冷启动。' },
  { title: '行业研究', desc: '持续发布季度性 AI 行业研究报告，覆盖 10+ 个 AI 领域、100+ 家 AI 企业、1000+ 位 AI 人物和 10000+ 个 AI 事件，为 AI 企业、人才与投资者提供行业信息。' },
  { title: '知识共学', desc: '建设覆盖 AI Agent、AI 产品、商业应用等方向的垂直知识库，并通过线上线下技术沙龙、Workshop 等形式，促进知识分享与项目合作。' },
];

const HACKATHON_SITES = [
  {
    title: '杭州站｜从创意到原型',
    desc: '2026 年 1 月 16—18 日，环球黑客松首站在杭州云谷中心举行。活动通过高强度开发、作品路演、产品展示与现场投票，推动参与者把想法快速转化为可运行、可验证的 AI 原型。',
    images: ['/images/环球黑客松 TOUR 2026·杭州站活动现场.jpg', '/images/环球黑客松 TOUR 2026·杭州站活动现场2.png'],
  },
  {
    title: '上海站｜OPC 极限挑战',
    desc: '2026 年 3 月 27—28 日，观猹、特工宇宙与浦发银行在全球开发者先锋大会期间联合举办环球黑客松·上海站 OPC 极限挑战赛，围绕 OpenClaw 开展极限开发、现场路演与产品验证。',
    images: ['/images/环球黑客松·上海站 OPC 极限挑战赛活动现场.jpg', '/images/环球黑客松·上海站 OPC 极限挑战赛活动现场2.jpg'],
  },
  {
    title: '伦敦站｜首次走向海外',
    desc: '2026 年 4 月 18—19 日，环球黑客松伦敦站在伦敦大学学院举行，这是环球黑客松首次海外落地。活动设置 AI 与媒体创作、包容性城市和 Agent 工作流等方向，连接来自不同背景的开发者、创作者与社区伙伴。',
    images: ['/images/伦敦站｜首次走向海外.png', '/images/伦敦站｜首次走向海外2.png', '/images/伦敦站｜首次走向海外3.jpg'],
  },
];

const PARTNER_LOGO_ROWS = [
  // 第一行
  ['/images/logos/image.png', '/images/logos/image-2.png', '/images/logos/image-3.png', '/images/logos/image-4.png', '/images/logos/image-5.png', '/images/logos/image-6.png'],
  // 第二行
  ['/images/logos/image-7.png', '/images/logos/image-8.png', '/images/logos/image-9.png', '/images/logos/image-10.png', '/images/logos/image-11.png'],
  // 第三行
  ['/images/logos/image-13.png', '/images/logos/image-14.png', '/images/logos/组 18.svg', '/images/logos/组 19.svg', '/images/logos/image-15.png', '/images/logos/image-16.png'],
  // 第四行
  ['/images/logos/image-17.png', '/images/logos/组 20.svg', '/images/logos/组 21.svg', '/images/logos/组 22.svg'],
];

const PARTNER_GROUPS = [
  { name: '投资机构', items: '红杉中国 · 华兴资本 · 真格基金 · 奇绩创坛 · 蓝驰创投 · Monolith · 五源资本' },
  { name: '企业伙伴', items: '字节跳动 · 阿里巴巴 · 蚂蚁集团 · 腾讯 · 谷歌 · 百度 · MiniMax · 智谱 · 月之暗面' },
  { name: '社区伙伴', items: '知乎 · 小红书 · FounderPark · 魔搭社区 · WaytoAGI · Datawhale' },
  { name: '行业伙伴', items: '浦发银行 · 迅雷 · 京东 · 莫高设计 · 猿辅导 · 美团 · 蓝盒子' },
  { name: '高校伙伴', items: '清华大学 · 北京大学 · 浙江大学 · 新加坡国立大学 · 哈佛大学' },
  { name: '技术峰会', items: 'WAIC 世界人工智能大会 · Google Cloud Next · 全球开发者先锋大会' },
];

const KEY_EVENTS = [
  { name: '第一届观猹大会', desc: '2025 年 7 月 16 日在北京 Blue Note 举办，是观猹首次发布会与线下大会，围绕 Build in Public、AI 产品发布、真实用户反馈和产品观猹员计划展开分享。', images: ['/images/第一届观猹大会.png'] },
  { name: '全球首届猹话会', desc: '观猹上线百日后的社区线下聚会，面向产品观猹员、AI 创业者与爱好者，围绕产品体验、创业实践与社区连接展开交流。', images: ['/images/全球首届猹话会.jpg'] },
  { name: 'AI 创业者 Demo Day', desc: '2025 年 11 月 8 日由华兴资本与观猹在上海联合举办，15 家创业公司围绕 AI Agent、AI 硬件/具身智能和 AI Infra 展示项目，并与投资人与产业伙伴交流。', images: ['/images/AI 创业者 Demo Day.jpg'] },
  { name: '环球黑客松 TOUR 2026·杭州站', desc: '2026 年 1 月 16—18 日由观猹与魔搭社区在杭州云谷中心联合主办，以"见证创造发生"为主题，通过沉浸开发、作品路演、产品摆摊和观众投票支持 AI 创作者。', images: ['/images/环球黑客松 TOUR 2026·杭州站.jpg'] },
  { name: 'OpenClaw 猹话会 001', desc: '观猹、特工宇宙与红杉中国联合发起的 OpenClaw 线下活动，现场设置安装指导与实战分享，帮助参与者完成部署、交流使用经验并体验 Vibe Coding 对战。', images: ['/images/OpenClaw 猹话会 001.jpg'] },
  { name: 'OpenClaw 猹话会 002·龙虾家长会', desc: '2026 年 3 月 22 日在南京举办，由观猹与魔搭社区合作，围绕 OpenClaw 的科学使用、成本控制、进阶玩法与商业化路径展开分享，并设产品展示与互动交流。', images: ['/images/OpenClaw 猹话会 002·龙虾家长会.jpg', '/images/北京大学创新创业学院活动合影.jpg'] },
  { name: 'OpenClaw 猹话会 003·北大站', desc: '2026 年 3 月 22 日在北京大学举办，由北大学生创新学社、观猹与红杉中国主办，聚焦 OpenClaw 权限管控、数据隔离、操作审计、安装配置与实战避坑。', images: ['/images/OpenClaw 猹话会 003·北大站.jpg', '/images/高校 AI 分享现场｜活动待确认.jpg'] },
  { name: '环球黑客松 OPC 极限挑战赛·上海站', desc: '2026 年 3 月 27—28 日在全球开发者先锋大会期间举办，由观猹、特工宇宙与浦发银行联合推出，以 OPC 为核心开展 OpenClaw 极限开发、现场路演与产品验证。', images: ['/images/环球黑客松 OPC 极限挑战赛·上海站.jpg'] },
  { name: '观猹 × 知乎｜2026 新知青年大会分论坛', desc: '2026 年 5 月 16 日在北京 798 艺术区举行的观猹分论坛，以"当 AI 也开始用 APP——Agent 基础设施的新机会"为主题，讨论 TPD、CLI/API、MCP 与 Skill 等新范式。', images: ['/images/观猹 × 知乎｜2026 新知青年大会分论坛.jpg'] },
  { name: '谁能成为百万博主·第一赛季决赛', desc: '面向 AI 内容创作者的 30 天账号成长赛事，参赛者从零运营 AI 主题账号，获得闭门课程、工具与投流支持，最终于 5 月 18 日线下路演，现场 PK 创作成果。', images: ['/images/谁能成为百万博主·第一赛季决赛.jpg'] },
  { name: '猹话会 / 环球黑客松', desc: '线下活动、开发者连接、产品展示与行业交流场景。', images: ['/images/OpenClaw 猹话会活动现场.jpg', '/images/环球黑客松 TOUR 2026·杭州站.jpg'] },
  { name: 'WAIC 官方合作｜AI 产品吐槽大会', desc: '2026 年 7 月。观猹与 WAIC 开展官方合作，在上海设置 AI 产品体验、评价与吐槽交流场景，并邀请观猹旗下达人参与探展，以真实用户反馈连接产品、开发者和行业观众。', images: ['/images/观猹 × WAIC 活动现场.jpg', '/images/观猹 × TokenDance 联合展位.jpg'] },
  { name: 'ChinaJoy 观猹展台', desc: '2026 年 7 月。观猹携 AI 产品体验与大众点评互动进入 ChinaJoy，通过现场扫码、产品展示、猹评互动和品牌联动，让更多年轻用户近距离了解和体验 AI 产品。', images: ['/images/ChinaJoy.jpg'] },
  { name: '观猹 × 杭州中国动漫博物馆', desc: '2026 年 8 月 15 日。观猹在杭州中国动漫博物馆开展联合展示与交流活动，结合逛展、主题分享和限定联名 Token 卡领取，将 AI 产品体验、内容交流与年轻文化场景连接起来。', images: ['/images/观猹 × 杭州中国动漫博物馆联合展示.jpg'] },
  { name: 'Happy Qwensday × 观猹｜AI 调酒师活动', desc: '2026 年。观猹与 Happy Qwensday 联动打造 AI 调酒师主题体验，设置现场 Vibe Coding、AI 调酒互动和作品收录入口，以轻量、社交化的方式让参与者体验 AI 创作。', images: ['/images/Happy Qwensday × 观猹 AI 调酒师活动.jpg', '/images/AI 调酒师主题物料.jpg'] },
  { name: '亚马逊云科技 × 观猹｜AI 主题交流', desc: '2026 年。观猹与亚马逊云科技联合开展 AI 主题分享与交流，通过产品实践、行业案例和现场讨论，促进开发者、企业和 AI 从业者之间的连接。', images: ['/images/亚马逊云科技 × 观猹 AI 主题交流现场.jpg', '/images/亚马逊云科技 AI 主题交流现场.jpg'] },
  { name: '银行｜Token 礼品卡合作', desc: '观猹与浦发银行开展 Token 礼品卡合作，将大模型算力转化为可领取、可赠送的实体卡产品，拓展 AI 能力在金融服务与用户礼赠场景中的应用。', images: ['/images/Token 词元礼品传播画面.jpg'] },
  { name: '观猹 × 京东｜AI 硬件创新大赛 / 路演', desc: '观猹参与京东 AI 硬件创新大赛及相关路演，通过产品展示、现场点评和展位互动，连接 AI 硬件团队与真实用户反馈。', images: ['/images/观猹 × 京东.jpg'] },
];

// ============ 板块三数据：好用产品馆 ============
type Product = { name: string; slogan: string; desc: string; tags: string[]; rating: number; link: string; qrHint: string; logo: string; order: string };
const PRODUCT_CATEGORIES = ['全部'];
const ALL_PRODUCTS: Product[] = [
  { order: '01', name: 'Paper2Galgame', slogan: '"前辈！开学我们一起读 paper 吧"', desc: '把论文或课件转成互动式视觉小说（Galgame），通过剧情化讲解和知识点提炼，帮助用户快速掌握核心内容。', tags: ['论文阅读', '课堂展示', '跨学科入门'], rating: 4.8, link: 'https://watcha.cn/products/paper2galgame', qrHint: '扫码体验 Paper2Galgame', logo: '/images/Paper2Galgame logo.png' },
  { order: '02', name: '佛脚 AI', slogan: '"让天下没有难过的考试，让学习变得更简单！"', desc: '一站式 AI 备考伙伴，支持拆解学习计划、解析 PDF/PPT/音视频、生成模拟题，覆盖"学—测—评—导—疏"全流程。', tags: ['考试备考', '资料解析', '错题复盘'], rating: 4.6, link: 'https://watcha.cn/products/cram-ai', qrHint: '扫码体验佛脚 AI', logo: '/images/佛脚 AI logo.png' },
  { order: '03', name: 'WorkBuddy', slogan: '"2026 年了，真的有人桌面上没有办公 Agent 吗"', desc: 'AI 原生桌面智能体工作台，用自然语言驱动多 Agents 并行处理文件、调研和业务数据。', tags: ['数据处理', '竞品调研', '材料整理'], rating: 4.5, link: 'https://watcha.cn/products/workbuddy', qrHint: '扫码体验 WorkBuddy', logo: '/images/WorkBuddy logo.png' },
  { order: '04', name: 'U 深研 / UniFuncs', slogan: '"写过论文、计划书、文章的就知道这产品多重要"', desc: '深度研究产品，采用动态规划与边搜边推技术，支持实时搜索、深度阅读，高效萃取关键信息。', tags: ['深度调研', '论文写作', '项目立项'], rating: 4.7, link: 'https://watcha.cn/products/unifuncs', qrHint: '扫码体验 U 深研', logo: '/images/U 深研 logo.png' },
  { order: '05', name: 'ima', slogan: '"入社会第一课，学会沉淀经验，再打磨能力"', desc: '以知识库为核心的 AI 工作台，支持多模态资料解读、全网与知识库问答、主题写作与润色。', tags: ['知识沉淀', '资料解读', '协作学习'], rating: 4.4, link: 'https://watcha.cn/products/ima', qrHint: '扫码体验 ima', logo: '/images/ima logo.png' },
  { order: '06', name: 'Trae', slogan: '"vibecoding 的第一步，可以在这里"', desc: 'AI 原生开发与工作平台，支持 IDE 与 Work 双形态，SOLO 智能体可自动完成需求理解、编码、测试与预览。', tags: ['代码生成', '项目开发', '极速原型'], rating: 4.9, link: 'https://watcha.cn/products/43', qrHint: '扫码下载 Trae', logo: '/images/Trae logo.png' },
  { order: '07', name: 'OiiOii', slogan: '"你爱看的 AI 漫剧多半是在 oiioii 出生的"', desc: '专注动画创作的 AI Agent，内置多角色创作团队，支持从创意、脚本、分镜到图片、视频和 MV 的协同生成。', tags: ['动画创作', '漫剧生成'], rating: 4.3, link: 'https://watcha.cn/products/oiioii', qrHint: '扫码体验 OiiOii', logo: '/images/OiiOii logo.png' },
];

// ============ 板块四数据：互动展区 ============
type VoteProduct = { id: number; name: string; desc: string; logo: string; good: number; bad: number };
const VOTE_PRODUCTS: VoteProduct[] = [
  { id: 1, name: 'Paper2Galgame', desc: '把论文或课件转成互动式视觉小说，剧情化讲解帮你快速掌握核心内容。', logo: '/images/Paper2Galgame logo.png', good: 248, bad: 31 },
  { id: 2, name: '佛脚 AI', desc: '一站式 AI 备考伙伴，覆盖"学—测—评—导—疏"全流程。', logo: '/images/佛脚 AI logo.png', good: 189, bad: 52 },
  { id: 3, name: 'WorkBuddy', desc: 'AI 原生桌面智能体工作台，多 Agents 并行处理文件、调研和业务数据。', logo: '/images/WorkBuddy logo.png', good: 205, bad: 38 },
  { id: 4, name: 'U 深研 / UniFuncs', desc: '深度研究产品，动态规划 + 边搜边推，实时搜索深度阅读。', logo: '/images/U 深研 logo.png', good: 176, bad: 42 },
  { id: 5, name: 'ima', desc: '以知识库为核心的 AI 工作台，多模态资料解读 + 全网问答 + 主题写作。', logo: '/images/ima logo.png', good: 168, bad: 45 },
  { id: 6, name: 'Trae', desc: 'AI 原生开发与工作平台，SOLO 智能体自动完成需求→编码→测试→预览。', logo: '/images/Trae logo.png', good: 312, bad: 18 },
  { id: 7, name: 'OiiOii', desc: '专注动画创作的 AI Agent，从创意到 MV 协同生成。', logo: '/images/OiiOii logo.png', good: 156, bad: 44 },
];

const COURSE_URL = 'https://study.watcha.cn/';

const STAR_WATCHERS = [
  {
    name: '悟鸣AI', handle: '@wuming', avatar: '/images/悟鸣AI.png',
    intro: '金牌观猹员；浙江省人工智能专家服务团专家，前蚂蚁集团 Agent 工程师，长期关注 AI Agent、产品实测与 AI 教育。',
    quotes: ['"希望自己的一点经验，能够帮助到更多人少走弯路。"', '"参加比赛先看评分标准，先完成再完美。"'],
    link: 'https://watcha.cn/@wuming?tab=posts',
  },
  {
    name: '观猹员小明同学', handle: '@xiaoming', avatar: '/images/小明同学.png',
    intro: '金牌观猹员；自称"一枚氪学家、Token 大富翁"，持续输出真实、直接、有态度的产品体验。',
    quotes: ['"想夸就夸，想喷就喷。"', '"不欢迎说得好听，欢迎说得够硬。"'],
    link: 'https://watcha.cn/@10000076',
  },
  {
    name: 'GoodTime', handle: '', avatar: '/images/GoodTime.png',
    intro: '金牌观猹员、金牌助教；全栈开发者、AI 讲师与社区主理人，关注产品实测、开发者社区和高校 AI 实践。',
    quotes: ['"不情绪化输出，只给带解决方案的批评。"', '"产品团队是需要真话的。"'],
    link: 'https://watcha.cn/discuss/10226',
  },
];

// ============ 板块卡片数据 ============
const PANELS = [
  { id: 'timeline', num: '01', title: '杭电 × 观猹', subtitle: 'AI 育人生态共建', desc: '从校园萌芽 → 创业成长 → 资源反哺母校 · 完整时间线叙事', accent: '#67e0ed' },
  { id: 'ecosystem', num: '02', title: '玩 AI，上观猹', subtitle: 'AI 产品的大众点评', desc: '观猹平台 · TokenDance · 猹与猹 · 特工宇宙 · 环球黑客松', accent: '#a4c1f7' },
  { id: 'products', num: '03', title: '好用产品馆', subtitle: '校园场景精选 AI 工具', desc: '论文阅读 · 备考学习 · 办公调研 · 代码开发 · 动画创作', accent: '#f472b6' },
  { id: 'interactive', num: '04', title: '互动展区', subtitle: '参与体验，共建 AI 社区', desc: 'Good/Bad 评分 · 答题站 · 名片墙 · Token 补给', accent: '#ffb38a' },
];

// ============ 公共组件 ============

function DetailHeader({ num, title, subtitle, accent }: { num: string; title: string; subtitle: string; accent: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="mb-4 text-sm tracking-[0.3em] uppercase font-medium" style={{ color: accent }}>{num}</div>
      <h1 className="mb-4 text-4xl md:text-5xl font-bold leading-tight"
        style={{ background: `linear-gradient(135deg, ${accent}, #1a1a2e)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {title}
      </h1>
      <div className="text-sm tracking-widest text-slate-500 uppercase">{subtitle}</div>
    </div>
  );
}

function CloseButton({ onClick, top = 'top-6' }: { onClick: () => void; top?: string }) {
  return (
    <button onClick={onClick} className={`fixed ${top} right-6 z-[200] w-12 h-12 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all hover:scale-110`}
      style={{ background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.9)', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}
      aria-label="关闭">✕</button>
  );
}

function ImageGallery({ images, accent }: { images: string[]; accent: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
      {images.map((src, i) => {
        const name = decodeURIComponent(src.split('/').pop() || '').replace(/\.[^.]+$/, '');
        return (
          <figure key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: `${accent}40`, background: '#fff' }}>
            <img src={src} alt={name} className="w-full h-52 object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
            <figcaption className="px-3 py-2 text-xs text-slate-600 text-center font-medium" style={{ borderTop: `1px solid ${accent}25` }}>
              {name}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

// ============ 板块一详情：校企发展时间线 ============

function TimelineDetail({ accent, onOpenStory, onOpenVisit }: { accent: string; onOpenStory: (id: string) => void; onOpenVisit: () => void }) {
  return (
    <div>
      <div className="mb-8 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}18, #a4c1f718, #f0e9e218)`, border: `1px solid ${accent}40` }}>
        <div className="mb-3 text-xs tracking-[0.3em] font-medium" style={{ color: accent }}>校企共建 · 故事从这里开始</div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">杭电 × 观猹共建 AI 育人生态</h2>
        <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          从校园学习共同体走向 AI 创业，把创业资源回流母校 —— 这是一个关于青春、勇气和反哺的故事。
        </p>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />
          关键发展时间线
        </h3>
        <div className="relative overflow-x-auto pb-2" ref={bindHorizontalScroll} data-lenis-prevent>
          <div className="flex gap-4 md:gap-5 min-w-max px-2">
            {TIMELINE_EVENTS.map((ev, i) => (
              <div key={i}
                className="shrink-0 w-64 rounded-2xl p-5 border-2 transition-all hover:shadow-md"
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  borderColor: 'rgba(0,0,0,0.06)',
                }}>
                <div className="text-xs font-bold tracking-wider mb-1" style={{ color: accent }}>{ev.year}</div>
                <div className="text-base font-bold text-slate-800 mb-2 leading-snug">{ev.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{ev.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-400 text-center">← 鼠标悬停于此区域，滚动滚轮即可横向浏览 →</div>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />
          四个值得记住的故事
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STORY_CARDS.map((card) => (
            <button key={card.id} onClick={() => onOpenStory(card.id)}
              className="text-left rounded-2xl overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
              <div className="relative h-44 overflow-hidden" style={{ background: `${accent}15` }}>
                {card.images[0] ? (
                  <img src={card.images[0]} alt="" className="w-full h-full object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: `${accent}15` }} />
                )}
              </div>
              <div className="p-5">
                <h4 className="text-base font-bold text-slate-800 mb-2 leading-snug">{card.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{card.intro}</p>
                <div className="mt-3 text-xs font-semibold" style={{ color: accent }}>点击查看完整故事 →</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={onOpenVisit}
        className="text-left w-full rounded-2xl p-6 md:p-8 transition-all hover:shadow-lg hover:-translate-y-0.5"
        style={{ background: `linear-gradient(135deg, ${accent}15, #f0e9e220)`, border: `1px dashed ${accent}60` }}>
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">杭电、学军中学领导莅临调研：共话 AI 赋能教育</h3>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          7 月 10 日 · 杭电党委书记王尧祥、党委副书记钱波，学军中学党委书记杨凯锋一行莅临观猹调研交流 · 连接中学 - 高校 - 青年创业团队
        </p>
        <div className="mt-4 text-xs font-semibold" style={{ color: accent }}>点击查看调研详情 →</div>
      </button>
    </div>
  );
}

// ============ 板块二详情：观猹生态 ============

function EcosystemDetail({ accent, onOpenBusiness }: { accent: string; onOpenBusiness: (id: string) => void }) {
  return (
    <div>
      <div className="mb-8 rounded-3xl p-8 md:p-10 grid md:grid-cols-5 gap-8 items-center"
        style={{ background: 'rgba(255,255,255,0.85)', border: `1px solid ${accent}40` }}>
        <div className="md:col-span-3">
          <div className="mb-2 text-xs font-bold tracking-wider" style={{ color: accent }}>PLATFORM</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">玩 AI，上观猹</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            观猹是 AI 产品的大众点评——发现、体验、评分、讨论，一站式 AI 产品探索社区。
            我们也是杭州 AI 五小凤之一，获得央媒报道与头部资本背书。
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://watcha.cn" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: accent }}>官网 watcha.cn（国内）</a>
            <a href="https://watcha.ai" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:-translate-y-0.5" style={{ background: `${accent}20`, color: '#1a1a2e', border: `1px solid ${accent}` }}>watcha.ai（全球）</a>
          </div>
        </div>
        <div className="md:col-span-2 flex flex-col items-center gap-4">
          <img src="/watcha-logo-new.jpg" alt="观猹 Logo" className="h-28 object-contain rounded-xl" />
          <div className="text-center text-sm text-slate-500">扫码访问官网 ↗</div>
        </div>
      </div>

      {/* 五大业务：横向条状，自上而下，点击进入详情 */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />五大业务矩阵
        </h3>
        <div className="space-y-3">
          {BUSINESSES.map((b) => (
            <button key={b.id} onClick={() => onOpenBusiness(b.id)}
              className="w-full flex items-center gap-4 md:gap-5 rounded-2xl p-4 md:p-5 border text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
              <div className="shrink-0 w-20 h-16 rounded-xl bg-white border flex items-center justify-center overflow-hidden p-1.5" style={{ borderColor: `${accent}35` }}>
                <img src={b.logo} alt={b.name} className="max-w-full max-h-full object-contain" />
              </div>
              {b.logoExtra && (
                <div className="shrink-0 hidden sm:flex w-28 h-16 rounded-xl bg-white border items-center justify-center overflow-hidden p-1.5" style={{ borderColor: `${accent}35` }}>
                  <img src={b.logoExtra} alt={`${b.name}文字标`} className="max-w-full max-h-full object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-slate-800">{b.name}</div>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed mt-1">{b.desc}</p>
              </div>
              <div className="shrink-0 text-xs font-semibold whitespace-nowrap" style={{ color: accent }}>点击进入 →</div>
            </button>
          ))}
        </div>
      </div>

      {/* 合作伙伴 Logo 墙 */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />生态合作伙伴与行业背书
        </h3>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <img src="/images/生态合作伙伴与行业背书.png" alt="生态合作伙伴与行业背书" className="w-full h-auto block cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
        </div>
      </div>

      {/* 重点活动回顾：活动名 | 简介 | 图片 三列式 */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />重点活动回顾
        </h3>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="hidden md:grid grid-cols-[190px_1fr_250px] gap-5 px-5 py-3 text-sm font-bold text-slate-700"
            style={{ background: 'rgba(0,0,0,0.035)' }}>
            <div>活动名</div>
            <div>简介</div>
            <div>图片</div>
          </div>
          {KEY_EVENTS.map((ev, i) => (
            <div key={i} className="grid md:grid-cols-[190px_1fr_250px] gap-3 md:gap-5 px-5 py-4 border-t"
              style={{ borderColor: 'rgba(0,0,0,0.06)', background: i % 2 === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)' }}>
              <div className="text-sm font-bold text-slate-800 leading-snug">{ev.name}</div>
              <div className="text-xs md:text-sm text-slate-600 leading-relaxed">{ev.desc}</div>
              <div className="flex sm:flex-row md:flex-col flex-col gap-2">
                {ev.images.map((src, j) => {
                  const name = decodeURIComponent(src.split('/').pop() || '').replace(/\.[^.]+$/, '');
                  return (
                    <figure key={j} className="flex-1 min-w-0 rounded-lg overflow-hidden border bg-white" style={{ borderColor: `${accent}30` }}>
                      <img src={src} alt={name} className="w-full h-24 object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
                      <figcaption className="px-2 py-1 text-[10px] text-slate-500 text-center truncate" style={{ borderTop: `1px solid ${accent}20` }}>{name}</figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a href="https://watcha.cn" target="_blank" rel="noreferrer" className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: accent }}>前往观猹查看更多行业动态 →</a>
        </div>
      </div>
    </div>
  );
}

// ============ 板块二业务详情子弹窗 ============

function BusinessDetailPanel({ businessId, accent, onClose }: { businessId: string | null; accent: string; onClose: () => void }) {
  if (!businessId) return null;
  const business = BUSINESSES.find((b) => b.id === businessId);
  if (!business) return null;

  const shotName = (src: string) => decodeURIComponent(src.split('/').pop() || '').replace(/\.[^.]+$/, '');
  const bordered = { borderColor: `${accent}35` };

  return (
    <div className="watcha-detail-enter fixed inset-0 z-[130] overflow-y-auto" data-lenis-prevent ref={bindVerticalScroll}>
      <CloseButton onClick={onClose} top="top-24" />
      <div className="max-w-4xl mx-auto px-5 md:px-6 py-20">
        {/* 头部：logo + 名称 + 简介 */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-28 h-20 rounded-2xl bg-white border flex items-center justify-center p-2" style={bordered}>
            <img src={business.logo} alt={business.name} className="max-w-full max-h-full object-contain" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">{business.name}</h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">{business.desc}</p>
        </div>

        {/* 观猹平台详情 */}
        {businessId === 'platform' && (
          <>
            <figure className="rounded-2xl overflow-hidden border mb-8 bg-white" style={bordered}>
              <img src="/images/平台核心能力.png" alt="平台核心能力" className="w-full object-contain cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
            </figure>
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold" style={{ color: accent }}>五大核心板块</h3>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-4">观猹平台核心功能实拍：</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {PLATFORM_SHOTS.slice(0, 2).map((src) => (
                <figure key={src} className="rounded-xl overflow-hidden border bg-white" style={bordered}>
                  <img src={src} alt={shotName(src)} className="w-full h-48 object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
                  <figcaption className="px-3 py-2 text-xs text-slate-600 text-center font-medium" style={{ borderTop: `1px solid ${accent}25` }}>{shotName(src)}</figcaption>
                </figure>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PLATFORM_SHOTS.slice(2).map((src) => (
                <figure key={src} className="rounded-xl overflow-hidden border bg-white" style={bordered}>
                  <img src={src} alt={shotName(src)} className="w-full h-36 object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
                  <figcaption className="px-3 py-2 text-xs text-slate-600 text-center font-medium" style={{ borderTop: `1px solid ${accent}25` }}>{shotName(src)}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        {/* TokenDance 详情 */}
        {businessId === 'tokendance' && (
          <>
            <h3 className="text-2xl font-bold text-center mb-6" style={{ color: accent }}>四大核心能力</h3>
            <div className="space-y-3 mb-10">
              {TOKEN_DANCE_ABILITIES.map((a) => (
                <div key={a.key} className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white shrink-0" style={{ background: accent }}>{a.key}</div>
                    <div className="text-base font-bold text-slate-800">{a.title}</div>
                  </div>
                  <ul className="space-y-1">
                    {a.points.map((p, i) => (
                      <li key={i} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                        <span className="shrink-0" style={{ color: accent }}>•</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-4">TokenDance 核心功能实拍：</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <figure className="rounded-xl overflow-hidden border bg-white" style={bordered}>
                <img src="/images/TokenDance 官网｜统一模型网关与多协议兼容.png" alt="TokenDance 核心功能实拍" className="w-full h-52 object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
                <figcaption className="px-3 py-2 text-xs text-slate-600 text-center font-medium" style={{ borderTop: `1px solid ${accent}25` }}>TokenDance 核心功能实拍</figcaption>
              </figure>
              <figure className="rounded-xl overflow-hidden border bg-white" style={bordered}>
                <img src="/images/平台能力｜智能路由、统一计费与容错降级.png" alt="平台能力｜智能路由、统一计费与容错降级" className="w-full h-52 object-cover cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
                <figcaption className="px-3 py-2 text-xs text-slate-600 text-center font-medium" style={{ borderTop: `1px solid ${accent}25` }}>平台能力｜智能路由、统一计费与容错降级</figcaption>
              </figure>
            </div>
          </>
        )}

        {/* 猹与猹详情 */}
        {businessId === 'chacha' && (
          <>
            <div className="space-y-3 mb-8">
              {CHACHA_SERVICES.map((s) => (
                <div key={s.title} className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
                  <div className="text-base font-bold text-slate-800 mb-1">{s.title}</div>
                  <div className="text-sm text-slate-600 leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
            <figure className="rounded-xl overflow-hidden border bg-white" style={bordered}>
              <img src="/images/签约.png" alt="签约" className="w-full object-contain cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
              <figcaption className="px-3 py-2 text-xs text-slate-600 text-center font-medium" style={{ borderTop: `1px solid ${accent}25` }}>签约</figcaption>
            </figure>
          </>
        )}

        {/* 特工宇宙媒体详情 */}
        {businessId === 'teagentmedia' && (
          <>
            <h3 className="text-2xl font-bold text-center mb-6" style={{ color: accent }}>特工宇宙业务内容</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {TEAGENT_MEDIA_BLOCKS.map((s) => (
                <div key={s.title} className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
                  <div className="text-base font-bold mb-2" style={{ color: accent }}>{s.title}</div>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <figure className="rounded-xl overflow-hidden border bg-white" style={bordered}>
              <img src="/images/知识号见面会.jpg" alt="知识号见面会" className="w-full h-auto object-contain cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
              <figcaption className="px-3 py-2 text-xs text-slate-600 text-center font-medium" style={{ borderTop: `1px solid ${accent}25` }}>知识号见面会</figcaption>
            </figure>
          </>
        )}

        {/* 环球黑客松详情 */}
        {businessId === 'hackathon' && (
          <>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-8" style={{ color: accent }}>环球黑客松代表站点与媒体关注：</h3>
            <div className="space-y-9">
              {HACKATHON_SITES.map((site) => (
                <div key={site.title}>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{site.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{site.desc}</p>
                  <ImageGallery images={site.images} accent={accent} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============ 板块三详情：好用产品馆 ============

function ProductsDetail({ accent }: { accent: string }) {
  const filtered = ALL_PRODUCTS;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="p-5 pb-3">
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: `${accent}15` }}>
                  <img src={p.logo} alt={p.name} className="w-full h-full object-contain p-1.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[10px] tracking-widest font-bold" style={{ color: accent }}>精选工具 {p.order}</span>
                  </div>
                  <div className="text-base font-bold text-slate-800 leading-tight">{p.name}</div>
                </div>
              </div>
              <div className="text-xs md:text-sm italic text-slate-500 mb-2 leading-relaxed">{p.slogan}</div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-3">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.tags.map((t, j) => (
                  <span key={j} className="px-2 py-0.5 rounded-md text-[11px] font-medium" style={{ background: `${accent}18`, color: accent }}>#{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <span style={{ color: '#f59e0b' }}>★</span>
                <span className="font-bold text-slate-700">{p.rating.toFixed(1)}</span>
                <span>· 观猹平台评分</span>
              </div>
            </div>
            <div className="px-5 py-4 border-t flex items-center justify-between gap-3" style={{ borderColor: 'rgba(0,0,0,0.06)', background: `${accent}08` }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-700 truncate">{p.qrHint}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{p.link}</div>
              </div>
              <a href={p.link} target="_blank" rel="noreferrer" className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-transform hover:scale-105" style={{ background: accent }}>立即体验 →</a>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-xs text-slate-400">💡 产品库支持后台定期新增 / 替换，与线下文化墙同步月度更新</div>
    </div>
  );
}

// ============ 板块四详情：互动展区 ============

function InteractiveDetail({ accent }: { accent: string }) {
  const [votes, setVotes] = useState<VoteProduct[]>(VOTE_PRODUCTS);
  const [voteMap, setVoteMap] = useState<Record<number, 'good' | 'bad'>>({});

  const handleVote = (pid: number, type: 'good' | 'bad') => {
    if (voteMap[pid]) return;
    setVoteMap((m) => ({ ...m, [pid]: type }));
    setVotes((vs) => vs.map((v) => v.id === pid ? { ...v, good: v.good + (type === 'good' ? 1 : 0), bad: v.bad + (type === 'bad' ? 1 : 0) } : v));
  };

  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />01 · Good / Bad 评分墙
        </h3>
        <p className="text-xs md:text-sm text-slate-500 mb-5">每月更新参评产品 · 投票结果生成《杭电学生 AI 产品口碑档案》存档 · 体验产品后再参与投票 🎯</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {votes.map((v) => {
            const total = v.good + v.bad;
            const goodPct = Math.round((v.good / total) * 100);
            const myVote = voteMap[v.id];
            return (
              <div key={v.id} className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: `${accent}15` }}>
                    <img src={v.logo} alt={v.name} className="w-full h-full object-contain p-1.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-800">{v.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{v.desc}</div>
                  </div>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex mb-3 bg-slate-100">
                  <div className="h-full transition-all" style={{ width: `${goodPct}%`, background: '#ef4444' }} />
                  <div className="h-full flex-1 transition-all" style={{ background: '#10b981' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
                  <span>GOOD {v.good} ({goodPct}%)</span>
                  <span>BAD {v.bad} ({100 - goodPct}%)</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleVote(v.id, 'good')} disabled={!!myVote} className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: myVote === 'good' ? '#ef4444' : myVote ? '#f1f5f9' : '#fee2e2',
                      color: myVote === 'good' ? '#fff' : myVote ? '#94a3b8' : '#ef4444',
                      cursor: myVote ? 'default' : 'pointer',
                    }}>👍 GOOD</button>
                  <button onClick={() => handleVote(v.id, 'bad')} disabled={!!myVote} className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: myVote === 'bad' ? '#10b981' : myVote ? '#f1f5f9' : '#d1fae5',
                      color: myVote === 'bad' ? '#fff' : myVote ? '#94a3b8' : '#10b981',
                      cursor: myVote ? 'default' : 'pointer',
                    }}>👎 BAD</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />02 · 课程
        </h3>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <iframe src={COURSE_URL} title="观猹学社课程" className="w-full" style={{ height: '560px', border: '0' }} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />03 · 金牌观猹员名片墙
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STAR_WATCHERS.map((sw, i) => (
            <div key={i} className="rounded-2xl p-5 border transition-all hover:shadow-md"
              style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-black text-white text-xl" style={{ background: `linear-gradient(135deg, ${accent}, #a4c1f7)` }}>{sw.name.charAt(0)}</div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-800 leading-tight">{sw.name}</div>
                  {sw.handle && <div className="text-xs text-slate-400 mt-0.5">{sw.handle}</div>}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{sw.intro}</p>
              <div className="space-y-2 mb-4">
                {sw.quotes.map((q, j) => (
                  <div key={j} className="rounded-xl px-3 py-2 text-xs italic text-slate-700" style={{ background: `${accent}10` }}>{q}</div>
                ))}
              </div>
              <a href={sw.link} target="_blank" rel="noreferrer" className="inline-block text-xs font-semibold transition-opacity hover:opacity-70 break-all" style={{ color: accent }}>
                🔗 {sw.link}
              </a>
              <div className="mt-3 rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <img src={sw.avatar} alt={sw.name} className="w-full h-auto block cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ 故事子弹窗 ============

function StoryDetailPanel({ story, accent, onClose }: { story: typeof STORY_CARDS[number] | null; accent: string; onClose: () => void }) {
  if (!story) return null;
  return (
    <div className="watcha-detail-enter fixed inset-0 z-[120] overflow-y-auto" data-lenis-prevent ref={bindVerticalScroll}>
      <CloseButton onClick={onClose} top="top-24" />
      <div className="max-w-3xl mx-auto px-5 md:px-6 py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">{story.title}</h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">{story.intro}</p>
        </div>
        <div className="space-y-4 text-slate-700 leading-relaxed text-sm md:text-base">
          {story.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        {story.images && story.images.length > 0 && <ImageGallery images={story.images} accent={accent} />}
      </div>
    </div>
  );
}

// ============ 调研子弹窗 ============

function VisitDetailPanel({ accent, onClose }: { accent: string; onClose: () => void }) {
  return (
    <div className="watcha-detail-enter fixed inset-0 z-[120] overflow-y-auto" data-lenis-prevent ref={bindVerticalScroll}>
      <CloseButton onClick={onClose} top="top-24" />
      <div className="max-w-3xl mx-auto px-5 md:px-6 py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 leading-snug">杭电、学军中学领导莅临调研：共话 AI 赋能教育</h2>
          <div className="text-xs tracking-[0.3em] font-medium" style={{ color: accent }}>调研纪实 · 7 月 10 日</div>
        </div>
        <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-5 font-medium">{VISIT_DETAIL.lead}</p>
        {VISIT_DETAIL.paragraphs.map((p, i) => (
          <p key={i} className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">{p}</p>
        ))}
        <ImageGallery images={VISIT_DETAIL.images} accent={accent} />
      </div>
    </div>
  );
}

// ============ 主组件 ============

export default function WatchaPage() {
  const cylinderRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardFocusRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lenisRef = useRef<Lenis | null>(null);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const activePanelData = PANELS.find((p) => p.id === activePanel);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [showVisitDetail, setShowVisitDetail] = useState(false);
  const [activeBusiness, setActiveBusiness] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const activeStory = STORY_CARDS.find((s) => s.id === activeStoryId) || null;

  // ============ 气球入场：从底部依次弹性升起 ============

  useEffect(() => {
    const layer = document.querySelector<HTMLElement>('.wc-balloon-layer');
    if (!layer) return;

    const accents = ['#67e0ed', '#a4c1f7', '#f472b6', '#ffb38a'];
    const balloons: HTMLElement[] = [];

    for (let i = 0; i < 8; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'wc-balloon';

      const size = 40 + Math.random() * 50; // 40-90px
      const color = accents[i % accents.length];

      // 避开中央 40%（卡片区域），气球分布在左右两侧
      let left: number;
      if (i % 2 === 0) {
        left = 5 + Math.random() * 20; // 左侧 5-25%
      } else {
        left = 75 + Math.random() * 20; // 右侧 75-95%
      }
      const top = 15 + Math.random() * 60; // 15-75% 高度

      balloon.style.cssText = `
        width: ${size}px;
        height: ${size * 1.2}px;
        left: ${left}%;
        top: ${top}%;
        background: ${color};
        animation-delay: ${-Math.random() * 3}s;
        opacity: 0;
      `;

      const shine = document.createElement('div');
      shine.className = 'wc-balloon-shine';
      balloon.appendChild(shine);

      layer.appendChild(balloon);
      balloons.push(balloon);
    }

    // 依次弹性升起
    balloons.forEach((balloon, i) => {
      gsap.fromTo(balloon,
        { y: window.innerHeight, opacity: 0 },
        {
          y: 0,
          opacity: 0.35,
          duration: 2.5,
          delay: 0.3 + i * 0.4,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    });

    return () => {
      balloons.forEach(b => b.remove());
    };
  }, []);

  // ============ 磁吸效果：卡片向鼠标轻微偏移，离开弹回 ============

  // SVG 水波滤镜 ID（避免与页面其他 SVG 冲突）
  const RIPPLE_FILTER_ID = 'wc-water-ripple';

  function spawnRipple(x: number, y: number, container: HTMLElement) {
    const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ripple.setAttribute('class', 'wc-ripple-svg');
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.innerHTML = `
      <g filter="url(#${RIPPLE_FILTER_ID})">
        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(103,224,237,0.35)" stroke-width="1.5" />
        <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(164,193,247,0.25)" stroke-width="1" />
        <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(244,114,182,0.15)" stroke-width="1" />
        <circle cx="100" cy="100" r="25" fill="none" stroke="rgba(255,179,138,0.1)" stroke-width="1" />
      </g>
    `;
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1200);
  }

  function handleWaterRipple(e: ReactPointerEvent<HTMLDivElement>) {
    const container = e.currentTarget.querySelector<HTMLElement>('.wc-ripple-layer');
    if (!container) return;
    // 节流：与上次涟漪距离太近则跳过
    const last = (container as unknown as { _lastRipple?: { x: number; y: number; t: number } })._lastRipple;
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (last && now - last.t < 200 && Math.hypot(x - last.x, y - last.y) < 60) return;
    (container as unknown as { _lastRipple?: { x: number; y: number; t: number } })._lastRipple = { x, y, t: now };
    spawnRipple(x, y, container);
  }

  function handleCarouselPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    handleCarouselGlow(e);
    handleWaterRipple(e);
  }

  function handleMagneticMove(e: ReactPointerEvent<HTMLDivElement>) {
    const glassPanel = e.currentTarget.querySelector<HTMLElement>('.glass-panel');
    if (!glassPanel) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 磁吸偏移
    const offsetX = (mouseX - rect.width / 2) * 0.18;
    const offsetY = (mouseY - rect.height / 2) * 0.18;
    const clampedX = Math.max(-9, Math.min(9, offsetX));
    const clampedY = Math.max(-9, Math.min(9, offsetY));
    gsap.to(glassPanel, { x: clampedX, y: clampedY, scale: 1.02, duration: 0.6, ease: 'power3.out' });

    // 追光：更新 CSS 变量驱动光斑位置
    glassPanel.style.setProperty('--mx', `${mouseX}px`);
    glassPanel.style.setProperty('--my', `${mouseY}px`);
  }

  function handleMagneticLeave(e: ReactPointerEvent<HTMLDivElement>) {
    const glassPanel = e.currentTarget.querySelector<HTMLElement>('.glass-panel');
    if (!glassPanel) return;
    gsap.to(glassPanel, { x: 0, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' });
  }

  // 区域级追光：整个木马区背景跟随鼠标的柔光
  function handleCarouselGlow(e: ReactPointerEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--gy', `${e.clientY - rect.top}px`);
  }

  // 全局图片预览：让子组件里的 img 能触发主组件的预览层
  useEffect(() => {
    (window as unknown as { __previewImage?: (src: string) => void }).__previewImage = (src: string) => setPreviewSrc(src);
    return () => { delete (window as unknown as { __previewImage?: (src: string) => void }).__previewImage; };
  }, []);

  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    function handleResize() { setVh(window.innerHeight); }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;

    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    const cylinder = cylinderRef.current;
    if (!cylinder) return;
    const vw = window.innerWidth;
    const SPIRAL_RADIUS = 400;
    const STEP_Y = (vw * 0.4) / 3;
    const START_Y_OFFSET = 30;

    const cardAngles: number[] = [];
    const cardYOffsets: number[] = [];
    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      const angle = index * 90;
      const yOffset = START_Y_OFFSET + index * STEP_Y;
      cardAngles[index] = angle;
      cardYOffsets[index] = yOffset;
      panel.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${SPIRAL_RADIUS}px) translateY(${yOffset}px)`;
    });

    gsap.to(cylinder, { rotateY: -270, y: -STEP_Y * 3, ease: 'none',
      scrollTrigger: { trigger: '.carousel-wrapper', start: 'top top', end: 'bottom bottom', scrub: true } });

    const baseScale = 0.85;
    const maxScale = 1.0;
    function updateCards() {
      const currentRotation = gsap.getProperty(cylinder, 'rotateY') as number;
      const currentRotationRad = (currentRotation * Math.PI) / 180;
      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        const angle = cardAngles[index] ?? 0;
        const yOffset = cardYOffsets[index] ?? 0;
        const worldAngleRad = (angle * Math.PI) / 180 + currentRotationRad;
        const z = SPIRAL_RADIUS * Math.cos(worldAngleRad);
        const t = (z + SPIRAL_RADIUS) / (2 * SPIRAL_RADIUS);
        const scale = baseScale + (maxScale - baseScale) * t;
        const opacity = z > 0 ? 0.5 + 0.5 * t : Math.max(0, 0.15 + 0.35 * (1 + z / SPIRAL_RADIUS));
        panel.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${SPIRAL_RADIUS}px) translateY(${yOffset}px) scale(${scale})`;
        panel.style.opacity = String(opacity);
        panel.style.zIndex = String(Math.round(t * 100));

        // 景深聚焦：侧面/背面卡片内部文字虚化缩小，转正瞬间清晰（filter 只加内层，避免压平 3D）
        const focus = cardFocusRefs.current[index];
        if (focus) {
          const blur = Math.pow(1 - t, 1.5) * 8;
          const innerScale = 0.92 + 0.08 * t;
          focus.style.filter = `blur(${blur.toFixed(2)}px)`;
          focus.style.transform = `scale(${innerScale.toFixed(3)})`;
        }
      });
    }
    gsap.ticker.add(updateCards);
    updateCards();

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove(updateCards);
    };
  }, []);

  // 详情弹窗打开/关闭时：停止 Lenis 并锁定窗口原生滚动，让弹层内部独立滚动
  useEffect(() => {
    const hasOverlay = activePanel || activeStoryId || showVisitDetail;
    if (hasOverlay) {
      lenisRef.current?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenisRef.current?.start();
      document.documentElement.style.overflow = '';
    }
  }, [activePanel, activeStoryId, showVisitDetail, activeBusiness]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (previewSrc) { setPreviewSrc(null); return; }
        if (activeBusiness) { setActiveBusiness(null); return; }
        if (showVisitDetail) { setShowVisitDetail(false); return; }
        if (activeStoryId) { setActiveStoryId(null); return; }
        if (activePanel) { setActivePanel(null); }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, activeStoryId, showVisitDetail, activeBusiness]);

  return (
    <div className="relative text-slate-900">
      {/* 隐藏的 SVG 水波滤镜定义 */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={RIPPLE_FILTER_ID} x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="2" result="turbulence" seed="3">
              <animate attributeName="baseFrequency" dur="8s" values="0.015;0.025;0.015" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <WatchaCanvas />
      <CloudsHero />

      <nav className="liquid-glass fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full px-7 py-2.5 text-sm font-medium text-slate-700">
        <div className="font-bold text-slate-900">观猹文化墙</div>
        <div className="nav-glow-link text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" style={{ '--glow-color': '#67e0ed' } as CSSProperties} onClick={() => setActivePanel('timeline')}>校企共建</div>
        <div className="nav-glow-link text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" style={{ '--glow-color': '#a4c1f7' } as CSSProperties} onClick={() => setActivePanel('ecosystem')}>观猹生态</div>
        <div className="nav-glow-link text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" style={{ '--glow-color': '#f472b6' } as CSSProperties} onClick={() => setActivePanel('products')}>产品馆</div>
        <div className="nav-glow-link text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" style={{ '--glow-color': '#ffb38a' } as CSSProperties} onClick={() => setActivePanel('interactive')}>互动</div>
      </nav>

      <div className="carousel-wrapper relative"
        style={{ height: '600vh', opacity: activePanel ? 0 : 1, pointerEvents: activePanel ? 'none' : 'auto', transition: 'opacity 0.5s ease' }}>
        <div className="carousel sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center"
          onPointerMove={handleCarouselPointerMove}
          style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}>
          <div className="wc-balloon-layer" />
          <div className="wc-ripple-layer" />
          <div ref={cylinderRef} className="cylinder relative"
            style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', willChange: 'transform', zIndex: 1 }}>
            {PANELS.map((panel, index) => (
              <div key={panel.id}
                ref={(el) => { panelRefs.current[index] = el; }}
                className="panel absolute left-1/2 top-1/2 flex items-center justify-center cursor-pointer"
                onClick={() => setActivePanel(panel.id)}
                onPointerMove={handleMagneticMove}
                onPointerLeave={handleMagneticLeave}
                style={{ width: '40vw', height: '50vh', transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
                <div className="glass-panel relative w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 8px 32px rgba(103, 224, 237, 0.15), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
                    '--card-accent': panel.accent,
                  } as CSSProperties}>
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-30 blur-2xl" style={{ backgroundColor: panel.accent }} />
                  <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: panel.accent }} />
                  <div ref={(el) => { cardFocusRefs.current[index] = el; }} className="wc-card-focus">
                    <div className="mb-3 text-xs tracking-[0.3em] uppercase font-medium" style={{ color: panel.accent }}>{panel.num}</div>
                    <h2 className="mb-3 text-3xl md:text-4xl font-bold px-2" style={{
                      background: `linear-gradient(135deg, ${panel.accent}, #1a1a2e)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>{panel.title}</h2>
                    <div className="mb-4 text-xs tracking-widest text-slate-500 uppercase">{panel.subtitle}</div>
                    <p className="max-w-xs text-sm text-slate-600 leading-relaxed">{panel.desc}</p>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase opacity-60" style={{ color: panel.accent }}>点击查看 →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 最底部：鸟群区域
          - relative z-10：盖住 fixed 全屏的雾效背景（z-0）
          - 顶部 45vh 背景由透明渐变到 #96b3e1：滚入时与上方雾效柔和衔接，无生硬分界线
          - sticky 钉住 + 150vh 容器：鸟群滚入后钉在视口，页面到底时视口始终被鸟群占满，
            避免滚过鸟类区域后底部露出一条雾效
          - sticky 顶部 30vh mask 渐隐：鸟向上飞入顶部区域逐渐隐没 */}
      <section
        className="relative z-10"
        style={{
          height: '150vh',
          background: 'linear-gradient(to bottom, transparent 0%, #96b3e1 45vh, #96b3e1 100%)',
        }}
      >
        <div
          className="sticky top-0 h-screen"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30vh, black 100%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30vh, black 100%)',
          }}
        >
          <BirdsBackground />
          {/* 中央落款：落地页同款 logo 组合 + 白色小字（位于 sticky 垂直中心，
              在顶部 30vh mask 渐隐区之下，不受遮罩影响） */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="mb-6 flex items-center justify-center gap-6">
              <img src="/hdu-logo.jpg" alt="杭电校徽" className="h-16 w-16 rounded-full object-cover" style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.6)' }} />
              <span className="text-3xl text-white">×</span>
              <img src="/watcha-logo.png" alt="观猹 Logo" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-sm text-white/90 tracking-[0.35em] pl-[0.35em]">始于此方，行至远方</p>
          </div>
        </div>
      </section>

      {/* 主详情页层 */}
      {activePanelData && (
        <div className="watcha-detail-enter fixed inset-0 z-[100] overflow-y-auto" data-lenis-prevent ref={bindVerticalScroll}>
          <CloseButton onClick={() => setActivePanel(null)} />

          <div className="max-w-4xl mx-auto px-5 md:px-6 py-20">
            <DetailHeader num={activePanelData.num} title={activePanelData.title} subtitle={activePanelData.subtitle} accent={activePanelData.accent} />

            {activePanel === 'timeline' && (
              <TimelineDetail accent={activePanelData.accent}
                onOpenStory={(id) => setActiveStoryId(id)}
                onOpenVisit={() => setShowVisitDetail(true)} />
            )}
            {activePanel === 'ecosystem' && <EcosystemDetail accent={activePanelData.accent} onOpenBusiness={(id) => setActiveBusiness(id)} />}
            {activePanel === 'products' && <ProductsDetail accent={activePanelData.accent} />}
            {activePanel === 'interactive' && <InteractiveDetail accent={activePanelData.accent} />}

            <div className="mt-16 mb-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${activePanelData.accent}, transparent)` }} />
            <div className="text-center text-sm text-slate-400 mb-12">观猹学社 · AI 育人生态 · 杭电 × 观猹</div>
          </div>
        </div>
      )}

      {/* 故事子弹窗 */}
      {activePanel === 'timeline' && activePanelData && (
        <StoryDetailPanel story={activeStory} accent={activePanelData.accent} onClose={() => setActiveStoryId(null)} />
      )}

      {/* 调研子弹窗 */}
      {activePanel === 'timeline' && activePanelData && showVisitDetail && (
        <VisitDetailPanel accent={activePanelData.accent} onClose={() => setShowVisitDetail(false)} />
      )}

      {/* 业务详情子弹窗（板块二五大业务） */}
      {activePanel === 'ecosystem' && activePanelData && (
        <BusinessDetailPanel businessId={activeBusiness} accent={activePanelData.accent} onClose={() => setActiveBusiness(null)} />
      )}

      {/* 图片全屏预览层 */}
      {previewSrc && (
        <div className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setPreviewSrc(null)}>
          <img src={previewSrc} alt="预览" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-zoom-in" onClick={(e) => { e.stopPropagation(); (window as any).__previewImage?.(e.currentTarget.src); }} />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center hover:bg-white/40 transition" onClick={() => setPreviewSrc(null)}>✕</button>
        </div>
      )}
    </div>
  );
}
