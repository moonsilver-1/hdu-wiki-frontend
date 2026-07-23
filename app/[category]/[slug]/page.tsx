import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import { getArticle, getArticleSlugs, getCategoryName } from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import Toc from "@/components/Toc";
import SearchHighlight from "@/components/SearchHighlight";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);
  if (!article) return { title: "未找到" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);

  if (!article) notFound();

  const categoryName = getCategoryName(category);

  return (
    <div className="site-container content-layout article-layout">
      <Sidebar activeCategory={category} activeSlug={slug} />
      <main className="article-page-content">
        <nav className="breadcrumb" aria-label="面包屑">
          <Link href="/">首页</Link>
          <span>/</span>
          <Link href={`/${category}`}>{categoryName}</Link>
          <span>/</span>
          <span aria-current="page">{article.title}</span>
        </nav>

        <header className={`article-header category-${category}`}>
          <Link href={`/${category}`} className="article-category-label">
            {categoryName}
          </Link>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <div className="article-meta">
            {article.author ? (
              <span><UserRound aria-hidden="true" size={16} />{article.author}</span>
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
      </main>
      <Toc items={article.toc} />
    </div>
  );
}
