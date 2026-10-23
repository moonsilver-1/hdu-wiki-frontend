import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import story from "../scripts/media/story.json";

test("the friendship film keeps the abstract identity joke out of dialogue", () => {
  const dialogue = story.scenes.map((scene) => scene.text).join("\n");
  assert.doesNotMatch(dialogue, /那我是谁|自封/);
  assert.match(dialogue, /我陪你/);
  assert.match(dialogue, /这次换我陪你/);
  assert.match(dialogue, /我们一起上/);
  assert.notEqual(story.voices.boy, story.voices.girl);
});

test("the final scene stays on the shared stage and ends in audience cheering", () => {
  const stageStart = story.scenes.findIndex((scene) => scene.setting === "stage");
  assert.ok(stageStart > 0);
  assert.ok(story.scenes.slice(stageStart).every((scene) => scene.setting === "stage"));
  const finale = story.scenes.at(-1);
  assert.equal(finale?.role, "crowd");
  assert.equal(finale?.text, "GOAT！GOAT！GOAT！");
  assert.equal(finale?.setting, "stage");
});

test("the shipped movie, cover and captions exist and agree with the script", () => {
  const mp4 = readFileSync("public/promo/hdu-friends.mp4");
  assert.equal(mp4.toString("ascii", 4, 8), "ftyp");
  assert.ok(mp4.includes(Buffer.from("soun")), "the movie must include an audio track");
  const poster = readFileSync("public/promo/hdu-friends-poster.jpg");
  assert.equal(poster.readUInt16BE(0), 0xffd8);
  const captions = readFileSync("public/promo/hdu-friends.zh.vtt", "utf8");
  assert.match(captions, /^WEBVTT/);
  let previousCaption = -1;
  for (const scene of story.scenes) {
    const caption = captions.indexOf(scene.text);
    assert.ok(caption > previousCaption, `caption order must match the script: ${scene.text}`);
    previousCaption = caption;
  }
  assert.doesNotMatch(captions, /那我是谁/);
});
