"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface SearchResult {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  snippet: string;
  tags: string[];
  date: string;
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

function highlight(text: string, query: string): ReactNode[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [text];
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  return text.split(pattern).map((part, index) =>
    part && tokens.includes(part.toLowerCase()) ? <mark key={index}>{part}</mark> : part
  );
}

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      const normalized = query.trim();
      if (normalized.length > 80) {
        setResults([]);
        setError("搜索词不能超过 80 个字符");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalized)}&limit=12`, { signal: controller.signal });
        const data = (await response.json()) as { results?: SearchResult[]; error?: string };
        if (!response.ok) throw new Error(data.error ?? "搜索失败");
        setResults(data.results ?? []);
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === "AbortError") return;
        setError(requestError instanceof Error ? requestError.message : "搜索失败");
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 200);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [open, query]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && results.length > 0) {
      const firstResult = results[0];
      router.push(`/${firstResult.category}/${firstResult.slug}?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  }, [onClose, query, results, router]);

  if (!open) return null;

  return (
    <div className="search-dialog-shell" role="dialog" aria-modal="true" aria-label="搜索 Wiki">
      <button className="search-dialog-backdrop" onClick={onClose} aria-label="关闭搜索" />
      <div className="search-dialog-panel">
        <div className="search-dialog-input-row">
          <Search aria-hidden="true" size={20} />
          <input ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleKeyDown} placeholder="搜索标题、摘要、标签或正文" aria-label="搜索标题、摘要、标签或正文" />
          <button type="button" onClick={onClose} className="dialog-close" aria-label="关闭搜索"><X aria-hidden="true" size={18} /></button>
        </div>
        <div className="search-results-heading"><span>{query.trim() ? "搜索结果" : "最近收录"}</span>{loading ? <span>搜索中…</span> : query.trim() ? <span>{results.length} 条</span> : null}</div>
        <div className="search-results">
          {error ? <div className="search-empty">{error}</div> : !loading && results.length === 0 ? <div className="search-empty">未找到相关内容</div> : results.map((item) => (
            <Link key={`${item.category}-${item.slug}`} href={`/${item.category}/${item.slug}?q=${encodeURIComponent(query.trim())}`} onClick={onClose} className="search-result">
              <span className={`search-result-category category-${item.category}`}>{categoryNames[item.category] ?? item.category}</span>
              <span className="search-result-copy"><strong>{highlight(item.title, query)}</strong><span>{highlight(item.snippet || item.excerpt, query)}</span></span>
              <ArrowUpRight aria-hidden="true" size={17} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
