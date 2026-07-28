import Link from "next/link";
import { ArrowUpRight, CalendarDays, UserRound } from "lucide-react";
import { getAuthorSlug, splitAuthors, type ArticleMeta } from "@/lib/content";

export default function CategoryArticleCard({
  article,
  category,
}: {
  article: ArticleMeta;
  category: string;
}) {
  return (
    <article className={`category-article-card category-${category}`}>
      <Link
        href={`/${category}/${article.slug}`}
        prefetch={false}
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
      <h2><Link href={`/${category}/${article.slug}`} prefetch={false}>{article.title}</Link></h2>
      <p>{article.excerpt}</p>
      <div className="category-article-footer">
        <div className="tag-list">
          {article.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <Link
          href={`/${category}/${article.slug}`}
          prefetch={false}
          className="category-article-arrow"
          aria-label={`阅读：${article.title}`}
        >
          <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </article>
  );
}
