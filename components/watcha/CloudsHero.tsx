'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CloudsHero — 观猹文化墙顶部 Hero 区（200vh 加厚云层）
 *
 * 基于 6157a89 简单渐变版 + 穿云入雾效果：
 *   - 容器：200vh，占据文档流两屏高度
 *   - Vanta canvas：fixed 全屏，固定在视口
 *   - 滚动 0~100vh：云层完全显示（第一屏，标题区）
 *   - 滚动 100~200vh：云层慢慢淡出（第二屏，穿云入雾）
 *   - 滚动 200vh+：云层完全消失，露出雾效 + 旋转木马
 *
 * 【交互】
 *   - 鼠标移动：云层轻微视差偏移
 *   - 自动缓慢流动
 *   - 向下滚动箭头提示
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

    // === 把 Vanta canvas 改成 fixed 全屏，让云层固定在视口 ===
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.zIndex = '20';
      canvas.style.pointerEvents = 'none';
    }

    // === 滚动驱动云层透明度（穿云入雾效果）===
    // 前两屏（0~200vh）：完全显示，云层厚厚地覆盖
    // 第三屏（200~300vh）：慢慢淡出到 0，穿云而出
    gsap.to(container, {
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top', // 容器底部到达视口顶部时（滚完 300vh）
        scrub: true,
      },
      onUpdate: function () {
        if (!canvas) return;
        const progress = this.progress();
        // progress 0 → 1 对应滚动 0 → 300vh
        // 0~66.7% 时 opacity=1（前两屏完整云层），66.7%~100% 时 opacity 从 1→0
        let opacity = 1;
        if (progress > 2 / 3) {
          opacity = 1 - (progress - 2 / 3) * 3;
        }
        canvas.style.opacity = String(Math.max(0, opacity));
      },
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
      style={{ height: '300vh', background: '#68b8d7' }}
    >
      {/* Hero 内容层 — 第一屏居中 */}
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

      {/* 底部渐变过渡 — 覆盖整个第三屏（100vh），云层慢慢消散成雾气 */}
      <div
        className="absolute left-0 right-0 z-[25] pointer-events-none"
        style={{
          bottom: 0,
          height: '100vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(173, 193, 222, 0.1) 30%, rgba(173, 193, 222, 0.35) 60%, rgba(173, 193, 222, 0.7) 85%, rgba(173, 193, 222, 0.95) 100%)',
        }}
      />
    </div>
  );
}
