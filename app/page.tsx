import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  GitFork,
} from "lucide-react";
import { getAllArticles, getAuthors, getCategories, getAuthorSlug, splitAuthors, type ArticleMeta } from "@/lib/content";
import CategoryIcon from "@/components/CategoryIcon";
import ArticleList from "@/components/ArticleList";
import SearchButton from "@/components/SearchButton";

const categoryInfo: Record<string, { desc: string }> = {
  courses: { desc: "课程笔记、考试经验与学习资源" },
  campus: { desc: "校园办事、生活攻略与成长指南" },
  tech: { desc: "编程、硬件、工具与项目实践" },
  community: { desc: "社团介绍、学生组织与校园活动" },
};

const featuredSlugs = ["main-guide", "how-to-use-llm", "how-to-become-a-qualified-developer"];

function sortByDate(articles: ArticleMeta[]) {
  return [...articles].sort((articleA, articleB) =>
    articleB.date.localeCompare(articleA.date) || articleA.slug.localeCompare(articleA.slug, "en", { numeric: true })
  );
}

// 看「全部」时按分类交错排列：每个分类取最新一篇轮流展示，避免某一类（如深度学习）
// 的海量文章把顶部全部占满。每个分组内部仍按时间倒序，因此轮到的都是各自最新的内容。
function interleaveByCategory(articles: ArticleMeta[], categoryOrder: string[]): ArticleMeta[] {
  const groups = new Map<string, ArticleMeta[]>();
  for (const category of categoryOrder) groups.set(category, []);
  for (const article of articles) {
    groups.get(article.category)?.push(article);
  }

  const interleaved: ArticleMeta[] = [];
  const maxGroupLength = Math.max(...[...groups.values()].map((group) => group.length), 0);
  for (let index = 0; index < maxGroupLength; index += 1) {
    for (const category of categoryOrder) {
      const article = groups.get(category)?.[index];
      if (article) interleaved.push(article);
    }
  }
  return interleaved;
}

function formatPeriod(period: string) {
  const [year, month] = period.split("-");
  return `${year}年${Number(month)}月`;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ period?: string; category?: string }>;
}) {
  const categories = getCategories();
  const authors = getAuthors();
  const sortedArticles = sortByDate(getAllArticles());
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const categoryOrder = categories.map((category) => category.slug);
  // 分类计数不计必读文章：它们单独归入「必读文章」分组展示，不重复算进各分类，
  // 保证首页计数与分类页（getArticlesByCategory 过滤了 featured）、侧边栏一致。
  const categoryCounts = sortedArticles.reduce<Record<string, number>>((counts, article) => {
    if (article.featured) return counts;
    counts[article.category] = (counts[article.category] ?? 0) + 1;
    return counts;
  }, {});

  const params = (await searchParams) ?? {};
  const requestedCategory = params.category ?? "";
  const selectedCategory = categoryOrder.includes(requestedCategory) ? requestedCategory : "";

  // 先按分类圈定范围，可用时间随选中的分类变化，避免选到该分类下没有的月份。
  const categoryScoped = selectedCategory
    ? sortedArticles.filter((article) => article.category === selectedCategory)
    : sortedArticles;
  const availablePeriods = [...new Set(categoryScoped.map((article) => article.date.slice(0, 7)).filter(Boolean))]
    .sort((periodA, periodB) => periodB.localeCompare(periodA));

  const requestedPeriod = params.period ?? "";
  const selectedPeriod = availablePeriods.includes(requestedPeriod) ? requestedPeriod : "";

  const periodFiltered = selectedPeriod
    ? categoryScoped.filter((article) => article.date.startsWith(selectedPeriod))
    : categoryScoped;

  // 选了具体分类就按时间倒序；看「全部」时按分类交错排列，避免深度学习等大类铺满顶部。
  const recentArticles = selectedCategory
    ? sortByDate(periodFiltered)
    : interleaveByCategory(periodFiltered, categoryOrder);

  const featuredArticle =
    featuredSlugs
      .map((slug) => sortedArticles.find((article) => article.slug === slug))
      .find((article): article is ArticleMeta => Boolean(article)) ?? sortedArticles[0];
  const supportingArticles = featuredSlugs
    .map((slug) => sortedArticles.find((article) => article.slug === slug))
    .filter((article): article is ArticleMeta => Boolean(article))
    .filter((article) => article.slug !== featuredArticle?.slug)
    .slice(0, 2);
  const joinArticle = sortedArticles.find((article) => article.slug === "how-to-join-us");
  const popularArticles = ["main-guide", "how-to-use-llm", "how-too-use-github", "how-to-get-job"]
    .map((slug) => sortedArticles.find((article) => article.slug === slug))
    .filter((article): article is ArticleMeta => Boolean(article));

  return (
    <div className="hw2">
      {/* ===== Hero ===== */}
      <section className="hw2-hero">
        <div className="hw2-hero-grid" aria-hidden="true" />
        <div className="hw2-container">
          <p className="hw2-kicker"><span className="hw2-prompt">~/hdu-wiki</span> 杭电人的百科 · 由同学共同维护</p>
          <h1 className="hw2-title">
            把学长学姐的经验，
            <br />
            交给每一位新生。
            <span className="hw2-caret" aria-hidden="true" />
          </h1>
          <p className="hw2-sub">
            课程攻略、校园生活、技术实践——HDU Wiki 是杭电人一起写的百科，现有 {sortedArticles.length} 篇内容，持续更新，永远开放。
          </p>
          <div className="hw2-search"><SearchButton variant="hero" listenForShortcut={false} /></div>
          <div className="hw2-popular">
            <span className="hw2-popular-label">热门</span>
            {popularArticles.map((article) => (
              <Link key={article.slug} href={`/${article.category}/${article.slug}`}>
                {article.tags[0] || article.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 数据条 ===== */}
      <div className="hw2-stats hw2-container">
        <div><i>01</i><strong>{sortedArticles.length}</strong><span>篇实用内容</span></div>
        <div><i>02</i><strong>{categories.length}</strong><span>个知识方向</span></div>
        <div><i>03</i><strong>{authors.length}</strong><span>位贡献者</span></div>
        <div><i>04</i><strong>2026</strong><span>持续共建中</span></div>
      </div>

      <main>
        {/* ===== 知识方向 ===== */}
        <section className="hw2-section">
          <div className="hw2-container">
            <header className="hw2-head">
              <div>
                <span className="hw2-tag">[ 01 ] 知识方向</span>
                <h2>四个板块，覆盖大学四年</h2>
              </div>
              <p className="hw2-head-note">从选课到毕设，从报到到期末——先把路认熟，再把路走宽。</p>
            </header>
            <div className="hw2-cats">
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className="hw2-cat"
                >
                  <span className="hw2-cat-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="hw2-cat-body">
                    <strong>{category.name}</strong>
                    <span>{categoryInfo[category.slug]?.desc}</span>
                  </span>
                  <span className="hw2-cat-count">
                    {categoryCounts[category.slug] ?? 0} 篇
                    <ArrowRight aria-hidden="true" size={14} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {featuredArticle ? (
          <section className="hw2-section hw2-section-alt" aria-labelledby="featured-title">
            <div className="hw2-container">
              <header className="hw2-head">
                <div>
                  <span className="hw2-tag">[ 02 ] 新生推荐</span>
                  <h2 id="featured-title">从这里开始，到任何地方</h2>
                </div>
                <Link href={`/${featuredArticle.category}`} className="hw2-head-link">
                  浏览{categoryNames.get(featuredArticle.category)}
                  <ArrowRight aria-hidden="true" size={15} />
                </Link>
              </header>

              <div className="hw2-featured">
                <article className={`hw2-featured-main category-${featuredArticle.category}`}>
                  <Link
                    href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                    className="hw2-hit-area"
                    aria-label={`阅读：${featuredArticle.title}`}
                    tabIndex={-1}
                  />
                  <span className="hw2-featured-label">
                    <BookOpenCheck aria-hidden="true" size={15} />
                    新生必读
                  </span>
                  <h3><Link href={`/${featuredArticle.category}/${featuredArticle.slug}`}>{featuredArticle.title}</Link></h3>
                  <p>{featuredArticle.excerpt}</p>
                  <div className="hw2-featured-meta">
                    <span className="hw2-featured-authors">
                      {splitAuthors(featuredArticle.author).map((author, index) => (
                        <span key={author}>
                          {index > 0 ? ", " : null}
                          <Link href={`/authors/${encodeURIComponent(getAuthorSlug(author))}`}>{author}</Link>
                        </span>
                      ))}
                    </span>
                    <span className="hw2-featured-go">开始阅读 <ArrowRight aria-hidden="true" size={15} /></span>
                  </div>
                </article>

                <div className="hw2-supporting">
                  {supportingArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/${article.category}/${article.slug}`}
                      className="hw2-support-card"
                    >
                      <span className="hw2-support-icon">
                        <CategoryIcon category={article.category} size={20} />
                      </span>
                      <span className="hw2-support-body">
                        <small>{categoryNames.get(article.category)}</small>
                        <strong>{article.title}</strong>
                        <span>{article.excerpt}</span>
                      </span>
                      <ArrowUpRight className="hw2-support-arrow" aria-hidden="true" size={17} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="hw2-section" aria-labelledby="articles-title">
          <div className="hw2-container">
            <header className="hw2-head">
              <div>
                <span className="hw2-tag">[ 03 ] 全部内容</span>
                <h2 id="articles-title">最近值得一读</h2>
              </div>
              <form className="hw2-filter" method="get" action="/#articles">
                <label htmlFor="article-category">
                  <span>分类</span>
                  <select id="article-category" name="category" defaultValue={selectedCategory}>
                    <option value="">全部</option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>{category.name}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="article-period">
                  <span>时间</span>
                  <select id="article-period" name="period" defaultValue={selectedPeriod}>
                    <option value="">全部</option>
                    {availablePeriods.map((period) => (
                      <option key={period} value={period}>{formatPeriod(period)}</option>
                    ))}
                  </select>
                </label>
                <button type="submit">查找</button>
              </form>
            </header>

            {recentArticles.length > 0 ? (
              <ArticleList
                key={`${selectedCategory}-${selectedPeriod}`}
                articles={recentArticles}
                categoryNames={Object.fromEntries(categoryNames)}
              />
            ) : (
              <div className="hw2-empty">这个时间段还没有文章</div>
            )}
          </div>
        </section>

        <section className="hw2-section hw2-section-alt" aria-labelledby="contributors-title">
          <div className="hw2-container">
            <header className="hw2-head">
              <div>
                <span className="hw2-tag">[ 04 ] 共同记录</span>
                <h2 id="contributors-title">贡献者</h2>
              </div>
              <p className="hw2-head-note">感谢每一位把经验写进 Wiki 的作者。</p>
            </header>
            <div className="hw2-contributors">
              {authors.map((author, index) => (
                <Link key={author.slug} href={`/authors/${encodeURIComponent(author.slug)}`} className="hw2-contributor">
                  <span className="hw2-contributor-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="hw2-contributor-avatar" aria-hidden="true">{author.name.slice(0, 1)}</span>
                  <span className="hw2-contributor-name">{author.name}</span>
                  <span className="hw2-contributor-count">{author.articleCount} 篇</span>
                  <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="hw2-cta">
          <div className="hw2-container hw2-cta-inner">
            <span className="hw2-tag">[ 05 ] 共同维护</span>
            <h2>把你的经验，留给下一位 HDUer</h2>
            <p>一篇攻略、一次踩坑记录，都会被接下来几年的人看到。</p>
            <div className="hw2-cta-actions">
              {joinArticle ? (
                <Link href={`/${joinArticle.category}/${joinArticle.slug}`} className="hw2-btn hw2-btn-primary">
                  了解如何加入
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ) : null}
              <Link href="/contribute" className="hw2-btn hw2-btn-primary">
                投稿写文章
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <a
                href="https://github.com/moonsilver-1/hdu-wiki-frontend"
                target="_blank"
                rel="noreferrer"
                className="hw2-btn hw2-btn-ghost"
              >
                <GitFork aria-hidden="true" size={16} />
                GitHub
              </a>
            </div>
          </div>
          <div className="hw2-wordmark" aria-hidden="true">HDU WIKI</div>
        </section>
      </main>
    </div>
  );
}
