import assert from "node:assert/strict";
import test from "node:test";
import { searchArticles } from "../lib/search";
import { GET as articlesRoute } from "../app/api/articles/route";

test("search indexes full article text beyond the old 500 character prefix", () => {
  const response = searchArticles("GRPO", 12);
  assert.ok(response.results.some((result) => result.title.includes("DeepSeek-R1")));
});

test("empty search returns the five newest articles", () => {
  const response = searchArticles("", 12);
  assert.equal(response.results.length, 5);
  for (let index = 1; index < response.results.length; index += 1) {
    assert.ok(response.results[index - 1].date >= response.results[index].date);
  }
});

test("article index endpoint returns metadata for Vim tree without content", async () => {
  const response = await articlesRoute();
  assert.equal(response.status, 200);
  const payload = (await response.json()) as { articles?: Array<Record<string, unknown>> };
  assert.ok(Array.isArray(payload.articles));
  assert.ok((payload.articles?.length ?? 0) > 12);
  assert.ok(payload.articles?.every((article) => Object.keys(article).sort().join(",") === "category,slug,title"));
});
