import Link from "next/link";
import { BookOpenCheck, TerminalSquare } from "lucide-react";
import {
  getArticlesByCategory,
  getCategories,
  getFeaturedArticles,
  groupArticlesBySeries,
  type ArticleSectionNode,
} from "@/lib/content";
import CategoryIcon from "./CategoryIcon";
import SidebarActiveArticle from "./SidebarActiveArticle";

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
        <SidebarActiveArticle slug={activeSlug} />
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
                    prefetch={false}
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
          const groups = groupArticlesBySeries(articles);

          const renderSection = (sectionNode: ArticleSectionNode) => {
            const sectionActive = sectionNode.articles.some((a) => a.slug === activeSlug)
              || sectionNode.subgroups.some((g) => g.articles.some((a) => a.slug === activeSlug));

            if (sectionNode.subgroups.length > 0) {
              return (
                <details
                  key={sectionNode.key}
                  className="sidebar-section-group sidebar-course-group"
                  open={sectionActive}
                >
                  <summary>
                    <span>{sectionNode.label}</span>
                    <small>{sectionNode.subgroups.reduce((n, g) => n + g.articles.length, 0)}</small>
                  </summary>
                  <div className="sidebar-section-volumes">
                    {sectionNode.subgroups.map((group) => (
                      <details
                        key={group.key}
                        className="sidebar-volume-group"
                        open={group.articles.some((a) => a.slug === activeSlug)}
                      >
                        <summary>
                          <span>{group.label}</span>
                          <small>{group.articles.length}</small>
                        </summary>
                        <div className="sidebar-section-articles">
                          {group.articles.map((article) => (
                            <Link
                              key={article.slug}
                              href={`/${category.slug}/${article.slug}`}
                              prefetch={false}
                              data-sidebar-article={article.slug}
                              className={article.slug === activeSlug ? "is-current" : ""}
                              aria-current={article.slug === activeSlug ? "page" : undefined}
                            >
                              {article.title}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              );
            }

            return (
              <details
                key={sectionNode.key}
                className="sidebar-section-group"
                open={sectionActive}
              >
                <summary>
                  <span>{sectionNode.label}</span>
                  <small>{sectionNode.articles.length}</small>
                </summary>
                <div className="sidebar-section-articles">
                  {sectionNode.articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/${category.slug}/${article.slug}`}
                      prefetch={false}
                      data-sidebar-article={article.slug}
                      className={article.slug === activeSlug ? "is-current" : ""}
                      aria-current={article.slug === activeSlug ? "page" : undefined}
                    >
                      {article.title}
                    </Link>
                  ))}
                </div>
              </details>
            );
          };

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
                  {groups.map((group) => group.isSeries ? (
                    <details key={group.key} className="sidebar-course-group" open>
                      <summary>
                        <span>{group.label}</span>
                        <small>{group.sections.reduce((count, section) => count + (section.subgroups.length > 0
                          ? section.subgroups.reduce((n, volume) => n + volume.articles.length, 0)
                          : section.articles.length), 0)}</small>
                      </summary>
                      <div className="sidebar-section-volumes">
                        {group.sections.map(renderSection)}
                      </div>
                    </details>
                  ) : renderSection(group.sections[0]))}
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
