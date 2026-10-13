import assert from "node:assert/strict";
import test from "node:test";
import { dateInShanghai, hasValidationErrors, validateArticleDocument, validateSubmissionFields } from "../lib/content-validation";
import { markdownProcessor } from "../lib/content";

test("new article requires title, date, author and excerpt", () => {
  const issues = validateArticleDocument({ body: "这是一段足够长的正文，用来通过正文长度检查。" });
  assert.equal(hasValidationErrors(issues), true);
  assert.deepEqual(
    issues.filter((issue) => issue.level === "error").map((issue) => issue.code),
    ["V001", "V003", "V004", "V006"]
  );
});

test("H1, images and raw HTML are rejected outside fenced code", () => {
  const issues = validateArticleDocument({
    title: "安全测试文章",
    date: "2026-08-08",
    author: "TNHTH",
    excerpt: "这是一个长度合适、用于测试规则的文章摘要。",
    tags: ["测试"],
    body: "# 不允许\n\n<img src=\"x\">\n\n![图片](x.png)\n\n```html\n<script>alert(1)</script>\n```\n",
  });
  assert.equal(issues.some((issue) => issue.code === "V012"), true);
  assert.equal(issues.some((issue) => issue.code === "V013"), true);
  assert.equal(issues.some((issue) => issue.code === "V014"), true);
});

test("unsafe link protocols are rejected and stripped by the renderer", async () => {
  const issues = validateArticleDocument({
    title: "链接安全测试文章",
    date: "2026-08-08",
    author: "TNHTH",
    excerpt: "这是一个长度合适、用于测试不安全链接协议的文章摘要。",
    body: "## 链接\n\n[危险链接](javascript:alert(1))\n",
  });
  assert.equal(issues.some((issue) => issue.code === "V017"), true);
  const html = (await markdownProcessor.process("[危险链接](javascript:alert(1))")).toString();
  assert.doesNotMatch(html, /javascript:/i);
});

test("Shanghai date uses local calendar day", () => {
  assert.equal(dateInShanghai(new Date("2026-08-08T17:00:00.000Z")), "2026-08-09");
});

test("submission and article validation share field rules", () => {
  const input = { title: "x", date: "2026-02-30", author: "", excerpt: "短", tags: [], body: "短", category: "campus", section: "campus-life" };
  const articleCodes = validateArticleDocument(input).filter((issue) => issue.level === "error").map((issue) => issue.code);
  const submissionCodes = validateSubmissionFields(input).filter((issue) => issue.level === "error").map((issue) => issue.code);
  assert.deepEqual(submissionCodes.slice(0, articleCodes.length), articleCodes);
});
