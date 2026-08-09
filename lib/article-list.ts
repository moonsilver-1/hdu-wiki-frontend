export const INITIAL_ARTICLE_COUNT = 6;
export const ARTICLE_PAGE_SIZE = 6;

/** Return the number of cards that should be visible on the first render. */
export function getInitialArticleCount(total: number): number {
  return Math.min(Math.max(total, 0), INITIAL_ARTICLE_COUNT);
}

/** Increase the visible window without ever exceeding the available articles. */
export function getNextArticleCount(current: number, total: number): number {
  const safeTotal = Math.max(total, 0);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  return Math.min(safeTotal, safeCurrent + ARTICLE_PAGE_SIZE);
}
