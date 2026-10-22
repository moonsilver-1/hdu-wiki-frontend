export const SITE_URL = "https://www.hdu-wiki.cn";
export const SITE_NAME = "HDU Wiki - 杭电百科";
export const SOCIAL_IMAGE = {
  url: "/mascot-wiki-512.png", width: 512, height: 512, alt: "HDU Wiki 杭电百科",
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function articleStructuredData(article: {
  title: string; excerpt: string; category: string; slug: string; date: string;
}, authors: { name: string; slug: string }[], categoryName: string) {
  const url = absoluteUrl(`/${article.category}/${encodeURIComponent(article.slug)}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article", "@id": `${url}#article`, url,
        headline: article.title, description: article.excerpt, inLanguage: "zh-CN",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        ...(article.date ? { datePublished: `${article.date}T00:00:00+08:00` } : {}),
        author: authors.map((author) => ({ "@type": "Person", name: author.name, url: absoluteUrl(`/authors/${encodeURIComponent(author.slug)}`) })),
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: categoryName, item: absoluteUrl(`/${article.category}`) },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ] as const,
  };
}
