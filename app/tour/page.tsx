import type { Metadata } from "next";
import Link from "next/link";
import styles from "./tour.module.css";

const title = "一分钟认识杭电 Wiki";
const description = "跟着这段网站操作演示，看看怎样找课程笔记、搜索文章，以及在手机上阅读。约 60 秒，配中文字幕。";
const video = "/promo/hdu-wiki-tour.mp4";
const poster = "/promo/hdu-wiki-tour-poster.jpg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tour" },
  openGraph: {
    title,
    description,
    url: "/tour",
    type: "website",
    images: [{ url: poster, alt: title }],
    videos: [{ url: video, type: "video/mp4" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [poster] },
};

export default function TourPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/" className={styles.back}>回到首页</Link>
        <header className={styles.heading}>
          <p className={styles.note}>HDU Wiki · 网站介绍</p>
          <h1>{title}</h1>
          <p className={styles.description}>找课程笔记、查校园攻略，或是随便翻翻。这里演示给你看。</p>
        </header>

        <figure className={styles.film}>
          <video
            className={styles.video}
            controls
            preload="none"
            poster={poster}
            playsInline
            width={1280}
            height={720}
            aria-label="杭电 Wiki 网站操作演示"
            aria-describedby="tour-caption"
          >
            <source src={video} type="video/mp4" />
            <track src="/promo/hdu-wiki-tour.zh.vtt" kind="subtitles" srcLang="zh-CN" label="中文字幕" />
            你的浏览器暂时无法播放这段视频，可以<a href={video} download>下载后观看</a>。
          </video>
          <figcaption id="tour-caption" className={styles.caption}>
            <span>约 60 秒 · 中文字幕</span>
            <a href={video} download="HDU-Wiki-一分钟介绍.mp4">下载视频</a>
          </figcaption>
        </figure>

        <section className={styles.afterword} aria-labelledby="tour-next">
          <h2 id="tour-next">去翻翻看</h2>
          <nav className={styles.links} aria-label="视频介绍的内容">
            <Link href="/courses">课程笔记</Link>
            <Link href="/campus/main-guide">新生指南</Link>
            <Link href="/tech">技术文章</Link>
            <Link href="/">全部内容</Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
