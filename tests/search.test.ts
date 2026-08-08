import assert from "node:assert/strict";
import test from "node:test";
import { searchArticles } from "../lib/search";

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
