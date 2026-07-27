import Link from "next/link";
import { BookOpenCheck, TerminalSquare } from "lucide-react";
import {
  getArticlesByCategory,
  getCategories,
  getFeaturedArticles,
  getSectionName,
  sortArticles,
  type ArticleMeta,
} from "@/lib/content";
import CategoryIcon from "./CategoryIcon";

const sectionOrder = ["fundamentals", "deep-learning"];

export default function Sidebar({
  activeCategory,
  activeSlug,
}: {
  activeCategory?: string;
  activeSlug?: string;
}) {
  const categories = getCategories();
  const featuredArticles = getFeaturedArticles();

  return (
    <aside className="wiki-sidebar">
      <nav className="wiki-sidebar-inner" aria-label="知识分类">
        {featuredArticles.length > 0 ? (
          <div className="sidebar-group sidebar-featured-group">
            <details className="sidebar-featured-details" open>
              <summary className="sidebar-category sidebar-featured-category">
                <BookOpenCheck aria-hidden="true" size={18} />
                <span>必读文章</span>
                <small>{featuredArticles.length}</small>
              </summary>
              <div className="sidebar-articles sidebar-featured-articles">
                {featuredArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${article.category}/${article.slug}`}
                    className={article.slug === activeSlug ? "is-current" : ""}
                    aria-current={article.slug === activeSlug ? "page" : undefined}
                  >
                    {article.title}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        ) : null}

        {categories.map((category) => {
          const articles = getArticlesByCategory(category.slug);
          const isActive = activeCategory === category.slug;
          const sectionArticles = new Map<string, ArticleMeta[]>();

          for (const article of articles) {
            const current = sectionArticles.get(article.section) ?? [];
            current.push(article);
            sectionArticles.set(article.section, current);
          }

          const sections = [...sectionArticles.entries()].sort(([sectionA], [sectionB]) => {
            const orderA = sectionOrder.indexOf(sectionA);
            const orderB = sectionOrder.indexOf(sectionB);
            if (orderA !== -1 || orderB !== -1) {
              return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
            }
            return getSectionName(sectionA).localeCompare(getSectionName(sectionB), "zh-CN");
          });

          return (
            <div key={category.slug} className="sidebar-group">
              <Link
                href={`/${category.slug}`}
                className={`sidebar-category category-${category.slug} ${isActive ? "is-active" : ""}`}
              >
                <CategoryIcon category={category.slug} size={18} />
                <span>{category.name}</span>
                <small>{articles.length}</small>
              </Link>
              {isActive && articles.length > 0 ? (
                <div className="sidebar-articles">
                  {sections.map(([section, sectionItems]) => {
                    const sortedItems = sortArticles(sectionItems);
                    return (
                      <details
                        key={section}
                        className="sidebar-section-group"
                        open={sortedItems.some((article) => article.slug === activeSlug)}
                      >
                        <summary>
                          <span>{getSectionName(section)}</span>
                          <small>{sortedItems.length}</small>
                        </summary>
                        <div className="sidebar-section-articles">
                          {sortedItems.map((article) => (
                            <Link
                              key={article.slug}
                              href={`/${category.slug}/${article.slug}`}
                              className={article.slug === activeSlug ? "is-current" : ""}
                              aria-current={article.slug === activeSlug ? "page" : undefined}
                            >
                              {article.title}
                            </Link>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
        <Link href="/vim" className="sidebar-vim-link">
          <TerminalSquare aria-hidden="true" size={17} />
          Vim阅读模式
        </Link>
      </nav>
    </aside>
  );
}
