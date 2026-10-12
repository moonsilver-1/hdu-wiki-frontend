'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CloudsHero — 多图层视差云效果
 *
 * 设计：
 *   - 5 层云，每层有不同的大小、透明度、移动速度
 *   - 近景云（前景）：大、清晰、移动快
 *   - 远景云（背景）：小、淡、移动慢
 *   - 滚动驱动：云层从上方飘下 → 充满视口 → 从底部散出
 *
 * 视差速度（相对于滚动速度的比例）：
 *   远景层（层1）：0.3x — 慢，制造深度感
 *   中远景（层2）：0.5x
 *   中景层（层3）：0.7x
 *   中近景（层4）：0.9x
 *   近景层（层5）：1.2x — 快，从眼前飘过
 *
 * 容器高度 400vh：
 *   0~25%    云层从顶部进入
 *   25~75%   云层充满视口（维持2屏）
 *   75~100%  云层从底部散出
 */

// 每层云的配置
const CLOUD_LAYERS = [
  // 层 1：远景 — 淡、小、慢
  {
    speed: 0.3,
    opacity: 0.4,
    blur: '60px',
    clouds: [
      { left: '10%', top: '20%', size: '40vw', color: 'rgba(255, 255, 255, 0.3)' },
      { left: '60%', top: '40%', size: '35vw', color: 'rgba(255, 255, 255, 0.25)' },
      { left: '30%', top: '70%', size: '45vw', color: 'rgba(255, 255, 255, 0.35)' },
    ],
  },
  // 层 2：中远景
  {
    speed: 0.5,
    opacity: 0.55,
    blur: '45px',
    clouds: [
      { left: '-5%', top: '15%', size: '35vw', color: 'rgba(255, 255, 255, 0.4)' },
      { left: '50%', top: '50%', size: '40vw', color: 'rgba(255, 255, 255, 0.45)' },
      { left: '20%', top: '75%', size: '38vw', color: 'rgba(255, 255, 255, 0.35)' },
      { left: '75%', top: '25%', size: '30vw', color: 'rgba(255, 255, 255, 0.4)' },
    ],
  },
  // 层 3：中景
  {
    speed: 0.7,
    opacity: 0.7,
    blur: '30px',
    clouds: [
      { left: '5%', top: '30%', size: '30vw', color: 'rgba(255, 255, 255, 0.5)' },
      { left: '55%', top: '60%', size: '35vw', color: 'rgba(255, 255, 255, 0.55)' },
      { left: '25%', top: '10%', size: '28vw', color: 'rgba(255, 255, 255, 0.45)' },
      { left: '70%', top: '80%', size: '32vw', color: 'rgba(255, 255, 255, 0.5)' },
    ],
  },
  // 层 4：中近景
  {
    speed: 0.9,
    opacity: 0.85,
    blur: '18px',
    clouds: [
      { left: '-10%', top: '45%', size: '28vw', color: 'rgba(255, 255, 255, 0.6)' },
      { left: '65%', top: '20%', size: '25vw', color: 'rgba(255, 255, 255, 0.65)' },
      { left: '35%', top: '70%', size: '30vw', color: 'rgba(255, 255, 255, 0.55)' },
      { left: '85%', top: '55%', size: '22vw', color: 'rgba(255, 255, 255, 0.6)' },
    ],
  },
  // 层 5：近景 — 清晰、大、快
  {
    speed: 1.2,
    opacity: 1.0,
    blur: '10px',
    clouds: [
      { left: '0%', top: '25%', size: '22vw', color: 'rgba(255, 255, 255, 0.75)' },
      { left: '70%', top: '55%', size: '20vw', color: 'rgba(255, 255, 255, 0.8)' },
      { left: '40%', top: '85%', size: '25vw', color: 'rgba(255, 255, 255, 0.7)' },
      { left: '90%', top: '10%', size: '18vw', color: 'rgba(255, 255, 255, 0.75)' },
    ],
  },
];

export default function CloudsHero({ onScrollDown }: { onScrollDown?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const vh = window.innerHeight;
    const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];

    // === 为每层云创建独立的滚动动画（视差效果）===
    layers.forEach((layer, index) => {
      const config = CLOUD_LAYERS[index];
      if (!config) return;

      // 初始位置：在视口上方外
      gsap.set(layer, {
        yPercent: -100 * config.speed,
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      // 阶段1：云层从顶部飘入（0% → 25%）
      // 每层按自己的 speed 比例移动
      tl.to(layer, {
        yPercent: 0,
        opacity: config.opacity,
        duration: 0.25,
        ease: 'none',
      });

      // 阶段2：云层停留/飘过（25% → 75%）
      // 远景几乎不动，近景继续飘
      tl.to(layer, {
        yPercent: 50 * (config.speed - 0.3), // 远景移动少，近景移动多
        opacity: config.opacity,
        duration: 0.5,
        ease: 'none',
      });

      // 阶段3：云层从底部散出（75% → 100%）
      tl.to(layer, {
        yPercent: 100 * config.speed + 50,
        opacity: 0,
        duration: 0.25,
        ease: 'none',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const handleScrollDown = () => {
    if (onScrollDown) {
      onScrollDown();
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: '400vh',
        background: 'linear-gradient(to bottom, #68b8d7 0%, #8fc5dd 40%, #adc1de 100%)',
      }}
    >
      {/* ===== 5 层视差云 ===== */}
      {CLOUD_LAYERS.map((layer, layerIndex) => (
        <div
          key={layerIndex}
          ref={(el) => { layerRefs.current[layerIndex] = el; }}
          className="absolute left-0 w-full"
          style={{
            top: 0,
            height: '100vh',
            zIndex: 10 + layerIndex, // 层越高 z-index 越高
            filter: `blur(${layer.blur})`,
            pointerEvents: 'none',
          }}
        >
          {/* 每层中的多朵云 */}
          {layer.clouds.map((cloud, cloudIndex) => (
            <div
              key={cloudIndex}
              className="absolute rounded-full"
              style={{
                left: cloud.left,
                top: cloud.top,
                width: cloud.size,
                height: cloud.size,
                background: `radial-gradient(ellipse at 35% 40%, ${cloud.color} 0%, transparent 65%)`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      ))}

      {/* ===== Hero 内容层 — 第一屏居中 ===== */}
      <div className="relative z-[30] flex flex-col items-center justify-center h-screen text-center px-6">
        {/* 小标签 */}
        <div
          className="mb-6 px-4 py-1.5 rounded-full text-xs tracking-[0.3em] uppercase font-medium"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          观猹学社 × 杭电
        </div>

        {/* 主标题 */}
        <h1
          className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
          style={{
            color: '#fff',
            textShadow: `
              0 2px 20px rgba(104, 184, 215, 0.4),
              0 8px 32px rgba(24, 53, 80, 0.2)
            `,
            letterSpacing: '0.05em',
          }}
        >
          观猹文化墙
        </h1>

        {/* 副标题 */}
        <p
          className="text-lg md:text-xl font-light max-w-xl leading-relaxed mb-12"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            textShadow: '0 1px 8px rgba(24, 53, 80, 0.15)',
          }}
        >
          AI 育人生态 · 精选产品 · 沉浸式互动体验
        </p>

        {/* 向下滚动提示 */}
        <button
          onClick={handleScrollDown}
          className="group absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
        >
          <span className="text-xs tracking-[0.3em] uppercase">向下探索</span>
          <div
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
            style={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}
          >
            <div
              className="w-1 h-2 rounded-full animate-bounce"
              style={{ background: 'rgba(255, 255, 255, 0.8)' }}
            />
          </div>
        </button>
      </div>

      {/* ===== 底部渐变：云层散出时柔和过渡到雾效 ===== */}
      <div
        className="absolute left-0 right-0 z-[25] pointer-events-none"
        style={{
          bottom: 0,
          height: '15vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(173, 193, 222, 0.4) 40%, rgba(173, 193, 222, 0.8) 80%, rgba(173, 193, 222, 0.95) 100%)',
        }}
      />
    </div>
  );
}
