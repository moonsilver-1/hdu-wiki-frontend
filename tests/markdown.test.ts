import assert from "node:assert/strict";
import test from "node:test";
import { markdownProcessor, preprocessMarkdown } from "../lib/markdown";
import { validateMarkdownBody } from "../lib/markdown-validation";
import { prepareSubmissionImages } from "../lib/editor-images";
import { POST as preview } from "../app/api/preview/route";

const render = async (body: string) => String(await markdownProcessor.process(preprocessMarkdown(body)));

test("standalone double-dollar formulas display, while code and inline math remain intact", async () => {
  const body = '## 公式\r\n\r\n$$x^2$$\r\n\r\n行内 $x$。\r\n\r\n`$$literal$$`\r\n\r\n```text\r\n$$not_math$$\r\n```';
  const html = await render(body);
  assert.equal((html.match(/class="katex-display"/g) ?? []).length, 1);
  assert.match(html, /<code>\$\$literal\$\$<\/code>/);
  assert.match(html, /\$\$not_math\$\$/);
  assert.doesNotMatch(html, /katex-error/);
});

test("GFM tables, nested lists, blockquotes and unknown code languages render", async () => {
  const html = await render('## 表格\n\n| 左 | 右 |\n| :--- | ---: |\n| **粗体** | 2 |\n\n> 引用\n\n1. 项目\n   - 子项目\n\n```made-up-language\n<tag>\n```');
  assert.match(html, /<table>/);
  assert.match(html, /align="right"/);
  assert.match(html, /<ol>[\s\S]*<ul>/);
  assert.match(html, /<blockquote>/);
  assert.match(html, /(?:&lt;|&#x3C;)tag(?:>|&gt;|&#x3E;)/);
});

test("preview and published pipeline render identical formulas and code", async () => {
  const body = '## 例子\n\n$$a+b$$\n\n```text\n$$literal$$\n```';
  const response = await preview(new Request('https://example.test/api/preview', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ body }),
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).html, await render(body));
});

test("reference links and encoded unsafe protocols cannot bypass validation or rendering", async () => {
  for (const body of ['[x][ref]\n\n[ref]: javascript:alert(1)', '[x](jav&#x61;script:alert)', '[x](java&#x09;script:alert)']) {
    assert.ok(validateMarkdownBody(body).some((issue) => issue.code === "V017"));
    assert.doesNotMatch(await render(body), /href="(?:java|data|vbscript)/i);
  }
  assert.ok(validateMarkdownBody('<https://example.com> <script>x</script>').some((issue) => issue.code === "V014"));
});

test("nested and tilde code fences are not mistaken for live HTML; unclosed fences are reported", () => {
  for (const body of ['~~~~html\n<script>x</script>\n~~~\n~~~~', '````md\n```html\n<script>x</script>\n```\n````', '    <script>x</script>']) {
    assert.equal(validateMarkdownBody(body).filter((issue) => issue.level === 'error').length, 0);
  }
  assert.ok(validateMarkdownBody('```js\nconst a = 1;').some((issue) => issue.code === 'V018'));
});

test("deleting a middle image preserves the remaining references at submission", () => {
  const result = prepareSubmissionImages('![first](local:0) ![third](local:2) ![new](local:3)', [
    { id: 0, name: 'first' }, { id: 2, name: 'third' }, { id: 3, name: 'new' },
  ]);
  assert.equal(result.body, '![first](local:0) ![third](local:1) ![new](local:2)');
  assert.deepEqual(result.images, [{ name: 'first' }, { name: 'third' }, { name: 'new' }]);
});

test("imported table breaks render safely without changing code or enabling HTML", async () => {
  const html = await render('| 内容 |\n| --- |\n| 第一行&lt;br&gt;第二行 `<br>` |');
  assert.match(html, /第一行<br>第二行/);
  assert.match(html, /<code>(?:&lt;|&#x3C;)br/);
  assert.doesNotMatch(await render('<script>alert(1)</script>'), /<script>/);
});
