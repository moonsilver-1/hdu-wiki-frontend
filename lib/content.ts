import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const contentDir = path.join(process.cwd(), "content");

export interface ArticleMeta {
  title: string;
  category: string;
  tags: string[];
  description: string;
  slug: string;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
  toc: TocItem[];
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

export function getCategoryName(slug: string): string {
  return categoryMap[slug] || slug;
}

export function getCategories(): { slug: string; name: string }[] {
  return Object.entries(categoryMap).map(([slug, name]) => ({ slug, name }));
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

export async function getArticle(
  category: string,
  slug: string
): Promise<Article | null> {
  const filePath = path.join(contentDir, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const result = await unified()
    .use(remarkParse)
    .use(gfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = result.toString();
  const toc = extractToc(contentHtml);

  return {
    title: data.title || slug,
    category: data.category || category,
    tags: data.tags || [],
    description: data.description || "",
    slug,
    contentHtml,
    toc,
  };
}

export function getArticleSlugs(category: string): string[] {
  const dir = path.join(contentDir, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getArticleMeta(
  category: string,
  slug: string
): ArticleMeta | null {
  const filePath = path.join(contentDir, category, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    title: data.title || slug,
    category: data.category || category,
    tags: data.tags || [],
    description: data.description || "",
    slug,
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

export function getArticlesByCategory(category: string): ArticleMeta[] {
  const slugs = getArticleSlugs(category);
  return slugs
    .map((slug) => getArticleMeta(category, slug))
    .filter((a): a is ArticleMeta => a !== null);
}

export function getSearchIndexData(): {
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
}[] {
  const categories = Object.keys(categoryMap);
  const data: {
    slug: string;
    category: string;
    title: string;
    description: string;
    tags: string[];
    content: string;
  }[] = [];

  for (const cat of categories) {
    const slugs = getArticleSlugs(cat);
    for (const slug of slugs) {
      const filePath = path.join(contentDir, cat, `${slug}.md`);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data: frontmatter, content } = matter(fileContent);
      data.push({
        slug,
        category: cat,
        title: frontmatter.title || slug,
        description: frontmatter.description || "",
        tags: frontmatter.tags || [],
        content: content.replace(/[#*`\[\]()]/g, "").slice(0, 500),
      });
    }
  }

  return data;
}
