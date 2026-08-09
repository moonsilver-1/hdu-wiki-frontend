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

export function rangeTouchesArticleComment(root: HTMLElement, range: Range): boolean {
  return [...root.querySelectorAll<HTMLElement>("mark.article-comment-highlight")]
    .some((mark) => range.intersectsNode(mark));
}

export function wrapArticleCommentRange(root: HTMLElement, range: Range, commentId: string): boolean {
  const nodes = articleTextNodes(root).filter((node) => {
    try {
      return range.intersectsNode(node);
    } catch {
      return false;
    }
  });
  if (nodes.length === 0 || rangeTouchesArticleComment(root, range)) return false;

  for (const node of nodes) {
    if (node.parentElement?.closest("mark.article-comment-highlight")) return false;
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
    mark.className = "article-comment-highlight";
    mark.dataset.commentId = commentId;
    mark.tabIndex = 0;
    mark.appendChild(part.extractContents());
    part.insertNode(mark);
  }
  return true;
}

export function removeArticleCommentHighlights(root: HTMLElement, commentId: string): void {
  for (const mark of [...root.querySelectorAll<HTMLElement>("mark.article-comment-highlight")]) {
    if (mark.dataset.commentId !== commentId || !mark.parentNode) continue;
    const parent = mark.parentNode;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
  }
}
