import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/chat";

// 「问小羊」AI 问答接口
export async function POST(request: Request) {
  let body: { question?: unknown };
  try {
    body = (await request.json()) as { question?: unknown };
  } catch {
    return NextResponse.json({ error: "请求格式不正确" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (question.length < 2) {
    return NextResponse.json({ error: "问题太短啦，多说几个字" }, { status: 400 });
  }
  if (question.length > 300) {
    return NextResponse.json({ error: "问题最长 300 字" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const result = await answerQuestion(question, ip);
  return NextResponse.json(result);
}
