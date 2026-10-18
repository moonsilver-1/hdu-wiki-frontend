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
function WatchaLoader() {
  return (
    <>
      <style>{`
        .wc-hr {
          width: 150px;
          height: 73px;
          position: relative;
          margin: 0 auto;
        }
        .wc-hr .wc-fade-in {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          top: 0;
          right: 0;
          animation: wc-heartRateIn 2.5s linear infinite;
        }
        .wc-hr .wc-fade-out {
          position: absolute;
          width: 120%;
          height: 100%;
          background-color: #ffffff;
          top: 0;
          right: -120%;
          animation: wc-heartRateOut 2.5s linear infinite;
        }
        @keyframes wc-heartRateIn {
          0% { width: 100%; }
          50% { width: 0; }
          100% { width: 0; }
        }
        @keyframes wc-heartRateOut {
          0% { left: -120%; }
          30% { left: -120%; }
          100% { left: 0; }
        }
      `}</style>
      <div
        style={{
          background: '#ffffff',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="wc-hr">
          <svg
            viewBox="0 0 150 73"
            width="150"
            height="73"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline
              points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
              strokeMiterlimit="10"
              strokeWidth="3"
              stroke="#009B9E"
              fill="none"
            />
          </svg>
          <div className="wc-fade-in" />
          <div className="wc-fade-out" />
        </div>
      </div>
    </>
  );
}

const WatchaPage = dynamic(
  () => import('./WatchaPage'),
  {
    ssr: false,
    loading: () => <WatchaLoader />,
  }
);

export default function WatchaClientWrapper() {
  return <WatchaPage />;
}
