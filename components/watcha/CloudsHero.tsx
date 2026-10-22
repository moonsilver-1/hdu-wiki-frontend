'use client';

import WatchaImage from './WatchaImage';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 云层形状参数：噪声采样频率，特征尺寸 = 1/频率。
// 水平频率 < 垂直频率 → 云团横向拉宽（复刻旧版"天空更宽"的观感，当前宽高比 3:1）。
// 想更宽就调小 FREQ_XZ；想云更小就调大 FREQ_Y。
const FREQ_XZ = 0.67; // 水平（xz）：云团宽度 ≈ 1.5 倍官方
const FREQ_Y = 2.0;   // 垂直（y）：云团高度 = 0.5 倍官方

// 云层图案各向异性压缩：Vanta CLOUDS 的 shader 是 3D 体积云 raymarching，未暴露缩放参数。
// 其 4 个 LOD map 函数共用同一行噪声采样 `vec3 q = p - speed1*(...)`，
// 把采样域改为各向异性缩放可分别控制云团的宽与高，相机/云层高度/飘动速度均不受影响。
// patch 挂在模块 prototype 上，仅影响本项目 import 的这一份 vanta.clouds。
{
  const proto = (CLOUDS as unknown as { prototype?: { fragmentShader?: string } }).prototype;
  const target = 'vec3 q = p - speed1*(iTime + constantTime);';
  const patched = `vec3 q = vec3(p.x*${FREQ_XZ.toFixed(2)}, p.y*${FREQ_Y.toFixed(2)}, p.z*${FREQ_XZ.toFixed(2)}) - speed1*(iTime + constantTime);`;
  if (typeof proto?.fragmentShader === 'string' && proto.fragmentShader.includes(target)) {
    proto.fragmentShader = proto.fragmentShader.split(target).join(patched);
  }
}

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
  const vantaElRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<VantaCloudsInstance | null>(null);

  useEffect(() => {
    const vantaEl = vantaElRef.current;
    if (!vantaEl) return;

    // Vanta.js CLOUDS 效果
    // 关键：el 必须是「视口大小」的元素。Vanta 按 el.offsetWidth/offsetHeight 渲染缓冲区，
    // 云层噪声也按 el 的宽高比计算。官方 demo 的 el 就是占满视口的 section，
    // 而此前挂在 300vh 容器上会导致：缓冲区呈 1:3 竖长条 + 噪声按竖版宽高比计算，
    // 再被 CSS 压进 100vh 视口 → 云朵被纵向压扁 3 倍，呈现横向拉丝的"虚化"感。
    vantaRef.current = CLOUDS({
      el: vantaEl,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      // 颜色参数与 Vanta 官网 CLOUDS 默认值完全一致
      skyColor: 0x68b8d7,
      cloudColor: 0xadc1de,
      cloudShadowColor: 0x183550,
      sunColor: 0xff9919,
      sunGlareColor: 0xff6633,
      sunlightColor: 0xff9933,
      // vanta 的 scale 是渲染分辨率除数（pixelRatio = DPR/scale），值越大分辨率越低、越省性能但越模糊。
      // 官方 CLOUDS 默认 scale:3（1/3 分辨率），这里取 2.0 已比官方更清晰，GPU 负载为 1/4。
      scale: 2.0,
      scaleMobile: 2.0,
      speed: 1.0,
    });

    // 鼠标交互走 vanta 的 window 级监听，canvas 本身不拦截指针事件
    const canvas = vantaEl.querySelector('canvas');
    if (canvas) {
      canvas.style.pointerEvents = 'none';
    }

    // === 滚动驱动云层透明度（穿云入雾效果）===
    // 前两屏（0~200vh）：完全显示，云层厚厚地覆盖
    // 第三屏（200~300vh）：慢慢淡出到 0，穿云而出
    const fade = gsap.to(vantaEl, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top', // 容器底部到达视口顶部时（滚完 300vh）
        scrub: true,
      },
      onUpdate: function () {
        const progress = this.progress();
        // progress 0 → 1 对应滚动 0 → 300vh
        // 0~66.7% 时 opacity=1（前两屏完整云层），66.7%~100% 时 opacity 从 1→0
        let opacity = 1;
        if (progress > 2 / 3) {
          opacity = 1 - (progress - 2 / 3) * 3;
        }
        vantaEl.style.opacity = String(Math.max(0, opacity));
      },
    });

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
      fade.scrollTrigger?.kill();
      fade.kill();
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
      {/* Vanta 渲染层 — fixed 全屏（视口大小），云层固定在视口并按正确宽高比渲染 */}
      <div
        ref={vantaElRef}
        className="fixed inset-0 z-20"
        style={{ pointerEvents: 'none' }}
        suppressHydrationWarning
      />
      {/* Hero 内容层 — 第一屏居中 */}
      <div className="relative z-[30] flex flex-col items-center justify-center h-screen text-center px-6">
        {/* 小标签 */}
        <div
          className="wc-focus-in-expand wc-anim-delay-1 mb-6 px-4 py-1.5 rounded-full text-xs uppercase font-medium"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.3em',
            ['--wc-target-tracking' as string]: '0.3em',
          }}
        >
          观猹学社 × 杭州电子科技大学
        </div>

        {/* Logo 组合 */}
        <div className="wc-focus-in-expand-img wc-anim-delay-2 mb-8 flex items-center justify-center gap-6">
          <WatchaImage sizes="64px" loading="eager" src="/hdu-logo.jpg" alt="杭电校徽" className="h-16 w-16 rounded-full object-cover" style={{ boxShadow: '0 0 0 2px rgba(255,255,255,0.6)' }} />
          <span className="text-3xl" style={{ color: '#fff' }}>×</span>
          <WatchaImage sizes="64px" loading="eager" src="/watcha-logo.png" alt="观猹 Logo" className="h-16 w-auto object-contain" />
        </div>

        {/* 主标题 */}
        <h1
          className="wc-focus-in-expand wc-anim-delay-3 text-6xl md:text-8xl font-black mb-6 text-center px-4"
          style={{
            color: '#fff',
            letterSpacing: '0.05em',
            ['--wc-target-tracking' as string]: '0.05em',
          }}
        >
          观猹文化墙
        </h1>

        {/* 副标题 */}
        <p
          className="wc-focus-in-expand wc-anim-delay-4 text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-12 text-center px-4"
          style={{
            color: '#fff',
            letterSpacing: 'normal',
            ['--wc-target-tracking' as string]: '0',
          }}
        >
          校企共建 AI 育人生态 · 从校园萌芽到产业回流 · 沉浸式互动体验
        </p>

        {/* 向下滚动提示 */}
        <button
          onClick={handleScrollDown}
          className="group absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          style={{ color: 'rgba(255, 255, 255, 0.8)' }}
        >
          <span className="wc-focus-in-expand-img wc-anim-delay-5 flex flex-col items-center gap-2">
            <span className="text-xs tracking-[0.3em] uppercase">向下探索</span>
            <span
              className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
              style={{ borderColor: 'rgba(255, 255, 255, 0.6)' }}
            >
              <span
                className="w-1 h-2 rounded-full animate-bounce block"
                style={{ background: 'rgba(255, 255, 255, 0.8)' }}
              />
            </span>
          </span>
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
