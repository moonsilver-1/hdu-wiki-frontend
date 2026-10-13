'use client';

import dynamic from 'next/dynamic';

/**
 * 客户端包装层
 *
 * 用 dynamic + ssr:false 让 WatchaPage 只在客户端渲染
 * 因为 Three.js、GSAP、Lenis 都需要浏览器 API，
 * 不参与 SSR 可以彻底避免 hydration mismatch
 *
 * 注意：Next.js 16+ 不允许在 Server Component 里使用 ssr:false，
 * 所以这个文件必须是 Client Component（带 'use client'）
 */
const WatchaPage = dynamic(
  () => import('./WatchaPage'),
  { ssr: false }
);

export default function WatchaClientWrapper() {
  return <WatchaPage />;
}
