import { isContributeSection as isTaxonomyContributeSection, siteTaxonomy } from "@/lib/site-taxonomy";

export type ContributeCategory = {
  slug: string;
  name: string;
  sections: { slug: string; name: string }[];
};

/** Backwards-compatible facade for existing UI imports. */
export const contributeCategories: ContributeCategory[] = siteTaxonomy.map((category) => ({
  slug: category.slug,
  name: category.name,
  sections: category.sections
    .filter((section) => section.contribute)
    .map(({ slug, name }) => ({ slug, name })),
}));

export function isContributeCategory(slug: string): boolean {
  return contributeCategories.some((category) => category.slug === slug);
}

export function getContributeCategory(slug: string): ContributeCategory | undefined {
  return contributeCategories.find((category) => category.slug === slug);
}

export function isContributeSection(categorySlug: string, sectionSlug: string): boolean {
  return isTaxonomyContributeSection(categorySlug, sectionSlug);
}

export interface ContributeSubmission {
  title: string;
  category: string;
  section: string;
  author: string;
  excerpt: string;
  tags: string[];
  body: string;
}
