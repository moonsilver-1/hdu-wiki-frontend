export type ValidationLevel = "error" | "warning";

export interface ContentValidationIssue {
  level: ValidationLevel;
  code: string;
  message: string;
  hint?: string;
}

export interface ContentDocumentInput {
  title?: unknown;
  date?: unknown;
  author?: unknown;
  excerpt?: unknown;
  tags?: unknown;
  body?: unknown;
}

const asText = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export function isRealIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function dateInShanghai(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function validateArticleDocument(input: ContentDocumentInput, options?: { existing?: boolean }): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const title = asText(input.title);
  const author = asText(input.author);
  const excerpt = asText(input.excerpt);
  const body = typeof input.body === "string" ? input.body : "";
  const tags = Array.isArray(input.tags) ? input.tags : [];

  if (!title) issues.push(error("V001", "缺少 title", "Front Matter 必须提供文章标题。"));
  else if (title.length < 2 || title.length > 80) issues.push(error("V002", "title 长度必须为 2–80 字符", "缩短标题或将说明移入正文。"));

  if (!isRealIsoDate(input.date)) issues.push(error("V003", "date 必须是有效的 YYYY-MM-DD 日期", "使用真实存在的公历日期，例如 2026-08-08。"));
  if (!author) issues.push(error("V004", "缺少 author", "填写作者名；多人使用逗号分隔。"));
  else if (author.length > 40) issues.push(error("V005", "author 最多 40 字符", "缩短作者署名。"));
  if (!options?.existing && !excerpt) issues.push(error("V006", "新文章必须提供 excerpt", "摘要用于卡片、SEO 和搜索结果。"));
  if (excerpt && (excerpt.length < 20 || excerpt.length > 160)) issues.push(error("V007", "excerpt 长度必须为 20–160 字符", "将摘要压缩到一两句完整说明。"));
  if (tags.length > 8) issues.push(error("V008", "tags 最多 8 个", "删除低信息量标签。"));
  if (tags.some((tag) => typeof tag !== "string" || !tag.trim())) issues.push(error("V009", "tags 必须是非空字符串", "清理空标签或非字符串值。"));

  if (body.length < 20) issues.push(error("V010", "正文至少 20 字符", "补充可验证的正文内容。"));
  if (body.length > 60_000) issues.push(error("V011", "正文最多 60,000 字符", "拆分成多篇文章或删减重复内容。"));

  let inFence = false;
  let previousHeadingLevel = 0;
  let hasH2 = false;
  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (/^\s*#\s+/.test(line)) issues.push(error("V012", "正文禁止 H1", "页面标题由站点模板提供，正文从 H2 开始。"));
    if (/!\[[^\]]*\]\([^)]*\)/.test(line) || /^\s*<img\b/i.test(line)) issues.push(error("V013", "正文禁止图片节点", "本版本使用纯 Markdown 文本；图片系统另立 V1.2。"));
    const withoutInlineCode = line.replace(/`[^`]*`/g, "");
    const htmlTag = /<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\s*\/?\s*>/;
    if (htmlTag.test(withoutInlineCode) && !/<https?:\/\/[^>]+>/.test(withoutInlineCode)) issues.push(error("V014", "正文禁止 raw HTML", "改写为标准 Markdown 或代码块。"));
    const heading = /^(#{2,6})\s+/.exec(line);
    if (heading) {
      const level = heading[1].length;
      if (level === 2) hasH2 = true;
      if (previousHeadingLevel && level > previousHeadingLevel + 1) issues.push(warning("V015", "标题层级跳级", "将标题逐级组织，便于目录和屏幕阅读器理解。"));
      previousHeadingLevel = level;
    }
  }
  if (body.length >= 20 && !hasH2) issues.push(warning("V016", "正文没有 H2", "长文建议从 H2 开始组织章节。"));

  return issues;
}

export function validateSubmissionFields(input: ContentDocumentInput & { category?: unknown; section?: unknown }): ContentValidationIssue[] {
  const issues = validateArticleDocument(input);
  if (!asText(input.category)) issues.push(error("V020", "缺少 category", "选择一个站点分类。"));
  if (!asText(input.section)) issues.push(error("V021", "缺少 section", "选择一个可投稿的 section。"));
  return issues;
}

const error = (code: string, message: string, hint: string): ContentValidationIssue => ({ level: "error", code, message, hint });
const warning = (code: string, message: string, hint: string): ContentValidationIssue => ({ level: "warning", code, message, hint });

export function hasValidationErrors(issues: ContentValidationIssue[]): boolean {
  return issues.some((issue) => issue.level === "error");
}
