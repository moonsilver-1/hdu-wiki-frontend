/** Client-safe taxonomy shared by content, contribution UI and validation. */
export interface SiteSection {
  slug: string;
  name: string;
  contribute: boolean;
}

export interface SiteSeries {
  slug: string;
  name: string;
  sectionSlugs: string[];
  /** Optional parent series used to render a two-level taxonomy (for example AI 指导 → Claude Code). */
  parentSlug?: string;
}

export interface SiteCategory {
  slug: string;
  name: string;
  sections: SiteSection[];
  series?: SiteSeries[];
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
    series: [
      { slug: "from-zero", name: "从零开始学", sectionSlugs: ["deep-learning", "algorithm"] },
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
      { slug: "ai-guidance-general", name: "AI 指导 · 通用方法", contribute: true },
      { slug: "ai-guidance-writing", name: "AI 指导 · 写作与文档", contribute: true },
      { slug: "claude-code-getting-started", name: "Claude Code · 入门", contribute: true },
      { slug: "claude-code-advanced", name: "Claude Code · 进阶", contribute: true },
      { slug: "claude-code-reference", name: "Claude Code · 参考", contribute: true },
      { slug: "claude-code-team", name: "Claude Code · 团队与大型项目", contribute: true },
      { slug: "codex", name: "Codex · 完整教程", contribute: true },
      { slug: "cursor-getting-started", name: "Cursor · 入门", contribute: true },
      { slug: "cursor-rules", name: "Cursor · Rules", contribute: true },
      { slug: "cursor-framework", name: "Cursor · 框架规则", contribute: true },
      { slug: "cursor-practice", name: "Cursor · 项目实战", contribute: true },
      { slug: "cursor-miniprogram", name: "Cursor · 小程序", contribute: true },
      { slug: "cursor-versions", name: "Cursor · 版本与功能", contribute: true },
      { slug: "trae", name: "Trae · 完整教程", contribute: true },
      { slug: "other-ai-tools", name: "其他 AI 工具", contribute: true },
      { slug: "openclaw", name: "OpenClaw 与 AI Agent", contribute: true },
      { slug: "ai-tools-comparison", name: "AI 工具选择", contribute: true },
      { slug: "ai-workflows", name: "AI 编程工作流", contribute: true },
      { slug: "ai-model-evaluation", name: "AI 模型评测", contribute: true },
      { slug: "zcode", name: "ZCode", contribute: true },
      { slug: "vibecoding", name: "AI 编程（未归档）", contribute: true },
      { slug: "other", name: "其他", contribute: true },
    ],
    series: [
      { slug: "ai-guidance", name: "AI 指导", sectionSlugs: [] },
      {
        slug: "claude-code",
        name: "Claude Code",
        parentSlug: "ai-guidance",
        sectionSlugs: [
          "claude-code-getting-started",
          "claude-code-advanced",
          "claude-code-reference",
          "claude-code-team",
        ],
      },
      { slug: "codex", name: "Codex", parentSlug: "ai-guidance", sectionSlugs: ["codex"] },
      {
        slug: "cursor",
        name: "Cursor",
        parentSlug: "ai-guidance",
        sectionSlugs: [
          "cursor-getting-started",
          "cursor-rules",
          "cursor-framework",
          "cursor-practice",
          "cursor-miniprogram",
          "cursor-versions",
        ],
      },
      { slug: "trae", name: "Trae", parentSlug: "ai-guidance", sectionSlugs: ["trae"] },
      {
        slug: "other-ai-tools",
        name: "其他 AI 工具",
        parentSlug: "ai-guidance",
        sectionSlugs: ["other-ai-tools", "openclaw"],
      },
      {
        slug: "ai-general",
        name: "通用 AI 指导",
        parentSlug: "ai-guidance",
        sectionSlugs: ["ai-guidance-general", "ai-guidance-writing", "ai-tools-comparison", "ai-workflows", "ai-model-evaluation"],
      },
      { slug: "zcode", name: "ZCode", parentSlug: "ai-guidance", sectionSlugs: ["zcode"] },
    ],
  },
  {
    slug: "community",
    name: "社团与活动",
    sections: [
      { slug: "hdu-wiki", name: "hdu-wiki", contribute: true },
      { slug: "development-log", name: "开发日志", contribute: true },
      { slug: "science-fiction-contest", name: "科幻征文", contribute: true },
    ],
    series: [
      {
        slug: "hdu-wiki",
        name: "hdu-wiki",
        sectionSlugs: ["hdu-wiki"],
      },
      {
        slug: "development-log",
        name: "开发日志",
        parentSlug: "hdu-wiki",
        sectionSlugs: ["development-log"],
      },
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

export function getSiteSeries(categorySlug: string): SiteSeries[] {
  return getSiteCategory(categorySlug)?.series ?? [];
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
