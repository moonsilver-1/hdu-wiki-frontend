"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { getStickerPage, stickerDownloadName, STICKER_CATEGORIES, STICKER_ROLES, type StickerRoleFilter } from "@/lib/stickers";
import styles from "./stickers.module.css";

const roles: { value: StickerRoleFilter; label: string }[] = [
  { value: "all", label: "一起看" },
  { value: "boy", label: "小羊学长" },
  { value: "girl", label: "小羊学姐" },
];

export default function StickerGallery() {
  const [role, setRole] = useState<StickerRoleFilter>("all");
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);
  const result = getStickerPage({ role, category, query, page });

  function turnPage(next: number) {
    setPage(next);
    resultsRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    resultsRef.current?.focus({ preventScroll: true });
  }

  return (
    <section aria-label="挑选表情包">
      <div className={styles.toolbar}>
        <div className={styles.roles} role="group" aria-label="选择人物">
          {roles.map((option) => (
            <button key={option.value} type="button" data-role={option.value} aria-pressed={role === option.value}
              onClick={() => { setRole(option.value); setPage(1); }}>{option.label}</button>
          ))}
        </div>
        <div className={styles.search}>
          <label htmlFor="sticker-search">找一句话</label>
          <input id="sticker-search" type="search" placeholder="比如：GOAT、加油、晚安" value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }} />
        </div>
      </div>
      <div className={styles.categories} role="group" aria-label="选择主题">
        {["全部", ...STICKER_CATEGORIES].map((item) => (
          <button key={item} type="button" aria-pressed={category === item}
            onClick={() => { setCategory(item); setPage(1); }}>{item}</button>
        ))}
      </div>
      <div ref={resultsRef} tabIndex={-1} className={styles.results}>
        <p className={styles.resultCount} role="status" aria-live="polite">
          {result.total ? `${result.total} 张 · 第 ${result.page} / ${result.pageCount} 页` : "没找到这句话，换个词试试。"}
        </p>
        {result.total ? (
          <ul className={styles.grid} aria-label="表情包列表">
            {result.items.map((sticker) => (
              <li key={sticker.id} className={styles.card} data-role={sticker.role}>
                <a href={sticker.src} download={stickerDownloadName(sticker)} aria-label={`保存${STICKER_ROLES[sticker.role]}「${sticker.caption}」PNG`}>
                  <div className={styles.art}>
                    <Image src={sticker.src} alt={`${STICKER_ROLES[sticker.role]}「${sticker.caption}」表情`}
                      fill sizes="(max-width: 540px) 45vw, (max-width: 850px) 30vw, 240px" loading="lazy" decoding="async" />
                  </div>
                  <div className={styles.cardCaption}>
                    <span><strong>{sticker.caption}</strong><small>{STICKER_ROLES[sticker.role]}</small></span>
                    <span className={styles.save}>保存 PNG</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <p>也可能在另一个分类里。</p>
            <button type="button" onClick={() => { setRole("all"); setCategory("全部"); setQuery(""); setPage(1); }}>看看全部</button>
          </div>
        )}
      </div>
      {result.pageCount > 1 ? (
        <nav className={styles.pagination} aria-label="表情包翻页">
          <button type="button" disabled={result.page === 1} onClick={() => turnPage(result.page - 1)}>上一页</button>
          <span aria-label={`第 ${result.page} 页，共 ${result.pageCount} 页`}>{result.page} / {result.pageCount}</span>
          <button type="button" disabled={result.page === result.pageCount} onClick={() => turnPage(result.page + 1)}>下一页</button>
        </nav>
      ) : null}
    </section>
  );
}
