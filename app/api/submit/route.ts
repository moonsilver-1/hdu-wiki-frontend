import { NextResponse } from "next/server";
import { submitArticle, isDryRun } from "@/lib/contribute";
import type { ContributeSubmission } from "@/lib/contribute-meta";
import { readJsonBody } from "@/lib/request-body";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (reason === "REQUEST_TOO_LARGE") return NextResponse.json({ error: "请求体超过 256 KiB 限制" }, { status: 413 });
    if (reason === "UNSUPPORTED_MEDIA_TYPE") return NextResponse.json({ error: "只接受 application/json" }, { status: 415 });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const asString = (value: unknown): string => (typeof value === "string" ? value : "");
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
    excerpt: asString(payload.excerpt),
    tags: tagArray.map((tag) => tag.trim()).filter(Boolean),
    body: asString(payload.body),
  };

  const result = await submitArticle(submission);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status ?? 400 }
    );
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
