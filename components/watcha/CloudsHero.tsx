'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import CLOUDS2 from 'vanta/dist/vanta.clouds2.min';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * CloudsHero — 观猹文化墙顶部 Hero 区（双层云层穿云效果）
 *
 * 【双层云层结构】
 *   第 1 层（上层）：CLOUDS — 云的上表面视角（蓝天白云）
 *   第 2 层（下层）：CLOUDS2 — 云层内部视角（体积云、厚云层）
 *
 * 【滚动过渡节奏】300vh 容器
 *   0 ~ 100vh  (0%~33%)：  CLOUDS 完全显示，CLOUDS2 隐藏（第一屏：云顶俯瞰）
 *   100 ~ 200vh (33%~66%)：CLOUDS 淡出，CLOUDS2 淡入（第二屏：穿云过渡）
 *   200 ~ 300vh (66%~100%)：CLOUDS 隐藏，CLOUDS2 完全显示（第三屏：厚云层内部）
 *
 * 【交互】
 *   - 鼠标移动：云层轻微视差偏移
 *   - 自动缓慢流动
 *   - 向下滚动箭头提示
 */

export default function CloudsHero({ onScrollDown }: { onScrollDown?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clouds1Ref = useRef<HTMLDivElement>(null);
  const clouds2Ref = useRef<HTMLDivElement>(null);
  const vanta1Ref = useRef<any>(null);
  const vanta2Ref = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    const clouds1Container = clouds1Ref.current;
    const clouds2Container = clouds2Ref.current;
    if (!container || !clouds1Container || !clouds2Container) return;

    // ========== 1. 上层：CLOUDS（云顶视角 — 蓝天白云） ==========
    vanta1Ref.current = CLOUDS({
      el: clouds1Container,
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

    // 把 canvas 改成 fixed 全屏
    const canvas1 = clouds1Container.querySelector('canvas');
    if (canvas1) {
      canvas1.style.position = 'fixed';
      canvas1.style.top = '0';
      canvas1.style.left = '0';
      canvas1.style.width = '100vw';
      canvas1.style.height = '100vh';
      canvas1.style.zIndex = '20';
      canvas1.style.pointerEvents = 'none';
    }

    // ========== 2. 下层：CLOUDS2（云层内部视角 — 厚云层） ==========
    vanta2Ref.current = CLOUDS2({
      el: clouds2Container,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      texturePath: '/vanta-noise.png', // 噪声纹理
      // 云层内部配色：天空色和云色接近，营造"全是云"的包裹感
      skyColor: 0x6a8cb8,       // 偏暗的云色（模拟云层内部的"天空"，实际就是云的深处）
      cloudColor: 0x8fa8c8,     // 云层主体色
      lightColor: 0xd8e4f0,     // 云层高光（从云缝透进来的光）
      speed: 0.8,               // 云层飘动速度
    });

    const canvas2 = clouds2Container.querySelector('canvas');
    if (canvas2) {
      canvas2.style.position = 'fixed';
      canvas2.style.top = '0';
      canvas2.style.left = '0';
      canvas2.style.width = '100vw';
      canvas2.style.height = '100vh';
      canvas2.style.zIndex = '19';
      canvas2.style.pointerEvents = 'none';
      canvas2.style.opacity = '0'; // 初始隐藏
    }

    // ========== 3. 滚动驱动双层过渡（穿云效果） ==========
    // 300vh 容器分成三段：
    //   0%~33%  (0~100vh):   CLOUDS=1, CLOUDS2=0  → 云顶视角
    //   33%~66% (100~200vh): CLOUDS 1→0, CLOUDS2 0→1 → 穿云过渡
    //   66%~100% (200~300vh): CLOUDS=0, CLOUDS2=1  → 云层内部
    gsap.to(container, {
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom top', // 容器底部到达视口顶部时（滚完 300vh）
        scrub: true,
      },
      onUpdate: function () {
        const progress = this.progress(); // 0 ~ 1

        // CLOUDS（上层）透明度
        let opacity1 = 1;
        if (progress > 1 / 3 && progress <= 2 / 3) {
          // 33%~66%: 从 1 线性淡出到 0
          opacity1 = 1 - (progress - 1 / 3) * 3;
        } else if (progress > 2 / 3) {
          opacity1 = 0;
        }

        // CLOUDS2（下层）透明度
        let opacity2 = 0;
        if (progress > 1 / 3 && progress <= 2 / 3) {
          // 33%~66%: 从 0 线性淡入到 1
          opacity2 = (progress - 1 / 3) * 3;
        } else if (progress > 2 / 3) {
          opacity2 = 1;
        }

        if (canvas1) {
          canvas1.style.opacity = String(Math.max(0, Math.min(1, opacity1)));
        }
        if (canvas2) {
          canvas2.style.opacity = String(Math.max(0, Math.min(1, opacity2)));
        }
      },
    });

    // ========== 4. 清理 ==========
    return () => {
      if (vanta1Ref.current) {
        vanta1Ref.current.destroy();
        vanta1Ref.current = null;
      }
      if (vanta2Ref.current) {
        vanta2Ref.current.destroy();
        vanta2Ref.current = null;
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
      style={{ height: '300vh' }}
    >
      {/* 双层 Vanta 容器 */}
      <div ref={clouds1Ref} className="absolute inset-0 pointer-events-none" />
      <div ref={clouds2Ref} className="absolute inset-0 pointer-events-none" />

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

      {/* 第二屏：穿云过渡提示（可选文字） */}
      <div className="relative z-[30] flex items-center justify-center h-screen text-center">
        <div
          className="text-sm tracking-[0.5em] uppercase opacity-60"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          穿 · 云 · 而 · 入
        </div>
      </div>

      {/* 第三屏：云层内部，和下方旋转木马衔接 */}
      <div className="relative z-[30] h-screen" />
    </div>
  );
}
