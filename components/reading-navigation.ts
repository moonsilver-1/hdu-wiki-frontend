export interface ReadingTocItem {
  id: string;
  text: string;
  level: number;
}

export interface ReadingTocItemWithParent extends ReadingTocItem {
  parentText?: string;
}

export function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function decorateReadingToc(items: ReadingTocItem[]): ReadingTocItemWithParent[] {
  let parentText: string | undefined;

  return items.map((item) => {
    if (item.level === 2) {
      parentText = item.text;
      return { ...item };
    }

    return { ...item, parentText };
  });
}

export function nearestReadingTocIndex(ratios: number[], target: number): number {
  if (ratios.length === 0) return -1;

  const normalizedTarget = clampRatio(target);
  let nearestIndex = 0;
  let nearestDistance = Math.abs(ratios[0] - normalizedTarget);

  for (let index = 1; index < ratios.length; index += 1) {
    const distance = Math.abs(ratios[index] - normalizedTarget);
    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  }

  return nearestIndex;
}

export function getReadingProgress(
  scrollY: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number
): number {
  if (!Number.isFinite(articleHeight) || articleHeight <= 0) return 0;
  if (scrollY <= articleTop) return 0;
  if (articleHeight <= viewportHeight) return scrollY + viewportHeight >= articleTop + articleHeight ? 1 : 0;

  const readingOffset = Math.min(300, Math.max(120, viewportHeight * 0.35));
  const readingLine = scrollY + readingOffset;
  const endLine = articleTop + articleHeight - readingOffset;

  if (scrollY + viewportHeight >= articleTop + articleHeight - 2) return 1;
  return clampRatio((readingLine - articleTop) / Math.max(1, endLine - articleTop));
}
