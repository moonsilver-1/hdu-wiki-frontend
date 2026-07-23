"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SearchItem {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string[];
}

const categoryNames: Record<string, string> = {
  courses: "课程",
  campus: "校园",
  tech: "技术",
  community: "社团",
};

export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [allData, setAllData] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open || allData.length > 0) return;

    const controller = new AbortController();
    fetch("/api/search", { signal: controller.signal })
      .then((response) => response.json())
      .then(setAllData)
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Search index failed to load", error);
        }
      });
    return () => controller.abort();
  }, [open, allData.length]);

  useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return allData
      .filter(
        (item) =>
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.excerpt.toLowerCase().includes(normalizedQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      )
      .slice(0, 8);
  }, [query, allData]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && results.length > 0) {
        const firstResult = results[0];
        router.push(
          `/${firstResult.category}/${firstResult.slug}?q=${encodeURIComponent(query.trim())}`
        );
        onClose();
      }
    },
    [onClose, query, results, router]
  );

  if (!open) return null;

  const visibleItems = query.trim() ? results : allData.slice(0, 5);

  return (
    <div className="search-dialog-shell" role="dialog" aria-modal="true" aria-label="搜索 Wiki">
      <button className="search-dialog-backdrop" onClick={onClose} aria-label="关闭搜索" />
      <div className="search-dialog-panel">
        <div className="search-dialog-input-row">
          <Search aria-hidden="true" size={20} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索标题、摘要或标签"
            aria-label="搜索标题、摘要或标签"
          />
          <button type="button" onClick={onClose} className="dialog-close" aria-label="关闭搜索">
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <div className="search-results-heading">
          <span>{query.trim() ? "搜索结果" : "最近收录"}</span>
          {query.trim() ? <span>{results.length} 条</span> : null}
        </div>

        <div className="search-results">
          {query.trim() && results.length === 0 ? (
            <div className="search-empty">未找到相关内容</div>
          ) : (
            visibleItems.map((item) => (
              <Link
                key={`${item.category}-${item.slug}`}
                href={`/${item.category}/${item.slug}?q=${encodeURIComponent(query.trim())}`}
                onClick={onClose}
                className="search-result"
              >
                <span className={`search-result-category category-${item.category}`}>
                  {categoryNames[item.category] ?? item.category}
                </span>
                <span className="search-result-copy">
                  <strong>{item.title}</strong>
                  <span>{item.excerpt}</span>
                </span>
                <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
