import assert from "node:assert/strict";
import test from "node:test";
import { articleStructuredData, serializeJsonLd } from "../lib/seo";

test("structured data uses canonical article and encoded author URLs without invented modification dates", () => {
  const result = articleStructuredData({ title: '示例', excerpt: '摘要', category: 'tech', slug: 'example', date: '2026-10-22' }, [{ name: '如山', slug: '如山' }], '技术');
  const article = result['@graph'][0];
  assert.equal(article.url, 'https://www.hdu-wiki.cn/tech/example');
  assert.equal(article.datePublished, '2026-10-22T00:00:00+08:00');
  assert.equal('dateModified' in article, false);
  assert.ok(article.author?.[0].url.includes('%E5%A6%82'));
});

test("JSON-LD serialization cannot break out of its script element", () => {
  const value = { title: '</script><script>alert(1)</script>' };
  const serialized = serializeJsonLd(value);
  assert.doesNotMatch(serialized, /</);
  assert.deepEqual(JSON.parse(serialized), value);
});
