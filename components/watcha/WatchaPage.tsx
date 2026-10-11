'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WatchaCanvas from './WatchaCanvas';
import './watcha.css';

/**
 * WatchaPage — 观猹文化墙主页面
 *
 * 整合了 impressive demo 的视觉风格：
 * - 液态玻璃导航栏
 * - 仪表盘风格"观猹"卡片（边缘游走光点 + 扫光 + 渐变文字）
 * - 背景层：Three.js Canvas（以后替换成视频或更酷的 WebGL 效果）
 */

gsap.registerPlugin(ScrollTrigger);

const navLinks = ['关于我们', '投资', '建设', '咨询'];

export default function WatchaPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // ========== Lenis 平滑滚动 ==========
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ========== GSAP ScrollTrigger 和 Lenis 联动 ==========
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // ========== Hero 入场动画 ==========
    gsap.from('.guancha-outer', {
      scale: 0.9,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
    });

    // ========== 各模块滚动入场动画 ==========
    gsap.utils.toArray<HTMLElement>('.scroll-section').forEach((section, i) => {
      gsap.from(section.querySelector('.section-content'), {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: i * 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // 清理
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen text-slate-900">
      {/* 背景层：Three.js Canvas */}
      <WatchaCanvas />

      {/* 内容层 */}
      <div ref={contentRef} className="relative z-10">
        {/* ===== 液态玻璃导航栏 ===== */}
        <nav className="fixed inset-x-0 top-0 z-50 px-6 pt-6 md:px-12 lg:px-16">
          <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
            <div className="text-2xl font-semibold tracking-tight">观猹</div>
            <div className="hidden items-center gap-8 text-sm md:flex">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="transition-colors hover:text-gray-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* ===== Hero 首屏：仪表盘风格"观猹"卡片 ===== */}
        <section className="flex h-screen items-center justify-center px-6 text-center">
          {/* 外层：光点游走的边框层 */}
          <div className="guancha-outer">
            {/* 游走光点 */}
            <div className="guancha-dot" />
            {/* 卡片主体 */}
            <div className="guancha-card">
              {/* 扫光光线 */}
              <div className="guancha-ray" />
              {/* 装饰线 */}
              <div className="guancha-line topl" />
              <div className="guancha-line bottoml" />
              <div className="guancha-line leftl" />
              <div className="guancha-line rightl" />
              {/* 观猹大字 */}
              <div className="guancha-text">观猹</div>
              <div className="guancha-subtitle">GuanCha · AI 育人生态</div>
            </div>
          </div>
        </section>

        {/* ===== 模块1：时间线 ===== */}
        <section className="scroll-section flex h-screen items-center justify-center px-6">
          <div className="section-content text-center">
            <div className="mb-4 text-sm tracking-widest text-slate-500 uppercase">Module 01</div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900">杭电 × 观猹 共建 AI 育人生态</h2>
            <p className="max-w-xl text-slate-600">
              从未央学社成立到育人基金设立，从特工宇宙斩获金奖到 2020 亿 Tokens 捐赠
            </p>
          </div>
        </section>

        {/* ===== 模块2：生态板块 ===== */}
        <section className="scroll-section flex h-screen items-center justify-center px-6">
          <div className="section-content text-center">
            <div className="mb-4 text-sm tracking-widest text-slate-500 uppercase">Module 02</div>
            <h2 className="mb-6 text-4xl font-bold">玩 AI，上观猹</h2>
            <p className="max-w-xl text-slate-600">
              观猹平台 + 五大生态板块，带你玩转 AI 世界
            </p>
          </div>
        </section>

        {/* ===== 模块3：产品馆 ===== */}
        <section className="scroll-section flex h-screen items-center justify-center px-6">
          <div className="section-content text-center">
            <div className="mb-4 text-sm tracking-widest text-slate-500 uppercase">Module 03</div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900">好用产品馆</h2>
            <p className="max-w-xl text-slate-600">
              7 款精选 AI 产品，每一个都值得体验
            </p>
          </div>
        </section>

        {/* ===== 模块4：互动区 ===== */}
        <section className="scroll-section flex h-screen items-center justify-center px-6">
          <div className="section-content text-center">
            <div className="mb-4 text-sm tracking-widest text-slate-500 uppercase">Module 04</div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900">互动展区</h2>
            <p className="max-w-xl text-slate-600">
              产品集合墙 · Good/Bad 评分 · 答题站 · 名片墙 · Token 领取
            </p>
          </div>
        </section>

        {/* ===== 底部留白 ===== */}
        <div className="h-32" />
      </div>
    </div>
  );
}
