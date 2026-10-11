import dynamic from 'next/dynamic';

/**
 * /watcha 路由页面
 *
 * 用 dynamic + ssr:false 让整个页面只在客户端渲染
 * 因为 Three.js、GSAP、Lenis 都需要浏览器 API，
 * 不参与 SSR 可以彻底避免 hydration mismatch
 */
const WatchaPage = dynamic(
  () => import('@/components/watcha/WatchaPage'),
  { ssr: false }
);

export default function Page() {
  return <WatchaPage />;
}
