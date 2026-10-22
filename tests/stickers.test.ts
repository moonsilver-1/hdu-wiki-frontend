import assert from "node:assert/strict";
import test from "node:test";
import { getStickerPage, stickerDownloadName, STICKERS, STICKER_CATEGORIES, STICKER_PAGE_SIZE } from "../lib/stickers";

test("catalog has 20 independent PNG paths per character and all requested reactions", () => {
  assert.equal(STICKERS.length, 40);
  assert.equal(new Set(STICKERS.map((item) => item.id)).size, 40);
  assert.equal(new Set(STICKERS.map((item) => item.src)).size, 40);
  for (const role of ["boy", "girl"] as const) {
    const matching = STICKERS.filter((item) => item.role === role);
    assert.equal(matching.length, 20);
    assert.equal(new Set(matching.map((item) => item.caption)).size, 20);
    for (const caption of ["吃什么", "你好牛魔", "抽象", "随便", "赶ddl中", "牛啊牛啊", "收到", "困了", "救命", "抱抱"]) {
      assert.ok(matching.some((item) => item.caption === caption), `${role}: ${caption}`);
    }
    for (const item of matching) {
      assert.match(item.src, new RegExp(`^/stickers/${role}/\\d{3}\\.png$`));
      assert.ok(STICKER_CATEGORIES.includes(item.category as typeof STICKER_CATEGORIES[number]));
    }
  }
});

test("pagination covers the full catalog once and renders at most one page", () => {
  const first = getStickerPage();
  assert.equal(first.items.length, STICKER_PAGE_SIZE);
  assert.equal(first.total, 40);
  assert.equal(first.pageCount, 2);
  const ids: string[] = [];
  for (let page = 1; page <= first.pageCount; page++) {
    const result = getStickerPage({ page });
    assert.ok(result.items.length <= 24);
    ids.push(...result.items.map((item) => item.id));
  }
  assert.equal(ids.length, 40);
  assert.equal(new Set(ids).size, 40);
  assert.equal(getStickerPage({ page: 2 }).items.length, 16);
});

test("role, category and text filters compose without leaking the other character", () => {
  const result = getStickerPage({ role: "girl", category: "抽象", query: "牛" });
  assert.equal(result.total, 2);
  assert.deepEqual(result.items.map((item) => item.caption), ["你好牛魔", "牛啊牛啊"]);
  assert.ok(result.items.every((item) => item.role === "girl" && item.category === "抽象"));
  assert.equal(getStickerPage({ role: "boy" }).total, 20);
  assert.equal(getStickerPage({ category: "校园" }).total, 4);
});

test("search accepts casual spacing and case, and can find a character by name", () => {
  assert.equal(getStickerPage({ query: " 赶 DDL " }).total, 2);
  assert.equal(getStickerPage({ query: "小羊学姐" }).total, 20);
  assert.equal(getStickerPage({ query: "   " }).total, 40);
});

test("empty searches and out-of-range pages remain navigable", () => {
  const empty = getStickerPage({ query: "没有这句台词", page: 9 });
  assert.equal(empty.total, 0);
  assert.deepEqual(empty.items, []);
  assert.equal(empty.page, 1);
  assert.equal(empty.pageCount, 1);
  assert.equal(getStickerPage({ page: -3 }).page, 1);
  assert.equal(getStickerPage({ page: Number.NaN }).page, 1);
  assert.equal(getStickerPage({ page: 99 }).page, 2);
  assert.equal(getStickerPage({ role: "girl", page: 9 }).page, 1);
});

test("download names identify the character and work on Windows", () => {
  assert.equal(stickerDownloadName(STICKERS[0]), "小羊学长-001-收到.png");
  assert.equal(stickerDownloadName(STICKERS[1]), "小羊学姐-001-收到.png");
  for (const sticker of STICKERS) {
    assert.doesNotMatch(stickerDownloadName(sticker), /[\\/:*?"<>|]/);
  }
});
