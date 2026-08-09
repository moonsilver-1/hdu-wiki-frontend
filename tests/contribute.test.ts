import assert from "node:assert/strict";
import test from "node:test";
import { buildMarkdownFile, containsDangerousHtml, submitArticle } from "../lib/contribute";
import { POST as submitRoute } from "../app/api/submit/route";
import { POST as previewRoute } from "../app/api/preview/route";
import { GET as articleRoute } from "../app/api/article/route";

const submission = {
  title: "测试投稿文章",
  category: "tech",
  section: "engineering",
  author: "TNHTH",
  excerpt: "这是一段长度合适的测试摘要，用于验证投稿合同。",
  tags: ["测试"],
  body: "## 测试章节\n\n这是一段长度超过二十字符的正文内容。",
};

test("dangerous HTML is blocked outside code but displayed inside code", () => {
  assert.match(containsDangerousHtml("<script>alert(1)</script>" ) ?? "", /script/);
  assert.equal(containsDangerousHtml("```html\n<script>alert(1)</script>\n```"), null);
});

test("generated markdown always contains the required excerpt", () => {
  const markdown = buildMarkdownFile(submission, "2026-08-08");
  assert.match(markdown, /excerpt:/);
  assert.doesNotMatch(markdown, /email|联系邮箱/i);
});

test("submit API rejects bodies larger than 256 KiB", async () => {
  const body = "{" + "\"body\":\"" + "x".repeat(256 * 1024) + "\"}";
  const response = await submitRoute(new Request("https://example.test/api/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  }));
  assert.equal(response.status, 413);
});

test("preview API rejects oversized markdown before parsing", async () => {
  const response = await previewRoute(new Request("https://example.test/api/preview", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ body: "x".repeat(60_001) }),
  }));
  assert.equal(response.status, 413);
});

test("article API rejects traversal categories", async () => {
  const response = await articleRoute(new Request("https://example.test/api/article?category=..%2F..&slug=package"));
  assert.equal(response.status, 400);
});

test("dry-run uses Shanghai calendar date", async () => {
  const oldDryRun = process.env.CONTRIBUTE_DRY_RUN;
  const oldToken = process.env.GITHUB_TOKEN;
  process.env.CONTRIBUTE_DRY_RUN = "1";
  delete process.env.GITHUB_TOKEN;
  try {
    const result = await submitArticle(submission, { now: new Date("2026-08-08T17:00:00.000Z") });
    assert.equal(result.ok, true);
    assert.match(result.markdown ?? "", /date:\s*['"]?2026-08-09/);
  } finally {
    if (oldDryRun === undefined) delete process.env.CONTRIBUTE_DRY_RUN;
    else process.env.CONTRIBUTE_DRY_RUN = oldDryRun;
    if (oldToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = oldToken;
  }
});

async function assertCleanup(sequence: Response[]) {
  const oldFetch = globalThis.fetch;
  const oldToken = process.env.GITHUB_TOKEN;
  const oldDryRun = process.env.CONTRIBUTE_DRY_RUN;
  process.env.GITHUB_TOKEN = "test-token";
  delete process.env.CONTRIBUTE_DRY_RUN;
  const calls: (RequestInfo | URL)[] = [];
  globalThis.fetch = async (input) => {
    calls.push(input);
    return sequence.shift() ?? new Response("", { status: 500 });
  };
  try {
    const result = await submitArticle({ ...submission, title: `清理测试-${Date.now()}` });
    assert.equal(result.ok, false);
    assert.equal(calls.some((call) => String(call).includes("/git/refs/heads/submission%2F") && sequence.length === 0), true);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = oldToken;
    if (oldDryRun === undefined) delete process.env.CONTRIBUTE_DRY_RUN;
    else process.env.CONTRIBUTE_DRY_RUN = oldDryRun;
  }
}

test("file commit failure triggers best-effort orphan branch cleanup", () => assertCleanup([
  new Response(JSON.stringify({ commit: { sha: "abc" } }), { status: 200 }),
  new Response("", { status: 201 }),
  new Response("upstream failed", { status: 500 }),
  new Response(null, { status: 204 }),
]));

test("PR creation failure triggers best-effort orphan branch cleanup", () => assertCleanup([
  new Response(JSON.stringify({ commit: { sha: "abc" } }), { status: 200 }),
  new Response("", { status: 201 }),
  new Response("", { status: 201 }),
  new Response("upstream failed", { status: 500 }),
  new Response(null, { status: 204 }),
]));
