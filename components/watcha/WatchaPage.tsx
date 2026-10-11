'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import WatchaCanvas from './WatchaCanvas';
import './watcha.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * WatchaPage — 观猹文化墙主页
 *
 * 【核心交互】
 *   1. 旋转木马模式：滚动 → 4 个卡片围绕中心轴旋转切换
 *   2. 点击卡片 → 卡片放大到全屏，进入详情浏览模式
 *   3. 详情模式下：滚动 → 浏览该卡片的详细内容
 *   4. 点击关闭 / ESC → 缩小回到旋转木马
 *
 * 【结构】
 *   WatchaCanvas  —  雾效背景
 *   .carousel     —  3D 旋转木马（4 张卡片）
 *   .detail-modal —  详情层（点击后显示，可滚动浏览）
 */

// 4 个模块的数据
const PANELS = [
  {
    id: 'hero',
    num: '01',
    title: '观猹',
    subtitle: 'GuanCha · AI 育人生态',
    desc: '观猹学社联合杭州电子科技大学，以 AI 育人空间为载体，把观猹正在做的事、AI 圈的最新动态和可直接上手的 AI 产品带进校园。',
    accent: '#67e0ed',
    // 详情页内容（用占位符模拟长文本）
    detailContent: {
      sections: [
        { heading: '关于观猹', paragraphs: 3 },
        { heading: '我们的使命', paragraphs: 4 },
        { heading: '核心理念', paragraphs: 3 },
        { heading: '发展历程', paragraphs: 5 },
        { heading: '未来展望', paragraphs: 3 },
      ],
    },
  },
  {
    id: 'timeline',
    num: '02',
    title: '杭电 × 观猹',
    subtitle: 'AI 育人生态共建',
    desc: '未央学社成立 · 育人基金设立 · 特工宇宙获金奖 · 捐赠2020亿Tokens · 领导调研',
    accent: '#a4c1f7',
    detailContent: {
      sections: [
        { heading: '未央学社成立', paragraphs: 2 },
        { heading: '育人基金设立', paragraphs: 3 },
        { heading: '特工宇宙获金奖', paragraphs: 3 },
        { heading: '捐赠 2020 亿 Tokens', paragraphs: 2 },
        { heading: '领导调研指导', paragraphs: 3 },
        { heading: '未来合作规划', paragraphs: 4 },
      ],
    },
  },
  {
    id: 'products',
    num: '03',
    title: '好用产品馆',
    subtitle: '7 款精选 AI 产品',
    desc: 'Paper2Galgame · 佛脚AI · WorkBuddy · U深研 · ima · Trae · OiiOii',
    accent: '#f472b6',
    detailContent: {
      sections: [
        { heading: 'Paper2Galgame', paragraphs: 2 },
        { heading: '佛脚 AI', paragraphs: 3 },
        { heading: 'WorkBuddy', paragraphs: 2 },
        { heading: 'U 深研', paragraphs: 3 },
        { heading: 'ima', paragraphs: 2 },
        { heading: 'Trae', paragraphs: 3 },
        { heading: 'OiiOii', paragraphs: 2 },
      ],
    },
  },
  {
    id: 'interactive',
    num: '04',
    title: '互动展区',
    subtitle: '沉浸式体验',
    desc: '产品集合墙 · Good/Bad评分墙 · 答题站 · 名片墙 · Token领取',
    accent: '#67e0ed',
    detailContent: {
      sections: [
        { heading: '产品集合墙', paragraphs: 2 },
        { heading: 'Good / Bad 评分墙', paragraphs: 3 },
        { heading: '答题站', paragraphs: 2 },
        { heading: '名片墙', paragraphs: 2 },
        { heading: 'Token 领取', paragraphs: 3 },
      ],
    },
  },
];

// 生成占位符文本（Lorem ipsum 风格）
function generatePlaceholder(count: number): string[] {
  const sentences = [
    '观猹学社致力于构建面向未来的 AI 育人生态，让每一位同学都能在 AI 时代找到自己的位置。',
    '我们相信，AI 不只是工具，更是一种全新的思维方式和创造力的延伸。',
    '通过与杭州电子科技大学的深度合作，我们将前沿的 AI 技术带入校园，让更多人受益。',
    '从基础学习到实战项目，从社区交流到职业发展，观猹为每一位学习者提供全方位的支持。',
    '在这里，你不仅能学到技术，更能找到志同道合的伙伴，一起探索 AI 的无限可能。',
    '我们的产品和服务覆盖学习、工作、创作等多个场景，让 AI 真正融入日常。',
    '每一次互动、每一个问题、每一份创意，都是我们前进的动力。',
  ];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(sentences[i % sentences.length]);
  }
  return result;
}

export default function WatchaPage() {
  const cylinderRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // 当前激活的详情面板（null = 旋转木马模式）
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const activePanelData = PANELS.find((p) => p.id === activePanel);

  useEffect(() => {
    // ========== 1. Lenis 平滑滚动 ==========
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 同步 GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ========== 2. 3D 旋转木马动画 ==========
    const cylinder = cylinderRef.current;
    if (!cylinder) return;

    gsap.to(cylinder, {
      rotateY: -270,
      ease: 'none',
      scrollTrigger: {
        trigger: '.carousel-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // ========== 3. 清理 ==========
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // ESC 关闭详情
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && activePanel) {
        setActivePanel(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel]);

  // 4个页面，间隔 90°
  const panelAngle = 360 / PANELS.length;
  const stepY = (typeof window !== 'undefined' ? window.innerHeight : 800) / 3;

  return (
    <div className="relative text-slate-900">
      {/* 雾效背景 */}
      <WatchaCanvas />

      {/* 导航栏 */}
      <nav className="liquid-glass fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-8 rounded-full px-8 py-3 text-sm font-medium text-slate-700">
        <div className="font-bold text-slate-900">观猹学社</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">生态</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">产品</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">互动</div>
      </nav>

      {/* 旋转木马容器 */}
      <div
        ref={carouselRef}
        className="carousel-wrapper relative"
        style={{
          height: '400vh',
          opacity: activePanel ? 0 : 1,
          pointerEvents: activePanel ? 'none' : 'auto',
          transition: 'opacity 0.5s ease',
        }}
      >
        <div
          className="carousel sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center"
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          <div
            ref={cylinderRef}
            className="cylinder relative"
            style={{
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {PANELS.map((panel, index) => {
              const angle = index * panelAngle;
              const yOffset = index * stepY;

              return (
                <div
                  key={panel.id}
                  className="panel absolute left-1/2 top-1/2 flex items-center justify-center cursor-pointer"
                  onClick={() => setActivePanel(panel.id)}
                  style={{
                    width: '70vw',
                    maxWidth: '900px',
                    height: '70vh',
                    maxHeight: '600px',
                    transform: `
                      translate(-50%, -50%)
                      translateY(${yOffset}px)
                      rotateY(${angle}deg)
                      translateZ(400px)
                    `,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {/* 玻璃态卡片 */}
                  <div
                    className="glass-panel relative w-full h-full rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.8)',
                      boxShadow: `
                        0 8px 32px rgba(103, 224, 237, 0.15),
                        0 2px 8px rgba(0, 0, 0, 0.04),
                        inset 0 1px 1px rgba(255, 255, 255, 0.9)
                      `,
                    }}
                  >
                    {/* 装饰光 */}
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 blur-3xl"
                      style={{ backgroundColor: panel.accent }}
                    />
                    <div
                      className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full opacity-20 blur-3xl"
                      style={{ backgroundColor: panel.accent }}
                    />

                    {/* 编号 */}
                    <div
                      className="mb-4 text-sm tracking-[0.3em] uppercase font-medium"
                      style={{ color: panel.accent }}
                    >
                      {panel.num}
                    </div>

                    {/* 标题 */}
                    <h2
                      className="mb-4 text-5xl md:text-6xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${panel.accent}, #1a1a2e)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {panel.title}
                    </h2>

                    {/* 副标题 */}
                    <div className="mb-6 text-sm tracking-widest text-slate-500 uppercase">
                      {panel.subtitle}
                    </div>

                    {/* 描述 */}
                    <p className="max-w-lg text-base text-slate-600 leading-relaxed">
                      {panel.desc}
                    </p>

                    {/* 点击提示 */}
                    <div
                      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase opacity-60"
                      style={{ color: panel.accent }}
                    >
                      ↓ 点击查看详情 ↓
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 详情页层 — 点击卡片后出现 */}
      {activePanelData && (
        <div
          ref={detailRef}
          className="fixed inset-0 z-[100] overflow-y-auto"
          style={{
            background: 'rgba(252, 244, 231, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          {/* 关闭按钮 */}
          <button
            onClick={() => setActivePanel(null)}
            className="fixed top-6 right-6 z-10 w-12 h-12 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            }}
          >
            ✕
          </button>

          {/* 详情内容 */}
          <div className="max-w-3xl mx-auto px-6 py-24">
            {/* 头部 */}
            <div className="mb-16 text-center">
              <div
                className="mb-4 text-sm tracking-[0.3em] uppercase font-medium"
                style={{ color: activePanelData.accent }}
              >
                {activePanelData.num}
              </div>
              <h1
                className="mb-4 text-6xl md:text-7xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${activePanelData.accent}, #1a1a2e)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {activePanelData.title}
              </h1>
              <div className="text-sm tracking-widest text-slate-500 uppercase">
                {activePanelData.subtitle}
              </div>
            </div>

            {/* 各章节内容 */}
            {activePanelData.detailContent.sections.map((section, idx) => (
              <section key={idx} className="mb-16">
                <h2
                  className="mb-6 text-2xl font-bold flex items-center gap-4"
                  style={{ color: activePanelData.accent }}
                >
                  <span className="text-sm opacity-60">
                    0{idx + 1}
                  </span>
                  {section.heading}
                </h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  {generatePlaceholder(section.paragraphs).map((text, pIdx) => (
                    <p key={pIdx}>{text}</p>
                  ))}
                </div>
              </section>
            ))}

            {/* 底部装饰 */}
            <div
              className="mt-20 mb-8 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${activePanelData.accent}, transparent)`,
              }}
            />
            <div className="text-center text-sm text-slate-400 mb-12">
              观猹学社 · AI 育人生态
            </div>
          </div>
        </div>
      )}

      {/* 底部留白 */}
      <div style={{ height: '20vh' }} />

      {/* 全局动画样式 */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
