import { NextResponse } from "next/server";
import { getArticle } from "@/lib/content";
import { isValidCategory } from "@/lib/site-taxonomy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const slug = searchParams.get("slug");

  if (!category || !slug || !isValidCategory(category)) {
    return NextResponse.json({ error: "Missing category or slug" }, { status: 400 });
  }

  const article = await getArticle(category, slug);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json({
    title: article.title,
    category: article.category,
    slug: article.slug,
    contentHtml: article.contentHtml,
    date: article.date,
    author: article.author,
  });
}
