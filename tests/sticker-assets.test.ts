import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { inflateRawSync } from "node:zlib";
import { STICKERS, STICKER_PACKS } from "../lib/stickers";

const publicRoot = path.resolve("public");

test("published sticker originals are 100 distinct RGBA PNGs matching the catalog", () => {
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
    assert.ok(png.readUInt32BE(16) >= 512 && png.readUInt32BE(20) >= 512, item.src);
    assert.equal(png[25], 6, `RGBA transparency required: ${item.src}`);
    const hash = createHash("sha256").update(png).digest("hex");
    assert.ok(!signatures.has(hash), `Duplicate image: ${item.src}`);
    signatures.add(hash);
  }
  assert.equal(signatures.size, 100);
});

for (const pack of STICKER_PACKS) test(`${pack.role} ZIP contains its 50 unmodified PNG originals`, () => {
  const filename = path.join(publicRoot, pack.url);
  assert.ok(statSync(filename).size < 100 * 1024 * 1024, "static ZIP must remain below hosting and Git file limits");
  assert.equal(pack.size, `${(statSync(filename).size / 1_000_000).toFixed(1)} MB`);
  const zip = readFileSync(filename);
  assert.equal(zip.readUInt32LE(0), 0x04034b50);
  const end = zip.length - 22;
  assert.equal(zip.readUInt32LE(end), 0x06054b50, "ZIP central directory footer");
  const count = zip.readUInt16LE(end + 10);
  assert.equal(count, 52, "50 originals, a readme, and a manifest");
  let offset = zip.readUInt32LE(end + 16);
  const names: string[] = [];
  const originals = new Map(STICKERS.filter((item) => item.role === pack.role).map((item) => [
    `${item.role === "boy" ? "学长" : "学姐"}/${item.number}-${item.caption}.png`, item.src,
  ]));
  for (let i = 0; i < count; i++) {
    assert.equal(zip.readUInt32LE(offset), 0x02014b50);
    const nameLength = zip.readUInt16LE(offset + 28);
    const extraLength = zip.readUInt16LE(offset + 30);
    const commentLength = zip.readUInt16LE(offset + 32);
    const name = zip.toString("utf8", offset + 46, offset + 46 + nameLength);
    names.push(name);
    const src = originals.get(name);
    if (src) {
      const localOffset = zip.readUInt32LE(offset + 42);
      assert.equal(zip.readUInt32LE(localOffset), 0x04034b50);
      const dataOffset = localOffset + 30 + zip.readUInt16LE(localOffset + 26) + zip.readUInt16LE(localOffset + 28);
      const compressed = zip.subarray(dataOffset, dataOffset + zip.readUInt32LE(offset + 20));
      const method = zip.readUInt16LE(offset + 10);
      assert.ok(method === 0 || method === 8, `Supported ZIP compression: ${name}`);
      const decoded = method === 8 ? inflateRawSync(compressed) : compressed;
      const archivedHash = createHash("sha256").update(decoded).digest("hex");
      const originalHash = createHash("sha256").update(readFileSync(path.join(publicRoot, src))).digest("hex");
      assert.equal(archivedHash, originalHash, `Archive must retain the original: ${name}`);
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  const expected = [...originals.keys()].sort();
  assert.deepEqual(names.filter((name) => name.endsWith(".png")).sort(), expected);
  assert.ok(names.includes("使用说明.txt") && names.includes("清单.json"));
});
