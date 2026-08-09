import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { courseVolumes } from "@/lib/content";
import {
  isContributeCategory,
  isContributeSection,
  type ContributeSubmission,
} from "@/lib/contribute-meta";
import {
  dateInShanghai,
  hasValidationErrors,
  validateSubmissionFields,
} from "@/lib/content-validation";

// 投稿相关的环境变量：
// - GITHUB_TOKEN：fine-grained token，仅授权 moonsilver-1/hdu-wiki-frontend，
//   Contents: Read and write + Pull requests: Read and write
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
  issues?: ReturnType<typeof validateSubmissionFields>;
}

// 危险 HTML/脚本模式：正文渲染只允许标准 Markdown，但投稿入口仍主动拒绝
// 脚本、事件属性和图片，避免未来渲染管线变更时留下 XSS 或隐私风险。
const DANGEROUS_PATTERNS: { regex: RegExp; hint: string }[] = [
  { regex: /<script[\s>]/i, hint: "正文里检测到 <script> 标签" },
  { regex: /<iframe[\s>]/i, hint: "正文里检测到 <iframe> 标签" },
  { regex: /<object[\s>]/i, hint: "正文里检测到 <object> 标签" },
  { regex: /<embed[\s>]/i, hint: "正文里检测到 <embed> 标签" },
  { regex: /on\w+\s*=\s*["'`]/i, hint: "正文里检测到事件属性（如 onclick）" },
  { regex: /(?:javascript|data|vbscript):\s*\S/i, hint: "正文里检测到不安全链接协议" },
  // 图片：本站没有图片存储，外链图片会破图、可被第三方用于 IP 追踪，
  // <img> 还可能携带 onerror 注入。统一拦截 markdown 图片语法和 <img> 标签。
  { regex: /<img[\s>]/i, hint: "正文里检测到 <img> 图片标签（本站不支持图片）" },
  { regex: /!\[[^\]]*\]\(/, hint: "正文里检测到 markdown 图片语法 ![]()（本站不支持图片）" },
];

// 把代码块（```...``` 和缩进 4 行的代码）从正文中剔除，只检查剩余文本。
// 这样允许用户在代码块里讨论/展示这些内容（它们会被转义成文本，不会执行）。
export function containsDangerousHtml(markdown: string): string | null {
  const withoutCodeBlocks = markdown
    // 去掉围栏代码块 ```...```（含语言标识）
    .replace(/```[\s\S]*?```/g, "")
    // 去掉行内代码 `...`
    .replace(/`[^`\n]*`/g, "");
  for (const { regex, hint } of DANGEROUS_PATTERNS) {
    if (regex.test(withoutCodeBlocks)) {
      // 图片类问题给「请改用文字描述」的提示，脚本类给「请放进代码块」的提示。
      if (hint.includes("不支持图片")) {
        return `${hint}，请用文字、代码或公式表达内容。`;
      }
      return `${hint}。如需展示代码，请用代码块（\`\`\`）包裹。`;
    }
  }
  return null;
}

// 文件路径护栏：确认路径严格匹配 content/<白名单category>/<白名单section>/<纯ASCII slug>.md，
// 防止路径穿越（../）或写到非预期位置。
export function isValidFilePath(
  filePath: string,
  category: string,
  section: string,
  slug: string
): boolean {
  if (!isContributeCategory(category) || !isContributeSection(category, section)) return false;
  // slug 只允许小写字母、数字、连字符，杜绝 / \ .. 等穿越字符
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return false;
  const expected = `content/${category}/${section}/${slug}.md`;
  return filePath === expected;
}

// 校验投稿内容。字段层面的硬约束在这里，slug 冲突在 generateSlug 里检查。
export function validateSubmission(input: Partial<ContributeSubmission>): ValidationResult {
  const category = input.category ?? "";
  if (!isContributeCategory(category)) return { ok: false, error: "请选择一个有效分类" };

  const section = input.section ?? "";
  if (!isContributeSection(category, section)) return { ok: false, error: "请选择一个有效子分类" };

  const issues = validateSubmissionFields({ ...input, date: dateInShanghai() });
  if (hasValidationErrors(issues)) {
    const first = issues.find((issue) => issue.level === "error");
    return { ok: false, error: first ? `${first.message}${first.hint ? `：${first.hint}` : ""}` : "投稿内容未通过校验", issues };
  }

  // 危险内容拦截：渲染管线开启了原生 HTML，正文里的 <script>/<iframe>/javascript:
  // 等会被真正执行。这里扫描「代码块外」的危险模式，命中即拒绝。代码块（```）内的
  // 同类内容会被渲染器转义成文本不执行，所以放行——提示用户把代码放进代码块。
  const dangerous = containsDangerousHtml(input.body?.trim() ?? "");
  if (dangerous) return { ok: false, error: dangerous };

  return { ok: true, issues };
}

// 把标题转成 kebab-case slug。中文按音译做不到，这里直接保留汉字并
// 用连字符分隔，最终 URL 形如 /tech/从零开始学vue。
// 标题转 slug：只保留 ASCII 小写字母、数字、连字符。
// 注意：slug 不能用中文！Next.js App Router 对动态路由参数不做百分号解码，
// 中文 slug 在 URL 里被编码成 %E6%9C%80... 后会与文件名对不上，导致详情页 404。
// 标题里没有可用的拉丁字符时，回退成 submission-<时间戳>，保证总有合法 slug。
export function slugifyTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || `submission-${Date.now().toString(36).slice(-6)}`;
}

// 已注册卷结构课程的保留 slug 黑名单（深度学习、算法等）：撞上会触发编号污染
// （标题被加 "1.3" 前缀、侧边栏错乱）。这些课程是作者精排的，不开放投稿。
const reservedSlugs = new Set<string>(
  Object.values(courseVolumes).flatMap((volumes) =>
    volumes.flatMap((volume) => volume.slugs)
  )
);

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
  frontmatter.excerpt = submission.excerpt.trim();
  if (tags.length > 0) frontmatter.tags = tags;

  // gray-matter.stringify(content, data) 会把 data 序列化成 YAML frontmatter，
  // 数组/字符串都按规范转义，比手拼 YAML 安全。
  return matter.stringify(submission.body.replace(/\r\n/g, "\n").trim() + "\n", frontmatter);
}

// 生成分支名：只用纯 ASCII 随机串，保证并发投稿不撞分支，也避免中文转义问题。
export function generateBranchName(): string {
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
  status?: number;
}

export async function deleteSubmissionBranch(
  apiBase: string,
  branch: string,
  headers: Record<string, string>
): Promise<void> {
  try {
    const response = await fetch(`${apiBase}/git/refs/heads/${encodeURIComponent(branch)}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      console.warn(JSON.stringify({ event: "submission_branch_cleanup_failed", branch, status: response.status }));
    }
  } catch (error) {
    console.warn(JSON.stringify({
      event: "submission_branch_cleanup_failed",
      branch,
      error: error instanceof Error ? error.message : String(error),
    }));
  }
}

// 主流程：校验 → 生成 md → 提交到 GitHub 新分支 → 开 PR。
export async function submitArticle(
  submission: ContributeSubmission,
  options: { now?: Date } = {}
): Promise<SubmitResult> {
  const validation = validateSubmission(submission);
  if (!validation.ok) return { ok: false, error: validation.error, status: 400 };

  const date = dateInShanghai(options.now ?? new Date());
  const slug = generateUniqueSlug(submission.title, submission.category);
  const filePath = `content/${submission.category}/${submission.section}/${slug}.md`;

  // 文件路径护栏：即使前面校验被绕过，也确保文件只落到白名单 category/section 下、
  // slug 纯 ASCII（无路径穿越字符），写不到仓库别处或覆盖系统文件。
  if (!isValidFilePath(filePath, submission.category, submission.section, slug)) {
    return { ok: false, error: "生成的文件路径不合法，请检查分类与标题", status: 400 };
  }

  const markdown = buildMarkdownFile(submission, date);
  const branch = generateBranchName();

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

  let branchCreated = false;
  let completed = false;
  try {
    // 1. 取默认分支的最新 commit SHA，作为新分支的起点。
    const branchInfoRes = await fetch(`${apiBase}/branches/${GITHUB_BASE_BRANCH}`, { headers });
    if (!branchInfoRes.ok) {
    const detail = await branchInfoRes.text();
      return { ok: false, error: `读取默认分支失败 (${branchInfoRes.status})：${detail}`, status: 502 };
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
      return { ok: false, error: `创建分支失败 (${refRes.status})：${detail}`, status: 502 };
    }
    branchCreated = true;

    try {
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
        return { ok: false, error: `提交文件失败 (${fileRes.status})：${detail}`, status: 502 };
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
        return { ok: false, error: `创建 PR 失败 (${prRes.status})：${detail}`, status: 502 };
      }
      const pr = (await prRes.json()) as { html_url?: string };
      completed = true;
      return { ok: true, prUrl: pr.html_url, filePath, branch };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, error: `调用 GitHub API 出错：${message}`, status: 502 };
    } finally {
      if (branchCreated && !completed) await deleteSubmissionBranch(apiBase, branch, headers);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: `调用 GitHub API 出错：${message}`, status: 502 };
  }
}

// PR 描述：给管理员审核用。投稿不收集邮箱，正文渲染也不允许 raw HTML。
function buildPrBody(submission: ContributeSubmission, filePath: string, date: string): string {
  const tags = submission.tags.filter(Boolean).join(", ") || "（无）";
  return [
    `## 投稿信息`,
    `- **标题**：${submission.title.trim()}`,
    `- **作者**：${submission.author.trim()}`,
    `- **分类 / 子分类**：${submission.category} / ${submission.section}`,
    `- **日期**：${date}`,
    `- **标签**：${tags}`,
    `- **文件**：\`${filePath}\``,
    ``,
    `## ⚠️ 审核提醒`,
    `本投稿来自网页端免登录提交。渲染管线只接受标准 Markdown，请务必逐行检查 diff：`,
    `1. 是否含有脚本、图片、raw HTML 或不必要的外链；`,
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
