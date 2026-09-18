import Link from "next/link";
import type { ArticleMeta } from "@/lib/content";

// 分类页折叠组内的文章条目：只放标题 + 日期，保持列表紧凑。
// （旧的日期/作者/摘要/标签重卡片已废弃。）
export default function CategoryArticleRow({
  article,
  category,
}: {
  article: ArticleMeta;
  category: string;
}) {
  return (
    <Link
      href={`/${category}/${article.slug}`}
      prefetch={false}
      className={`category-article-row category-${category}`}
    >
      <span className="category-article-row-title">{article.title}</span>
      {article.date ? <time dateTime={article.date}>{article.date}</time> : null}
    </Link>
  );
}
