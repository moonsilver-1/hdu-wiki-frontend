"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchHighlight() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) return;

    const article = document.querySelector(".wiki-content");
    if (!article) return;

    const walk = document.createTreeWalker(article, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walk.nextNode())) {
      const idx = node.textContent!.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) continue;

      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + query.length);

      const mark = document.createElement("mark");
      mark.className = "search-highlight";
      range.surroundContents(mark);

    mark.scrollIntoView({ behavior: "smooth", block: "center" });

      setTimeout(() => {
        mark.classList.add("search-highlight-fade");
      }, 3000);

      break;
    }
  }, [query]);

  return null;
}
