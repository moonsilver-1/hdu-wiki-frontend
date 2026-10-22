import assert from "node:assert/strict";
import test from "node:test";
import { getAdjacentArticles, getAllArticles, getArticle, sortArticles } from "../lib/content";

test("course navigation follows chapter order even when mixed with other courses", () => {
  const adjacent = getAdjacentArticles("courses", "strassen-matrix-multiplication");
  assert.equal(adjacent.previous?.slug, "convex-hull");
  assert.equal(adjacent.next?.slug, "fft");
  const articles = getAllArticles();
  const key = (list: typeof articles) => sortArticles(list).map((article) => `${article.category}/${article.slug}`);
  assert.deepEqual(key(articles), key([...articles].reverse()));
});

test("formula headings appear once in the table of contents", async () => {
  const article = await getArticle("courses", "strassen-matrix-multiplication");
  assert.equal(article?.toc[0].text, "1.朴素矩阵乘法为什么是 O(n^3)");
  assert.equal(article?.toc.length, 8);
});
