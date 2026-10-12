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
 * 结构：
 *   - 容器：200vh，占据文档流两屏高度
 *   - Vanta canvas：fixed 全屏，固定在视口
 *   - 滚动 0~100vh：云层完全显示（第一屏，标题区）
 *   - 滚动 100~200vh：云层慢慢淡出（第二屏，穿云入雾）
 *   - 滚动 200vh+：云层完全消失，露出雾效 + 旋转木马
 *
 * 底部过渡：飘动云絮 + 雾气粒子 + 渐变，增强穿云感
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

    // === 滚动驱动云层透明度 ===
    // 第一屏（0~100vh）：完全显示
    // 第二屏（100~200vh）：慢慢淡出到 0
    gsap.to(container, {
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top', // 容器底部到达视口顶部时（滚完 200vh）
        scrub: true,
      },
      // 用一个自定义属性控制透明度
      onUpdate: function () {
        if (!canvas) return;
        const progress = this.progress();
        // progress 0 → 1 对应滚动 0 → 200vh
        // 我们要：0~50% 时 opacity=1，50%~100% 时 opacity 从 1→0
        let opacity = 1;
        if (progress > 0.5) {
          opacity = 1 - (progress - 0.5) * 2;
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
      style={{ height: '200vh' }}
    >
      {/* Hero 内容层 — 第一屏居中，z-index 高于 canvas */}
      <div
        className="relative z-[30] flex flex-col items-center justify-center h-screen text-center px-6"
      >
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
          className="group absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-30"
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

      {/* ===== 底部过渡区：第二屏（100vh~200vh）云层消散 ===== */}

      {/* 飘动的云絮 — 大朵漂浮的云，营造穿云感 */}
      <div
        className="absolute left-0 right-0 z-[25] pointer-events-none overflow-hidden"
        style={{ bottom: 0, height: '100vh' }}
      >
        {/* 云朵 1 — 左大云 */}
        <div
          className="absolute cloud-float-1"
          style={{
            left: '-15%',
            bottom: '25%',
            width: '50%',
            height: '45%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(173, 193, 222, 0.6) 0%, rgba(173, 193, 222, 0.2) 50%, transparent 78%)',
            filter: 'blur(30px)',
          }}
        />
        {/* 云朵 2 — 右大云 */}
        <div
          className="absolute cloud-float-2"
          style={{
            right: '-10%',
            bottom: '15%',
            width: '55%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(173, 193, 222, 0.55) 0%, rgba(173, 193, 222, 0.15) 55%, transparent 80%)',
            filter: 'blur(35px)',
          }}
        />
        {/* 云朵 3 — 中间小云 */}
        <div
          className="absolute cloud-float-3"
          style={{
            left: '25%',
            bottom: '40%',
            width: '40%',
            height: '35%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(200, 215, 235, 0.4) 0%, rgba(173, 193, 222, 0.1) 60%, transparent 82%)',
            filter: 'blur(25px)',
          }}
        />
      </div>

      {/* 雾气粒子 — 越往下雾气越浓，穿云入雾 */}
      <div
        className="absolute left-0 right-0 z-[26] pointer-events-none overflow-hidden"
        style={{ bottom: 0, height: '90vh' }}
      >
        {[...Array(25)].map((_, i) => {
          const size = 50 + Math.random() * 120;
          const left = Math.random() * 100;
          const bottom = Math.random() * 90;
          const delay = Math.random() * 5;
          const duration = 7 + Math.random() * 10;
          const opacity = bottom < 20 ? 0.8 : bottom < 50 ? 0.5 : 0.25;
          return (
            <div
              key={i}
              className="absolute mist-particle"
              style={{
                left: `${left}%`,
                bottom: `${bottom}%`,
                width: `${size}px`,
                height: `${size * 0.6}px`,
                background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.5) 0%, rgba(200, 215, 235, 0.15) 50%, transparent 70%)',
                filter: 'blur(12px)',
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
