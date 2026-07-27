import Link from "next/link";
import { ArrowLeft, BookOpen, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getAuthorProfile, getAuthorSlug, getAuthors, sortArticles, splitAuthors } from "@/lib/content";

function findAuthor(slug: string) {
  const decodedSlug = decodeURIComponent(slug);
  return getAuthors().find((item) => item.slug === getAuthorSlug(decodedSlug));
}

export async function generateStaticParams() {
  return getAuthors().map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = findAuthor(slug);
  return { title: author?.name ?? "作者" };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = findAuthor(slug);
  if (!author) notFound();
  const bioHtml = await getAuthorProfile(author.name);

  const articles = sortArticles(getAllArticles().filter((article) =>
    splitAuthors(article.author).some((name) => getAuthorSlug(name) === author.slug)
  ));

  return (
    <main className="author-page">
      <div className="site-container author-page-inner">
        <Link href="/#contributors-title" className="breadcrumb author-back-link"><ArrowLeft aria-hidden="true" size={15} />返回贡献者名单</Link>
        <header className="author-header">
          <span className="author-avatar" aria-hidden="true">{author.name.slice(0, 1)}</span>
          <div>
            <span className="section-kicker">HDU Wiki 贡献者</span>
            <h1>{author.name}</h1>
            <p><UserRound aria-hidden="true" size={15} />参与撰写 {author.articleCount} 篇内容</p>
          </div>
        </header>
        <article className="wiki-content author-bio" dangerouslySetInnerHTML={{ __html: bioHtml }} />
        <section className="author-articles" aria-labelledby="author-articles-title">
          <div className="section-heading"><div><span className="section-kicker">贡献内容</span><h2 id="author-articles-title">TA 写过的文章</h2></div></div>
          <div className="author-article-list">
            {articles.map((article) => (
              <Link key={`${article.category}-${article.slug}`} href={`/${article.category}/${article.slug}`}>
                <span><BookOpen aria-hidden="true" size={16} />{article.title}</span>
                <small>{article.date}</small>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
