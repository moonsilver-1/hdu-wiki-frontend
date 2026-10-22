import type { Metadata } from "next";
import Link from "next/link";
import { STICKER_COUNT_PER_ROLE, STICKER_TOTAL, STICKER_PACK_SIZE, STICKER_PACK_URL } from "@/lib/stickers";
import StickerGallery from "./StickerGallery";
import styles from "./stickers.module.css";

const title = "小羊表情包";
const description = `小羊学长、小羊学姐各 ${STICKER_COUNT_PER_ROLE} 张表情包。常用回复、校园日常和一点抽象，单张 PNG 保存或整包 ZIP 下载。`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/stickers" },
  openGraph: { title, description, url: "/stickers", type: "website" },
};

export default function StickersPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <nav className={styles.breadcrumb} aria-label="页面导航">
          <Link href="/">回到首页</Link>
          <Link href="/video" prefetch={false}>看网站介绍</Link>
        </nav>
        <header className={styles.heading}>
          <div>
            <p className={styles.note}>学长 {STICKER_COUNT_PER_ROLE} 张 · 学姐 {STICKER_COUNT_PER_ROLE} 张</p>
            <h1>{title}</h1>
            <p className={styles.description}>收到、吃饭、赶 ddl，还有一些不太正常的日常。</p>
          </div>
          <div className={styles.downloadArea}>
            <a className={styles.downloadPack} href={STICKER_PACK_URL} download={`小羊学长学姐-${STICKER_TOTAL}张表情包.zip`}>下载全部 {STICKER_TOTAL} 张</a>
            <span>ZIP{STICKER_PACK_SIZE ? ` · ${STICKER_PACK_SIZE}` : ""} · 每张都是独立 PNG</span>
          </div>
        </header>
        <StickerGallery />
        <p className={styles.footnote}>点图片就能保存。手机上也可以打开原图，长按添加到表情。</p>
      </div>
    </main>
  );
}
