"use client";

import { useLayoutEffect } from "react";

export default function SidebarActiveArticle({ slug }: { slug?: string }) {
  useLayoutEffect(() => {
    if (!slug) return;

    const activeArticle = document.querySelector<HTMLElement>(
      `[data-sidebar-article="${CSS.escape(slug)}"]`
    );
    const sidebar = activeArticle?.closest<HTMLElement>(".wiki-sidebar-inner");
    if (!activeArticle || !sidebar) return;

    const sidebarBounds = sidebar.getBoundingClientRect();
    const articleBounds = activeArticle.getBoundingClientRect();
    const isFullyVisible =
      articleBounds.top >= sidebarBounds.top && articleBounds.bottom <= sidebarBounds.bottom;
    if (isFullyVisible) return;

    sidebar.scrollTo({
      top: sidebar.scrollTop + articleBounds.top - sidebarBounds.top - sidebar.clientHeight / 2 + articleBounds.height / 2,
    });
  }, [slug]);

  return null;
}
