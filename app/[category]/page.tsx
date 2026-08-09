import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticlesByCategory,
  getCategories,
  getCategoryName,
  groupArticlesBySeries,
  type ArticleSectionNode,
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
  if (!categories.some((item) => item.slug === category)) notFound();

  const categoryName = getCategoryName(category);
  const articles = getArticlesByCategory(category);
  const groups = groupArticlesBySeries(articles);

  const renderSection = (sectionNode: ArticleSectionNode) => (
    <details key={sectionNode.key} className="category-section-group">
      <summary>
        <span>{sectionNode.label}</span>
        <small>
          {(sectionNode.subgroups.length > 0
            ? sectionNode.subgroups.reduce((n, g) => n + g.articles.length, 0)
            : sectionNode.articles.length
          ) + "篇文章"}
        </small>
      </summary>
      {sectionNode.subgroups.length > 0 ? (
        <div className="category-volume-grid">
          {sectionNode.subgroups.map((group) => (
            <details key={group.key} className="category-volume-group">
              <summary>
                <span>{group.label}</span>
                <small>{group.articles.length}篇</small>
              </summary>
              <div className="category-article-grid category-section-articles">
                {group.articles.map((article) => (
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
      ) : (
        <div className="category-article-grid category-section-articles">
          {sectionNode.articles.map((article) => (
            <CategoryArticleCard
              key={article.slug}
              article={article}
              category={category}
            />
          ))}
        </div>
      )}
    </details>
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
          <strong>{articles.length}篇</strong>
        </header>

        {groups.length === 0 ? (
          <div className="empty-state">暂无文章</div>
        ) : (
          <div className="category-section-grid">
            {groups.map((group) => group.isSeries ? (
              <details key={group.key} className="category-series-group" open>
                <summary>
                  <span>{group.label}</span>
                  <small>{group.sections.reduce((count, section) => count + (section.subgroups.length > 0
                    ? section.subgroups.reduce((n, volume) => n + volume.articles.length, 0)
                    : section.articles.length), 0)}篇文章</small>
                </summary>
                <div className="category-series-sections">
                  {group.sections.map(renderSection)}
                </div>
              </details>
            ) : renderSection(group.sections[0]))}
          </div>
        )}
      </main>
    </div>
  );
}
