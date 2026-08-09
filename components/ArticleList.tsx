"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ArticleMeta } from "@/lib/content";
import {
  ARTICLE_PAGE_SIZE,
  getInitialArticleCount,
  getNextArticleCount,
} from "@/lib/article-list";

function splitAuthors(value: string): string[] {
  return value
    .split(/[,，、]/)
    .map((author) => author.trim())
    .filter(Boolean);
}

function getAuthorSlug(name: string): string {
  return name
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function ArticleCard({
  article,
  categoryName,
}: {
  article: ArticleMeta;
  categoryName: string;
}) {
  const authors = splitAuthors(article.author);

  return (
    <article className={`article-card category-${article.category}`}>
      <Link
        href={`/${article.category}/${article.slug}`}
        className="article-card-hit-area"
        aria-label={`阅读：${article.title}`}
        tabIndex={-1}
      />
      <div className="article-card-topline">
        <span className="article-category">{categoryName}</span>
        {article.date ? <time dateTime={article.date}>{article.date}</time> : null}
      </div>
      <h3><Link href={`/${article.category}/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.excerpt}</p>
      <div className="article-card-footer">
        <span className="article-authors">
          {(authors.length ? authors : ["HDU Wiki"]).map((author, index) => (
            <span key={author}>
              {index > 0 ? ", " : null}
              <Link href={`/authors/${encodeURIComponent(getAuthorSlug(author))}`}>{author}</Link>
            </span>
          ))}
        </span>
        <Link
          href={`/${article.category}/${article.slug}`}
          className="article-card-arrow"
          aria-label={`阅读：${article.title}`}
        >
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}

export default function ArticleList({
  articles,
  categoryNames,
}: {
  articles: ArticleMeta[];
  categoryNames: Record<string, string>;
}) {
  const [visibleCount, setVisibleCount] = useState(() => getInitialArticleCount(articles.length));
  const visibleArticles = articles.slice(0, visibleCount);
  const remainingCount = Math.max(articles.length - visibleCount, 0);

  return (
    <>
      <div className="article-grid" id="article-list" data-list-mode="progressive">
        {visibleArticles.map((article) => (
          <ArticleCard
            key={`${article.category}-${article.slug}`}
            article={article}
            categoryName={categoryNames[article.category] ?? article.category}
          />
        ))}
      </div>

      {articles.length > 0 ? (
        <div className="recent-tools article-list-controls">
          <span className="section-link article-list-count" aria-live="polite">
            已显示 {visibleArticles.length} / {articles.length} 篇
          </span>
          {remainingCount > 0 ? (
            <button
              type="button"
              className="button button-light article-load-more"
              aria-controls="article-list"
              onClick={() => setVisibleCount((current) => getNextArticleCount(current, articles.length))}
            >
              <span>加载更多</span>
              <small>再看 {Math.min(ARTICLE_PAGE_SIZE, remainingCount)} 篇</small>
              <ChevronDown aria-hidden="true" size={16} />
            </button>
          ) : (
            <span className="section-link article-list-complete">已经全部显示</span>
          )}
        </div>
      ) : null}
    </>
  );
}
