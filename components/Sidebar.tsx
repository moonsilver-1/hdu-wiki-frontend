import Link from "next/link";
import { TerminalSquare } from "lucide-react";
import { getCategories, getArticlesByCategory } from "@/lib/content";
import CategoryIcon from "./CategoryIcon";

export default function Sidebar({
  activeCategory,
  activeSlug,
}: {
  activeCategory?: string;
  activeSlug?: string;
}) {
  const categories = getCategories();

  return (
    <aside className="wiki-sidebar">
      <nav className="wiki-sidebar-inner" aria-label="知识分类">
        <span className="sidebar-label">知识分类</span>
        {categories.map((category) => {
          const articles = getArticlesByCategory(category.slug);
          const isActive = activeCategory === category.slug;

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
                  {articles.map((article) => (
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
              ) : null}
            </div>
          );
        })}
        <Link href="/vim" className="sidebar-vim-link">
          <TerminalSquare aria-hidden="true" size={17} />
          Vim 阅读模式
        </Link>
      </nav>
    </aside>
  );
}
