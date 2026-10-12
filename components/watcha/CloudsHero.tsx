'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';

/**
 * CloudsHero — 观猹文化墙顶部 Hero 区
 *
 * 基于 Vanta.js CLOUDS 效果的体积云背景
 * 配色参考用户自定义：天空蓝 + 淡云 + 暖阳
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
    // 参数来自用户自定义配置
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
      // 默认滚动到下一屏
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
      style={{ background: '#68b8d7' }} // 兜底底色：天空蓝
    >
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

      {/* 底部渐变过渡 — 云层慢慢消散成雾气，跟下方雾效无缝衔接 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
        style={{
          height: '50vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(173, 193, 222, 0.3) 40%, rgba(173, 193, 222, 0.7) 70%, rgba(173, 193, 222, 0.95) 100%)',
        }}
      />
    </div>
  );
}
