import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import {
  getCategories,
  getCategoryName,
  getArticlesByCategory,
  getAuthorSlug,
  splitAuthors,
} from "@/lib/content";
import CategoryIcon from "@/components/CategoryIcon";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

const categoryDescriptions: Record<string, string> = {
  courses: "课程笔记、考试经验与学习资源，帮你更清楚地规划学业。",
  campus: "从食堂宿舍到体育活动，整理每位 HDUer 都会遇到的校园问题。",
  tech: "编程、硬件、AI 与工程实践，从工具入门到完整学习路线。",
  community: "认识校园组织与共建方式，找到志同道合的人。",
};

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  return params.then((resolvedParams) => ({
    title: getCategoryName(resolvedParams.category),
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = getCategories();

  if (!categories.some((item) => item.slug === category)) {
    notFound();
  }

  const categoryName = getCategoryName(category);
  const articles = getArticlesByCategory(category).sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  return (
    <div className="site-container content-layout">
      <Sidebar activeCategory={category} />
      <main className="page-content">
        <nav className="breadcrumb" aria-label="面包屑">
          <Link href="/">首页</Link>
          <span>/</span>
          <span aria-current="page">{categoryName}</span>
        </nav>

        <header className={`category-header category-${category}`}>
          <span className="category-header-icon">
            <CategoryIcon category={category} size={28} />
          </span>
          <div>
            <span className="section-kicker">知识分类</span>
            <h1>{categoryName}</h1>
            <p>{categoryDescriptions[category]}</p>
          </div>
          <strong>{articles.length} 篇</strong>
        </header>

        {articles.length === 0 ? (
          <div className="empty-state">暂无文章</div>
        ) : (
          <div className="category-article-grid">
            {articles.map((article) => (
              <article
                key={article.slug}
                className={`category-article-card category-${category}`}
              >
                <Link
                  href={`/${category}/${article.slug}`}
                  className="category-article-hit-area"
                  aria-label={`阅读：${article.title}`}
                  tabIndex={-1}
                />
                <div className="category-article-topline">
                  {article.date ? (
                    <span><CalendarDays aria-hidden="true" size={15} />{article.date}</span>
                  ) : null}
                  {article.author ? (
                    <span><UserRound aria-hidden="true" size={15} />{splitAuthors(article.author).map((author, index) => (
                      <span key={author}>
                        {index > 0 ? ", " : null}
                        <Link href={`/authors/${encodeURIComponent(getAuthorSlug(author))}`}>{author}</Link>
                      </span>
                    ))}</span>
                  ) : null}
                </div>
                <h2><Link href={`/${category}/${article.slug}`}>{article.title}</Link></h2>
                <p>{article.excerpt}</p>
                <div className="category-article-footer">
                  <div className="tag-list">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <Link
                    href={`/${category}/${article.slug}`}
                    className="category-article-arrow"
                    aria-label={`阅读：${article.title}`}
                  >
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
