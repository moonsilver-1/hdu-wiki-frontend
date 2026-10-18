'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * BirdsBackground — 页面最底部的鸟类区域（Vanta.js BIRDS）
 *
 * 占据一屏高度，作为页面结尾的装饰。
 * 配色：淡蓝背景 + 红/青双色鸟群（方差梯度）
 *
 * 【兼容性处理】
 * 1. three.js r125+ 移除了 PlaneBufferGeometry，在 THREE 副本上加别名指向 PlaneGeometry。
 * 2. three.js r152+ 移除了 THREE.VertexColors 常量（vertexColors 变为 boolean），
 *    在 THREE 副本上加 `VertexColors = true` 别名。
 * 3. Vanta BIRDS 的 GPGPU 模式 shader 颜色为 0.2 灰底 + 深度衰减（官方注释 "Fake colors for now"），
 *    通过在模块加载前伪造移动端 UA（mobileCheck 在模块顶层执行），强制走 CPU 模式：
 *    CPU 模式用 MeshBasicMaterial + 顶点色，颜色由 color1/color2 经 getNewCol() 计算。
 * 4. vanta CPU 模式填充顶点色时用 c.attributes.position.length，但 THREE BufferAttribute
 *    只有 .count 没有 .length → color attribute 为空 → 鸟渲染成纯黑。
 *    初始化后手动给每只鸟的几何体填充顶点色修复。
 */

function createThreeWithLegacy() {
  type ThreeLegacy = typeof THREE & {
    PlaneBufferGeometry: typeof THREE.PlaneGeometry;
    VertexColors: boolean;
  };
  const THREE_Legacy: ThreeLegacy = {
    ...THREE,
    PlaneBufferGeometry: THREE.PlaneGeometry,
    // 关键修复：r152+ 移除了 VertexColors 常量，Vanta 用它做 vertexColors 参数
    VertexColors: true,
  };
  return THREE_Legacy;
}

export default function BirdsBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<VantaBirdsInstance | null>(null);

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

    import('vanta/dist/vanta.birds.min').then((mod) => {
      if (cancelled) return;

      // 恢复原始 userAgent
      Object.defineProperty(navigator, 'userAgent', {
        value: origAgent,
        configurable: true,
        writable: true,
      });

      const BIRDS_FN = mod.default;

      vantaRef.current = BIRDS_FN({
        el: container,
        THREE: THREE_Legacy,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        // scale 是渲染分辨率除数（pixelRatio = DPR/scale），值越大越省性能但越模糊。
        // CPU 模式的鸟群本身已很吃 CPU，这里同样取 2.0 折中。
        scale: 2.0,
        scaleMobile: 2.0,
        // 配色（按设计稿参数面板）
        backgroundColor: 0x96b3e1, // 淡蓝背景
        backgroundAlpha: 0.8,
        color1: 0xff0000,          // 红色
        color2: 0x00d1ff,          // 青色
        colorMode: 'varianceGradient',
        // 其余参数沿用面板值（即默认值）
        birdSize: 1,
        wingSpan: 30,
        speedLimit: 5,
        separation: 20,
        alignment: 20,
        cohesion: 20,
        quantity: 5,
      });

      // 关键修复：vanta CPU 模式填充顶点色时用 c.attributes.position.length，
      // 但 THREE BufferAttribute 只有 .count 没有 .length → color attribute 为空 → 鸟渲染成纯黑。
      // 初始化后手动给每只鸟的几何体填充顶点色，并强制材质重编译 shader
      // （vanta 创建材质时 vertexColors 依赖 T.VertexColors 别名，需 needsUpdate 让 shader 带上 USE_COLOR）。
      const fixColors = () => {
        const vv = vantaRef.current;
        if (!vv || !Array.isArray(vv.birds) || typeof vv.getNewCol !== 'function') return;
        vv.birds.forEach((bird: VantaBird, idx: number) => {
          const geo = bird.geometry;
          const posAttr = geo?.attributes?.position;
          if (!posAttr) return;
          const count = posAttr.count;
          const colors = new Float32Array(count * 3);
          const col = vv.getNewCol(idx / vv.birds.length);
          for (let j = 0; j < count; j++) {
            colors[j * 3] = col.r;
            colors[j * 3 + 1] = col.g;
            colors[j * 3 + 2] = col.b;
          }
          geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          if (bird.material) {
            bird.material.vertexColors = true;
            bird.material.needsUpdate = true;
          }
        });
      };
      requestAnimationFrame(() => setTimeout(fixColors, 0));
    }).catch(() => {
      // vanta birds 加载失败时静默降级：仅显示纯色背景
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
