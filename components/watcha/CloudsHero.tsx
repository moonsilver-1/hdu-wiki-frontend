'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CloudsHero — 穿越云层效果（云层随滚动移动）
 *
 * 设计：
 *   - 容器高度 400vh，撑开滚动空间
 *   - Vanta canvas：fixed 全屏，通过 translateY 模拟云层移动
 *   - 滚动驱动：云层从上方飘下来 → 充满视口（维持2屏）→ 从底部飘走
 *
 * 阶段划分：
 *   0%~25%    云层从顶部进入：translateY -100vh→0, opacity 0→1
 *   25%~75%   云层充满视口：维持 2 屏的全云状态
 *   75%~100%  云层从底部散出：translateY 0→100vh, opacity 1→0
 */

export default function CloudsHero({ onScrollDown }: { onScrollDown?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Vanta.js CLOUDS 效果
    vantaRef.current = CLOUDS({
      el: container,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      skyColor: 0x68b8d7,       // 天空色彩
      cloudColor: 0xadc1de,     // 云的颜色
      cloudShadowColor: 0x183550, // 云的阴影颜色
      sunColor: 0xff9919,       // 太阳色彩
      sunGlareColor: 0xff6633,  // 太阳眩光彩色
      sunlightColor: 0xff9933,  // 阳光色彩
      speed: 0.6,               // 速度
    });

    // 把 Vanta canvas 改成 fixed 全屏
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.zIndex = '10';
      canvas.style.pointerEvents = 'none';
      canvas.style.opacity = '0'; // 初始透明
    }

    // === 滚动驱动云层：移动 + 透明度 ===
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    // 阶段1：云层从顶部飘入（0% → 25%）
    // translateY: -100% → 0（云层从视口上方外移到视口内）
    // opacity: 0 → 1
    tl.fromTo(canvas,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.25, ease: 'none' }
    );

    // 阶段2：云层充满视口，维持（25% → 75%）
    tl.to(canvas, {
      yPercent: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'none',
    });

    // 阶段3：云层从底部散出（75% → 100%）
    // translateY: 0 → 100%（云层从视口移到下方外）
    // opacity: 1 → 0
    tl.to(canvas, {
      yPercent: 100,
      opacity: 0,
      duration: 0.25,
      ease: 'none',
    });

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
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
      className="relative w-full overflow-visible"
      style={{ height: '400vh', background: '#68b8d7' }}
    >
      {/* Hero 内容层 — 第一屏居中，z-index 高于云层 */}
      <div className="relative z-[20] flex flex-col items-center justify-center h-screen text-center px-6">
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

      {/* 底部渐变过渡：云层散出时柔和衔接雾效 */}
      <div
        className="absolute left-0 right-0 z-[15] pointer-events-none"
        style={{
          bottom: 0,
          height: '10vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(173, 193, 222, 0.6) 50%, rgba(173, 193, 222, 0.95) 100%)',
        }}
      />
    </div>
  );
}
