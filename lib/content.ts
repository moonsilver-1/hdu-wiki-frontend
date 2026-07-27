import fs from "fs";
import path from "path";
import matter from "gray-matter";
import gfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const contentDir = path.join(process.cwd(), "content");

// Keep the parser configuration in one place so article pages and API consumers
// produce the same HTML. Math is rendered on the server and is safe to inject
// because the source is repository-controlled Markdown.
const markdownProcessor = unified()
  .use(remarkParse)
  .use(gfm)
  .use(remarkMath, { singleDollarTextMath: true })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, { behavior: "wrap" })
  .use(rehypeHighlight)
  .use(rehypeKatex, { throwOnError: false, strict: false })
  .use(rehypeStringify);

export interface ArticleMeta {
  title: string;
  category: string;
  tags: string[];
  excerpt: string;
  date: string;
  author: string;
  slug: string;
  section: string;
  featured: boolean;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
  toc: TocItem[];
}

export interface Author {
  name: string;
  slug: string;
  bioHtml: string;
  articleCount: number;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

const categoryMap: Record<string, string> = {
  courses: "课程与学术",
  campus: "校园生活",
  tech: "技术与项目",
  community: "社团与活动",
};

const authorsDir = path.join(contentDir, "authors");

const sectionMap: Record<string, string> = {
  "deep-learning": "从零开始学深度学习",
  fundamentals: "基础课程",
  "campus-life": "校园生活",
  "forced-business": "被迫营业",
  "life-experience": "体验生活",
  engineering: "工程实践",
  "automation-learning": "自动化学习",
  "tool-use": "工具使用",
  vibecoding: "vibecoding",
  other: "其他",
  community: "社团与活动",
};

const deepLearningOrder = [
  "deep-learning-math",
  "linear-neural-network",
  "multilayer-perceptron",
  "deep-learning-computation",
  "convolutional-neural-network",
  "modern-convolutional-network",
  "recurrent-neural-network",
  "gated-recurrent-network",
  "attention-mechanism",
  "transformer",
  "optimization-and-regularization",
  "training-stability-and-performance",
  "computer-vision-principles",
  "nlp-pretraining",
  "nlp-applications",
];

export function getAuthorSlug(name: string): string {
  return name
    .trim()
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function splitAuthors(value: string): string[] {
  return value
    .split(/[,，、]/)
    .map((author) => author.trim())
    .filter(Boolean);
}

export function getCategoryName(slug: string): string {
  return categoryMap[slug] || slug;
}

export function getCategories(): { slug: string; name: string }[] {
  return Object.entries(categoryMap).map(([slug, name]) => ({ slug, name }));
}

export function getSectionName(slug: string): string {
  return sectionMap[slug] || slug;
}

function extractToc(contentHtml: string): TocItem[] {
  const toc: TocItem[] = [];
  const regex = /<h([2-3])[^>]*id="([^"]*)"[^>]*>(?:<a[^>]*>)?([^<]*)(?:<\/a>)?<\/h\1>/g;
  let match;
  while ((match = regex.exec(contentHtml)) !== null) {
    toc.push({
      level: parseInt(match[1]),
      id: match[2],
      text: match[3],
    });
  }
  return toc;
}

function getMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return getMarkdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });
}

function getArticleFile(category: string, slug: string): string | null {
  return getMarkdownFiles(path.join(contentDir, category)).find(
    (candidate) => path.basename(candidate, ".md") === slug
  ) ?? null;
}

function getArticleSection(category: string, filePath: string): string {
  const relativePath = path.relative(path.join(contentDir, category), filePath);
  return relativePath.split(path.sep)[0] || "general";
}

export function sortArticles(articles: ArticleMeta[]): ArticleMeta[] {
  return [...articles].sort((articleA, articleB) => {
    if (articleA.section === "deep-learning" && articleB.section === "deep-learning") {
      return deepLearningOrder.indexOf(articleA.slug) - deepLearningOrder.indexOf(articleB.slug);
    }

    return articleA.slug.localeCompare(articleB.slug, "en", { numeric: true });
  });
}

export async function getArticle(
  category: string,
  slug: string
): Promise<Article | null> {
  const filePath = getArticleFile(category, slug);
  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const result = await markdownProcessor.process(content);

  const contentHtml = result.toString();
  const toc = extractToc(contentHtml);

  return {
    title: data.title || slug,
    category: data.category || category,
    tags: data.tags || [],
    excerpt: data.excerpt || "",
    date: data.date || "",
    author: data.author || "",
    slug,
    section: data.section || getArticleSection(category, filePath),
    featured: data.featured === true,
    contentHtml,
    toc,
  };
}

export function getArticleSlugs(category: string): string[] {
  const dir = path.join(contentDir, category);
  return getMarkdownFiles(dir)
    .map((filePath) => path.basename(filePath, ".md"))
    .sort((slugA, slugB) => slugA.localeCompare(slugB, "en", { numeric: true }));
}

export function getArticleMeta(
  category: string,
  slug: string
): ArticleMeta | null {
  const filePath = getArticleFile(category, slug);
  if (!filePath) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    title: data.title || slug,
    category: data.category || category,
    tags: data.tags || [],
    excerpt: data.excerpt || "",
    date: data.date || "",
    author: data.author || "",
    slug,
    section: data.section || getArticleSection(category, filePath),
    featured: data.featured === true,
  };
}

export function getAllArticles(): ArticleMeta[] {
  const categories = Object.keys(categoryMap);
  const articles: ArticleMeta[] = [];

  for (const cat of categories) {
    const slugs = getArticleSlugs(cat);
    for (const slug of slugs) {
      const meta = getArticleMeta(cat, slug);
      if (meta) articles.push(meta);
    }
  }

  return articles;
}

export function getFeaturedArticles(): ArticleMeta[] {
  return sortArticles(getAllArticles().filter((article) => article.featured));
}

export async function getAuthorProfile(name: string): Promise<string> {
  const slug = getAuthorSlug(name);
  const filePath = path.join(authorsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return "<p>作者介绍正在搭建中，欢迎作者补充自己的经历与分享方向。</p>";
  }

  const { content } = matter(fs.readFileSync(filePath, "utf-8"));
  const result = await markdownProcessor.process(content);
  return result.toString();
}

export function getAuthors(): Author[] {
  const authorArticles = new Map<string, { articleCount: number; firstSeen: number }>();
  const articles = sortArticles(getAllArticles());

  for (const [articleIndex, article] of articles.entries()) {
    for (const name of splitAuthors(article.author)) {
      const current = authorArticles.get(name);
      authorArticles.set(name, {
        articleCount: (current?.articleCount ?? 0) + 1,
        firstSeen: current?.firstSeen ?? articleIndex,
      });
    }
  }

  return [...authorArticles.entries()]
    .sort(([, authorA], [, authorB]) =>
      authorB.articleCount - authorA.articleCount || authorA.firstSeen - authorB.firstSeen
    )
    .map(([name, contribution]) => ({
      name,
      slug: getAuthorSlug(name),
      bioHtml: "",
      articleCount: contribution.articleCount,
    }));
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  const slugs = getArticleSlugs(category);
  const articles = slugs
    .map((slug) => getArticleMeta(category, slug))
    .filter((a): a is ArticleMeta => a !== null && !a.featured);

  return sortArticles(articles);
}

export function getSearchIndexData(): {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string[];
  content: string;
}[] {
  const categories = Object.keys(categoryMap);
  const data: {
    slug: string;
    category: string;
    title: string;
    excerpt: string;
    tags: string[];
    content: string;
  }[] = [];

  for (const cat of categories) {
    const slugs = getArticleSlugs(cat);
    for (const slug of slugs) {
      const filePath = getArticleFile(cat, slug);
      if (!filePath) continue;
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter, content } = matter(fileContent);
      data.push({
        slug,
        category: cat,
        title: frontmatter.title || slug,
        excerpt: frontmatter.excerpt || "",
        tags: frontmatter.tags || [],
        content: content.replace(/[#*`\[\]()]/g, "").slice(0, 500),
      });
    }
  }

  return data;
}
