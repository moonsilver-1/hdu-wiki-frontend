'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * BirdsBackground — 页面最底部的鸟类区域（Vanta.js BIRDS）
 *
 * 占据一屏高度，作为页面结尾的装饰
 * 参数按截图中的默认值：
 *   backgroundColor: 深蓝
 *   color1: 蓝色
 *   color2: 红色
 *   quantity: 5
 *   birdSize: 0.5
 *   wingSpan: 40
 *   speedLimit: 5
 *
 * 【兼容处理】
 * 1. three.js r125+ 移除了 PlaneBufferGeometry 等旧 API，
 *    创建带别名的 THREE 副本传给 Vanta。
 * 2. Vanta.js BIRDS 的 GPGPU 模式（GPU 计算鸟群）
 *    与新版 three.js 有兼容性问题。
 *    通过在模块加载前伪造移动端 UA，强制使用 CPU 计算模式。
 *    mobileCheck() 在模块顶层执行，所以必须在 import 前改 UA。
 * 3. Vanta BIRDS 默认使用白色雾效，会把彩色的鸟"洗白"，
 *    初始化后将雾色改为与背景一致的深蓝色。
 */

function createThreeWithLegacy() {
  const THREE_Legacy: any = { ...THREE };
  THREE_Legacy.PlaneBufferGeometry = THREE.PlaneGeometry;
  return THREE_Legacy;
}

export default function BirdsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const THREE_Legacy = createThreeWithLegacy();

    // 在动态 import 之前伪造移动端 UA，强制 BIRDS 使用 CPU 计算模式
    const origAgent = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Android Mobile',
      configurable: true,
      writable: true,
    });

    let cancelled = false;

    import('vanta/dist/vanta.birds.min').then((BIRDS: any) => {
      if (cancelled) return;

      // 恢复原始 userAgent
      Object.defineProperty(navigator, 'userAgent', {
        value: origAgent,
        configurable: true,
        writable: true,
      });

      const BIRDS_FN = BIRDS.default || BIRDS;

      vantaRef.current = BIRDS_FN({
        el: container,
        THREE: THREE_Legacy,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0x07192F,
        color1: 0x0000FF,
        color2: 0xFF0000,
        colorMode: 'varianceGradient',
        birdSize: 0.5,
        wingSpan: 40,
        speedLimit: 5,
        separation: 20,
        alignment: 20,
        cohesion: 20,
        quantity: 5,
      });

      // 修复：Vanta BIRDS 默认自带白色雾效，会把彩色的鸟"洗白"
      // 把雾的范围拉远 + 颜色改成深蓝，让鸟群在纯深蓝背景上清晰飞行
      if (vantaRef.current.fog) {
        vantaRef.current.fog.far = 5000;
        vantaRef.current.fog.color.setHex(0x07192F);
      }
    });

    return () => {
      cancelled = true;
      // 确保 UA 被恢复
      if (navigator.userAgent !== origAgent) {
        Object.defineProperty(navigator, 'userAgent', {
          value: origAgent,
          configurable: true,
          writable: true,
        });
      }
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '100vh' }}
    />
  );
}
