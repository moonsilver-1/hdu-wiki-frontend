import Link from "next/link";
import {
  getCategories,
  getArticlesByCategory,
  getCategoryName,
} from "@/lib/content";

export default function Sidebar({ activeCategory }: { activeCategory?: string }) {
  const categories = getCategories();

  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <nav className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto sidebar-scroll py-6 pr-4">
        {categories.map((cat) => {
          const articles = getArticlesByCategory(cat.slug);
          const isActive = activeCategory === cat.slug;

          return (
            <div key={cat.slug} className="mb-4">
              <Link
                href={`/${cat.slug}`}
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {cat.name}
              </Link>
              {isActive && articles.length > 0 && (
                <div className="ml-3 mt-1 space-y-0.5">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/${cat.slug}/${article.slug}`}
                      className="block px-3 py-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] truncate"
                    >
                      {article.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
