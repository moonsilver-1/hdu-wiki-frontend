import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { getMobileContent } from '../lib/mobile-content';
import { getArticle, getAllArticles } from '../lib/content';

test('every body file is accessible, including legacy uppercase slugs', async () => {
  const files = (dir: string): string[] => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory() ? (e.name==='authors'?[]:files(path.join(dir,e.name))) : e.name.endsWith('.md')?[path.join(dir,e.name)]:[]);
  assert.equal(getAllArticles().length, files('content').length);
  assert.ok(await getArticle('courses','preparation-before-learning-ML'));
  assert.equal(await getArticle('courses','../authors/huang'), null);
});

test('mobile export matches website content, anchors and course order', async () => {
  const data = await getMobileContent();
  assert.equal(data.total, getAllArticles().length);
  assert.equal(new Set(data.articles.map(a=>a.slug)).size, data.total);
  assert.match(data.version,/^[a-f0-9]{64}$/);
  for (const article of data.articles) {
    assert.ok(article.html.length > 20);
    assert.doesNotMatch(article.html,/class="katex-error"/);
    for (const item of article.toc) assert.ok(article.html.includes(`id="${item.id}"`),`${article.slug}#${item.id}`);
  }
  const course = data.categories.courses.sections.find(s=>s.slug==='algorithm')!.articles;
  const index = course.findIndex(a=>a.slug==='strassen-matrix-multiplication');
  assert.equal(course[index-1].slug,'convex-hull');
  assert.equal(course[index+1].slug,'fft');
  assert.ok(data.courseVolumes.courses.some(v=>v.key.startsWith('algorithm/')));
});
