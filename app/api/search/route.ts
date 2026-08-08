import { NextResponse } from "next/server";
import { searchArticles } from "@/lib/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const rawLimit = url.searchParams.get("limit");
  const limit = rawLimit ? Number(rawLimit) : 12;
  if (query.length > 80) return NextResponse.json({ error: "搜索词不能超过 80 个字符" }, { status: 400 });
  if (!Number.isInteger(limit) || limit < 1 || limit > 12) {
    return NextResponse.json({ error: "limit 必须是 1–12 的整数" }, { status: 400 });
  }
  return NextResponse.json(searchArticles(query, limit), {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
