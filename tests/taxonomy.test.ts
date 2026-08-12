import assert from "node:assert/strict";
import test from "node:test";
import { getArticlesByCategory, groupArticlesBySeries } from "../lib/content";
import { siteTaxonomy } from "../lib/site-taxonomy";

test("taxonomy has unique category and section slugs", () => {
  const categories = siteTaxonomy.map((category) => category.slug);
  assert.equal(new Set(categories).size, categories.length);
  for (const category of siteTaxonomy) {
    const sections = category.sections.map((section) => section.slug);
    assert.equal(new Set(sections).size, sections.length, category.slug);
  }
});

test("courses exposes one from-zero series containing both learning tracks", () => {
  const courses = siteTaxonomy.find((category) => category.slug === "courses");
  assert.ok(courses);
  assert.deepEqual(courses.series, [{
    slug: "from-zero",
    name: "从零开始学",
    sectionSlugs: ["deep-learning", "algorithm"],
  }]);
});

test("tech groups AI tutorials by tool series and keeps subcategory order", () => {
  const tech = siteTaxonomy.find((category) => category.slug === "tech");
  assert.ok(tech);

  const series = new Map((tech.series ?? []).map((item) => [item.slug, item.sectionSlugs]));
  assert.deepEqual(series.get("ai-guidance"), []);
  assert.equal(tech.series?.find((item) => item.slug === "claude-code")?.parentSlug, "ai-guidance");
  assert.equal(tech.series?.find((item) => item.slug === "codex")?.parentSlug, "ai-guidance");
  assert.equal(tech.series?.find((item) => item.slug === "cursor")?.parentSlug, "ai-guidance");
  assert.equal(tech.series?.find((item) => item.slug === "ai-general")?.parentSlug, "ai-guidance");
  assert.deepEqual(series.get("claude-code"), [
    "claude-code-getting-started",
    "claude-code-advanced",
    "claude-code-reference",
    "claude-code-team",
  ]);
  assert.deepEqual(series.get("codex"), ["codex"]);
  assert.deepEqual(series.get("cursor"), [
    "cursor-getting-started",
    "cursor-rules",
    "cursor-framework",
    "cursor-practice",
    "cursor-miniprogram",
    "cursor-versions",
  ]);
  assert.deepEqual(series.get("trae"), ["trae"]);
});

test("tech renders one AI guidance parent with tool and general child series", () => {
  const groups = groupArticlesBySeries(getArticlesByCategory("tech"));
  const aiGuidance = groups.find((group) => group.key === "series:ai-guidance");
  assert.ok(aiGuidance);
  assert.deepEqual(aiGuidance.children.map((child) => child.label), [
    "Claude Code",
    "Codex",
    "Cursor",
    "Trae",
    "其他 AI 工具",
    "通用 AI 指导",
    "ZCode",
  ]);
  assert.equal(aiGuidance.children.reduce((count, child) => count + child.sections.length, 0), 20);
});

test("community nests development log under the hdu-wiki series", () => {
  const groups = groupArticlesBySeries(getArticlesByCategory("community"));
  const hduWiki = groups.find((group) => group.key === "series:hdu-wiki");
  assert.ok(hduWiki);
  assert.deepEqual(hduWiki.sections.map((section) => section.key), ["sec:hdu-wiki"]);
  assert.deepEqual(hduWiki.children.map((child) => child.key), ["series:development-log"]);
  assert.deepEqual(hduWiki.children[0].sections.map((section) => section.key), ["sec:development-log"]);
});
