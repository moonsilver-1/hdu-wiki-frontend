import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticleSlugs, getCategoryName } from "@/lib/content";
import Sidebar from "@/components/Sidebar";
import Toc from "@/components/Toc";
import type { Metadata } from "next";

export function generateStaticParams() {
  const categories = ["courses", "campus", "tech", "community"];
  const params: { category: string; slug: string }[] = [];
  for (const cat of categories) {
    for (const slug of getArticleSlugs(cat)) {
      params.push({ category: cat, slug });
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
    description: article.description,
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
    <div className="max-w-7xl mx-auto flex">
      <Sidebar activeCategory={category} />
      <div className="flex-1 min-w-0 px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--color-primary)]">
            首页
          </Link>
          <span className="mx-1">/</span>
          <Link
            href={`/${category}`}
            className="hover:text-[var(--color-primary)]"
          >
            {categoryName}
          </Link>
          <span className="mx-1">/</span>
          <span className="text-[var(--color-foreground)]">{article.title}</span>
        </nav>

        {/* Article */}
        <article className="wiki-content max-w-3xl">
          <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </article>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] max-w-3xl">
            <div className="flex gap-1.5 flex-wrap">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[var(--color-surface)] text-[var(--color-muted)] px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TOC sidebar */}
      <Toc items={article.toc} />
    </div>
  );
}
