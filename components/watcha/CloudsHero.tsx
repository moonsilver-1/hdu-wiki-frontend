'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';

/**
 * CloudsHero — 观猹文化墙顶部 Hero 区
 *
 * 基于 Vanta.js CLOUDS 效果的体积云背景
 * 底部用噪声遮罩 + 多层雾气渐变 + 飘动云朵实现无缝过渡
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

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
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
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#68b8d7' }}
    >
      {/* SVG 噪声定义（用于 mask 不规则云边缘） */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="cloud-noise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="4"
              seed="2"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0"
              result="softNoise"
            />
          </filter>
          <filter id="cloud-noise-2" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              seed="5"
              result="noise"
            />
          </filter>
        </defs>
      </svg>

      {/* Hero 内容层 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
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

      {/* ===== 底部过渡区：云层 → 雾效（多层融合） ===== */}

      {/* 第 1 层：噪声溶解边缘 — 用 SVG 噪声把云层底部"打碎"成不规则云絮 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[15] pointer-events-none"
        style={{
          height: '35vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(173, 193, 222, 0.5) 50%, rgba(173, 193, 222, 0.85) 100%)',
          maskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='4' seed='3'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          WebkitMaskImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='4' seed='3'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
          maskMode: 'luminance',
          WebkitMaskMode: 'luminance',
        }}
      />

      {/* 第 2 层：飘动的云絮 — 几个大的径向渐变模拟漂浮云朵，从云层底部"垂下来" */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[16] pointer-events-none overflow-hidden"
        style={{ height: '45vh' }}
      >
        {/* 云朵 1 — 左大云 */}
        <div
          className="absolute cloud-float-1"
          style={{
            left: '-10%',
            bottom: '10%',
            width: '45%',
            height: '60%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(173, 193, 222, 0.7) 0%, rgba(173, 193, 222, 0.3) 40%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        {/* 云朵 2 — 右大云 */}
        <div
          className="absolute cloud-float-2"
          style={{
            right: '-5%',
            bottom: '5%',
            width: '50%',
            height: '55%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(173, 193, 222, 0.65) 0%, rgba(173, 193, 222, 0.25) 45%, transparent 75%)',
            filter: 'blur(25px)',
          }}
        />
        {/* 云朵 3 — 中间小云 */}
        <div
          className="absolute cloud-float-3"
          style={{
            left: '30%',
            bottom: '20%',
            width: '35%',
            height: '40%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(200, 215, 235, 0.5) 0%, rgba(173, 193, 222, 0.2) 50%, transparent 75%)',
            filter: 'blur(15px)',
          }}
        />
      </div>

      {/* 第 3 层：渐变底色过渡 — 最底部完全过渡到雾效顶部颜色 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[14] pointer-events-none"
        style={{
          height: '55vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(173, 193, 222, 0.1) 25%, rgba(173, 193, 222, 0.4) 55%, rgba(173, 193, 222, 0.8) 85%, rgba(173, 193, 222, 0.95) 100%)',
        }}
      />

      {/* 第 4 层：细小雾气粒子 — 营造空气中有雾气的感觉 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[17] pointer-events-none overflow-hidden"
        style={{ height: '40vh' }}
      >
        {[...Array(15)].map((_, i) => {
          const size = 40 + Math.random() * 80;
          const left = Math.random() * 100;
          const bottom = Math.random() * 60;
          const delay = Math.random() * 5;
          const duration = 6 + Math.random() * 8;
          return (
            <div
              key={i}
              className="absolute mist-particle"
              style={{
                left: `${left}%`,
                bottom: `${bottom}%`,
                width: `${size}px`,
                height: `${size * 0.6}px`,
                background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.4) 0%, rgba(200, 215, 235, 0.15) 50%, transparent 70%)',
                filter: 'blur(8px)',
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
