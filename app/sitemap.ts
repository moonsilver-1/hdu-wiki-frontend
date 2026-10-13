import type { MetadataRoute } from "next";
import { getAllArticles, getAuthors } from "@/lib/content";
import { siteTaxonomy } from "@/lib/site-taxonomy";

const siteUrl = "https://www.hdu-wiki.cn";

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = siteTaxonomy.map((category) => ({
    url: `${siteUrl}/${category.slug}`,
  }));
  const articles = getAllArticles().map((article) => ({
    url: `${siteUrl}/${article.category}/${article.slug}`,
    ...(article.date ? { lastModified: article.date } : {}),
  }));
  const authors = getAuthors().map((author) => ({
    url: `${siteUrl}/authors/${author.slug}`,
  }));
  return [{ url: siteUrl }, ...categories, ...articles, ...authors];
}
