"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import SearchDialog from "./SearchDialog";

type SearchButtonProps = {
  variant?: "compact" | "hero";
  listenForShortcut?: boolean;
};

export default function SearchButton({
  variant = "compact",
  listenForShortcut = true,
}: SearchButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!listenForShortcut) return;

    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [listenForShortcut]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`search-button search-button-${variant}`}
        aria-label="搜索 Wiki 内容"
      >
        <Search aria-hidden="true" size={variant === "hero" ? 21 : 17} />
        <span>{variant === "hero" ? "搜索文章、课程、生活指南..." : "搜索"}</span>
        {variant === "hero" ? <span className="search-submit">开始探索</span> : null}
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
