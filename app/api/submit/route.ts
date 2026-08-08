import { NextResponse } from "next/server";
import { submitArticle, isDryRun } from "@/lib/contribute";
import type { ContributeSubmission } from "@/lib/contribute-meta";

const MAX_REQUEST_BYTES = 256 * 1024;

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && Number(declaredLength) > MAX_REQUEST_BYTES) {
    throw new Error("REQUEST_TOO_LARGE");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }

  const reader = request.body?.getReader();
  if (!reader) throw new Error("INVALID_JSON");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) throw new Error("REQUEST_TOO_LARGE");
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const raw = new TextDecoder().decode(Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))));
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("INVALID_JSON");
  return parsed as Record<string, unknown>;
}

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
