/** Client-safe taxonomy shared by content, contribution UI and validation. */
export interface SiteSection {
  slug: string;
  name: string;
  contribute: boolean;
}

export interface SiteCategory {
  slug: string;
  name: string;
  sections: SiteSection[];
}

export const siteTaxonomy: SiteCategory[] = [
  {
    slug: "courses",
    name: "课程与学术",
    sections: [
      { slug: "deep-learning", name: "从零开始学深度学习", contribute: false },
      { slug: "algorithm", name: "从零开始学算法", contribute: false },
      { slug: "fundamentals", name: "基础课程", contribute: true },
    ],
  },
  {
    slug: "campus",
    name: "校园生活",
    sections: [
      { slug: "campus-life", name: "校园生活", contribute: true },
      { slug: "forced-business", name: "被迫营业", contribute: true },
      { slug: "life-experience", name: "体验生活", contribute: true },
    ],
  },
  {
    slug: "tech",
    name: "技术与项目",
    sections: [
      { slug: "engineering", name: "工程实践", contribute: true },
      { slug: "automation-learning", name: "自动化学习", contribute: true },
      { slug: "tool-use", name: "工具使用", contribute: true },
      { slug: "vibecoding", name: "vibecoding", contribute: true },
      { slug: "other", name: "其他", contribute: true },
    ],
  },
  {
    slug: "community",
    name: "社团与活动",
    sections: [
      { slug: "community", name: "社团与活动", contribute: true },
      { slug: "science-fiction-contest", name: "科幻征文", contribute: true },
    ],
  },
];

export const categoryMap: Record<string, string> = Object.fromEntries(
  siteTaxonomy.map((category) => [category.slug, category.name])
);

export const sectionMap: Record<string, string> = Object.fromEntries(
  siteTaxonomy.flatMap((category) =>
    category.sections.map((section) => [section.slug, section.name] as const)
  )
);

export function getSiteCategory(slug: string): SiteCategory | undefined {
  return siteTaxonomy.find((category) => category.slug === slug);
}

export function getSiteSection(categorySlug: string, sectionSlug: string): SiteSection | undefined {
  return getSiteCategory(categorySlug)?.sections.find((section) => section.slug === sectionSlug);
}

export function isValidCategory(slug: string): boolean {
  return Boolean(getSiteCategory(slug));
}

export function isValidSection(categorySlug: string, sectionSlug: string): boolean {
  return Boolean(getSiteSection(categorySlug, sectionSlug));
}

export function isContributeSection(categorySlug: string, sectionSlug: string): boolean {
  return getSiteSection(categorySlug, sectionSlug)?.contribute === true;
}
