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
  volumeKey: string; // 卷编号 "1"…"9"、"A"（仅深度学习课程有值，其余为空串）
  volumeLabel: string; // "第一卷 · 数学基础"
  displayNumber: string; // "1.3"、"A.7"
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

// 深度学习课程按「卷」组织：每卷一个 key（决定编号「卷.章」）、一个中文标签、一组 slug。
// 卷内的顺序既是该卷内的章号，也拼出全局阅读顺序（用于上一章/下一章导航）。
// 这里预留的 slug（如 GLM、各前沿卷）即使文件尚未创建也占住编号位置，
// 这样后续补建文件时编号不会错位。新增或重排章节，只需调整这里的 slugs。
export const deepLearningVolumes: {
  key: string;
  label: string;
  slugs: string[];
}[] = [
  {
    key: "1",
    label: "第一卷 · 数学基础",
    slugs: [
      "deep-learning-math",
      "math-linear-algebra",
      "math-linear-algebra-2",
      "math-probability",
      "math-optimization",
      "math-analysis",
    ],
  },
  {
    key: "2",
    label: "第二卷 · 机器学习",
    slugs: [
      "linear-neural-network",
      "ml-linear-regression-regularization",
      "ml-logistic-regression",
      "ml-generalized-linear-model",
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
    ],
  },
  {
    key: "3",
    label: "第三卷 · 深度学习架构",
    slugs: [
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
    ],
  },
  {
    key: "4",
    label: "第四卷 · 计算机视觉",
    slugs: [
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
    ],
  },
  {
    key: "5",
    label: "第五卷 · 自然语言处理",
    slugs: [
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
    ],
  },
  {
    key: "6",
    label: "第六卷 · 生成式模型",
    slugs: [
      "gen-vae",
      "gen-gan",
      "gen-diffusion-ddpm",
      "gen-diffusion-sd",
      "gen-diffusion-dit",
    ],
  },
  {
    key: "7",
    label: "第七卷 · 前沿架构与高效序列建模",
    slugs: [
      "arch-liquid-neural-network",
      "arch-linear-attention-modern-rnn",
      "arch-long-context-sparse-attention",
      "arch-selection-guide",
    ],
  },
  {
    key: "8",
    label: "第八卷 · 国产开源大模型剖析",
    slugs: [
      "deepseek-architecture",
      "deepseek-r1-rl",
      "kimi-series",
      "qwen-series",
      "glm-zhipu",
      "minimax-series",
    ],
  },
  {
    key: "9",
    label: "第九卷 · 工程落地与评测",
    slugs: [
      "inference-kvcache-vllm",
      "quantization-efficient-inference",
      "llm-agent-tool-use",
      "multi-agent",
      "llm-evaluation-benchmarks",
      "llm-safety-alignment",
    ],
  },
  {
    key: "A",
    label: "附录卷 · 算法与离散",
    slugs: [
      "math-discrete",
      "math-data-structures",
      "algo-dfs-bfs",
      "algo-shortest-path",
      "algo-genetic",
      "algo-simulated-annealing",
      "algo-swarm",
    ],
  },
];

export interface DeepLearningPlacement {
  volumeKey: string; // "1"…"9"、"A"
  volumeLabel: string; // "第一卷 · 数学基础"
  displayNumber: string; // "1.3"、"A.7"
  globalIndex: number; // 全局阅读顺序，驱动上一章/下一章导航
}

// slug -> 该章在课程里的卷归属、显示编号、全局序号。
export const deepLearningPlacement = new Map<string, DeepLearningPlacement>();
{
  let globalIndex = 0;
  for (const volume of deepLearningVolumes) {
    volume.slugs.forEach((slug, indexInVolume) => {
      deepLearningPlacement.set(slug, {
        volumeKey: volume.key,
        volumeLabel: volume.label,
        displayNumber: `${volume.key}.${indexInVolume + 1}`,
        globalIndex: globalIndex++,
      });
    });
  }
}

// 取一篇文章的卷归属（slug 不在课程结构里时返回 null，例如其他分类的文章）。
export function getArticleVolume(slug: string): DeepLearningPlacement | null {
  return deepLearningPlacement.get(slug) ?? null;
}

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

// 把文件名转成 slug：去掉 .md 后缀，再去掉开头的编号前缀。
// 前缀有三种写法：分卷编号 "1.3-"、附录编号 "A.1-"、旧的纯数字 "06-"。
// strip 之后 slug 保持不变，因此给文件加编号前缀时，URL、搜索都不受影响，
// 排序与分卷则由下面的 deepLearningVolumes 决定。
function slugFromFilename(filePath: string): string {
  const base = path.basename(filePath, ".md");
  return base.replace(/^(\d+\.\d+|[A-Z]\.\d+|\d+)-/, "");
}

// 读取 markdown 并把行尾统一成 LF。
// 读取 markdown 并做两步预处理，保证行间公式能被 remark-math 正确识别：
// 1. CRLF → LF：Windows 下文件常是 \r\n，会让 remark-math 认不出 display math。
// 2. 单行 $$...$$ → 多行：remark-math 6 只认 "$$ 单独成行" 的多行格式，
//    像 `$$A=U\Sigma V^\top$$` 这种单行写法会被当成行内公式（两个 $），
//    渲染出来缺少外层 .katex-display，无法居中。这里把单行的 $$...$$
//    展开成多行 `$$\n...\n$$`，统一交给 remark-math 当 display 处理。
function readMarkdown(filePath: string): string {
  return fs
    .readFileSync(filePath, "utf-8")
    .replace(/\r\n/g, "\n")
    .replace(/(^|[^$])\$\$([^\n$][^$]*?)\$\$(?!\$)/g, (_, pre, body) => `${pre}$$\n${body.trim()}\n$$`);
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
    const placeA = deepLearningPlacement.get(articleA.slug);
    const placeB = deepLearningPlacement.get(articleB.slug);
    if (placeA && placeB) {
      return placeA.globalIndex - placeB.globalIndex;
    }
    return articleA.slug.localeCompare(articleB.slug, "en", { numeric: true });
  });
}

// 分组顺序：先按既有的 section 顺序（fundamentals、deep-learning 等）。
const sidebarSectionOrder = ["fundamentals", "deep-learning"];

export interface ArticleGroup {
  key: string;
  label: string;
  articles: ArticleMeta[];
}

// 一个分组节点：可以是一级（section/课程大标题），也可以带二级子分组（卷）。
// articles 为空时，表示这个节点靠 subgroups 展示内容（深度学习课程即如此）。
export interface ArticleSectionNode {
  key: string;
  label: string;
  articles: ArticleMeta[];
  subgroups: ArticleGroup[];
  order: number;
}

// 把文章分成两级：第一级是 section（深度学习课程归为 "deep-learning" 这个大标题，
// 名字是「从零开始学深度学习」）；第二级是该 section 内的子分组——深度学习课程的子组是各卷，
// 其余 section 没有子组，文章直接挂在一级节点上。供侧边栏与分类页共用。
export function groupArticlesForDisplay(articles: ArticleMeta[]): ArticleSectionNode[] {
  // 第一级：按 section 收拢
  const sectionBuckets = new Map<string, ArticleMeta[]>();
  for (const article of articles) {
    const current = sectionBuckets.get(article.section) ?? [];
    current.push(article);
    sectionBuckets.set(article.section, current);
  }

  return [...sectionBuckets.entries()]
    .map(([section, sectionArticles]) => {
      const sectionIndex = sidebarSectionOrder.indexOf(section);
      const order = sectionIndex === -1 ? 500 : sectionIndex;
      const label = getSectionName(section);

      // 深度学习课程：把 section 内的文章再按卷分到二级子分组
      let subgroups: ArticleGroup[] = [];
      let topArticles = sortArticles(sectionArticles);
      if (section === "deep-learning" || sectionArticles.some((a) => a.volumeKey)) {
        const volumeBuckets = new Map<string, ArticleMeta[]>();
        for (const article of sectionArticles) {
          const vk = article.volumeKey || "other";
          const current = volumeBuckets.get(vk) ?? [];
          current.push(article);
          volumeBuckets.set(vk, current);
        }
        subgroups = [...volumeBuckets.entries()]
          .map(([volumeKey, groupArticles]) => {
            const volumeIndex = deepLearningVolumes.findIndex((v) => v.key === volumeKey);
            return {
              key: `vol:${volumeKey}`,
              label: deepLearningVolumes[volumeIndex]?.label ?? volumeKey,
              articles: sortArticles(groupArticles),
            };
          })
          .sort((groupA, groupB) => {
            const ia = deepLearningVolumes.findIndex((v) => v.key === groupA.key.slice(4));
            const ib = deepLearningVolumes.findIndex((v) => v.key === groupB.key.slice(4));
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
          });
        // 课程大标题下文章由子分组承载，一级 articles 留空
        topArticles = [];
      }

      return { key: `sec:${section}`, label, articles: topArticles, subgroups, order };
    })
    .sort((nodeA, nodeB) => nodeA.order - nodeB.order || nodeA.label.localeCompare(nodeB.label, "zh-CN"));
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

  const fileContent = readMarkdown(filePath);
  const { data, content } = matter(fileContent);

  const result = await markdownProcessor.process(content);

  const contentHtml = result.toString();
  const toc = extractToc(contentHtml);

  const placement = getArticleVolume(slug);
  const article: Article = {
    title: placement ? `${placement.displayNumber} ${data.title || slug}` : (data.title || slug),
    category: data.category || category,
    tags: normalizeTags(data.tags),
    excerpt: data.excerpt || "",
    date: data.date || "",
    author: data.author || "",
    slug,
    section: data.section || getArticleSection(category, filePath),
    featured: data.featured === true,
    volumeKey: placement?.volumeKey ?? "",
    volumeLabel: placement?.volumeLabel ?? "",
    displayNumber: placement?.displayNumber ?? "",
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

  const fileContent = readMarkdown(filePath);
  const { data } = matter(fileContent);

  const placement = getArticleVolume(slug);
  const meta: ArticleMeta = {
    title: placement ? `${placement.displayNumber} ${data.title || slug}` : (data.title || slug),
    category: data.category || category,
    tags: normalizeTags(data.tags),
    excerpt: data.excerpt || "",
    date: data.date || "",
    author: data.author || "",
    slug,
    section: data.section || getArticleSection(category, filePath),
    featured: data.featured === true,
    volumeKey: placement?.volumeKey ?? "",
    volumeLabel: placement?.volumeLabel ?? "",
    displayNumber: placement?.displayNumber ?? "",
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

  const { content } = matter(readMarkdown(filePath));
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
      const fileContent = readMarkdown(filePath);
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
