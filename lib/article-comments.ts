export interface ArticleComment {
  id: string;
  quote: string;
  occurrence: number;
  note: string;
  createdAt: string;
}

export function getArticleCommentStorageKey(category: string, slug: string): string {
  return `hdu-wiki:article-comments:${category}/${slug}`;
}

export function parseArticleComments(value: string | null): ArticleComment[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .slice(-100)
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id.slice(0, 80) : "",
        quote: typeof item.quote === "string" ? item.quote.slice(0, 2000) : "",
        occurrence: typeof item.occurrence === "number" && Number.isInteger(item.occurrence)
          ? Math.max(0, item.occurrence)
          : 0,
        note: typeof item.note === "string" ? item.note.slice(0, 1000) : "",
        createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
      }))
      .filter((item) => item.id && item.quote.trim().length >= 2 && item.note.trim());
  } catch {
    return [];
  }
}

export function countQuoteOccurrences(text: string, quote: string, endAt = text.length): number {
  if (!quote) return 0;
  const limit = Math.max(0, Math.min(endAt, text.length));
  let count = 0;
  let cursor = 0;
  while (cursor < limit) {
    const index = text.indexOf(quote, cursor);
    if (index < 0 || index >= limit) break;
    count += 1;
    cursor = index + Math.max(1, quote.length);
  }
  return count;
}

function articleTextNodes(root: HTMLElement): Text[] {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current: Node | null;
  while ((current = walker.nextNode())) {
    const textNode = current as Text;
    if (textNode.nodeValue) nodes.push(textNode);
  }
  return nodes;
}

export function getArticleText(root: HTMLElement): string {
  return articleTextNodes(root).map((node) => node.nodeValue ?? "").join("");
}

export function getArticleTextOffset(root: HTMLElement, node: Node, offset: number): number {
  const range = root.ownerDocument.createRange();
  range.selectNodeContents(root);
  range.setEnd(node, offset);
  return range.toString().length;
}

function pointAtOffset(nodes: Text[], target: number): { node: Text; offset: number } | null {
  let cursor = 0;
  for (const node of nodes) {
    const length = node.nodeValue?.length ?? 0;
    if (target <= cursor + length) return { node, offset: Math.max(0, target - cursor) };
    cursor += length;
  }
  const last = nodes.at(-1);
  return last ? { node: last, offset: last.nodeValue?.length ?? 0 } : null;
}

export function findArticleQuoteRange(
  root: HTMLElement,
  quote: string,
  occurrence = 0,
): Range | null {
  const nodes = articleTextNodes(root);
  const text = nodes.map((node) => node.nodeValue ?? "").join("");
  let cursor = 0;
  let start = -1;
  for (let index = 0; index <= occurrence; index += 1) {
    start = text.indexOf(quote, cursor);
    if (start < 0) return null;
    cursor = start + Math.max(1, quote.length);
  }
  const startPoint = pointAtOffset(nodes, start);
  const endPoint = pointAtOffset(nodes, start + quote.length);
  if (!startPoint || !endPoint) return null;

  const range = root.ownerDocument.createRange();
  range.setStart(startPoint.node, startPoint.offset);
  range.setEnd(endPoint.node, endPoint.offset);
  return range;
}

// ---------------------------------------------------------------------------
// Comment highlighting
//
// 文章批注的高亮需要画一层背景色，但又不能破坏原文 DOM——否则用户复制选区时
// 会把 <mark> 节点、data-* 属性一起带走，污染粘贴结果。这里优先使用浏览器原生的
// CSS Custom Highlight API（在渲染层画色，DOM 完全不动），在不支持的旧浏览器上
// 回退到 <mark> 包裹文字的旧实现，保证功能始终可用。
// ---------------------------------------------------------------------------

const HIGHLIGHT_NAME = "article-comment";
const HIGHLIGHT_CLASS = "article-comment-highlight";

let cssHighlight: Highlight | null = null;
const commentRanges = new Map<string, Range>();

/** 当前浏览器是否支持 CSS Custom Highlight API。 */
export function supportsCssCustomHighlight(): boolean {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.highlights !== "undefined" &&
    typeof Highlight !== "undefined"
  );
}

function ensureCssHighlight(): Highlight | null {
  if (!supportsCssCustomHighlight()) return null;
  if (!cssHighlight) {
    cssHighlight = new Highlight();
    CSS.highlights.set(HIGHLIGHT_NAME, cssHighlight);
  }
  return cssHighlight;
}

function rangesIntersect(a: Range, b: Range): boolean {
  try {
    // 相交 ⇔ a 不在 b 之前，且 a 不在 b 之后
    return (
      a.compareBoundaryPoints(Range.END_TO_START, b) > 0 &&
      a.compareBoundaryPoints(Range.START_TO_END, b) < 0
    );
  } catch {
    return false;
  }
}

/** 选区是否与任意已存在的批注高亮相交（同时覆盖 CSS 高亮与 mark 两条路径）。 */
export function rangeTouchesArticleComment(root: HTMLElement, range: Range): boolean {
  for (const mark of root.querySelectorAll<HTMLElement>(`mark.${HIGHLIGHT_CLASS}`)) {
    try {
      if (range.intersectsNode(mark)) return true;
    } catch {
      // 跨文档节点忽略
    }
  }
  for (const existing of commentRanges.values()) {
    if (rangesIntersect(range, existing)) return true;
  }
  return false;
}

function wrapMarkRange(root: HTMLElement, range: Range, commentId: string): boolean {
  try {
    const nodes = articleTextNodes(root).filter((node) => {
      try {
        return range.intersectsNode(node);
      } catch {
        return false;
      }
    });
    if (nodes.length === 0 || rangeTouchesArticleComment(root, range)) return false;

    for (const node of nodes) {
      if (node.parentElement?.closest(`mark.${HIGHLIGHT_CLASS}`)) return false;
    }

    const document = root.ownerDocument;
    for (const node of nodes) {
      const length = node.nodeValue?.length ?? 0;
      let start = 0;
      let end = length;
      if (node === range.startContainer) start = range.startOffset;
      if (node === range.endContainer) end = range.endOffset;
      if (end <= start) continue;

      const part = document.createRange();
      part.setStart(node, start);
      part.setEnd(node, end);
      const mark = document.createElement("mark");
      mark.className = HIGHLIGHT_CLASS;
      mark.dataset.commentId = commentId;
      mark.tabIndex = 0;
      mark.appendChild(part.extractContents());
      part.insertNode(mark);
    }
    return true;
  } catch {
    return false;
  }
}

function unwrapMarkRange(root: HTMLElement, commentId: string): void {
  for (const mark of [...root.querySelectorAll<HTMLElement>(`mark.${HIGHLIGHT_CLASS}`)]) {
    if (mark.dataset.commentId !== commentId || !mark.parentNode) continue;
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  }
}

function applyCssHighlightRange(range: Range, commentId: string): boolean {
  try {
    if (range.collapsed) return false;
    const highlight = ensureCssHighlight();
    if (!highlight) return false;
    const previous = commentRanges.get(commentId);
    if (previous) highlight.delete(previous);
    highlight.add(range);
    commentRanges.set(commentId, range);
    return true;
  } catch {
    return false;
  }
}

/** 为某条批注应用高亮，自动在 CSS 高亮与 mark 之间选择。 */
export function applyArticleCommentHighlight(root: HTMLElement, range: Range, commentId: string): boolean {
  if (supportsCssCustomHighlight()) return applyCssHighlightRange(range, commentId);
  return wrapMarkRange(root, range, commentId);
}

/** 移除某条批注的高亮。 */
export function removeArticleCommentHighlight(root: HTMLElement, commentId: string): void {
  if (supportsCssCustomHighlight()) {
    const range = commentRanges.get(commentId);
    if (range && cssHighlight) {
      try {
        cssHighlight.delete(range);
      } catch {
        // 忽略已失效的 range
      }
    }
    commentRanges.delete(commentId);
    return;
  }
  unwrapMarkRange(root, commentId);
}

/** 清空当前文章的所有批注高亮（用于路由切换 / 卸载时回收 range）。 */
export function clearArticleCommentHighlights(root: HTMLElement): void {
  if (supportsCssCustomHighlight()) {
    if (cssHighlight) cssHighlight.clear();
    commentRanges.clear();
    return;
  }
  for (const mark of [...root.querySelectorAll<HTMLElement>(`mark.${HIGHLIGHT_CLASS}`)]) {
    if (mark.dataset.commentId) unwrapMarkRange(root, mark.dataset.commentId);
  }
}

/** 取某条批注高亮在视口里的矩形（用于给弹出气泡定位）。 */
export function getArticleCommentRangeRect(commentId: string): DOMRect | null {
  const range = commentRanges.get(commentId);
  if (!range) return null;
  const rect = range.getBoundingClientRect();
  return rect.width === 0 && rect.height === 0 ? null : rect;
}

/**
 * 命中测试：给定视口坐标，返回它落在哪条批注上。
 * CSS 高亮路径下没有 DOM 节点可以 closest，只能用 caretRangeFromPoint 反查。
 */
export function findCommentIdAtPoint(root: HTMLElement, x: number, y: number): string | null {
  if (typeof document === "undefined") return null;
  let node: Node;
  let offset: number;

  if (typeof document.caretRangeFromPoint === "function") {
    const point = document.caretRangeFromPoint(x, y);
    if (!point) return null;
    node = point.startContainer;
    offset = point.startOffset;
  } else if (typeof document.caretPositionFromPoint === "function") {
    const position = document.caretPositionFromPoint(x, y);
    if (!position) return null;
    node = position.offsetNode;
    offset = position.offset;
  } else {
    return null;
  }

  if (!root.contains(node)) return null;
  for (const [commentId, range] of commentRanges) {
    try {
      if (range.isPointInRange(node, offset)) return commentId;
    } catch {
      // 跨根节点的 range 跳过
    }
  }
  return null;
}
