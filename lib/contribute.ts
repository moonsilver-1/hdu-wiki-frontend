import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { deepLearningVolumes } from "@/lib/content";
import {
  isContributeCategory,
  isContributeSection,
  type ContributeSubmission,
} from "@/lib/contribute-meta";

// 投稿相关的环境变量：
// - GITHUB_TOKEN：fine-grained token，只给目标仓库 Contents: Write 权限
// - GITHUB_OWNER / GITHUB_REPO：默认取本仓库的归属
// - CONTRIBUTE_DRY_RUN：任意非空值即进入试运行模式（不实际开 PR），本地验证用
const GITHUB_OWNER = process.env.GITHUB_OWNER ?? "moonsilver-1";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "hdu-wiki-frontend";
const GITHUB_BASE_BRANCH = process.env.GITHUB_BASE_BRANCH ?? "main";

export function isDryRun(): boolean {
  return Boolean(process.env.CONTRIBUTE_DRY_RUN) || !process.env.GITHUB_TOKEN;
}

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

// 校验投稿内容。字段层面的硬约束在这里，slug 冲突在 generateSlug 里检查。
export function validateSubmission(input: Partial<ContributeSubmission>): ValidationResult {
  const title = input.title?.trim() ?? "";
  if (title.length < 2) return { ok: false, error: "标题至少 2 个字符" };
  if (title.length > 80) return { ok: false, error: "标题不要超过 80 个字符" };

  const author = input.author?.trim() ?? "";
  if (author.length < 1) return { ok: false, error: "请填写作者署名" };
  if (author.length > 40) return { ok: false, error: "作者署名不要超过 40 个字符" };

  const category = input.category ?? "";
  if (!isContributeCategory(category)) return { ok: false, error: "请选择一个有效分类" };

  const section = input.section ?? "";
  if (!isContributeSection(category, section)) return { ok: false, error: "请选择一个有效子分类" };

  const body = input.body?.trim() ?? "";
  if (body.length < 20) return { ok: false, error: "正文至少 20 个字符" };
  if (body.length > 60000) return { ok: false, error: "正文不要超过 6 万字符" };

  const email = input.email?.trim() ?? "";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "邮箱格式不正确（如填写）" };
  }

  return { ok: true };
}

// 把标题转成 kebab-case slug。中文按音译做不到，这里直接保留汉字并
// 用连字符分隔，最终 URL 形如 /tech/从零开始学vue。
// 标题里没有可切分的拉丁词时，slug 可能整段是中文，这在站内是允许的。
export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    // 拉丁文：非字母数字全转连字符
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    // 去掉首尾连字符
 .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// 深度学习保留 slug 黑名单：撞上会触发编号污染（标题被加 "1.3" 前缀、侧边栏错乱）。
const reservedSlugs = new Set<string>(deepLearningVolumes.flatMap((volume) => volume.slugs));

// 扫描某 category 下已存在的 slug，加上保留 slug，组成完整的冲突集合。
function getTakenSlugs(category: string): Set<string> {
  const taken = new Set<string>(reservedSlugs);
  const categoryDir = path.join(process.cwd(), "content", category);
  if (!fs.existsSync(categoryDir)) return taken;

  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(entryPath);
      return entry.isFile() && entry.name.endsWith(".md") ? [entryPath] : [];
    });

  for (const filePath of walk(categoryDir)) {
    const base = path.basename(filePath, ".md").replace(/^(\d+\.\d+|[A-Z]\.\d+|\d+)-/, "");
    taken.add(base);
  }
  return taken;
}

// 生成唯一 slug：撞名就加 -2、-3 后缀。返回最终 slug 与文件相对路径。
export function generateUniqueSlug(title: string, category: string): string {
  const base = slugifyTitle(title) || "untitled";
  const taken = getTakenSlugs(category);
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i += 1) {
    const candidate = `${base}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}

// 投稿生成的 frontmatter 不写 category/section/featured/volumeKey：
// category、section 靠文件路径推导；featured/volumeKey 是系统字段，写了也会被覆盖。
export function buildMarkdownFile(submission: ContributeSubmission, date: string): string {
  const tags = submission.tags
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);

  const frontmatter: Record<string, unknown> = {
    title: submission.title.trim(),
    date,
    author: submission.author.trim(),
  };
  const excerpt = submission.excerpt.trim();
  if (excerpt) frontmatter.excerpt = excerpt;
  if (tags.length > 0) frontmatter.tags = tags;

  // gray-matter.stringify(content, data) 会把 data 序列化成 YAML frontmatter，
  // 数组/字符串都按规范转义，比手拼 YAML 安全。
  return matter.stringify(submission.body.replace(/\r\n/g, "\n").trim() + "\n", frontmatter);
}

// 生成分支名：只用纯 ASCII 随机串，保证并发投稿不撞分支，也避免中文转义问题。
export function generateBranchName(slug: string): string {
  const suffix = Math.random().toString(36).slice(2, 10);
  const stamp = Date.now().toString(36).slice(-5);
  return `submission/${stamp}${suffix}`;
}

export interface SubmitResult {
  ok: boolean;
  prUrl?: string;
  markdown?: string; // dry-run 时回显将要生成的文件内容
  filePath?: string;
  branch?: string;
  error?: string;
}

// 主流程：校验 → 生成 md → 提交到 GitHub 新分支 → 开 PR。
export async function submitArticle(
  submission: ContributeSubmission
): Promise<SubmitResult> {
  const validation = validateSubmission(submission);
  if (!validation.ok) return { ok: false, error: validation.error };

  const date = new Date().toISOString().slice(0, 10);
  const slug = generateUniqueSlug(submission.title, submission.category);
  const filePath = `content/${submission.category}/${submission.section}/${slug}.md`;
  const markdown = buildMarkdownFile(submission, date);
  const branch = generateBranchName(slug);

  if (isDryRun()) {
    return {
      ok: true,
      markdown,
      filePath,
      branch,
      prUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/compare/${GITHUB_BASE_BRANCH}...${branch}`,
    };
  }

  const token = process.env.GITHUB_TOKEN!;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
  const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

  try {
    // 1. 取默认分支的最新 commit SHA，作为新分支的起点。
    const branchInfoRes = await fetch(`${apiBase}/branches/${GITHUB_BASE_BRANCH}`, { headers });
    if (!branchInfoRes.ok) {
      const detail = await branchInfoRes.text();
      return { ok: false, error: `读取默认分支失败 (${branchInfoRes.status})：${detail}` };
    }
    const branchInfo = (await branchInfoRes.json()) as { commit: { sha: string } };

    // 2. 用 Git Refs API 基于该 commit 创建新分支（端点是 /git/refs，ref 名写在 body 里）。
    const refRes = await fetch(`${apiBase}/git/refs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: branchInfo.commit.sha }),
    });
    if (!refRes.ok) {
      const detail = await refRes.text();
      return { ok: false, error: `创建分支失败 (${refRes.status})：${detail}` };
    }

    // 3. Contents API：在新分支上提交文件（此时分支已存在）。
    const content = Buffer.from(markdown, "utf-8").toString("base64");
    const fileRes = await fetch(`${apiBase}/contents/${filePath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `投稿：${submission.title.trim()}`,
        content,
        branch,
      }),
    });
    if (!fileRes.ok) {
      const detail = await fileRes.text();
      return { ok: false, error: `提交文件失败 (${fileRes.status})：${detail}` };
    }

    // 4. 开 PR：head=新分支，base=默认分支。
    const prRes = await fetch(`${apiBase}/pulls`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: `[投稿] ${submission.title.trim()}`,
        head: branch,
        base: GITHUB_BASE_BRANCH,
        body: buildPrBody(submission, filePath, date),
      }),
    });
    if (!prRes.ok) {
      const detail = await prRes.text();
      return { ok: false, error: `创建 PR 失败 (${prRes.status})：${detail}` };
    }
    const pr = (await prRes.json()) as { html_url?: string };
    return { ok: true, prUrl: pr.html_url, filePath, branch };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `调用 GitHub API 出错：${message}` };
  }
}

// PR 描述：给管理员审核用，重点提醒检查 HTML/脚本注入。
function buildPrBody(submission: ContributeSubmission, filePath: string, date: string): string {
  const tags = submission.tags.filter(Boolean).join(", ") || "（无）";
  const email = submission.email?.trim();
  return [
    `## 投稿信息`,
    `- **标题**：${submission.title.trim()}`,
    `- **作者**：${submission.author.trim()}${email ? `（联系邮箱：${email}）` : ""}`,
    `- **分类 / 子分类**：${submission.category} / ${submission.section}`,
    `- **日期**：${date}`,
    `- **标签**：${tags}`,
    `- **文件**：\`${filePath}\``,
    ``,
    `## ⚠️ 审核提醒`,
    `本投稿来自网页端免登录提交。渲染管线开启了原生 HTML，请务必逐行检查 diff：`,
    `1. 是否含有 \`<script>\`、\`<iframe>\`、\`on*\` 事件属性等可疑代码；`,
    `2. 外链是否指向可信站点；`,
    `3. 内容是否符合社区规范。`,
    ``,
    `确认无误后再合并，合并后会自动触发部署。`,
  ].join("\n");
}

// 客户端预览用：对用户输入的正文做与 readMarkdown 一致的预处理，
// 保证预览渲染结果和合并后正式页一致。
export function preprocessMarkdown(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/(^|[^$])\$\$([^\n$][^$]*?)\$\$(?!\$)/g, (_, pre, body) => `${pre}$$\n${body.trim()}\n$$`);
}
