"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

interface SearchItem {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
}

const categoryNames: Record<string, string> = {
  courses: "课程",
  campus: "校园",
  tech: "技术",
  community: "社团",
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 把查询拆成关键词，命中的片段用 <mark> 高亮。空查询原样返回。
function highlight(text: string, query: string): ReactNode[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [text];
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  return text.split(pattern).map((part, index) =>
    part && tokens.includes(part.toLowerCase()) ? <mark key={index}>{part}</mark> : part
  );
}

// 计算单篇文章的相关度分数：标题 > 标签 > 摘要 > 正文，用于结果排序。
function scoreItem(item: SearchItem, query: string): number {
  const title = item.title.toLowerCase();
  let score = 0;
  if (title === query) score += 220;
  else if (title.startsWith(query)) score += 160;
  else if (title.includes(query)) score += 100;

  if (item.tags.some((tag) => tag.toLowerCase().includes(query))) score += 60;
  if (item.excerpt.toLowerCase().includes(query)) score += 30;
  if (item.content.toLowerCase().includes(query)) score += 10;
  return score;
}

// 优先展示包含关键词的摘要；摘要没命中就从正文里截一段上下文，让正文搜索也能定位。
function getSnippet(item: SearchItem, query: string): string {
  if (query && item.excerpt.toLowerCase().includes(query)) return item.excerpt;
  if (query) {
    const index = item.content.toLowerCase().indexOf(query);
    if (index !== -1) {
      const start = Math.max(0, index - 30);
      const end = Math.min(item.content.length, index + query.length + 60);
      const window = item.content.slice(start, end).trim();
      return `${start > 0 ? "…" : ""}${window}${end < item.content.length ? "…" : ""}`;
    }
  }
  return item.excerpt;
}

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
      .map((item) => ({ item, score: scoreItem(item, normalizedQuery) }))
      .filter((entry) => entry.score > 0)
      .sort((entryA, entryB) => entryB.score - entryA.score)
      .slice(0, 12)
      .map((entry) => entry.item);
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
            placeholder="搜索标题、摘要、标签或正文"
            aria-label="搜索标题、摘要、标签或正文"
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
                  <strong>{highlight(item.title, query)}</strong>
                  <span>{highlight(getSnippet(item, query.trim().toLowerCase()), query)}</span>
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
