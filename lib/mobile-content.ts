import { createHash } from 'node:crypto';
import { courseVolumes, getAllArticles, getArticle, sortArticles, type Article } from './content';
import { siteTaxonomy } from './site-taxonomy';

async function buildMobileContent() {
  const articles: (Omit<Article, 'contentHtml'> & { html: string; readingTime: number })[] = [];
  // Keep memory bounded while rendering a full offline snapshot.
  for (const meta of sortArticles(getAllArticles())) {
    const article = await getArticle(meta.category, meta.slug);
    if (!article) throw new Error(`Missing article: ${meta.category}/${meta.slug}`);
    const { contentHtml, ...fields } = article;
    articles.push({ ...fields, html: contentHtml,
      readingTime: Math.max(1, Math.ceil(contentHtml.replace(/<[^>]*>/g, '').length / 350)) });
  }
  const metadata = (article: typeof articles[number]) => {
    const { title, category, tags, excerpt, date, author, slug, section, featured, volumeKey, readingTime } = article;
    return { title, category, tags, excerpt, date, author, slug, section, featured, volumeKey, readingTime };
  };
  const categories = Object.fromEntries(siteTaxonomy.map(category => {
    const entries = articles.filter(a => a.category === category.slug && !a.featured).map(metadata);
    return [category.slug, { slug: category.slug, name: category.name, desc: `${entries.length} 篇校园知识与经验`,
      articles: entries, sections: category.sections.map(section => ({ slug: section.slug, name: section.name,
        articles: entries.filter(a => a.section === section.slug) })).filter(s => s.articles.length) }];
  }));
  const volumes = Object.fromEntries(siteTaxonomy.map(category => [category.slug,
    category.sections.flatMap(section => (courseVolumes[section.slug] ?? []).map(volume => ({
      key: `${section.slug}/${volume.key}`, title: `${section.name} · ${volume.label}`,
      slugs: volume.slugs.filter(slug => articles.some(a => a.category === category.slug && a.section === section.slug && a.slug === slug)),
    }))).filter(volume => volume.slugs.length)]));
  const payload = { schemaVersion: 1, articles, categories, courseVolumes: volumes,
    featured: articles.filter(a => a.featured).map(metadata), total: articles.length };
  const version = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return { ...payload, version, generatedAt: new Date().toISOString() };
}

let snapshot: ReturnType<typeof buildMobileContent> | undefined;
export function getMobileContent() {
  snapshot ??= buildMobileContent().catch(error => { snapshot = undefined; throw error; });
  return snapshot;
}
