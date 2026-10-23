import type { Metadata } from "next";
import Link from "next/link";
import VideoPlayer from "./VideoPlayer";
import styles from "./video.module.css";
import story from "@/scripts/media/story.json";

const title = "一起，成为更好的自己";
const description = "小羊学长和学姐的校园友情小剧场。从一起解决难题，到并肩站上舞台，和好朋友一起成长。双人配音，配中文字幕。";
const video = "/promo/hdu-friends.mp4";
const poster = "/promo/hdu-friends-poster.jpg";

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
          <p className={styles.note}>HDU Wiki · 小羊学长学姐的小剧场</p>
          <h1>{title}</h1>
          <p className={styles.description}>你卡住的时候，我陪你再试一次。轮到我紧张的时候，你也一直都在。</p>
        </header>
        <figure className={styles.film}>
          <VideoPlayer />
          <figcaption id="video-caption" className={styles.caption}>
            <span>双人合成配音 · 中文字幕</span>
            <a href={video} download="小羊学长学姐-一起成为更好的自己.mp4">下载小剧场</a>
          </figcaption>
        </figure>
        <details className={styles.transcript}>
          <summary>看文字版故事</summary>
          <ol>
            {story.scenes.map((scene, index) => (
              <li key={index}><strong>{scene.role === "boy" ? "学长" : scene.role === "girl" ? "学姐" : "台下的同学们"}</strong><p>{scene.text}</p></li>
            ))}
          </ol>
        </details>
        <section className={styles.afterword} aria-labelledby="video-next">
          <h2 id="video-next">把得到的帮助，继续传下去</h2>
          <nav className={styles.links} aria-label="视频介绍的内容">
            <Link href="/courses">课程笔记</Link>
            <Link href="/campus/main-guide">新生指南</Link>
            <Link href="/tech">技术文章</Link>
            <Link href="/stickers" prefetch={false}>小羊表情包</Link>
            <a href="/promo/hdu-wiki-tour.mp4">看网站操作演示</a>
          </nav>
        </section>
      </div>
    </main>
  );
}
