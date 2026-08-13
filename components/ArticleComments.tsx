"use client";

import { MessageCircle, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyArticleCommentHighlight,
  clearArticleCommentHighlights,
  countQuoteOccurrences,
  findArticleQuoteRange,
  findCommentIdAtPoint,
  getArticleCommentRangeRect,
  getArticleCommentStorageKey,
  getArticleText,
  getArticleTextOffset,
  parseArticleComments,
  rangeTouchesArticleComment,
  removeArticleCommentHighlight,
  supportsCssCustomHighlight,
  type ArticleComment,
} from "@/lib/article-comments";

interface ArticleCommentsProps {
  category: string;
  slug: string;
  contentId?: string;
}

interface FloatingPosition {
  top: number;
  left: number;
}

interface PendingSelection {
  quote: string;
  position: FloatingPosition;
}

const MAX_COMMENTS = 100;
const HIGHLIGHT_CLASS = "article-comment-highlight";

function clampPosition(position: FloatingPosition, width: number, height: number): FloatingPosition {
  return {
    left: Math.max(10, Math.min(position.left, window.innerWidth - width - 10)),
    top: Math.max(10, Math.min(position.top, window.innerHeight - height - 10)),
  };
}

function positionBelow(rect: DOMRect, width: number, height: number): FloatingPosition {
  const below = rect.bottom + 10;
  const top = below + height > window.innerHeight ? rect.top - height - 10 : below;
  return clampPosition({ top, left: rect.left }, width, height);
}

function makeCommentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `comment-${crypto.randomUUID()}`;
  return `comment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function ArticleComments({ category, slug, contentId = "article-content-body" }: ArticleCommentsProps) {
  const storageKey = useMemo(() => getArticleCommentStorageKey(category, slug), [category, slug]);
  const rootRef = useRef<HTMLElement | null>(null);
  const selectionRangeRef = useRef<Range | null>(null);
  const pointerUpTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [note, setNote] = useState("");
  const [composeError, setComposeError] = useState("");
  const [activeComment, setActiveComment] = useState<{ id: string; position: FloatingPosition } | null>(null);
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);

  // 读取上次的开/关状态。放在 useEffect 里读 localStorage，避免 SSR 与首次
  // hydration 之间出现 mismatch。
  useEffect(() => {
    let stored = true;
    try {
      stored = window.localStorage.getItem("hdu-wiki:article-comments:enabled") !== "off";
    } catch {
      stored = true;
    }
    enabledRef.current = stored;
    setEnabled(stored);
  }, []);

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      enabledRef.current = next;
      try {
        window.localStorage.setItem("hdu-wiki:article-comments:enabled", next ? "on" : "off");
      } catch {
        // 隐私模式下存储失败不影响切换本身
      }
      if (!next) {
        // 关闭时顺手收起正在编辑/查看的弹窗，避免它们卡在屏幕上
        selectionRangeRef.current = null;
        setPendingSelection(null);
        setActiveComment(null);
        setComposeError("");
      }
      return next;
    });
  }, []);

  const persistComments = useCallback((next: ArticleComment[]) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // 隐私模式或存储空间不足时，当前页面仍保留内存中的评论。
    }
  }, [storageKey]);

  useEffect(() => {
    selectionRangeRef.current = null;
    const loadTimer = window.setTimeout(() => {
      try {
        setComments(parseArticleComments(window.localStorage.getItem(storageKey)));
      } catch {
        setComments([]);
      }
      setPendingSelection(null);
      setActiveComment(null);
    }, 0);
    return () => {
      window.clearTimeout(loadTimer);
      selectionRangeRef.current = null;
      if (pointerUpTimerRef.current !== null) {
        window.clearTimeout(pointerUpTimerRef.current);
        pointerUpTimerRef.current = null;
      }
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
      // 离开当前文章（卸载或路由切换）时回收 CSS 高亮持有的 range，
      // 避免它们继续挂在已卸载的 DOM 节点上。
      const root = rootRef.current;
      if (root) clearArticleCommentHighlights(root);
    };
  }, [storageKey]);

  useEffect(() => {
    const root = document.getElementById(contentId);
    rootRef.current = root;
    if (!root || comments.length === 0) {
      // 评论被清空时同步移除残留高亮
      if (root && supportsCssCustomHighlight()) clearArticleCommentHighlights(root);
      return;
    }

    // CSS 高亮路径：range 都存在全局注册表里，每次重新按 comments 全量重建最稳，
    // 既不会改 DOM，也不会有可见的闪烁。mark 路径保持幂等追加。
    if (supportsCssCustomHighlight()) clearArticleCommentHighlights(root);

    for (const comment of comments) {
      const alreadyApplied = !supportsCssCustomHighlight()
        && [...root.querySelectorAll<HTMLElement>(`mark.${HIGHLIGHT_CLASS}`)]
          .some((mark) => mark.dataset.commentId === comment.id);
      if (alreadyApplied) continue;
      const range = findArticleQuoteRange(root, comment.quote, comment.occurrence);
      if (range) applyArticleCommentHighlight(root, range, comment.id);
    }
  }, [comments, contentId]);

  useEffect(() => {
    if (pendingSelection) textareaRef.current?.focus();
  }, [pendingSelection]);

  const showCommentById = useCallback((id: string) => {
    if (!id) return;
    const root = rootRef.current;
    if (!root) return;
    let rect: DOMRect | null = null;
    if (supportsCssCustomHighlight()) {
      rect = getArticleCommentRangeRect(id);
    } else {
      const mark = [...root.querySelectorAll<HTMLElement>(`mark.${HIGHLIGHT_CLASS}`)]
        .find((candidate) => candidate.dataset.commentId === id && candidate.isConnected && root.contains(candidate));
      if (mark) rect = mark.getBoundingClientRect();
    }
    if (!rect) return;
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    setActiveComment({ id, position: positionBelow(rect, 290, 150) });
  }, []);

  const scheduleHideComment = useCallback(() => {
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setActiveComment(null), 160);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const useCssHighlight = supportsCssCustomHighlight();

    const findMark = (target: EventTarget | null): HTMLElement | null => {
      return target instanceof HTMLElement
        ? target.closest<HTMLElement>(`mark.${HIGHLIGHT_CLASS}`)
        : null;
    };
    const handlePointerOver = (event: PointerEvent) => {
      const mark = findMark(event.target);
      if (mark) showCommentById(mark.dataset.commentId ?? "");
    };
    const handlePointerOut = (event: PointerEvent) => {
      const mark = findMark(event.target);
      const nextTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null;
      if (mark && !mark.contains(nextTarget)) scheduleHideComment();
    };
    const handleFocusIn = (event: FocusEvent) => {
      const mark = findMark(event.target);
      if (mark) showCommentById(mark.dataset.commentId ?? "");
    };
    const handleClick = (event: MouseEvent) => {
      if (useCssHighlight) {
        const id = findCommentIdAtPoint(root, event.clientX, event.clientY);
        if (id) showCommentById(id);
        return;
      }
      const mark = findMark(event.target);
      if (mark) showCommentById(mark.dataset.commentId ?? "");
    };

    // CSS 高亮下没有任何 DOM 节点可以 closest，只能在 pointermove 时做命中测试。
    // 用 rAF 节流，避免每次移动都查询。
    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;
    const handlePointerMove = (event: PointerEvent) => {
      pendingX = event.clientX;
      pendingY = event.clientY;
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        if (rootRef.current !== root || !root.isConnected) return;
        const id = findCommentIdAtPoint(root, pendingX, pendingY);
        if (id) showCommentById(id);
        else scheduleHideComment();
      });
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!enabledRef.current) return;
      if (event.target instanceof HTMLElement && event.target.closest(".article-comment-compose, .article-comment-popover")) return;
      if (pointerUpTimerRef.current !== null) window.clearTimeout(pointerUpTimerRef.current);
      pointerUpTimerRef.current = window.setTimeout(() => {
        pointerUpTimerRef.current = null;
        if (rootRef.current !== root || !root.isConnected) return;
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0).cloneRange();
        if (!root.contains(range.commonAncestorContainer) || !root.contains(range.startContainer) || !root.contains(range.endContainer)) return;
        const quote = range.toString();
        if (quote.trim().length < 2 || quote.length > 2000 || rangeTouchesArticleComment(root, range)) return;
        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return;
        selectionRangeRef.current = range;
        setComposeError("");
        setNote("");
        setPendingSelection({ quote, position: positionBelow(rect, 320, 245) });
        textareaRef.current?.focus();
      }, 0);
    };

    if (useCssHighlight) {
      root.addEventListener("pointermove", handlePointerMove);
    } else {
      root.addEventListener("pointerover", handlePointerOver);
      root.addEventListener("pointerout", handlePointerOut);
      root.addEventListener("focusin", handleFocusIn);
    }
    root.addEventListener("click", handleClick);
    root.addEventListener("pointerup", handlePointerUp);
    return () => {
      if (useCssHighlight) {
        root.removeEventListener("pointermove", handlePointerMove);
      } else {
        root.removeEventListener("pointerover", handlePointerOver);
        root.removeEventListener("pointerout", handlePointerOut);
        root.removeEventListener("focusin", handleFocusIn);
      }
      root.removeEventListener("click", handleClick);
      root.removeEventListener("pointerup", handlePointerUp);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      if (pointerUpTimerRef.current !== null) {
        window.clearTimeout(pointerUpTimerRef.current);
        pointerUpTimerRef.current = null;
      }
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [scheduleHideComment, showCommentById, contentId, comments.length]);

  const closeComposer = () => {
    selectionRangeRef.current = null;
    setPendingSelection(null);
    setComposeError("");
  };

  const saveComment = () => {
    const root = rootRef.current;
    const range = selectionRangeRef.current;
    const trimmedNote = note.trim();
    if (!root || !range || !pendingSelection) return;
    if (!trimmedNote) {
      setComposeError("先写一点留言，再保存。");
      return;
    }
    if (trimmedNote.length > 1000) {
      setComposeError("留言最多 1000 字。");
      return;
    }

    if (!root.isConnected || !root.contains(range.startContainer) || !root.contains(range.endContainer)) {
      setComposeError("这段文字已经离开当前文章，请重新选择后再试。");
      return;
    }

    let articleText: string;
    let startOffset: number;
    try {
      articleText = getArticleText(root);
      startOffset = getArticleTextOffset(root, range.startContainer, range.startOffset);
    } catch {
      setComposeError("这段文字刚刚发生了变化，请重新选择后再试。");
      return;
    }
    const comment: ArticleComment = {
      id: makeCommentId(),
      quote: pendingSelection.quote,
      occurrence: countQuoteOccurrences(articleText, pendingSelection.quote, startOffset),
      note: trimmedNote,
      createdAt: new Date().toISOString(),
    };
    let applied = false;
    try {
      applied = applyArticleCommentHighlight(root, range, comment.id);
    } catch {
      applied = false;
    }
    if (!applied) {
      setComposeError("这段文字刚刚发生了变化，请重新选择后再试。");
      return;
    }
    const next = [...comments, comment].slice(-MAX_COMMENTS);
    if (next.length < comments.length + 1) {
      const removed = comments[comments.length - MAX_COMMENTS];
      if (removed) removeArticleCommentHighlight(root, removed.id);
    }
    setComments(next);
    persistComments(next);
    closeComposer();
    window.getSelection()?.removeAllRanges();
  };

  const deleteComment = (id: string) => {
    const root = rootRef.current;
    if (root) removeArticleCommentHighlight(root, id);
    const next = comments.filter((comment) => comment.id !== id);
    setComments(next);
    persistComments(next);
    setActiveComment(null);
  };

  const visibleComment = activeComment ? comments.find((comment) => comment.id === activeComment.id) : null;

  return (
    <>
      <button
        type="button"
        className={`article-comment-toggle ${enabled ? "is-on" : "is-off"}`}
        onClick={toggleEnabled}
        aria-pressed={enabled}
        aria-label={enabled ? "关闭划词留言，方便复制" : "开启划词留言"}
        title={enabled ? "划词留言：开（点击关闭后可正常复制）" : "划词留言：关（点击开启）"}
      >
        <MessageCircle aria-hidden="true" size={16} />
      </button>
      {pendingSelection ? (
        <div
          className="article-comment-compose"
          style={{ top: pendingSelection.position.top, left: pendingSelection.position.left }}
          role="dialog"
          aria-label="给选中的文字留言"
        >
          <header>
            <strong><MessageCircle aria-hidden="true" size={15} />给这段话留言</strong>
            <button type="button" onClick={closeComposer} aria-label="取消留言"><X aria-hidden="true" size={15} /></button>
          </header>
          <p className="article-comment-note">“{pendingSelection.quote.trim().slice(0, 110)}{pendingSelection.quote.trim().length > 110 ? "…" : ""}”</p>
          <textarea
            ref={textareaRef}
            value={note}
            maxLength={1000}
            onChange={(event) => setNote(event.target.value)}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === "Enter") saveComment();
            }}
            placeholder="写下你的想法"
            rows={3}
          />
          <div className="article-comment-compose-footer">
            <small>只保存在当前浏览器</small>
            {composeError ? <span role="alert">{composeError}</span> : null}
            <button type="button" onClick={saveComment}>保存</button>
          </div>
        </div>
      ) : null}

      {visibleComment && activeComment ? (
        <div
          className="article-comment-popover"
          style={{ top: activeComment.position.top, left: activeComment.position.left }}
          onPointerEnter={() => { if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current); }}
          onPointerLeave={scheduleHideComment}
          role="status"
        >
          <header>
            <strong><MessageCircle aria-hidden="true" size={15} />留言</strong>
            <button type="button" onClick={() => deleteComment(visibleComment.id)} aria-label="删除本条留言">
              <Trash2 aria-hidden="true" size={14} />
            </button>
          </header>
          <p className="article-comment-note article-comment-note-body">{visibleComment.note}</p>
          <small>“{visibleComment.quote.trim().slice(0, 88)}{visibleComment.quote.trim().length > 88 ? "…" : ""}”</small>
        </div>
      ) : null}
    </>
  );
}
