import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { GitFork } from "lucide-react";
import "./globals.css";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HDU Wiki - 杭电百科",
    template: "%s - HDU Wiki",
  },
  description: "杭州电子科技大学校园百科，涵盖课程、校园生活、技术、社团等内容",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("wiki-theme");var d=t==="dark"||(t!=="light"&&(window.matchMedia("(prefers-color-scheme:dark)").matches||(new Date().getHours()>=18||new Date().getHours()<6)));if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
      </head>
      <body className="app-body">
        <ThemeProvider>
          <Header />
          <div className="app-main">{children}</div>
          <footer className="site-footer">
            <div className="site-container footer-inner">
              <div>
                <Link href="/" className="footer-brand"><strong>HDU</strong> Wiki</Link>
                <span>杭州电子科技大学校园百科</span>
              </div>
              <div className="footer-links">
                <Link href="/community/how-to-join-us">参与共建</Link>
                <a
                  href="https://github.com/moonsilver-1/hdu-wiki-frontend"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="HDU Wiki GitHub 仓库"
                >
                  <GitFork aria-hidden="true" size={17} />
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
