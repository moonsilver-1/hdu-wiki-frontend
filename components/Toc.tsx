"use client";

import { BookOpen, ChevronDown, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clampRatio,
  decorateReadingToc,
  getReadingProgress,
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

function scheduleHeadingScroll(id: string): void {
  // Let the pointer/click event finish before changing scroll position or hash.
  window.setTimeout(() => scrollToHeading(id), 0);
}

function chapterLabel(item: PositionedTocItem, index: number, total: number): string {
  const prefix = `${index + 1} / ${total}`;
  return item.parentText && item.level === 3 ? `${prefix} · ${item.parentText} / ${item.text}` : `${prefix} · ${item.text}`;
}

export default function Toc({ items }: { items: ReadingTocItem[] }) {
  const decoratedItems = useMemo(() => decorateReadingToc(items), [items]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const tocListRef = useRef<HTMLElement>(null);
  const [positionedItems, setPositionedItems] = useState<PositionedTocItem[]>(() =>
    decoratedItems.map((item, index) => ({ ...item, ratio: getFallbackRatio(index, decoratedItems.length) }))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  // 滑动圆点与进度填充在目录列表里的纵向位置（px），跟随当前章节平滑移动。
  const [dotOffset, setDotOffset] = useState(0);
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
    if (!article || decoratedItems.length === 0) return;

    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    const articleHeight = article.scrollHeight;
    const progress = getReadingProgress(window.scrollY, articleTop, articleHeight, window.innerHeight);
    const readingLine = window.scrollY + READING_HEADER_OFFSET;
    const articleRect = article.getBoundingClientRect();
    let nextActiveIndex = 0;

    decoratedItems.forEach((item, index) => {
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
  }, [decoratedItems]);

  // 圆点吸附到当前章节所在行；带 200ms 过渡，滚动时就能看到它沿线滑行。
  const measureDot = useCallback(() => {
    const list = tocListRef.current;
    if (!list) return;
    const link = list.querySelectorAll<HTMLAnchorElement>(".toc-panel-item")[activeIndex];
    if (!link) return;
    setDotOffset(link.offsetTop + link.offsetHeight / 2);
  }, [activeIndex]);

  const openDirectory = () => {
    // Keep this toggle outside React state: pointer-up must return before any layout work.
    const dialog = dialogRef.current;
    const trigger = mobileTriggerRef.current;
    if (!dialog || dialog.dataset.open === "true") return;
    dialog.dataset.open = "true";
    dialog.setAttribute("aria-hidden", "false");
    trigger?.setAttribute("aria-expanded", "true");
  };

  const closeDirectory = () => {
    const dialog = dialogRef.current;
    const trigger = mobileTriggerRef.current;
    if (!dialog || dialog.dataset.open !== "true") return;
    delete dialog.dataset.open;
    dialog.setAttribute("aria-hidden", "true");
    trigger?.setAttribute("aria-expanded", "false");
    trigger?.focus();
  };

  useEffect(() => {
    if (items.length === 0) return;

    let frame = 0;
    let disposed = false;
    const scheduleUpdate = () => {
      if (disposed || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (disposed) return;
        updateReadingState();
      });
    };
    const handleResize = () => {
      if (disposed) return;
      updateLayout();
      scheduleUpdate();
      measureDot();
    };
    const article = document.getElementById(ARTICLE_CONTENT_ID);
    const resizeObserver = article ? new ResizeObserver(handleResize) : null;
    if (article) resizeObserver?.observe(article);

    const initialFrame = window.requestAnimationFrame(() => {
      if (disposed) return;
      updateLayout();
      scheduleUpdate();
      measureDot();
    });
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", handleResize);
    document.fonts?.ready.then(handleResize).catch(() => undefined);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(initialFrame);
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [items.length, updateLayout, updateReadingState, measureDot]);

  useEffect(() => {
    measureDot();
  }, [activeIndex, positionedItems, measureDot]);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (dialogRef.current?.dataset.open !== "true") return;
      const target = event.target as Node | null;
      if (dialogRef.current?.contains(target) || mobileTriggerRef.current?.contains(target)) return;
      closeDirectory();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dialogRef.current?.dataset.open === "true") closeDirectory();
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (items.length === 0) return null;

  const activeItem = positionedItems[activeIndex] ?? positionedItems[0];
  const progressPercent = Math.round(readingProgress * 100);

  return (
    <aside className="toc-sidebar" aria-label="文章章节导航">
      {/* 顶部阅读进度条：随滚动从左往右填充 */}
      <div className="reading-progress-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${readingProgress})` }} />
      </div>

      {/* 桌面端：luoluo/Fumadocs 式章节树（层级竖线 + 父子贝塞尔折线 + 已读点亮） */}
      <div className="toc-panel">
        <div className="toc-panel-head">
          <small>本页目录</small>
          <span>{progressPercent}%</span>
        </div>
        <nav className="toc-panel-list" ref={tocListRef} aria-label="文章章节列表">
          <span
            className="toc-panel-dot"
            style={{
              top: dotOffset,
              left: (positionedItems[activeIndex]?.level ?? 2) === 3 ? 16.5 : 8.5,
            }}
            aria-hidden="true"
          />
          {positionedItems.map((item, index) => {
            const prev = positionedItems[index - 1];
            const lineX = item.level === 3 ? 16.5 : 8.5;
            // 只在层级切换处画连接曲线（进入/离开子层级），同级项之间只靠竖线
            // 延续，否则每个子项都会多出一条重复的树枝状曲线。
            let connector: string | null = null;
            if (prev && item.level !== prev.level) {
              connector = item.level === 3
                ? `M 8.5 0 C 8.5 8 ${lineX} 4 ${lineX} 12`
                : `M 16.5 0 C 16.5 8 ${lineX} 4 ${lineX} 12`;
            }
            const isRead = index <= activeIndex;
            // 第一项的竖线从文字处开始（不向上出头）；其余项从项顶上方 6px 开始，
            // 与上一项的线尾重叠，保证树线视觉上连续无断口。
            const lineStart = connector ? 12 : index === 0 ? 6 : 0;
            return (
              <a
                key={item.id}
                href={`#${encodeURIComponent(item.id)}`}
                className={`toc-panel-item toc-panel-item-level-${item.level}${activeIndex === index ? " is-active" : ""}`}
                aria-label={chapterLabel(item, index, positionedItems.length)}
                aria-current={activeIndex === index ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  scheduleHeadingScroll(item.id);
                }}
              >
                <svg className="toc-panel-tree" width={17} aria-hidden="true">
                  {connector ? (
                    <path d={connector} className={isRead ? "is-read" : undefined} />
                  ) : null}
                  <line
                    x1={lineX}
                    y1={lineStart}
                    x2={lineX}
                    y2="100%"
                    className={isRead ? "is-read" : undefined}
                  />
                </svg>
                {item.text}
              </a>
            );
          })}
        </nav>
      </div>

      {isReading ? (
        <button
          ref={mobileTriggerRef}
          className="reading-rail-toggle"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-label={`打开文章目录，当前章节：${activeItem?.text ?? "未开始"}`}
          title={activeItem?.text ?? "文章目录"}
          onClick={openDirectory}
        >
          <BookOpen aria-hidden="true" size={15} />
          <span>{progressPercent}</span>
          <ChevronDown aria-hidden="true" size={13} />
        </button>
      ) : null}

      <div
        ref={dialogRef}
        className="reading-mobile-dialog"
        aria-hidden="true"
        role="dialog"
        aria-modal="false"
        aria-label="文章目录"
        onClick={(event) => {
          if (event.target === event.currentTarget) window.setTimeout(closeDirectory, 0);
        }}
      >
        <div className="reading-mobile-dialog-inner">
          <header>
            <div>
              <small>文章目录</small>
              <strong>{progressPercent}% 已读</strong>
            </div>
            <button
              type="button"
              className="reading-mobile-close"
              aria-label="关闭文章目录"
              onClick={() => window.setTimeout(closeDirectory, 0)}
            >
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
                  window.setTimeout(() => {
                    closeDirectory();
                    scrollToHeading(item.id);
                  }, 0);
                }}
              >
                <span>{item.text}</span>
                <small>{index + 1}</small>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
