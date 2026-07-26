import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  GitFork,
} from "lucide-react";
import { getAllArticles, getAuthors, getCategories, getAuthorSlug, splitAuthors, type ArticleMeta } from "@/lib/content";
import CategoryIcon from "@/components/CategoryIcon";
import SearchButton from "@/components/SearchButton";

const categoryInfo: Record<string, { desc: string }> = {
  courses: { desc: "课程笔记、考试经验与学习资源" },
  campus: { desc: "校园办事、生活攻略与成长指南" },
  tech: { desc: "编程、硬件、工具与项目实践" },
  community: { desc: "社团介绍、学生组织与校园活动" },
};

const featuredSlugs = ["main-guide", "how-to-use-llm", "how-to-become-a-qualified-developer"];

function sortByDate(articles: ArticleMeta[]) {
  return [...articles].sort((a, b) => b.date.localeCompare(a.date));
}

function ArticleCard({
  article,
  categoryName,
}: {
  article: ArticleMeta;
  categoryName: string;
}) {
  return (
    <article className={`article-card category-${article.category}`}>
      <Link
        href={`/${article.category}/${article.slug}`}
        className="article-card-hit-area"
        aria-label={`阅读：${article.title}`}
        tabIndex={-1}
      />
      <div className="article-card-topline">
        <span className="article-category">{categoryName}</span>
        {article.date ? <time dateTime={article.date}>{article.date}</time> : null}
      </div>
      <h3><Link href={`/${article.category}/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.excerpt}</p>
      <div className="article-card-footer">
        <span className="article-authors">
          {(splitAuthors(article.author).length ? splitAuthors(article.author) : ["HDU Wiki"]).map((author, index) => (
            <span key={author}>
              {index > 0 ? ", " : null}
              <Link href={`/authors/${encodeURIComponent(getAuthorSlug(author))}`}>{author}</Link>
            </span>
          ))}
        </span>
        <Link
          href={`/${article.category}/${article.slug}`}
          className="article-card-arrow"
          aria-label={`阅读：${article.title}`}
        >
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  );
}

export default async function Home() {
  const categories = getCategories();
  const authors = getAuthors();
  const sortedArticles = sortByDate(getAllArticles());
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const categoryCounts = sortedArticles.reduce<Record<string, number>>((counts, article) => {
    counts[article.category] = (counts[article.category] ?? 0) + 1;
    return counts;
  }, {});

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
    <div className="home-page">
      <section className="home-hero">
        <div className="site-container home-hero-content">
          <h1>HDU Wiki</h1>
          <p className="hero-lead">我们期待能让杭电变得越来越好！！！</p>
          <SearchButton variant="hero" listenForShortcut={false} />

          <div className="hero-popular" aria-label="热门内容">
            <span>热门</span>
            {popularArticles.map((article) => (
              <Link key={article.slug} href={`/${article.category}/${article.slug}`}>
                {article.tags[0] || article.title}
              </Link>
            ))}
          </div>

          <div className="hero-stats" aria-label="站点内容统计">
            <div><strong>{sortedArticles.length}</strong><span>篇实用内容</span></div>
            <div><strong>{categories.length}</strong><span>个知识方向</span></div>
            <div><strong>2026</strong><span>持续共建中</span></div>
          </div>
        </div>
      </section>

      <main>
        <section className="home-section" aria-labelledby="categories-title">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">探索 Wiki</span>
                <h2 id="categories-title">四大焚决</h2>
                <p>这里有我们认为比较常见的四个方面的焚决</p>
              </div>
            </div>

            <div className="category-grid">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className={`category-card category-${category.slug}`}
                >
                  <span className="category-icon">
                    <CategoryIcon category={category.slug} size={24} />
                  </span>
                  <h3>{category.name}</h3>
                  <p>{categoryInfo[category.slug]?.desc}</p>
                  <span className="category-count">
                    {categoryCounts[category.slug] ?? 0} 篇文章
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {featuredArticle ? (
          <section className="home-section home-section-muted" aria-labelledby="featured-title">
            <div className="site-container">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">精选阅读</span>
                  <h2 id="featured-title">从这里开始，到任何地方</h2>
                </div>
                <Link href={`/${featuredArticle.category}`} className="section-link">
                  浏览{categoryNames.get(featuredArticle.category)}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>

              <div className="featured-grid">
                <article className={`featured-article category-${featuredArticle.category}`}>
                  <Link
                    href={`/${featuredArticle.category}/${featuredArticle.slug}`}
                    className="featured-hit-area"
                    aria-label={`阅读：${featuredArticle.title}`}
                    tabIndex={-1}
                  />
                  <span className="featured-label">
                    <BookOpenCheck aria-hidden="true" size={16} />
                    新生推荐
                  </span>
                  <h3><Link href={`/${featuredArticle.category}/${featuredArticle.slug}`}>{featuredArticle.title}</Link></h3>
                  <p>{featuredArticle.excerpt}</p>
                  <div className="featured-meta">
                    <span className="featured-authors">
                      {splitAuthors(featuredArticle.author).map((author, index) => (
                        <span key={author}>
                          {index > 0 ? ", " : null}
                          <Link href={`/authors/${encodeURIComponent(getAuthorSlug(author))}`}>{author}</Link>
                        </span>
                      ))}
                    </span>
                    <span>开始阅读 <ArrowRight aria-hidden="true" size={17} /></span>
                  </div>
                </article>

                <div className="supporting-articles">
                  {supportingArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/${article.category}/${article.slug}`}
                      className={`supporting-article category-${article.category}`}
                    >
                      <span className="supporting-icon">
                        <CategoryIcon category={article.category} size={21} />
                      </span>
                      <div>
                        <span>{categoryNames.get(article.category)}</span>
                        <h3>{article.title}</h3>
                        <p>{article.excerpt}</p>
                      </div>
                      <ArrowUpRight className="supporting-arrow" aria-hidden="true" size={18} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="home-section" aria-labelledby="articles-title">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">全部内容</span>
                <h2 id="articles-title">最近值得一读</h2>
                <p>从新收录到经典指南，按更新时间快速浏览。</p>
              </div>
              <span className="article-total">共 {sortedArticles.length} 篇</span>
            </div>

            <div className="article-grid">
              {sortedArticles.map((article) => (
                <ArticleCard
                  key={`${article.category}-${article.slug}`}
                  article={article}
                  categoryName={categoryNames.get(article.category) ?? article.category}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="home-section contributors-section" aria-labelledby="contributors-title">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <span className="section-kicker">共同记录</span>
                <h2 id="contributors-title">贡献者</h2>
                <p>感谢每一位把经验写进 HDU Wiki 的作者！！！</p>
              </div>
            </div>
            <div className="contributors-grid">
              {authors.map((author) => (
                <Link key={author.slug} href={`/authors/${encodeURIComponent(author.slug)}`} className="contributor-card">
                  <span className="contributor-avatar" aria-hidden="true">{author.name.slice(0, 1)}</span>
                  <span className="contributor-info">
                    <strong>{author.name}</strong>
                    <small>{author.articleCount} 篇内容</small>
                  </span>
                  <ArrowUpRight aria-hidden="true" size={17} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="contribute-section">
          <div className="site-container contribute-inner">
            <div>
              <span className="section-kicker">共同维护</span>
              <h2>把你的经验，留给下一位 HDUer</h2>
              <p>让我们一起建设更好的 HDU-Wiki 吧！</p>
            </div>
            <div className="contribute-actions">
              {joinArticle ? (
                <Link href={`/${joinArticle.category}/${joinArticle.slug}`} className="button button-light">
                  了解如何加入
                  <ArrowRight aria-hidden="true" size={17} />
                </Link>
              ) : null}
              <a
                href="https://github.com/moonsilver-1/hdu-wiki-frontend"
                target="_blank"
                rel="noreferrer"
                className="button button-outline"
              >
                <GitFork aria-hidden="true" size={17} />
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
