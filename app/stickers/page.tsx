import type { Metadata } from "next";
import Link from "next/link";
import { STICKER_COUNT_PER_ROLE, STICKER_TOTAL, STICKER_PACKS, STICKER_ROLES } from "@/lib/stickers";
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
          <Link href="/video" prefetch={false}>看学长学姐的小故事</Link>
        </nav>
        <header className={styles.heading}>
          <div>
            <p className={styles.note}>学长 {STICKER_COUNT_PER_ROLE} 张 · 学姐 {STICKER_COUNT_PER_ROLE} 张</p>
            <h1>{title}</h1>
            <p className={styles.description}>晚安、加油、没事没事，也有一点 GOAT 式的抽象。</p>
          </div>
          <div className={styles.downloadArea}>
            {STICKER_PACKS.map((pack) => (
              <div className={styles.downloadItem} key={pack.role}>
                <a className={styles.downloadPack} href={pack.url} download={`${STICKER_ROLES[pack.role]}-${pack.count}张表情包.zip`}>{pack.label}</a>
                <span>ZIP · {pack.size} · 独立 PNG</span>
              </div>
            ))}
          </div>
        </header>
        <StickerGallery />
        <p className={styles.footnote}>共 {STICKER_TOTAL} 张，点图片就能单张保存。手机上也可以打开原图，长按添加到表情。</p>
      </div>
    </main>
  );
}
