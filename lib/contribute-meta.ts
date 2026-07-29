// 投稿功能的共享元数据：无 fs / 无服务端依赖，前后端都能 import。
// category / section 白名单在这里集中维护，与 lib/content.ts 的常量保持一致但不直接依赖它
// （lib/content.ts 顶层 import fs，进 client bundle 会导致报错）。

export interface ContributeCategory {
  slug: string;
  name: string;
  // 该分类下开放投稿的 section。深度学习课程有专门的编号体系，不接收投稿。
  sections: { slug: string; name: string }[];
}

// 四大分类全开；深度学习 section（编号受 deepLearningVolumes 硬编码控制）排除。
export const contributeCategories: ContributeCategory[] = [
  {
    slug: "courses",
    name: "课程与学术",
    sections: [{ slug: "fundamentals", name: "基础课程" }],
  },
  {
    slug: "campus",
    name: "校园生活",
    sections: [
      { slug: "campus-life", name: "校园生活" },
      { slug: "forced-business", name: "被迫营业" },
      { slug: "life-experience", name: "体验生活" },
    ],
  },
  {
    slug: "tech",
    name: "技术与项目",
    sections: [
      { slug: "engineering", name: "工程实践" },
      { slug: "automation-learning", name: "自动化学习" },
      { slug: "tool-use", name: "工具使用" },
      { slug: "vibecoding", name: "vibecoding" },
      { slug: "other", name: "其他" },
    ],
  },
  {
    slug: "community",
    name: "社团与活动",
    sections: [{ slug: "community", name: "社团与活动" }],
  },
];

export function isContributeCategory(slug: string): boolean {
  return contributeCategories.some((category) => category.slug === slug);
}

export function getContributeCategory(slug: string): ContributeCategory | undefined {
  return contributeCategories.find((category) => category.slug === slug);
}

export function isContributeSection(categorySlug: string, sectionSlug: string): boolean {
  return (
    getContributeCategory(categorySlug)?.sections.some((section) => section.slug === sectionSlug) ?? false
  );
}

export interface ContributeSubmission {
  title: string;
  category: string;
  section: string;
  author: string;
  email?: string;
  excerpt: string;
  tags: string[];
  body: string;
}
