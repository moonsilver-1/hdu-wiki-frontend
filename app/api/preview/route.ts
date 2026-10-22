import { NextResponse } from "next/server";
import { markdownProcessor, preprocessMarkdown } from "@/lib/markdown";
import { readJsonBody } from "@/lib/request-body";

const MAX_PREVIEW_MARKDOWN_CHARS = 60_000;

// 投稿编辑器实时预览：把用户输入的 markdown 正文渲染成 HTML，
// 复用文章页同一套 unified 管线，保证"所见即所得"。
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "INVALID_JSON";
    if (reason === "REQUEST_TOO_LARGE") {
      return NextResponse.json({ error: "请求体超过 256 KiB 限制" }, { status: 413 });
    }
    if (reason === "UNSUPPORTED_MEDIA_TYPE") {
      return NextResponse.json({ error: "仅接受 application/json" }, { status: 415 });
    }
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const markdown = typeof body.body === "string" ? body.body : "";
  if (markdown.length > MAX_PREVIEW_MARKDOWN_CHARS) {
    return NextResponse.json({ error: "预览正文不能超过 60,000 字符" }, { status: 413 });
  }
  if (!markdown.trim()) {
    return NextResponse.json({ html: "" });
  }

  try {
    const result = await markdownProcessor.process(preprocessMarkdown(markdown));
    return NextResponse.json({ html: result.toString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "render failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
