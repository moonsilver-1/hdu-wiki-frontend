import type { MetadataRoute } from "next";
import { getAllArticles, getAuthors } from "@/lib/content";
import { siteTaxonomy } from "@/lib/site-taxonomy";
import { SITE_URL } from "@/lib/seo";

const siteUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const categories = siteTaxonomy.map((category) => ({
    url: `${siteUrl}/${category.slug}`,
  }));
  const articles = getAllArticles().map((article) => ({
    url: `${siteUrl}/${article.category}/${article.slug}`,
    ...(article.date ? { lastModified: article.date } : {}),
  }));
  const authors = getAuthors().map((author) => ({
    url: `${siteUrl}/authors/${encodeURIComponent(author.slug)}`,
  }));
  return [{ url: siteUrl }, { url: `${siteUrl}/welcome` }, { url: `${siteUrl}/watcha` }, ...categories, ...articles, ...authors];
}
