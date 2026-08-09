import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/content";

// Vim 阅读模式需要完整的文章目录；搜索接口只返回有限的搜索结果，不能复用。
export async function GET() {
  const articles = getAllArticles().map((article) => ({
    category: article.category,
    slug: article.slug,
    title: article.title,
  }));

  return NextResponse.json(
    { articles },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
