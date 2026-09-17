import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Baloo_2, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 圆润的展示字体：只覆盖拉丁字母与数字，中文回退到系统字体，
// 给标题、数字和品牌字标带来圆乎乎的手感。
const displayFont = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hdu-wiki.cn"),
  title: {
    default: "HDU Wiki - 杭电百科",
    template: "%s - HDU Wiki",
  },
  description: "杭州电子科技大学校园百科，涵盖课程、校园生活、技术、社团等内容",
  openGraph: {
    type: "website",
    siteName: "HDU Wiki",
    locale: "zh_CN",
    title: "HDU Wiki - 杭电百科",
    description: "杭州电子科技大学校园百科，涵盖课程、校园生活、技术、社团等内容",
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${displayFont.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="app-body">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("wiki-theme");var d=t==="dark"||(t!=="light"&&(window.matchMedia("(prefers-color-scheme:dark)").matches||(new Date().getHours()>=18||new Date().getHours()<6)));if(d)document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        <ThemeProvider>
          <Header />
          <div className="app-main">{children}</div>
          <SiteFooter />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
