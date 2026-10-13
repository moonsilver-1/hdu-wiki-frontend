import test from "node:test";
import assert from "node:assert/strict";
import {
  clampRatio,
  decorateReadingToc,
  getReadingProgress,
  nearestReadingTocIndex,
} from "../components/reading-navigation";

test("clamps reading ratios to the progress range", () => {
  assert.equal(clampRatio(-1), 0);
  assert.equal(clampRatio(0.42), 0.42);
  assert.equal(clampRatio(2), 1);
  assert.equal(clampRatio(Number.NaN), 0);
});

test("chooses the nearest chapter on the compact rail", () => {
  assert.equal(nearestReadingTocIndex([], 0.5), -1);
  assert.equal(nearestReadingTocIndex([0, 0.4, 1], 0.27), 1);
  assert.equal(nearestReadingTocIndex([0, 0.4, 1], 0.82), 2);
});

test("keeps the current H2 as the parent of following H3 headings", () => {
  const items = decorateReadingToc([
    { id: "one", text: "第一章", level: 2 },
    { id: "one-a", text: "第一节", level: 3 },
    { id: "one-b", text: "第二节", level: 3 },
    { id: "two", text: "第二章", level: 2 },
    { id: "two-a", text: "第一节", level: 3 },
  ]);

  assert.equal(items[0].parentText, undefined);
  assert.equal(items[1].parentText, "第一章");
  assert.equal(items[2].parentText, "第一章");
  assert.equal(items[4].parentText, "第二章");
});

test("calculates progress at the start, middle and end of a long article", () => {
  assert.equal(getReadingProgress(0, 100, 1000, 500), 0);
  assert.ok(getReadingProgress(450, 100, 1000, 500) > 0.4);
  assert.equal(getReadingProgress(600, 100, 1000, 500), 1);
});

test("handles short, empty and long chapter lists without throwing", () => {
  assert.equal(getReadingProgress(0, 0, 0, 800), 0);
  assert.equal(getReadingProgress(0, 0, 400, 800), 0);
  const manyItems = decorateReadingToc(
    Array.from({ length: 26 }, (_, index) => ({
      id: `item-${index}`,
      text: `章节 ${index + 1}`,
      level: index % 3 === 0 ? 2 : 3,
    }))
  );
  assert.equal(manyItems.length, 26);
  assert.equal(manyItems[25].parentText, "章节 25");
});
