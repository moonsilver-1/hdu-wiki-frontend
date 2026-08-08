import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { getAdjacentArticles, getArticle, getArticleSlugs, getAuthorSlug, getCategoryName, splitAuthors } from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import Toc from "@/components/Toc";
import SearchHighlight from "@/components/SearchHighlight";
import ArticleKeyboardNav from "@/components/ArticleKeyboardNav";
import type { Metadata } from "next";

export function generateStaticParams() {
  const categories = ["courses", "campus", "tech", "community"];
  const params: { category: string; slug: string }[] = [];
  for (const category of categories) {
    for (const slug of getArticleSlugs(category)) {
      params.push({ category, slug });
    }
  }
  return params;
}

// Next.js App Router 对动态路由参数不做百分号解码：中文 slug 在 URL 里被编码成
// %E6%9C%80... 后，params.slug 拿到的是编码后的字符串，直接查文件会 404。
// 这里统一解码一次，保证无论 slug 是否含中文都能正确匹配文件。
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticle(category, decodeSlug(slug));
  if (!article) return { title: "未找到" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/${category}/${decodeSlug(slug)}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: `/${category}/${decodeSlug(slug)}`,
      publishedTime: article.date || undefined,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const decodedSlug = decodeSlug(slug);
  const article = await getArticle(category, decodedSlug);

  if (!article) notFound();

  const categoryName = getCategoryName(category);
  const { previous, next } = getAdjacentArticles(category, decodedSlug);

  return (
    <div className="site-container content-layout article-layout">
      <Sidebar activeCategory={category} activeSlug={decodedSlug} />
      <main className="article-page-content">
        <nav className="breadcrumb" aria-label="面包屑">
          <Link href="/">首页</Link>
          <span>/</span>
          <Link href={`/${category}`}>{categoryName}</Link>
          <span>/</span>
          <span aria-current="page">{article.title}</span>
        </nav>

        <header className={`article-header category-${category}`}>
          <Link href={`/${category}`} className={`article-category-label${article.featured ? " article-featured-label" : ""}`}>
            {article.featured ? "必读文章" : categoryName}
          </Link>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta">
            {article.author ? (
              <span><UserRound aria-hidden="true" size={16} />{splitAuthors(article.author).map((author, index) => (
                <span key={author}>
                  {index > 0 ? ", " : null}
                  <Link href={`/authors/${encodeURIComponent(getAuthorSlug(author))}`}>{author}</Link>
                </span>
              ))}</span>
            ) : null}
            {article.date ? (
              <time dateTime={article.date}>
                <CalendarDays aria-hidden="true" size={16} />{article.date}
              </time>
            ) : null}
          </div>
        </header>

        <article className="wiki-content">
          <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
          <Suspense><SearchHighlight /></Suspense>
        </article>

        {article.tags.length > 0 ? (
          <footer className="article-tags">
            <span>相关标签</span>
            <div className="tag-list">
              {article.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </footer>
        ) : null}

        {(previous || next) ? (
          <nav className="article-pagination" aria-label="文章导航">
            {previous ? (
              <Link href={`/${category}/${previous.slug}`} prefetch={false} className="article-pagination-link article-pagination-previous">
                <ChevronLeft aria-hidden="true" size={18} />
                <span><small>上一篇 <kbd aria-hidden="true">←</kbd></small>{previous.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/${category}/${next.slug}`} prefetch={false} className="article-pagination-link article-pagination-next">
                <span><small>下一篇 <kbd aria-hidden="true">→</kbd></small>{next.title}</span>
                <ChevronRight aria-hidden="true" size={18} />
              </Link>
            ) : <span />}
          </nav>
        ) : null}

        <ArticleKeyboardNav
          previousHref={previous ? `/${category}/${previous.slug}` : null}
          nextHref={next ? `/${category}/${next.slug}` : null}
        />
      </main>
      <Toc items={article.toc} />
    </div>
  );
}
