import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import gfm from "remark-gfm";
import { courseVolumes } from "../lib/content";
import { categoryMap, getSiteSection, siteTaxonomy } from "../lib/site-taxonomy";
import { validateArticleDocument, type ContentValidationIssue } from "../lib/content-validation";

type Node = { type?: string; depth?: number; lang?: string | null; children?: Node[]; position?: { start?: { line?: number } } };
type Baseline = { baselineCommit: string; legacyRules: string[] };

const root = process.cwd();
const contentRoot = path.join(root, "content");
const baseline = JSON.parse(fs.readFileSync(path.join(root, "content-validation-baseline.json"), "utf8")) as Baseline;
const issues: Array<ContentValidationIssue & { file: string }> = [];

function rel(file: string): string {
  return path.relative(root, file).split(path.sep).join("/");
}

function add(file: string, issue: ContentValidationIssue): void {
  issues.push({ ...issue, file: rel(file) });
}

function walk(node: Node, fn: (node: Node) => void): void {
  fn(node);
  for (const child of node.children ?? []) walk(child, fn);
}

function parseAst(body: string): Node {
  return unified().use(remarkParse).use(gfm).parse(body) as unknown as Node;
}

function baselineText(file: string): string | null {
  try {
    return execFileSync("git", ["show", `${baseline.baselineCommit}:${rel(file)}`], { cwd: root, encoding: "utf8" });
  } catch {
    return null;
  }
}

function unchangedFromBaseline(file: string): boolean {
  try {
    execFileSync("git", ["diff", "--quiet", baseline.baselineCommit, "--", rel(file)], { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function baselineAllows(file: string, code: string): boolean {
  if (!baseline.legacyRules.includes(code) || !unchangedFromBaseline(file)) return false;
  const source = baselineText(file);
  if (!source) return false;
  const parsed = matter(source);
  if (code === "V006") return typeof parsed.data.excerpt !== "string" || !parsed.data.excerpt.trim();
  if (code === "V012") return /(^|\n)\s*#\s+/.test(parsed.content);
  return false;
}

function addWithBaseline(file: string, issue: ContentValidationIssue): void {
  if (issue.level === "error" && baselineAllows(file, issue.code)) {
    add(file, { ...issue, level: "warning", message: `${issue.message}（历史基线）` });
  } else {
    add(file, issue);
  }
}

const seenSlugs = new Map<string, string>();
const markdownFiles = fs.readdirSync(contentRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== "authors")
  .flatMap((categoryEntry) => {
    const categoryDir = path.join(contentRoot, categoryEntry.name);
    return fs.readdirSync(categoryDir, { withFileTypes: true })
      .filter((sectionEntry) => sectionEntry.isDirectory())
      .flatMap((sectionEntry) => fs.readdirSync(path.join(categoryDir, sectionEntry.name), { withFileTypes: true })
        .filter((file) => file.isFile() && file.name.endsWith(".md"))
        .map((file) => path.join(categoryDir, sectionEntry.name, file.name)));
  });

for (const file of markdownFiles) {
  const relative = rel(file);
  const parts = relative.split("/");
  const category = parts[1];
  const section = parts[2];
  if (!categoryMap[category]) add(file, { level: "error", code: "P001", message: `非法 category 路径：${category}`, hint: "使用 lib/site-taxonomy.ts 中的 category。" });
  if (!getSiteSection(category, section)) add(file, { level: "error", code: "P002", message: `非法 section 路径：${category}/${section}`, hint: "使用 taxonomy 中声明的 section。" });

  const slug = path.basename(file, ".md").replace(/^(\d+\.\d+|[A-Z]\.\d+|\d+)-/, "");
  const slugKey = `${category}/${slug}`;
  const previous = seenSlugs.get(slugKey);
  if (previous) add(file, { level: "error", code: "P003", message: `同 category 重复 slug：${slug}`, hint: `已在 ${previous} 使用。` });
  else seenSlugs.set(slugKey, relative);

  const parsed = matter(fs.readFileSync(file, "utf8"));
  const documentIssues = validateArticleDocument({ ...parsed.data, body: parsed.content });
  for (const issue of documentIssues) addWithBaseline(file, issue);

  const ast = parseAst(parsed.content);
  walk(ast, (node) => {
    if (node.type === "image") add(file, { level: "error", code: "A001", message: "AST 检测到图片节点", hint: "改用纯 Markdown 文本。" });
    if (node.type === "html") add(file, { level: "error", code: "A002", message: "AST 检测到 raw HTML 节点", hint: "改写为 Markdown 或代码块。" });
    if (node.type === "code" && !node.lang) add(file, { level: "warning", code: "A003", message: "代码块未声明语言", hint: "建议使用 ```text、```ts 等语言标记。" });
  });
}

for (const category of siteTaxonomy) {
  const duplicateSectionSlugs = new Set<string>();
  for (const section of category.sections) {
    if (duplicateSectionSlugs.has(section.slug)) issues.push({ file: "lib/site-taxonomy.ts", level: "error", code: "T001", message: `taxonomy 重复 section：${category.slug}/${section.slug}`, hint: "删除重复项。" });
    duplicateSectionSlugs.add(section.slug);
  }
}

for (const [section, volumes] of Object.entries(courseVolumes)) {
  const keys = new Set<string>();
  const slugs = new Set<string>();
  for (const volume of volumes) {
    if (keys.has(volume.key)) issues.push({ file: "lib/content.ts", level: "error", code: "C001", message: `course volume 重复编号：${section}/${volume.key}`, hint: "为每个卷分配唯一编号。" });
    keys.add(volume.key);
    for (const slug of volume.slugs) {
      if (slugs.has(slug)) issues.push({ file: "lib/content.ts", level: "error", code: "C002", message: `course volume 重复 slug：${section}/${slug}`, hint: "一个课程 slug 只能归属一个卷。" });
      slugs.add(slug);
    }
  }
}

for (const issue of issues) {
  const location = issue.file;
  const level = issue.level.toUpperCase();
  console.log(`${level} ${location} [${issue.code}] ${issue.message}${issue.hint ? ` — ${issue.hint}` : ""}`);
}

const errors = issues.filter((issue) => issue.level === "error");
const warnings = issues.filter((issue) => issue.level === "warning");
console.log(`\n内容校验：${markdownFiles.length} 篇正文，${errors.length} errors，${warnings.length} warnings`);
if (errors.length) process.exitCode = 1;
