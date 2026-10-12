'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * FogTransition — 云层与旋转木马之间的雾气过渡页
 *
 * 效果：
 *   - Vanta.js FOG 暖色调雾气（米黄/金色，类似 vantajs.com 的雾效果）
 *   - 预留观猹 logo 位置（中央大区域）
 *   - 顶部和云层淡入衔接，底部和雾效墙淡出衔接
 *   - 高度：100vh
 *
 * 颜色配置（暖色调雾气）：
 *   - 底色：暖米色
 *   - 高光：淡金色
 *   - 暗部：暖棕色
 */

export default function FogTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Vanta.js FOG 效果 — 暖色调雾气
    vantaRef.current = FOG({
      el: container,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      highlightColor: 0xffeedd,    // 高光：淡米白
      midtoneColor: 0xf5e6d0,      // 中间调：暖米色
      lowlightColor: 0xd4b896,     // 暗部：浅棕金色
      baseColor: 0xe8d5b8,         // 底色：暖米黄色
      blurFactor: 0.6,             // 模糊程度
      speed: 0.8,                  // 流动速度
      zoom: 1.0,                   // 缩放
    });

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#e8d5b8' }}
    >
      {/* ===== 顶部过渡：与云层衔接 ===== */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '20vh',
          background: 'linear-gradient(to bottom, rgba(173, 193, 222, 0.8) 0%, rgba(232, 213, 184, 0) 100%)',
        }}
      />

      {/* ===== 中央 Logo 预留区 ===== */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        {/* Logo 占位框 — 后续替换为真实观猹 logo */}
        <div
          className="flex items-center justify-center mb-6"
          style={{
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '2px dashed rgba(139, 105, 60, 0.3)',
          }}
        >
          <span
            className="text-5xl font-black"
            style={{
              color: 'rgba(139, 105, 60, 0.5)',
              letterSpacing: '0.05em',
            }}
          >
            猹
          </span>
        </div>

        {/* Logo 下方文字 */}
        <div
          className="text-2xl font-bold tracking-[0.3em]"
          style={{ color: 'rgba(139, 105, 60, 0.7)' }}
        >
          观 猹
        </div>
        <div
          className="text-sm mt-2 tracking-[0.2em]"
          style={{ color: 'rgba(139, 105, 60, 0.5)' }}
        >
          GUAN CHA
        </div>
      </div>

      {/* ===== 底部过渡：与雾效墙衔接 ===== */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: '25vh',
          background: 'linear-gradient(to top, rgba(252, 244, 231, 0.9) 0%, rgba(232, 213, 184, 0) 100%)',
        }}
      />
    </div>
  );
}
