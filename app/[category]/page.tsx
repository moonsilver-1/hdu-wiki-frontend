import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticlesByCategory,
  getCategories,
  getCategoryName,
  getSectionName,
  sortArticles,
  type ArticleMeta,
} from "@/lib/content";
import CategoryIcon from "@/components/CategoryIcon";
import CategoryArticleCard from "@/components/CategoryArticleCard";
import Sidebar from "@/components/Sidebar";

const categoryDescriptions: Record<string, string> = {
  courses: "课程笔记、考试经验与学习资源，帮你更清楚地规划学业。",
  campus: "从食堂宿舍到校园活动，整理每位HDUer都会遇到的校园问题。",
  tech: "编程、硬件、AI与工程实践，从工具入门到完整学习路线。",
  community: "认识校园组织与共建方式，找到志同道合的人。",
};

const sectionOrder = ["fundamentals", "deep-learning"];

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

function groupArticles(articles: ArticleMeta[]) {
  const groups = new Map<string, ArticleMeta[]>();
  for (const article of articles) {
    const current = groups.get(article.section) ?? [];
    current.push(article);
    groups.set(article.section, current);
  }

  return [...groups.entries()].map(([section, sectionArticles]) => [
    section,
    sortArticles(sectionArticles),
  ] as [string, ArticleMeta[]]).sort(([sectionA], [sectionB]) => {
    const orderA = sectionOrder.indexOf(sectionA);
    const orderB = sectionOrder.indexOf(sectionB);
    if (orderA !== -1 || orderB !== -1) {
      return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
    }
    return getSectionName(sectionA).localeCompare(getSectionName(sectionB), "zh-CN");
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = getCategories();
  if (!categories.some((item) => item.slug === category)) notFound();

  const categoryName = getCategoryName(category);
  const articles = getArticlesByCategory(category);
  const groups = groupArticles(articles);

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
          <strong>{articles.length}篇</strong>
        </header>

        {groups.length === 0 ? (
          <div className="empty-state">暂无文章</div>
        ) : (
          <div className="category-section-grid">
            {groups.map(([section, sectionArticles]) => (
              <details key={section} className="category-section-group">
                <summary>
                  <span>{getSectionName(section)}</span>
                  <small>{sectionArticles.length}篇文章</small>
                </summary>
                <div className="category-article-grid category-section-articles">
                  {sectionArticles.map((article) => (
                    <CategoryArticleCard
                      key={article.slug}
                      article={article}
                      category={category}
                    />
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
