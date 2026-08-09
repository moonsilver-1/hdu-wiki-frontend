"use client";

import { BookOpen, ChevronDown, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clampRatio,
  decorateReadingToc,
  getReadingProgress,
  nearestReadingTocIndex,
  type ReadingTocItem,
  type ReadingTocItemWithParent,
} from "@/components/reading-navigation";

const ARTICLE_CONTENT_ID = "article-content";
const READING_HEADER_OFFSET = 104;

interface PositionedTocItem extends ReadingTocItemWithParent {
  ratio: number;
}

function getFallbackRatio(index: number, total: number): number {
  return total <= 1 ? 0 : index / (total - 1);
}

function scrollToHeading(id: string): void {
  const element = document.getElementById(id);
  if (!element) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  window.history.replaceState(null, "", `#${encodeURIComponent(id)}`);
}

function chapterLabel(item: PositionedTocItem, index: number, total: number): string {
  const prefix = `${index + 1} / ${total}`;
  return item.parentText && item.level === 3 ? `${prefix} · ${item.parentText} / ${item.text}` : `${prefix} · ${item.text}`;
}

export default function Toc({ items }: { items: ReadingTocItem[] }) {
  const decoratedItems = useMemo(() => decorateReadingToc(items), [items]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const [positionedItems, setPositionedItems] = useState<PositionedTocItem[]>(() =>
    decoratedItems.map((item, index) => ({ ...item, ratio: getFallbackRatio(index, decoratedItems.length) }))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const updateLayout = useCallback(() => {
    const article = document.getElementById(ARTICLE_CONTENT_ID);
    if (!article || decoratedItems.length === 0) return;

    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const articleHeight = article.scrollHeight;
    setPositionedItems(
      decoratedItems.map((item, index) => {
        const heading = document.getElementById(item.id);
        if (!heading) return { ...item, ratio: getFallbackRatio(index, decoratedItems.length) };
        const headingTop = heading.getBoundingClientRect().top + window.scrollY;
        return { ...item, ratio: clampRatio((headingTop - articleTop) / Math.max(1, articleHeight)) };
      })
    );
  }, [decoratedItems]);

  const updateReadingState = useCallback(() => {
    const article = document.getElementById(ARTICLE_CONTENT_ID);
    if (!article || positionedItems.length === 0) return;

    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const articleHeight = article.scrollHeight;
    const progress = getReadingProgress(window.scrollY, articleTop, articleHeight, window.innerHeight);
    const readingLine = window.scrollY + READING_HEADER_OFFSET;
    const articleRect = article.getBoundingClientRect();
    let nextActiveIndex = 0;

    positionedItems.forEach((item, index) => {
      const heading = document.getElementById(item.id);
      if (!heading) return;
      const headingTop = heading.getBoundingClientRect().top + window.scrollY;
      if (headingTop <= readingLine) nextActiveIndex = index;
    });

    setActiveIndex(nextActiveIndex);
    setReadingProgress(progress);
    setIsReading(
      articleRect.bottom > window.innerHeight * 0.12 &&
        articleRect.top < window.innerHeight * 0.88 &&
        progress < 0.995
    );
  }, [positionedItems]);

  useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateReadingState();
      });
    };
    const handleResize = () => {
      updateLayout();
      scheduleUpdate();
    };
    const article = document.getElementById(ARTICLE_CONTENT_ID);
    const resizeObserver = article ? new ResizeObserver(handleResize) : null;
    if (article) resizeObserver?.observe(article);

    const initialFrame = window.requestAnimationFrame(() => {
      updateLayout();
      scheduleUpdate();
    });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", handleResize);
    document.fonts?.ready.then(handleResize).catch(() => undefined);

    return () => {
      window.cancelAnimationFrame(initialFrame);
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [items.length, updateLayout, updateReadingState]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const restoreFocus = () => mobileTriggerRef.current?.focus();
    dialog.addEventListener("close", restoreFocus);
    return () => dialog.removeEventListener("close", restoreFocus);
  }, []);

  if (items.length === 0) return null;

  const activeItem = positionedItems[activeIndex] ?? positionedItems[0];
  const hoveredItem = hoveredIndex === null ? null : positionedItems[hoveredIndex];
  const ratios = positionedItems.map((item) => item.ratio);

  const updateHoveredFromPointer = (clientY: number, rect: DOMRect) => {
    setHoveredIndex(nearestReadingTocIndex(ratios, clampRatio((clientY - rect.top) / Math.max(1, rect.height))));
  };

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const index = nearestReadingTocIndex(ratios, (event.clientY - rect.top) / Math.max(1, rect.height));
    if (index >= 0) scrollToHeading(positionedItems[index].id);
  };

  const closeDrawer = () => dialogRef.current?.close();

  return (
    <aside className="toc-sidebar" aria-label="文章章节导航">
      <div className="reading-rail-shell">
        <div
          className="reading-rail"
          onPointerMove={(event) => updateHoveredFromPointer(event.clientY, event.currentTarget.getBoundingClientRect())}
          onPointerLeave={() => setHoveredIndex(null)}
          onClick={handleTrackClick}
          role="presentation"
        >
          <div className="reading-rail-track">
            <div className="reading-rail-progress" style={{ height: `${readingProgress * 100}%` }} />
            {positionedItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${encodeURIComponent(item.id)}`}
                className={`reading-rail-marker reading-rail-marker-level-${item.level}${activeIndex === index ? " is-active" : ""}`}
                style={{ top: `${item.ratio * 100}%` }}
                aria-label={chapterLabel(item, index, positionedItems.length)}
                aria-current={activeIndex === index ? "location" : undefined}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHeading(item.id);
                }}
              />
            ))}
          </div>
          {hoveredItem ? (
            <div className="reading-rail-tooltip" style={{ top: `${hoveredItem.ratio * 100}%` }} role="status">
              <small>{chapterLabel(hoveredItem, hoveredIndex ?? 0, positionedItems.length)}</small>
              <strong>{hoveredItem.text}</strong>
            </div>
          ) : null}
        </div>
      </div>

      {isReading ? (
        <button
          ref={mobileTriggerRef}
          className="reading-mobile-trigger"
          type="button"
          aria-haspopup="dialog"
          aria-label={`打开文章目录，当前章节：${activeItem?.text ?? "未开始"}`}
          onClick={() => dialogRef.current?.showModal()}
        >
          <BookOpen aria-hidden="true" size={16} />
          <span className="reading-mobile-current">{activeItem?.text ?? "文章目录"}</span>
          <span className="reading-mobile-progress">{Math.round(readingProgress * 100)}%</span>
          <ChevronDown aria-hidden="true" size={16} />
        </button>
      ) : null}

      <dialog ref={dialogRef} className="reading-mobile-dialog" aria-label="文章目录">
        <div className="reading-mobile-dialog-inner">
          <header>
            <div>
              <small>文章目录</small>
              <strong>{Math.round(readingProgress * 100)}% 已读</strong>
            </div>
            <button type="button" className="reading-mobile-close" aria-label="关闭文章目录" onClick={closeDrawer}>
              <X aria-hidden="true" size={18} />
            </button>
          </header>
          <nav aria-label="文章章节列表">
            {positionedItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${encodeURIComponent(item.id)}`}
                className={`reading-mobile-link reading-mobile-link-level-${item.level}${activeIndex === index ? " is-active" : ""}`}
                aria-current={activeIndex === index ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  closeDrawer();
                  scrollToHeading(item.id);
                }}
              >
                <span>{item.text}</span>
                <small>{index + 1}</small>
              </a>
            ))}
          </nav>
        </div>
      </dialog>
    </aside>
  );
}
