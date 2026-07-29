import { NextResponse } from "next/server";
import { markdownProcessor } from "@/lib/content";
import { preprocessMarkdown } from "@/lib/contribute";

// 投稿编辑器实时预览：把用户输入的 markdown 正文渲染成 HTML，
// 复用文章页同一套 unified 管线，保证"所见即所得"。
export async function POST(request: Request) {
  let body: { body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const markdown = typeof body.body === "string" ? body.body : "";
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
