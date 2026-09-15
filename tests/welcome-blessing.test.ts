import assert from "node:assert/strict";
import { test } from "node:test";
import { BLESSINGS, blessingByIndex, blessingFor, blessingIndexFor, fnv1a } from "../lib/welcome-blessings";
import { ROSTER_HASHES, VOICE_INDEXES } from "../lib/welcome-roster";
import { VOICES } from "../lib/welcome-voices";

test("祝福语库：恰好 50 段且无空串、无重复", () => {
  assert.equal(BLESSINGS.length, 50);
  assert.ok(BLESSINGS.every(b => b.trim().length >= 10));
  assert.equal(new Set(BLESSINGS).size, 50);
});

test("祝福分布：全名单按哈希均匀落在 50 段里", () => {
  const counts = new Array(50).fill(0);
  for (const h of ROSTER_HASHES) {
    const idx = blessingIndexFor(h);
    assert.ok(idx >= 0 && idx < 50);
    counts[idx]++;
  }
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  const empty = counts.filter(c => c === 0).length;
  assert.equal(empty, 0, "每一段祝福都应至少分给一位同学");
  // 随机体感优先：均值约 14 人/段，允许自然波动，不追求严格均匀
  assert.ok(max - min <= 20, `分布应大致均匀：max=${max} min=${min}`);
});

test("语音分配：23 段语音覆盖全员且严格平均", () => {
  assert.equal(VOICES.length, 23);
  assert.equal(VOICE_INDEXES.length, ROSTER_HASHES.length, "分配表应与名单一一对应");
  const counts = new Array(23).fill(0);
  for (const v of VOICE_INDEXES) {
    assert.ok(v >= 0 && v < 23);
    counts[v]++;
  }
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  assert.ok(max - min <= 1, `全员分配应严格平均：max=${max} min=${min}`);
});

test("哈希：确定性且格式正确", () => {
  const h = fnv1a("示例同学|demo");
  assert.equal(h, fnv1a("示例同学|demo"));
  assert.ok(/^[0-9a-f]{8}$/.test(h));
  // 名单哈希为 8 位十六进制，且规模与名单一致（不在此校验真实姓名，避免隐私明文入库）
  assert.ok(ROSTER_HASHES.length >= 600);
  assert.ok(ROSTER_HASHES.every(x => /^[0-9a-f]{8}$/.test(x)));
});

test("祝福读取：同哈希稳定，索引读取与分布一致", () => {
  const h = ROSTER_HASHES[0];
  assert.equal(blessingFor(h), BLESSINGS[blessingIndexFor(h)]);
  assert.equal(blessingByIndex(7), BLESSINGS[7]);
});
