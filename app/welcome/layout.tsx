import type { Metadata, Viewport } from "next";
import ReactDOM from "react-dom";
import { Noto_Serif_SC } from "next/font/google";
import "./welcome.css";

const serifCN = Noto_Serif_SC({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--wfont-serif",
});

export const metadata: Metadata = {
  title: {
    absolute: "欢迎来到杭电 · HDU Wiki",
  },
  description:
    "致二〇二六级的你：杭电官网、教务处、自动化学院，以及学长学姐写给你的杭电百科 —— 大学的入口，都在这一页。",
};

export const viewport: Viewport = {
  themeColor: "#f6f3e9",
};

// 地图素材较大，提前告知浏览器开始下载
export default function WelcomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  ReactDOM.preload("/welcome/walk-atlas-v2.png", { as: "image" });
  ReactDOM.preload("/welcome/assets.png", { as: "image" });
  return <div className={`wpage ${serifCN.variable}`}>{children}</div>;
}
