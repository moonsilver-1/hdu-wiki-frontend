import test from "node:test";
import assert from "node:assert/strict";
import {
  countQuoteOccurrences,
  getArticleCommentStorageKey,
  parseArticleComments,
} from "../lib/article-comments";

test("stores comments under an article-scoped browser key", () => {
  assert.equal(
    getArticleCommentStorageKey("courses", "algorithm-roadmap"),
    "hdu-wiki:article-comments:courses/algorithm-roadmap",
  );
});

test("counts non-overlapping quote occurrences for stable anchors", () => {
  assert.equal(countQuoteOccurrences("abc abc abc", "abc", 8), 2);
  assert.equal(countQuoteOccurrences("abc abc abc", "abc", 4), 1);
  assert.equal(countQuoteOccurrences("abc", "", 3), 0);
});

test("sanitizes malformed local comments before rendering", () => {
  const value = JSON.stringify([
    { id: "ok", quote: "一段文字", occurrence: 1, note: "我的批注", createdAt: "2026-08-09T00:00:00.000Z" },
    { id: "bad", quote: "", note: "" },
    "not an object",
  ]);
  assert.deepEqual(parseArticleComments(value), [{
    id: "ok",
    quote: "一段文字",
    occurrence: 1,
    note: "我的批注",
    createdAt: "2026-08-09T00:00:00.000Z",
  }]);
  assert.deepEqual(parseArticleComments("not-json"), []);
});
