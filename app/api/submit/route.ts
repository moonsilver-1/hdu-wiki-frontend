import { NextResponse } from "next/server";
import { submitArticle, isDryRun } from "@/lib/contribute";
import type { ContributeSubmission } from "@/lib/contribute-meta";

// 接收投稿，校验后调 GitHub API 开 PR。本地无 token 或设置 CONTRIBUTE_DRY_RUN
// 时进入试运行模式：不实际开 PR，回显将要生成的文件内容，方便端到端验证 UI。
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const asString = (value: unknown): string =>
    typeof value === "string" ? value : "";

  // tags 允许用户传字符串（逗号分隔）或数组，这里统一成数组。
  const rawTags = payload.tags;
  const tagArray: string[] = Array.isArray(rawTags)
    ? rawTags.map((tag) => String(tag))
    : typeof rawTags === "string"
      ? rawTags.split(/[,，、]/)
      : [];

  const submission: ContributeSubmission = {
    title: asString(payload.title),
    category: asString(payload.category),
    section: asString(payload.section),
    author: asString(payload.author),
    email: asString(payload.email),
    excerpt: asString(payload.excerpt),
    tags: tagArray.map((tag) => tag.trim()).filter(Boolean),
    body: asString(payload.body),
  };

  const result = await submitArticle(submission);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      prUrl: result.prUrl,
      filePath: result.filePath,
      branch: result.branch,
      markdown: result.markdown,
      dryRun: isDryRun(),
    },
    { status: 201 }
  );
}
