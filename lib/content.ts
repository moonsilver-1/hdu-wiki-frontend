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
import { cache } from "react";

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

interface CachedArticle {
  mtime: number;
  article: Article;
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
  // 数学与通用基础
  "deep-learning-math",
  "math-linear-algebra",
  "math-linear-algebra-2",
  "math-probability",
  "math-optimization",
  "math-analysis",
  "math-discrete",
  "math-data-structures",
  "algo-dfs-bfs",
  "algo-shortest-path",
  "algo-genetic",
  "algo-simulated-annealing",
  "algo-swarm",

  // 机器学习
  "ml-linear-regression-regularization",
  "ml-logistic-regression",
  "ml-knn",
  "ml-pca-lda",
  "ml-naive-bayes",
  "ml-decision-tree",
  "ml-random-forest",
  "ml-xgboost",
  "ml-lightgbm-catboost",
  "ml-svm",
  "ml-clustering",
  "ml-evaluation",
  "ml-sklearn-practice",

  // 深度学习基础与模型架构
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
  "arch-mamba",
  "arch-moe",

  // 计算机视觉
  "computer-vision-principles",
  "cv-classic-cnn",
  "cv-detection-rcnn",
  "cv-lightweight",
  "cv-yolo",
  "cv-detr",
  "cv-segmentation",
  "cv-instance-segmentation",
  "cv-self-supervised",
  "cv-clip",

  // 自然语言处理
  "nlp-pretraining",
  "nlp-applications",
  "nlp-embeddings",
  "nlp-scaling",
  "nlp-rlhf",
  "nlp-lora",
  "nlp-few-shot-prompt",
  "nlp-rag",
  "nlp-classic",
  "nlp-evaluation",

  // 生成式模型
  "gen-vae",
  "gen-gan",
  "gen-diffusion-ddpm",
  "gen-diffusion-sd",
  "gen-diffusion-dit",
];
const deepLearningOrderIndex = new Map(
  deepLearningOrder.map((slug, index) => [slug, index])
);

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

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === "string" && Boolean(tag.trim()));
  }

  return typeof value === "string"
    ? value.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean)
    : [];
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

// 文件列表缓存：文章一多，侧边栏/分类页/首页每次渲染都会反复 readdir 遍历，
// 用一个短 TTL 缓存削掉重复遍历，新增文件最多 1 秒后可见。
const markdownFilesCache = new Map<string, { expires: number; files: string[] }>();
const MARKDOWN_FILES_TTL_MS = 1000;

function getMarkdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  const now = Date.now();
  const cached = markdownFilesCache.get(directory);
  if (cached && cached.expires > now) return cached.files;

  const files = fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return getMarkdownFiles(entryPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
  });

  markdownFilesCache.set(directory, { expires: now + MARKDOWN_FILES_TTL_MS, files });
  return files;
}

// 把文件名转成 slug：去掉 .md 后缀，再去掉开头的排序编号前缀（如 "06-"）。
// 这样给 deep-learning 目录的文件加 "NN-" 编号前缀时，URL、排序、搜索都不受影响。
function slugFromFilename(filePath: string): string {
  const base = path.basename(filePath, ".md");
  return base.replace(/^\d+-/, "");
}

function getArticleFile(category: string, slug: string): string | null {
  return getMarkdownFiles(path.join(contentDir, category)).find(
    (candidate) => slugFromFilename(candidate) === slug
  ) ?? null;
}

function getArticleSection(category: string, filePath: string): string {
  const relativePath = path.relative(path.join(contentDir, category), filePath);
  return relativePath.split(path.sep)[0] || "general";
}

export function sortArticles(articles: ArticleMeta[]): ArticleMeta[] {
  return [...articles].sort((articleA, articleB) => {
    if (articleA.section === "deep-learning" && articleB.section === "deep-learning") {
      const orderA = deepLearningOrderIndex.get(articleA.slug) ?? Number.MAX_SAFE_INTEGER;
      const orderB = deepLearningOrderIndex.get(articleB.slug) ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || articleA.slug.localeCompare(articleB.slug, "en", { numeric: true });
    }

    return articleA.slug.localeCompare(articleB.slug, "en", { numeric: true });
  });
}

const articleCache = new Map<string, CachedArticle>();

async function getArticleUncached(
  category: string,
  slug: string
): Promise<Article | null> {
  const filePath = getArticleFile(category, slug);
  if (!filePath) return null;

  let mtime = 0;
  try {
    mtime = fs.statSync(filePath).mtimeMs;
  } catch {
    return null;
  }

  const cached = articleCache.get(filePath);
  if (cached && cached.mtime === mtime) return cached.article;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const result = await markdownProcessor.process(content);

  const contentHtml = result.toString();
  const toc = extractToc(contentHtml);

  const article: Article = {
    title: data.title || slug,
    category: data.category || category,
    tags: normalizeTags(data.tags),
    excerpt: data.excerpt || "",
    date: data.date || "",
    author: data.author || "",
    slug,
    section: data.section || getArticleSection(category, filePath),
    featured: data.featured === true,
    contentHtml,
    toc,
  };

  articleCache.set(filePath, { mtime, article });
  return article;
}

// Metadata generation and the page render both request the article. React.cache
// deduplicates that work within a request; articleCache retains parsed HTML until
// the Markdown source changes.
export const getArticle = cache(getArticleUncached);

export function getArticleSlugs(category: string): string[] {
  const dir = path.join(contentDir, category);
  return getMarkdownFiles(dir)
    .map((filePath) => slugFromFilename(filePath))
    .sort((slugA, slugB) => slugA.localeCompare(slugB, "en", { numeric: true }));
}

// 文章元信息缓存：按文件路径缓存解析结果，用 mtime 失效，编辑后立即生效，
// 这样文章多了之后侧边栏/列表也不用每次都重新读文件、解析 frontmatter。
const articleMetaCache = new Map<string, { mtime: number; meta: ArticleMeta }>();

export function getArticleMeta(
  category: string,
  slug: string
): ArticleMeta | null {
  const filePath = getArticleFile(category, slug);
  if (!filePath) return null;

  let mtime = 0;
  try {
    mtime = fs.statSync(filePath).mtimeMs;
  } catch {
    mtime = 0;
  }

  const cached = articleMetaCache.get(filePath);
  if (cached && cached.mtime === mtime) return cached.meta;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  const meta: ArticleMeta = {
    title: data.title || slug,
    category: data.category || category,
    tags: normalizeTags(data.tags),
    excerpt: data.excerpt || "",
    date: data.date || "",
    author: data.author || "",
    slug,
    section: data.section || getArticleSection(category, filePath),
    featured: data.featured === true,
  };

  articleMetaCache.set(filePath, { mtime, meta });
  return meta;
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

export function getAdjacentArticles(
  category: string,
  slug: string
): { previous: ArticleMeta | null; next: ArticleMeta | null } {
  const articles = getArticlesByCategory(category);
  const index = articles.findIndex((article) => article.slug === slug);

  return {
    previous: index > 0 ? articles[index - 1] : null,
    next: index !== -1 && index < articles.length - 1 ? articles[index + 1] : null,
  };
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
        tags: normalizeTags(frontmatter.tags),
        content: content.replace(/[#*`\[\]()]/g, "").slice(0, 500),
      });
    }
  }

  return data;
}
