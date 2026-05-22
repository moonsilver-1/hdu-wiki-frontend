"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchItem {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string[];
}

export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [allData, setAllData] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && allData.length === 0) {
      fetch("/api/search").then((r) => r.json()).then(setAllData);
    }
  }, [open, allData.length]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    );
    setResults(filtered.slice(0, 10));
  }, [query, allData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && results.length > 0) {
        router.push(`/${results[0].category}/${results[0].slug}?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    },
    [results, router, onClose]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--color-background)] rounded-xl shadow-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center px-4 border-b border-[var(--color-border)]">
          <svg
            className="w-4 h-4 text-[var(--color-muted)] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索 wiki 内容..."
            className="flex-1 px-3 py-3 text-sm outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-block text-xs text-[var(--color-muted)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded border border-[var(--color-border)]">
            ESC
          </kbd>
        </div>
        {query.trim() && (
          <div className="max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
                未找到相关内容
              </div>
            ) : (
              results.map((item) => (
                <Link
                  key={`${item.category}-${item.slug}`}
                  href={`/${item.category}/${item.slug}?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="block px-4 py-3 hover:bg-[var(--color-surface)] transition-colors border-b border-[var(--color-border)] last:border-b-0"
                >
                  <div className="text-sm font-medium text-[var(--color-foreground)]">
                    {item.title}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mt-0.5">
                    {item.excerpt}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <span className="text-xs text-[var(--color-primary)] bg-[var(--color-primary-light)] px-1.5 py-0.5 rounded">
                      {item.category === "courses"
                        ? "课程"
                        : item.category === "campus"
                        ? "校园"
                        : item.category === "tech"
                        ? "技术"
                        : "社团"}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
