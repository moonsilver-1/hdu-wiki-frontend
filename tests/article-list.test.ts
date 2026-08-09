import assert from "node:assert/strict";
import test from "node:test";
import {
  ARTICLE_PAGE_SIZE,
  INITIAL_ARTICLE_COUNT,
  getInitialArticleCount,
  getNextArticleCount,
} from "../lib/article-list";

test("article list starts with a compact first page", () => {
  assert.equal(getInitialArticleCount(0), 0);
  assert.equal(getInitialArticleCount(4), 4);
  assert.equal(getInitialArticleCount(20), INITIAL_ARTICLE_COUNT);
});

test("load more advances by one page and stops at the total", () => {
  assert.equal(getNextArticleCount(0, 20), ARTICLE_PAGE_SIZE);
  assert.equal(getNextArticleCount(6, 20), 12);
  assert.equal(getNextArticleCount(18, 20), 20);
  assert.equal(getNextArticleCount(30, 20), 20);
  assert.equal(getNextArticleCount(-2, 20), ARTICLE_PAGE_SIZE);
});
