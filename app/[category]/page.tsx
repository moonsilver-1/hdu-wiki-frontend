import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryName,
  getArticlesByCategory,
} from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getCategories().map((cat) => ({ category: cat.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  return params.then((p) => ({
    title: getCategoryName(p.category),
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = getCategories();

  if (!categories.find((c) => c.slug === category)) {
    notFound();
  }

  const categoryName = getCategoryName(category);
  const articles = getArticlesByCategory(category);

  return (
    <div className="max-w-7xl mx-auto flex">
      <Sidebar activeCategory={category} />
      <div className="flex-1 min-w-0 px-4 py-8">
        <div className="mb-8">
          <nav className="text-xs text-[var(--color-muted)] mb-2">
            <Link href="/" className="hover:text-[var(--color-primary)]">
              首页
            </Link>
            <span className="mx-1">/</span>
            <span>{categoryName}</span>
          </nav>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-muted)]">
            暂无文章
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/${category}/${article.slug}`}
                className="group block p-5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold group-hover:text-[var(--color-primary)] transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  {article.excerpt}
                </p>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-[var(--color-surface)] text-[var(--color-muted)] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
