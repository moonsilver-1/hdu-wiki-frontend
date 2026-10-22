import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { STICKERS, STICKER_PACK_URL } from "../lib/stickers";

const publicRoot = path.resolve("public");

test("published sticker originals are 40 distinct RGBA PNGs matching the catalog", () => {
  const signatures = new Set<string>();
  for (const role of ["boy", "girl"]) {
    const actual = readdirSync(path.join(publicRoot, "stickers", role))
      .filter((name) => name.endsWith(".png")).sort();
    const expected = STICKERS.filter((item) => item.role === role)
      .map((item) => path.basename(item.src)).sort();
    assert.deepEqual(actual, expected, role);
  }
  for (const item of STICKERS) {
    const png = readFileSync(path.join(publicRoot, item.src));
    assert.deepEqual(png.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), item.src);
    assert.equal(png.toString("ascii", 12, 16), "IHDR", item.src);
    assert.ok(png.readUInt32BE(16) >= 256 && png.readUInt32BE(20) >= 256, item.src);
    assert.equal(png[25], 6, `RGBA transparency required: ${item.src}`);
    const hash = createHash("sha256").update(png).digest("hex");
    assert.ok(!signatures.has(hash), `Duplicate image: ${item.src}`);
    signatures.add(hash);
  }
  assert.equal(signatures.size, 40);
});

test("the same-origin ZIP contains exactly the 40 independent PNGs", () => {
  assert.equal(STICKER_PACK_URL, "/stickers/sheep-stickers-40.zip");
  const filename = path.join(publicRoot, STICKER_PACK_URL);
  assert.ok(statSync(filename).size < 100 * 1024 * 1024, "static ZIP must remain below hosting and Git file limits");
  const zip = readFileSync(filename);
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  const end = zip.length - 22;
  assert.equal(zip.readUInt32LE(end), 0x06054b50, "ZIP central directory footer");
  const count = zip.readUInt16LE(end + 10);
  let offset = zip.readUInt32LE(end + 16);
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    assert.equal(zip.readUInt32LE(offset), 0x02014b50);
    const nameLength = zip.readUInt16LE(offset + 28);
    const extraLength = zip.readUInt16LE(offset + 30);
    const commentLength = zip.readUInt16LE(offset + 32);
    names.push(zip.toString("utf8", offset + 46, offset + 46 + nameLength));
    offset += 46 + nameLength + extraLength + commentLength;
  }
  const expected = STICKERS.map((item) =>
    `${item.role === "boy" ? "学长" : "学姐"}/${item.number}-${item.caption}.png`).sort();
  assert.deepEqual(names.filter((name) => name.endsWith(".png")).sort(), expected);
  assert.ok(names.includes("使用说明.txt") && names.includes("清单.json"));
});
