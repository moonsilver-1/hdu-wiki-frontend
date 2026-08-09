import assert from "node:assert/strict";
import test from "node:test";
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
