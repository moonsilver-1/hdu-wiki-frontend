import WatchaClientWrapper from '@/components/watcha/WatchaClientWrapper';

/**
 * /watcha 路由页面
 *
 * 【Next.js App Router 规则】
 *   app/ 下面的每个文件夹 → 一个 URL 路径
 *   文件夹里的 page.tsx → 这个路径的页面内容
 *   所以 app/watcha/page.tsx 对应访问 /watcha
 *
 * 【为什么要套一层 WatchaClientWrapper？】
 *   因为 Three.js、GSAP、Lenis 都需要浏览器 API，
 *   我们用 dynamic(ssr:false) 让它们跳过 SSR，
 *   避免 hydration mismatch 错误。
 *   Next.js 16+ 要求 ssr:false 必须写在 Client Component 里，
 *   所以 page.tsx（Server Component）只负责引入包装层。
 */
export const metadata = {
  alternates: { canonical: '/watcha' },
  title: '观猹文化墙 · 杭电 × 观猹共建 AI 育人生态',
  description:
    '观猹学社与杭州电子科技大学校企共建 AI 育人生态沉浸式互动体验：从校园萌芽到产业回流，好用产品馆、互动展区与生态伙伴一览。',
  keywords: ['观猹', '观猹文化墙', '杭电', 'AI 育人生态', '校企共建'],
};

export default function Page() {
  return <WatchaClientWrapper />;
}
