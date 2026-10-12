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
 * 【核心效果】3D 螺旋式滚动叙事
 *   4 个卡片围绕中心轴螺旋排列（既有旋转角度，又有纵向偏移）
 *   向下滚动 → 整体旋转 + 下移 → 新卡片从下方转上来
 *   卡片大小：默认 1/3 屏，接近正前方时放大到 2/3 屏
 *
 * 【交互】
 *   - 滚动：驱动整体旋转+下移
 *   - 点击卡片：进入详情页
 *   - ESC / 关闭按钮：返回旋转木马
 */

const PANELS = [
  {
    id: 'hero',
    num: '01',
    title: '观猹',
    subtitle: 'GuanCha · AI 育人生态',
    desc: '观猹学社联合杭州电子科技大学，以 AI 育人空间为载体，把观猹正在做的事、AI 圈的最新动态和可直接上手的 AI 产品带进校园。',
    accent: '#67e0ed',
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
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const activePanelData = PANELS.find((p) => p.id === activePanel);

  // 视口高度（SSR 默认值，CSR 后更新）
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    function handleResize() {
      setVh(window.innerHeight);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ========== 2. 螺旋参数 ==========
    const cylinder = cylinderRef.current;
    if (!cylinder) return;

    const vh = window.innerHeight;
    const SPIRAL_RADIUS = 360;       // 螺旋半径（px）
    const STEP_Y = vh * 0.38;        // 每个卡片的纵向间距
    const START_Y_OFFSET = -STEP_Y * 0.6; // 第0个卡片的y偏移（中心偏上）

    // ========== 2.1 设置卡片初始位置（圆柱表面） ==========
    // 卡片贴在圆柱表面，正面朝向圆柱外侧（远离中心）
    // 注意：transform 顺序很重要 — rotateY 在前 translateZ 在后
    // （CSS 从右往左应用，所以 translateZ 先执行、rotateY 后执行 = 先移出去再旋转 = 贴在圆柱表面）
    const cardAngles: number[] = [];
    const cardYOffsets: number[] = [];
    panelRefs.current.forEach((panel, index) => {
      if (!panel) return;
      const angle = index * 90; // 0°, 90°, 180°, 270°
      const yOffset = START_Y_OFFSET + index * STEP_Y;
      cardAngles[index] = angle;
      cardYOffsets[index] = yOffset;

      panel.style.transform = `
        translate(-50%, -50%)
        rotateY(${angle}deg)
        translateZ(${SPIRAL_RADIUS}px)
        translateY(${yOffset}px)
      `;
    });

    // ========== 3. 滚动驱动：螺旋旋转 + 上移 ==========
    // 向下滚动 → cylinder 逆时针旋转 + 向上移动
    // 最终第4个卡片（index 3）到达正前方中心位置
    gsap.to(cylinder, {
      rotateY: -270, // 逆时针旋转 270°（4个卡片，转3次）
      y: -STEP_Y * 3, // 向上移动 3 个台阶
      ease: 'none',
      scrollTrigger: {
        trigger: '.carousel-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5, // 加一点跟随感
      },
    });

    // ========== 4. 每帧更新：缩放 + 透明度（透视增强） ==========
    // CSS perspective 已有自然透视，这里额外加一点缩放增强效果
    const baseScale = 0.85;  // 最远卡片缩放
    const maxScale = 1.0;    // 最近卡片缩放（原始大小）

    function updateCards() {
      const currentRotation = gsap.getProperty(cylinder, 'rotateY') as number;
      const currentRotationRad = (currentRotation * Math.PI) / 180;

      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;

        const angle = cardAngles[index] ?? 0;
        const yOffset = cardYOffsets[index] ?? 0;
        const angleRad = (angle * Math.PI) / 180;

        // 当前世界角度 = 初始角度 + 圆柱旋转角度
        const worldAngleRad = angleRad + currentRotationRad;

        // z 位置决定缩放和透明度（z越大越近 → 越大越清晰）
        const z = SPIRAL_RADIUS * Math.cos(worldAngleRad);
        const t = (z + SPIRAL_RADIUS) / (2 * SPIRAL_RADIUS); // 0~1，0最远，1最近

        // 缩放：远小近大（增强透视感）
        const scale = baseScale + (maxScale - baseScale) * t;

        // 透明度：远处稍淡，背面淡出
        const opacity = z > 0 ? (0.5 + 0.5 * t) : Math.max(0, 0.15 + 0.35 * (1 + z / SPIRAL_RADIUS));

        // 用完整 transform 确保顺序正确：定位 + 缩放
        panel.style.transform = `
          translate(-50%, -50%)
          rotateY(${angle}deg)
          translateZ(${SPIRAL_RADIUS}px)
          translateY(${yOffset}px)
          scale(${scale})
        `;
        panel.style.opacity = String(opacity);

        // z-index：近的在上层
        const zIndex = Math.round(t * 100);
        panel.style.zIndex = String(zIndex);
      });
    }

    gsap.ticker.add(updateCards);
    updateCards(); // 初始调用一次，防止首帧闪烁

    // ========== 5. 清理 ==========
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove(updateCards);
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

  return (
    <div className="relative text-slate-900">
      {/* 雾效背景（fixed 全屏，在 Hero 滚走后可见） */}
      <WatchaCanvas />

      {/* ===== Hero 区：云层背景 + 大标题 ===== */}
      <CloudsHero />

      {/* 导航栏 */}
      <nav className="liquid-glass fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-8 rounded-full px-8 py-3 text-sm font-medium text-slate-700">
        <div className="font-bold text-slate-900">观猹学社</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">生态</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">产品</div>
        <div className="text-slate-500 hover:text-slate-900 cursor-pointer transition-colors">互动</div>
      </nav>

      {/* 旋转木马容器 — 高度=500vh，给滚动留出足够空间 */}
      <div
        className="carousel-wrapper relative"
        style={{
          height: '500vh',
          opacity: activePanel ? 0 : 1,
          pointerEvents: activePanel ? 'none' : 'auto',
          transition: 'opacity 0.5s ease',
        }}
      >
        {/* 3D 舞台 */}
        <div
          className="carousel sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center"
          style={{
            perspective: '1500px',
            perspectiveOrigin: '50% 50%',
          }}
        >
          {/* 旋转圆柱 — 旋转 + 下移 */}
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
              return (
                <div
                  key={panel.id}
                  ref={(el) => { panelRefs.current[index] = el; }}
                  className="panel absolute left-1/2 top-1/2 flex items-center justify-center cursor-pointer"
                  onClick={() => setActivePanel(panel.id)}
                  style={{
                    width: '30vw',
                    height: '42vh',
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                  }}
                >
                  {/* 玻璃态卡片 */}
                  <div
                    className="glass-panel relative w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center"
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
                      className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-30 blur-2xl"
                      style={{ backgroundColor: panel.accent }}
                    />
                    <div
                      className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full opacity-20 blur-2xl"
                      style={{ backgroundColor: panel.accent }}
                    />

                    {/* 编号 */}
                    <div
                      className="mb-3 text-xs tracking-[0.3em] uppercase font-medium"
                      style={{ color: panel.accent }}
                    >
                      {panel.num}
                    </div>

                    {/* 标题 */}
                    <h2
                      className="mb-3 text-3xl md:text-4xl font-bold"
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
                    <div className="mb-4 text-xs tracking-widest text-slate-500 uppercase">
                      {panel.subtitle}
                    </div>

                    {/* 描述 */}
                    <p className="max-w-xs text-sm text-slate-600 leading-relaxed">
                      {panel.desc}
                    </p>

                    {/* 点击提示 */}
                    <div
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase opacity-60"
                      style={{ color: panel.accent }}
                    >
                      点击查看 →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 详情页层 */}
      {activePanelData && (
        <div
          className="watcha-detail-enter fixed inset-0 z-[100] overflow-y-auto"
        >
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

          <div className="max-w-3xl mx-auto px-6 py-24">
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

            {activePanelData.detailContent.sections.map((section, idx) => (
              <section key={idx} className="mb-16">
                <h2
                  className="mb-6 text-2xl font-bold flex items-center gap-4"
                  style={{ color: activePanelData.accent }}
                >
                  <span className="text-sm opacity-60">0{idx + 1}</span>
                  {section.heading}
                </h2>
                <div className="space-y-4 text-slate-700 leading-relaxed">
                  {generatePlaceholder(section.paragraphs).map((text, pIdx) => (
                    <p key={pIdx}>{text}</p>
                  ))}
                </div>
              </section>
            ))}

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

      <div style={{ height: '20vh' }} />
    </div>
  );
}
