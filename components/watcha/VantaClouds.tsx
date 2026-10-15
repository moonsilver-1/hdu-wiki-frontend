'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import CLOUDS from 'vanta/dist/vanta.clouds.min';

/**
 * VantaClouds — 鸟群区域顶部叠加的云层（Vanta.js CLOUDS）
 *
 * 叠加在鸟群 canvas 之上，底部通过父容器的 mask 渐变透明，
 * 鸟向上飞入云层区域时被云遮住，视觉上像消失在云里。
 *
 * 配色按设计稿参数面板（自定义 1）：
 *   背景 0xffffff / 天空 0x699cbe / 云 0xadc1de / 云影 0x4d6c87
 *   太阳 0xd2bcbc / 眩光 0xe65c54 / 阳光 0xabcfcf / 速度 0.4
 *
 * 组件自身填满父容器（absolute inset-0），尺寸、位置与底部渐变由父容器控制。
 * 不传 minHeight/minWidth，使用 Vanta 默认值保证云层渲染清晰。
 */
export default function VantaClouds() {
  const containerRef = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    vantaRef.current = CLOUDS({
      el: container,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      backgroundColor: 0xffffff,
      skyColor: 0x699cbe,
      cloudColor: 0xadc1de,
      cloudShadowColor: 0x4d6c87,
      sunColor: 0xd2bcbc,
      sunGlareColor: 0xe65c54,
      sunlightColor: 0xabcfcf,
      speed: 0.4,
      // vanta 的 scale 是渲染分辨率除数（pixelRatio = DPR/scale），默认 3 即 1/3 分辨率
      // 渲染后由浏览器拉伸放大，会导致云层模糊。设为 1 全分辨率渲染保证清晰。
      scale: 1,
      scaleMobile: 2,
    });

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
