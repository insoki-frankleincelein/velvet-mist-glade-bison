import assert from "node:assert/strict";
import { test } from "node:test";
import { examples } from "../examples.ts";
import { identify, stillNeeded } from "../papers.ts";
import { assertNoInventedCitation } from "../schema.ts";
import { classify } from "./classify.ts";
import { talk } from "./talk.ts";

test("a death certificate is named and a blank page is not", () => {
  const hit = identify("الجمهورية الجزائرية شهادة الوفاة");
  assert.equal(hit?.id, "death");
  assert.equal(identify("ورقة بيضاء بلا عنوان"), null);
  const birth = identify("شهادة الميلاد عقد الميلاد");
  assert.equal(birth?.id, "birth");
});

test("logic examples open a path and invent nothing", () => {
  for (const example of examples) {
    const brief = classify(example.story, "16");
    assert.ok(brief.paths.length > 0, example.id);
    assertNoInventedCitation(brief);
  }
  const work = classify(examples.find((e) => e.id === "work")!.story, "16");
  assert.equal(work.paths.includes("labour"), true);
  const lock = classify(examples.find((e) => e.id === "lock")!.story, "16");
  assert.equal(lock.paths.includes("eviction"), true);
  assert.match(JSON.stringify(lock.ladder), /لا تغيّر القفل/);
});

test("the voice reply stays inside the mission", () => {
  const brief = classify(examples[0].story, "");
  const step = brief.ladder[0];
  assert.match(talk("وين نروح", step).ar, /محكمة|أمانة|ضبط/);
  assert.match(talk("قداش الثمن", step).ar, /تسعيرة/);
  assert.doesNotMatch(talk("عطيني المادة", step).ar, /المادة\s*\d/);
  assertNoInventedCitation(talk("شنو ندير", step));
});

test("papers already in hand drop off the missing list", () => {
  const missing = stillNeeded(["succession"], ["death"]);
  assert.equal(missing.some((p) => p.id === "death"), false);
  assert.equal(missing.some((p) => p.id === "family-book"), true);
});
