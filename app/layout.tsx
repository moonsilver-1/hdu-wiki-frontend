import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
    >
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-[var(--color-muted)]">
            HDU Wiki — 杭州电子科技大学校园百科
          </div>
        </footer>
      </body>
    </html>
  );
}
