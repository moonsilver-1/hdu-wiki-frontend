'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WatchaCanvas — 观猹文化墙背景层
 *
 * 基于 Vanta.js FOG 效果的 shader 背景
 * 配色参考用户自定义：奶油白底 + 青色高光 + 淡蓝低光
 *
 * 【技术原理】
 *   用一个全屏的平面（PlaneGeometry），贴一个 fragment shader
 *   shader 里用 fbm（分形布朗运动）噪声生成流动的雾气效果
 *   四层颜色混合：base → lowlight → midtone → highlight
 *
 * 【交互】
 *   - 鼠标移动：轻微偏移雾气（视差感）
 *   - 滚动：雾气缓慢流动加速
 */

// 雾效 shader — 来自 Vanta.js FOG，基于 The Book of Shaders
const fogVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fogFragmentShader = `
  uniform vec2 iResolution;
  uniform vec2 iMouse;
  uniform float iTime;

  uniform float blurFactor;
  uniform vec3 topColor;       // 顶部颜色（天空色，跟云层衔接）
  uniform vec3 bottomColor;    // 底部颜色（奶油白）
  uniform vec3 lowlightColor;
  uniform vec3 midtoneColor;
  uniform vec3 highlightColor;
  uniform float zoom;

  varying vec2 vUv;

  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                       vec2(0.129898,0.78233)))*
          437.585453123);
  }

  // Based on Morgan McGuire @morgan3d
  // https://www.shadertoy.com/view/4dS3Wd
  float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }

  #define NUM_OCTAVES 6

  float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = blurFactor;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= (1. - blurFactor);
    }
    return v;
  }

  void main() {
    vec2 st = vUv * 3.0;
    st.x *= 0.7 * iResolution.x / iResolution.y;
    st *= zoom;

    // 鼠标偏移 — 轻微的视差感
    st += iMouse * 0.08;

    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*iTime);
    q.y = fbm( st + vec2(1.0));

    vec2 dir = vec2(0.15,0.126);
    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ dir.x*iTime );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ dir.y*iTime);

    float f = fbm(st+r);

    // 垂直渐变底色：顶部天空色 → 底部奶油白
    // vUv.y 顶部=1，底部=0
    vec3 gradientBase = mix(bottomColor, topColor, vUv.y);

    color = mix(gradientBase,
                lowlightColor,
                clamp((f*f)*4.0,0.0,1.0) * 0.5);

    color = mix(color,
                midtoneColor,
                clamp(length(q),0.0,1.0) * 0.4);

    color = mix(color,
                highlightColor,
                clamp(length(r.x),0.0,1.0) * 0.3);

    vec3 finalColor = mix(gradientBase, color, f*f*f+.5*f*f+.4*f);
    gl_FragColor = vec4(finalColor,1.0);
  }
`;

export default function WatchaCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ========== 1. 基础 ==========
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ========== 2. 全屏雾效平面 ==========
    const geometry = new THREE.PlaneGeometry(2, 2); // 覆盖全屏

    const material = new THREE.ShaderMaterial({
      vertexShader: fogVertexShader,
      fragmentShader: fogFragmentShader,
      uniforms: {
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iMouse: { value: new THREE.Vector2(0, 0) },
        iTime: { value: 0 },
        // 垂直渐变底色
        topColor:    { value: new THREE.Color(0xadc1de) }, // 顶部：淡云色（跟云层衔接）
        bottomColor: { value: new THREE.Color(0xfcf4e7) }, // 底部：奶油白
        // 雾气配色
        lowlightColor:  { value: new THREE.Color(0xa4c1f7) }, // 淡蓝低光
        midtoneColor:   { value: new THREE.Color(0xf0e9e2) }, // 浅米中调
        highlightColor: { value: new THREE.Color(0x67e0ed) }, // 青色高光
        blurFactor:     { value: 0.58 },
        zoom:           { value: 1.0 },
      },
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // ========== 3. 鼠标交互 ==========
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    function handleMouseMove(e: MouseEvent) {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    window.addEventListener('mousemove', handleMouseMove);

    // ========== 4. 动画循环 ==========
    const clock = new THREE.Clock();
    let animationId = 0;
    let visible = true;

    function animate() {
      if (!visible) return; // 不可见时暂停 rAF，避免 NUM_OCTAVES=6 的 fbm 全速空跑
      const elapsed = clock.getElapsedTime();

      // 鼠标缓动
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 更新 shader uniforms
      material.uniforms.iTime.value = elapsed;
      material.uniforms.iMouse.value.set(mouse.x, mouse.y);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    }
    animate();

    // 容器可视性：fixed 全屏元素通常始终相交，作为兜底；
    // 标签页隐藏（visibilitychange）是真正的 CPU 节省来源。
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible) { animationId = requestAnimationFrame(animate); }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    function handleVisibility() {
      visible = !document.hidden;
      if (visible) { animationId = requestAnimationFrame(animate); }
      else { cancelAnimationFrame(animationId); }
    }
    document.addEventListener('visibilitychange', handleVisibility);

    // ========== 5. 响应窗口 ==========
    function handleResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    // ========== 6. 清理 ==========
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#fcf4e7' }} // 兜底底色
      suppressHydrationWarning
    />
  );
}
