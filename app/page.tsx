import Link from "next/link";
import { getAllArticles, getCategories, getArticlesByCategory } from "@/lib/content";
import SearchButton from "@/components/SearchButton";

const categoryInfo: Record<string, { icon: string; desc: string }> = {
  courses: {
    icon: "📚",
    desc: "课程笔记、考试经验、学习资源",
  },
  campus: {
    icon: "🏫",
    desc: "食堂攻略、宿舍指南、校园设施",
  },
  tech: {
    icon: "💻",
    desc: "编程教程、竞赛指南、项目经验",
  },
  community: {
    icon: "🎯",
    desc: "社团介绍、学生组织、校园活动",
  },
};

export default function Home() {
  const categories = getCategories();
  const allArticles = getAllArticles();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-[var(--color-primary)]">HDU</span> Wiki
        </h1>
        <p className="text-[var(--color-muted)] text-lg mb-6">
          杭州电子科技大学校园百科
        </p>
        <SearchButton />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {categories.map((cat) => {
          const info = categoryInfo[cat.slug];
          const articles = getArticlesByCategory(cat.slug);
          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group block p-5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{info.icon}</div>
              <h2 className="font-semibold text-sm group-hover:text-[var(--color-primary)] transition-colors">
                {cat.name}
              </h2>
              <p className="text-xs text-[var(--color-muted)] mt-1">
                {info.desc}
              </p>
              <p className="text-xs text-[var(--color-muted)] mt-2">
                {articles.length} 篇文章
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent articles */}
      <div>
        <h2 className="text-lg font-semibold mb-4">所有文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allArticles.map((article) => (
            <Link
              key={`${article.category}-${article.slug}`}
              href={`/${article.category}/${article.slug}`}
              className="group block p-4 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
            >
              <h3 className="font-medium text-sm group-hover:text-[var(--color-primary)] transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-2">
                {article.description}
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-[var(--color-surface)] text-[var(--color-muted)] px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
