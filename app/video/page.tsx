import type { Metadata } from "next";
import Link from "next/link";
import VideoPlayer from "./VideoPlayer";
import styles from "./video.module.css";

const title = "一分钟认识杭电 Wiki";
const description = "跟着这段网站操作演示，看看怎样找课程笔记、搜索文章，以及在手机上阅读。约 60 秒，配中文字幕。";
const video = "/promo/hdu-wiki-tour.mp4";
const poster = "/promo/hdu-wiki-tour-poster.jpg";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: "/video" },
  openGraph: { title, description, url: "/video", type: "website", images: [{ url: poster, alt: title }], videos: [{ url: video, type: "video/mp4" }] },
  twitter: { card: "summary_large_image", title, description, images: [poster] },
};

export default function VideoPage() {
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
          <VideoPlayer />
          <figcaption id="video-caption" className={styles.caption}>
            <span>约 60 秒 · 中文字幕</span>
            <a href={video} download="HDU-Wiki-一分钟介绍.mp4">下载视频</a>
          </figcaption>
        </figure>
        <section className={styles.afterword} aria-labelledby="video-next">
          <h2 id="video-next">去翻翻看</h2>
          <nav className={styles.links} aria-label="视频介绍的内容">
            <Link href="/courses">课程笔记</Link>
            <Link href="/campus/main-guide">新生指南</Link>
            <Link href="/tech">技术文章</Link>
            <Link href="/stickers" prefetch={false}>小羊表情包</Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
