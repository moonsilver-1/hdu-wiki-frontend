"use client";

import { MessageCircle, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  countQuoteOccurrences,
  findArticleQuoteRange,
  getArticleCommentStorageKey,
  getArticleText,
  getArticleTextOffset,
  parseArticleComments,
  rangeTouchesArticleComment,
  removeArticleCommentHighlights,
  wrapArticleCommentRange,
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
  const hideTimerRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [note, setNote] = useState("");
  const [composeError, setComposeError] = useState("");
  const [activeComment, setActiveComment] = useState<{ id: string; position: FloatingPosition } | null>(null);

  const persistComments = useCallback((next: ArticleComment[]) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // 隐私模式或存储空间不足时，当前页面仍保留内存中的评论。
    }
  }, [storageKey]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      try {
        setComments(parseArticleComments(window.localStorage.getItem(storageKey)));
      } catch {
        setComments([]);
      }
      setPendingSelection(null);
      setActiveComment(null);
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, [storageKey]);

  useEffect(() => {
    const root = document.getElementById(contentId);
    rootRef.current = root;
    if (!root || comments.length === 0) return;

    for (const comment of comments) {
      const alreadyApplied = [...root.querySelectorAll<HTMLElement>("mark.article-comment-highlight")]
        .some((mark) => mark.dataset.commentId === comment.id);
      if (alreadyApplied) continue;
      const range = findArticleQuoteRange(root, comment.quote, comment.occurrence);
      if (range) wrapArticleCommentRange(root, range, comment.id);
    }
  }, [comments, contentId]);

  useEffect(() => {
    if (pendingSelection) textareaRef.current?.focus();
  }, [pendingSelection]);

  const showComment = useCallback((mark: HTMLElement) => {
    const id = mark.dataset.commentId;
    if (!id) return;
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    setActiveComment({ id, position: positionBelow(mark.getBoundingClientRect(), 290, 150) });
  }, []);

  const scheduleHideComment = useCallback(() => {
    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    hideTimerRef.current = window.setTimeout(() => setActiveComment(null), 160);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const findMark = (target: EventTarget | null): HTMLElement | null => {
      return target instanceof HTMLElement
        ? target.closest<HTMLElement>("mark.article-comment-highlight")
        : null;
    };
    const handlePointerOver = (event: PointerEvent) => {
      const mark = findMark(event.target);
      if (mark) showComment(mark);
    };
    const handlePointerOut = (event: PointerEvent) => {
      const mark = findMark(event.target);
      const nextTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null;
      if (mark && !mark.contains(nextTarget)) scheduleHideComment();
    };
    const handleFocusIn = (event: FocusEvent) => {
      const mark = findMark(event.target);
      if (mark) showComment(mark);
    };
    const handleClick = (event: MouseEvent) => {
      const mark = findMark(event.target);
      if (mark) showComment(mark);
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest(".article-comment-compose, .article-comment-popover")) return;
      window.setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0).cloneRange();
        if (!root.contains(range.commonAncestorContainer)) return;
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

    root.addEventListener("pointerover", handlePointerOver);
    root.addEventListener("pointerout", handlePointerOut);
    root.addEventListener("focusin", handleFocusIn);
    root.addEventListener("click", handleClick);
    root.addEventListener("pointerup", handlePointerUp);
    return () => {
      root.removeEventListener("pointerover", handlePointerOver);
      root.removeEventListener("pointerout", handlePointerOut);
      root.removeEventListener("focusin", handleFocusIn);
      root.removeEventListener("click", handleClick);
      root.removeEventListener("pointerup", handlePointerUp);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHideComment, showComment, contentId, comments.length]);

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

    const articleText = getArticleText(root);
    const startOffset = getArticleTextOffset(root, range.startContainer, range.startOffset);
    const comment: ArticleComment = {
      id: makeCommentId(),
      quote: pendingSelection.quote,
      occurrence: countQuoteOccurrences(articleText, pendingSelection.quote, startOffset),
      note: trimmedNote,
      createdAt: new Date().toISOString(),
    };
    if (!wrapArticleCommentRange(root, range, comment.id)) {
      setComposeError("这段文字刚刚发生了变化，请重新选择后再试。");
      return;
    }
    const next = [...comments, comment].slice(-MAX_COMMENTS);
    if (next.length < comments.length + 1) {
      const removed = comments[comments.length - MAX_COMMENTS];
      if (removed) removeArticleCommentHighlights(root, removed.id);
    }
    setComments(next);
    persistComments(next);
    closeComposer();
    window.getSelection()?.removeAllRanges();
  };

  const deleteComment = (id: string) => {
    const root = rootRef.current;
    if (root) removeArticleCommentHighlights(root, id);
    const next = comments.filter((comment) => comment.id !== id);
    setComments(next);
    persistComments(next);
    setActiveComment(null);
  };

  const visibleComment = activeComment ? comments.find((comment) => comment.id === activeComment.id) : null;

  return (
    <>
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
