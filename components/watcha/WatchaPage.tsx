'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';
import WatchaCanvas from './WatchaCanvas';
import CloudsHero from './CloudsHero';
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

// ============ 板块一数据：校企发展时间线 ============
type TimelineEvent = { year: string; title: string; desc: string; images?: string[] };

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2020 年 9 月',
    title: '仲泰入学',
    desc: '仲泰进入杭州电子科技大学卓越学院人工智能专业，开启在杭电的校园学习与 AI 实践。',
    images: ['/images/仲泰与指导老师李甫.png'],
  },
  {
    year: '2021 年',
    title: '未央学社成立',
    desc: '针对高数、线代、概率论和专业课程中的学习困难，未央学社成立，在校内推进资料共享、课程答疑以及各类学习活动。',
    images: ['/images/未央学社 Integration Bee 积分赛.png', '/images/青年 AI 互学成长共同体.png'],
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
    images: ['/images/产学研协同与校企合作成果展示.png'],
  },
  {
    year: '2025 年初',
    title: '捐赠育人基金',
    desc: '团队向母校捐赠 5 万元，设立"AI+思政"育人基金，支持学生参与 AI 活动、科研探索和创新赛事。',
    images: ['/images/捐赠育人基金.jpg'],
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
    images: ['/images/中国国际大学生创新大赛（2025）金奖证书.jpg', '/images/特工宇宙项目路演现场.png'],
  },
  {
    year: '2026 年 1 月',
    title: '环球黑客松',
    desc: '环球黑客松 Global Hackathon Tour 杭州站与上海站相继落地，两站均获得央视主动报道。',
    images: ['/images/杭州黑客松活动现场.jpg'],
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
    images: ['/images/杭电 × 观猹 2020 亿 Tokens 捐赠活动.jpg'],
  },
];

const STORY_CARDS = [
  {
    id: 'weiyang',
    title: '未央学社：回应真实学习需求',
    emoji: '📚',
    intro: '15000+ 社群，辐射全校 3w+ 师生。学业帮扶、答疑活动、学习资料共享，把散落在校园各处的学习者凝聚成真正的学习共同体。',
    paragraphs: [
      '未央学社的诞生，源于一群学生最真实的学习困惑——高数、线代、概率论以及专业课程，上课听不太懂、课后没人问、资料找不到。于是有人把课堂笔记整理成文档、有人拉群做每日答疑、有人组织线下刷题。',
      '从零到一，从十几人到 15000+ 社群，未央学社成了杭电最大的学习共同体之一。资料共享、积分赛、高数辅导讲座……只要是能帮同学把学习这件事变得更轻松的事，学社都愿意尝试。',
      '团队邀请过百万粉丝博主李天意为杭电学生开展高数辅导，组织 Integration Bee 积分赛让严肃的数学比拼也能有趣起来。学习不该只是一个人的事，它可以是一群人一起发光。',
    ],
    images: ['/images/未央学社 Integration Bee 积分赛.png', '/images/青年 AI 互学成长共同体.png'],
  },
  {
    id: 'fund',
    title: '设立"AI + 思政"育人基金',
    emoji: '🎓',
    intro: '捐赠 5 万元育人基金，支持学生科研赛事与创新实践，让更多有想法的同学能够大胆试错、勇敢创造。',
    paragraphs: [
      '2025 年初，团队向母校捐赠 5 万元，设立"AI + 思政"育人基金。',
      '这笔基金专门用来支持杭电学生参与 AI 相关的活动、科研探索和创新赛事。团队希望，每一位对 AI 感兴趣的同学都能找到一个让想法落地的出口。',
      '捐赠不只是钱的事，更是一种承诺：我们从校园走出来，就一定要把资源带回校园。',
    ],
    images: ['/images/捐赠育人基金.jpg'],
  },
  {
    id: 'teagent',
    title: '特工宇宙获国赛金奖',
    emoji: '🏆',
    intro: '中国国际大学生创新大赛金奖获得者。从校园实践到全国舞台，特工宇宙用实力证明——杭电学子能做最前沿的 AI 产品。',
    paragraphs: [
      '中国国际大学生创新大赛（2025）上，"特工宇宙——领先级 AI Agent 开发平台与全链路解决方案供应商"项目获得全国金奖。',
      '这个奖项的背后，是十余位 00 后组成的创业团队在 AI Agent 方向上的持续深耕。从内容研究到技术探索、从产品原型到企业解决方案，他们用实际成果回应了市场与业界的期待。',
      '对杭电来说，这不仅仅是一枚奖牌——它证明：学生团队完全有能力把课堂上学到的知识，变成真正领先的产品与平台。',
    ],
    images: ['/images/中国国际大学生创新大赛（2025）金奖证书.jpg', '/images/特工宇宙项目路演现场.png'],
  },
  {
    id: 'tokens',
    title: '2020 亿 Tokens 捐赠：让 AI 资源持续回流',
    emoji: '⚡',
    intro: '2026 年 5 月，团队向杭电捐赠 2020 亿 Tokens，支持学生尝试 Agent 产品，开展学习、项目开发和创新实践。',
    paragraphs: [
      '"2020"对应团队成员进入杭电、开启大学生活的年份。这份捐赠不只是提供一项资源，也希望让学生从了解 AI，进一步走向使用 AI、做出作品、完成项目。',
      '除 Token 补助外，团队还将提供实习校招、项目孵化、赛事承办和前沿教程等支持。',
      '过去从校园开始的经历，正在转化为今天更多学生可以使用的 AI 学习和实践机会。',
    ],
    images: ['/images/杭电 × 观猹 2020 亿 Tokens 捐赠活动.jpg'],
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
const FIVE_BUSINESSES = [
  { name: '观猹平台', desc: 'AI 产品的大众点评——发现、评分、讨论、体验，一站式 AI 产品探索社区。' },
  { name: 'TokenDance 词元跳动', desc: '让 AI 变得可触摸——词元经济与创作激励平台，每一次创造都有价值。' },
  { name: '猹与猹增长服务', desc: '面向 AI 产品的增长加速器——从冷启动到规模化，陪你跑完整条路。' },
  { name: '特工宇宙媒体', desc: '聚焦 AI 圈内容生态——产品测评、行业观察、深度专访，做有趣有料的 AI 媒体。' },
  { name: '环球黑客松', desc: '连接全球 AI 开发者——多站点巡回、48 小时极限创造，把想法变成现实。' },
];

const PARTNERS = ['杭州电子科技大学', '浙江大学', '阿里巴巴', '百度智能云', '腾讯云', '字节跳动', '华为云', '讯飞星火', '月之暗面', '零一万物'];

const KEY_EVENTS = [
  { time: '2024.06', name: '观猹大会', desc: '首届观猹大会在杭电举办，AI 产品首发与行业分享。' },
  { time: '2024.09', name: '猹话会', desc: '每月一期的线下沙龙，AI 创业者与学生面对面。' },
  { time: '2024.11', name: '黑客松 · 杭州站', desc: '48 小时限时创造，100+ 开发者同场竞技。' },
  { time: '2025.07', name: 'WAIC 世界人工智能大会', desc: '观猹受邀参展，展示校园 AI 育人生态实践。' },
  { time: '2025.09', name: 'ChinaJoy 互动展区', desc: '学生 AI 产品集体亮相，与 Z 世代用户亲密接触。' },
  { time: '2026.03', name: '黑客松 · 北京站', desc: '跨城市连线，南北 AI 开发者共创。' },
];

// ============ 板块三数据：好用产品馆 ============
type Product = { name: string; slogan: string; desc: string; tags: string[]; rating: number; link: string; qrHint: string };
const PRODUCT_CATEGORIES = ['全部', '论文阅读', '备考学习', '办公调研', '代码开发', '动画创作'];
const ALL_PRODUCTS: Product[] = [
  { name: 'Paper2Galgame', slogan: '把论文读成恋爱游戏', desc: '用 Galgame 形式重新呈现学术论文，让硬核知识也能轻松入门。', tags: ['论文阅读', '趣味学习'], rating: 4.8, link: 'https://watcha.cn', qrHint: '扫码体验 Paper2Galgame' },
  { name: '佛脚 AI', slogan: '抱对佛脚，考试不慌', desc: 'AI 驱动的智能备考助手，知识点梳理 + 真题训练 + 薄弱点精准打击。', tags: ['备考学习'], rating: 4.6, link: 'https://watcha.cn', qrHint: '扫码体验佛脚 AI' },
  { name: 'WorkBuddy', slogan: '你的职场 AI 搭子', desc: 'PPT 生成、会议纪要、邮件润色、数据整理——办公全流程效率提升。', tags: ['办公调研'], rating: 4.5, link: 'https://watcha.cn', qrHint: '扫码体验 WorkBuddy' },
  { name: 'UniFuncs', slogan: '程序员的瑞士军刀', desc: '极简高效的代码工具集，格式化、压缩、转换、加密，一个页面搞定。', tags: ['代码开发'], rating: 4.7, link: 'https://watcha.cn', qrHint: '扫码体验 UniFuncs' },
  { name: 'ima', slogan: 'AI 图像，想画就画', desc: '文生图、图生图、风格迁移，内置多种模型，零门槛创作专业级图像。', tags: ['动画创作'], rating: 4.4, link: 'https://watcha.cn', qrHint: '扫码体验 ima' },
  { name: 'Trae', slogan: '懂你的 AI IDE', desc: '字节跳动出品的 AI 代码编辑器，自然语言写代码、全项目级智能重构。', tags: ['代码开发'], rating: 4.9, link: 'https://trae.ai', qrHint: '扫码下载 Trae' },
  { name: 'OiiOii', slogan: '把日常变成动画', desc: '一句描述生成 2D 动画短片，角色、场景、分镜、配乐全自动。', tags: ['动画创作'], rating: 4.3, link: 'https://watcha.cn', qrHint: '扫码体验 OiiOii' },
];

// ============ 板块四数据：互动展区 ============
const VOTE_PRODUCTS = [
  { id: 1, name: 'Paper2Galgame', desc: '把论文读成恋爱游戏的神奇工具', good: 248, bad: 31 },
  { id: 2, name: '佛脚 AI', desc: '备考党福音，AI 帮你抓重点', good: 189, bad: 52 },
  { id: 3, name: 'Trae', desc: '懂你的 AI 代码编辑器', good: 312, bad: 18 },
  { id: 4, name: 'OiiOii', desc: '一句话生成动画短片', good: 156, bad: 44 },
];

const QUIZ_QUESTIONS = [
  { q: '观猹平台的定位是什么？', options: ['AI 产品的大众点评', '电商购物平台', '短视频 App', '在线教育'], answer: 0, explain: '观猹是 AI 产品发现、评分与讨论社区，被誉为"AI 产品的大众点评"。' },
  { q: '2020 亿 Tokens 捐赠中的"2020"代表什么？', options: ['公司成立年份', '创始人入校年份', '产品发布年份', '融资额（万元）'], answer: 1, explain: '2020 代表创始人入校年份，寓意从校园出发、回报母校。' },
  { q: '未央学社目前辐射多少师生？', options: ['5000+', '10000+', '30000+', '50000+'], answer: 2, explain: '未央学社拥有 15000+ 社群成员，辐射全校 3w+ 师生。' },
  { q: '特工宇宙获得过什么国家级奖项？', options: ['ACM 金牌', '互联网+ 金奖', '中国国际大学生创新大赛金奖', '数学建模国一'], answer: 2, explain: '特工宇宙荣获中国国际大学生创新大赛金奖。' },
  { q: '观猹的五大业务不包括以下哪一项？', options: ['观猹平台', 'TokenDance', 'AI 芯片设计', '环球黑客松'], answer: 2, explain: '观猹五大业务：观猹平台、TokenDance、猹与猹增长、特工宇宙媒体、环球黑客松。' },
];

const STAR_WATCHERS = [
  { name: '悟鸣 AI', tag: 'AI 独立开发者', quote: 'AI 时代，每个人都可以成为造物主。', intro: '从校园黑客到独立开发者，悟鸣 AI 在 Agent 领域持续探索。' },
  { name: '小明同学', tag: '产品经理', quote: '好的 AI 产品，应该让最普通的用户也能感受到魔法。', intro: '前大厂 PM，现在用产品思维让 AI 更懂用户。' },
  { name: 'GoodTime', tag: '全栈工程师', quote: '代码是我的语言，AI 让我说得更快更远。', intro: '从竞赛选手到 AI 创业者，相信技术改变世界。' },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
      {images.map((src, i) => (
        <figure key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: `${accent}40`, background: '#fff' }}>
          <img src={src} alt="" className="w-full h-52 object-cover" />
        </figure>
      ))}
    </div>
  );
}

// ============ 板块一详情：校企发展时间线 ============

function TimelineDetail({ accent, onOpenStory, onOpenVisit }: { accent: string; onOpenStory: (id: string) => void; onOpenVisit: () => void }) {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

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
        <div className="relative overflow-x-auto pb-2" data-lenis-prevent>
          <div className="flex gap-4 md:gap-5 min-w-max px-2">
            {TIMELINE_EVENTS.map((ev, i) => (
              <div key={i}
                onClick={() => setActiveEvent(activeEvent === i ? null : i)}
                className={`cursor-pointer shrink-0 w-60 rounded-2xl p-5 border-2 transition-all ${activeEvent === i ? 'scale-[1.02] shadow-lg' : 'hover:shadow-md'}`}
                style={{
                  background: activeEvent === i ? `${accent}20` : 'rgba(255,255,255,0.85)',
                  borderColor: activeEvent === i ? accent : 'rgba(0,0,0,0.06)',
                }}>
                <div className="text-xs font-bold tracking-wider mb-1" style={{ color: accent }}>{ev.year}</div>
                <div className="text-base font-bold text-slate-800 mb-2 leading-snug">{ev.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed line-clamp-3">{ev.desc}</div>
                {ev.images && ev.images.length > 0 && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img src={ev.images[0]} alt="" className="w-full h-24 object-cover" />
                  </div>
                )}
                {activeEvent === i && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="text-sm text-slate-700 leading-relaxed mb-3">{ev.desc}</div>
                    {ev.images && <ImageGallery images={ev.images} accent={accent} />}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-400 text-center">← 横向滑动 / 点击节点查看详情 →</div>
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
                  <img src={card.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">{card.emoji}</div>
                )}
                <div className="absolute top-3 left-3 text-3xl drop-shadow">{card.emoji}</div>
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
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2"><span>🏫</span> 高校 × 中学 × 青年创业团队</h3>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          杭电、学军中学领导莅临观猹调研交流 · 连接中学 - 高校 - 青年创业团队 · 打开 AI 教育真实场景
        </p>
        <div className="mt-4 text-xs font-semibold" style={{ color: accent }}>点击查看调研详情 →</div>
      </button>
    </div>
  );
}

// ============ 板块二详情：观猹生态 ============

function EcosystemDetail({ accent }: { accent: string }) {
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

      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />五大业务矩阵
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FIVE_BUSINESSES.map((b, i) => (
            <div key={i} className="rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
              <div className="text-xs font-bold mb-2" style={{ color: accent }}>0{i + 1}</div>
              <h4 className="text-base font-bold text-slate-800 mb-2">{b.name}</h4>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />合作伙伴 & 生态伙伴
        </h3>
        <div className="rounded-2xl p-5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex gap-3 overflow-x-auto pb-2" data-lenis-prevent>
            {PARTNERS.map((p, i) => (
              <div key={i} className="shrink-0 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700"
                style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.06)' }}>{p}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />重点活动回顾
        </h3>
        <div className="space-y-3">
          {KEY_EVENTS.map((ev, i) => (
            <div key={i} className="flex gap-4 rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.06)' }}>
              <div className="shrink-0 w-20 text-xs font-bold text-center pt-1" style={{ color: accent }}>{ev.time}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-800 mb-1">{ev.name}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{ev.desc}</div>
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

// ============ 板块三详情：好用产品馆 ============

function ProductsDetail({ accent }: { accent: string }) {
  const [cat, setCat] = useState('全部');
  const filtered = cat === '全部' ? ALL_PRODUCTS : ALL_PRODUCTS.filter((p) => p.tags.includes(cat));

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        {PRODUCT_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={cat === c ? { background: accent, color: '#fff' } : { background: 'rgba(255,255,255,0.85)', color: '#1a1a2e', border: '1px solid rgba(0,0,0,0.1)' }}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(0,0,0,0.06)' }}>
            <div className="p-5 pb-3">
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black" style={{ background: `${accent}20`, color: accent }}>{p.name.charAt(0)}</div>
                <div className="min-w-0">
                  <div className="text-base font-bold text-slate-800 leading-tight">{p.name}</div>
                  <div className="text-xs text-slate-500 italic mt-0.5 truncate">{p.slogan}</div>
                </div>
              </div>
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
  const [votes, setVotes] = useState(VOTE_PRODUCTS);
  const [voteMap, setVoteMap] = useState<Record<number, 'good' | 'bad'>>({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const handleVote = (pid: number, type: 'good' | 'bad') => {
    if (voteMap[pid]) return;
    setVoteMap((m) => ({ ...m, [pid]: type }));
    setVotes((vs) => vs.map((v) => v.id === pid ? { ...v, good: v.good + (type === 'good' ? 1 : 0), bad: v.bad + (type === 'bad' ? 1 : 0) } : v));
  };

  const handleQuizSubmit = () => {
    if (selected === null) return;
    if (selected === QUIZ_QUESTIONS[quizIdx].answer) setScore((s) => s + 1);
    setShowResult(true);
  };

  const handleQuizNext = () => {
    if (quizIdx + 1 >= QUIZ_QUESTIONS.length) setQuizDone(true);
    else { setQuizIdx(quizIdx + 1); setSelected(null); setShowResult(false); }
  };

  const resetQuiz = () => { setQuizIdx(0); setSelected(null); setShowResult(false); setScore(0); setQuizDone(false); };

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
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm" style={{ background: `${accent}20`, color: accent }}>{v.name.charAt(0)}</div>
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
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />02 · 观猹学社答题站
        </h3>
        <div className="rounded-2xl p-6 md:p-8" style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.06)' }}>
          {!quizDone ? (
            <>
              <div className="text-xs text-slate-400 mb-2">进度 {quizIdx + 1} / {QUIZ_QUESTIONS.length}</div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5">
                <div className="h-full transition-all rounded-full" style={{ width: `${((quizIdx + (showResult ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%`, background: accent }} />
              </div>
              <div className="text-base md:text-lg font-bold text-slate-800 mb-5">{QUIZ_QUESTIONS[quizIdx].q}</div>
              <div className="space-y-2 mb-5">
                {QUIZ_QUESTIONS[quizIdx].options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = showResult && i === QUIZ_QUESTIONS[quizIdx].answer;
                  const isWrong = showResult && isSelected && i !== QUIZ_QUESTIONS[quizIdx].answer;
                  return (
                    <button key={i} onClick={() => !showResult && setSelected(i)} disabled={showResult}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all border"
                      style={{
                        background: isCorrect ? '#d1fae5' : isWrong ? '#fee2e2' : isSelected ? `${accent}20` : 'rgba(255,255,255,0.9)',
                        borderColor: isCorrect ? '#10b981' : isWrong ? '#ef4444' : isSelected ? accent : 'rgba(0,0,0,0.08)',
                        color: isWrong ? '#dc2626' : isCorrect ? '#059669' : '#1a1a2e',
                      }}>
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                      {isCorrect && <span className="ml-2">✓</span>}
                      {isWrong && <span className="ml-2">✗</span>}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <div className="rounded-xl p-4 text-sm text-slate-600 mb-4" style={{ background: `${accent}12` }}>
                  <span className="font-bold" style={{ color: accent }}>📖 解析：</span> {QUIZ_QUESTIONS[quizIdx].explain}
                </div>
              )}
              <div className="flex gap-3 justify-end">
                {!showResult ? (
                  <button onClick={handleQuizSubmit} disabled={selected === null} className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-transform"
                    style={{ background: selected === null ? '#cbd5e1' : accent, cursor: selected === null ? 'not-allowed' : 'pointer' }}>提交答案</button>
                ) : (
                  <button onClick={handleQuizNext} className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                    style={{ background: accent }}>{quizIdx + 1 >= QUIZ_QUESTIONS.length ? '查看结果' : '下一题 →'}</button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-slate-800 mb-2">答题完成！</div>
              <div className="text-sm text-slate-500 mb-1">你答对了</div>
              <div className="text-4xl font-black mb-1" style={{ color: accent }}>{score} / {QUIZ_QUESTIONS.length}</div>
              <div className="text-xs text-slate-400 mb-5">🎁 完成答题可获取 Token 相关权益指引</div>
              <button onClick={resetQuiz} className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: accent }}>再玩一次</button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />03 · 金牌观猹员名片墙
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-2" data-lenis-prevent>
          {STAR_WATCHERS.map((sw, i) => (
            <div key={i} className="shrink-0 w-64 rounded-2xl p-5 border transition-all hover:shadow-md"
              style={{ background: 'rgba(255,255,255,0.85)', borderColor: 'rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ background: `linear-gradient(135deg, ${accent}, #a4c1f7)` }}>{sw.name.charAt(0)}</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{sw.name}</div>
                  <div className="text-xs text-slate-500">{sw.tag}</div>
                </div>
              </div>
              <div className="rounded-xl px-3 py-2.5 text-sm italic text-slate-700 mb-3" style={{ background: `${accent}10` }}>"{sw.quote}"</div>
              <div className="text-[11px] text-slate-400 leading-relaxed">{sw.intro}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="inline-block w-1 h-6 rounded-full" style={{ background: accent }} />04 · Token 创作补给站
        </h3>
        <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center"
          style={{ background: `linear-gradient(135deg, ${accent}18, #a4c1f715)`, border: `1px solid ${accent}50` }}>
          <div className="flex-1">
            <div className="text-3xl md:text-4xl font-black mb-3" style={{ color: accent }}>2020 亿 Tokens</div>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed mb-4">
              2020 代表入校年份，每一个 Token 都是我们回流母校的承诺。算力资源、实习孵化、AI 教程，全面支持同学的创作与学习。
            </p>
            <div className="text-xs text-slate-500">📱 扫码下方二维码 → 查看 Token 领取教程（微信文章）</div>
          </div>
          <div className="shrink-0 w-32 h-32 rounded-2xl flex items-center justify-center text-center text-xs text-slate-500 p-3"
            style={{ background: '#fff', border: `2px dashed ${accent}` }}>
            <div>
              <div className="text-3xl mb-1">📷</div>
              <div>领取教程</div>
              <div className="mt-1 text-[10px] text-slate-400">微信文章二维码</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ 故事子弹窗 ============

function StoryDetailPanel({ story, accent, onClose }: { story: typeof STORY_CARDS[number] | null; accent: string; onClose: () => void }) {
  if (!story) return null;
  return (
    <div className="watcha-detail-enter fixed inset-0 z-[120] overflow-y-auto" data-lenis-prevent>
      <CloseButton onClick={onClose} top="top-24" />
      <div className="max-w-3xl mx-auto px-5 md:px-6 py-20">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{story.emoji}</div>
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
    <div className="watcha-detail-enter fixed inset-0 z-[120] overflow-y-auto" data-lenis-prevent>
      <CloseButton onClick={onClose} top="top-24" />
      <div className="max-w-3xl mx-auto px-5 md:px-6 py-20">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏫</div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">高校 × 中学 × 青年创业团队</h2>
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
  const lenisRef = useRef<Lenis | null>(null);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const activePanelData = PANELS.find((p) => p.id === activePanel);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [showVisitDetail, setShowVisitDetail] = useState(false);
  const activeStory = STORY_CARDS.find((s) => s.id === activeStoryId) || null;

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
    const START_Y_OFFSET = 50;

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

  // 详情弹窗打开/关闭时停止/恢复 Lenis，让详情面板原生滚动生效
  useEffect(() => {
    const hasOverlay = activePanel || activeStoryId || showVisitDetail;
    if (hasOverlay) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [activePanel, activeStoryId, showVisitDetail]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showVisitDetail) { setShowVisitDetail(false); return; }
        if (activeStoryId) { setActiveStoryId(null); return; }
        if (activePanel) { setActivePanel(null); }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, activeStoryId, showVisitDetail]);

  return (
    <div className="relative text-slate-900">
      <WatchaCanvas />
      <CloudsHero />

      <nav className="liquid-glass fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full px-7 py-2.5 text-sm font-medium text-slate-700">
        <div className="font-bold text-slate-900">观猹文化墙</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" onClick={() => setActivePanel('timeline')}>校企共建</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" onClick={() => setActivePanel('ecosystem')}>观猹生态</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" onClick={() => setActivePanel('products')}>产品馆</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors" onClick={() => setActivePanel('interactive')}>互动</div>
      </nav>

      <div className="carousel-wrapper relative"
        style={{ height: '600vh', opacity: activePanel ? 0 : 1, pointerEvents: activePanel ? 'none' : 'auto', transition: 'opacity 0.5s ease' }}>
        <div className="carousel sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}>
          <div ref={cylinderRef} className="cylinder relative"
            style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', willChange: 'transform' }}>
            {PANELS.map((panel, index) => (
              <div key={panel.id}
                ref={(el) => { panelRefs.current[index] = el; }}
                className="panel absolute left-1/2 top-1/2 flex items-center justify-center cursor-pointer"
                onClick={() => setActivePanel(panel.id)}
                style={{ width: '40vw', height: '56vh', transformStyle: 'preserve-3d', transformOrigin: 'center center' }}>
                <div className="glass-panel relative w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.72)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 8px 32px rgba(103, 224, 237, 0.15), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
                  }}>
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-30 blur-2xl" style={{ backgroundColor: panel.accent }} />
                  <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: panel.accent }} />
                  <div className="mb-3 text-xs tracking-[0.3em] uppercase font-medium" style={{ color: panel.accent }}>{panel.num}</div>
                  <h2 className="mb-3 text-3xl md:text-4xl font-bold px-2" style={{
                    background: `linear-gradient(135deg, ${panel.accent}, #1a1a2e)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{panel.title}</h2>
                  <div className="mb-4 text-xs tracking-widest text-slate-500 uppercase">{panel.subtitle}</div>
                  <p className="max-w-xs text-sm text-slate-600 leading-relaxed">{panel.desc}</p>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase opacity-60" style={{ color: panel.accent }}>点击查看 →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 主详情页层 */}
      {activePanelData && (
        <div className="watcha-detail-enter fixed inset-0 z-[100] overflow-y-auto" data-lenis-prevent>
          <CloseButton onClick={() => setActivePanel(null)} />

          <div className="max-w-4xl mx-auto px-5 md:px-6 py-20">
            <DetailHeader num={activePanelData.num} title={activePanelData.title} subtitle={activePanelData.subtitle} accent={activePanelData.accent} />

            {activePanel === 'timeline' && (
              <TimelineDetail accent={activePanelData.accent}
                onOpenStory={(id) => setActiveStoryId(id)}
                onOpenVisit={() => setShowVisitDetail(true)} />
            )}
            {activePanel === 'ecosystem' && <EcosystemDetail accent={activePanelData.accent} />}
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
    </div>
  );
}
