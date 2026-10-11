import WatchaPage from '@/components/watcha/WatchaPage';

/**
 * /watcha 路由页面
 *
 * 【为什么要建这个文件？】
 *
 * 这是 Next.js App Router 的规则：
 *   app/ 下面的每个文件夹 → 就是一个 URL 路径
 *   文件夹里的 page.tsx → 就是这个路径的页面内容
 *
 * 所以 app/watcha/page.tsx 对应访问 /watcha 这个 URL。
 *
 * 【为什么 page.tsx 这么简单？】
 *
 * 因为 page.tsx 默认是 Server Component（服务端组件），
 * 但我们的页面要用到 Three.js、GSAP 这些浏览器 API，
 * 必须在 Client Component（客户端组件）里跑。
 *
 * 所以我们把主要逻辑都放在 WatchaPage.tsx 里（带 'use client'），
 * page.tsx 只负责引用它。
 */
export default function Page() {
  return <WatchaPage />;
}
