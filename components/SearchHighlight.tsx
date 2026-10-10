"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchHighlight() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    const normalizedQuery = query?.trim().slice(0, 80) ?? "";
    if (!normalizedQuery) return;

    const article = document.querySelector(".wiki-content");
    if (!article) return;

    const lowerQuery = normalizedQuery.toLowerCase();
    const walk = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    let mark: HTMLElement | null = null;
    let fadeTimer: number | undefined;
    while ((node = walk.nextNode())) {
      const text = node.textContent ?? "";
      const idx = text.toLowerCase().indexOf(lowerQuery);
      if (idx === -1) continue;
      const end = idx + normalizedQuery.length;
      // Unicode case folding can change string length; never create an invalid DOM range.
      if (end > text.length) continue;

      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, end);

      mark = document.createElement("mark");
      mark.className = "search-highlight";
      range.surroundContents(mark);

      mark.scrollIntoView({ behavior: "smooth", block: "center" });

      fadeTimer = window.setTimeout(() => {
        mark?.classList.add("search-highlight-fade");
      }, 3000);

      break;
    }

    return () => {
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      if (!mark?.parentNode) return;
      const parent = mark.parentNode;
      while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
      parent.removeChild(mark);
    };
  }, [query]);

  return null;
}
