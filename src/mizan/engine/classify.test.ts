import assert from "node:assert/strict";
import { test } from "node:test";
import tc01 from "../cases/tc-01-garage.json" with { type: "json" };
import { assertNoInventedCitation, assertStep } from "../schema.ts";
import { classify } from "./classify.ts";
import { parseImport } from "./import-check.ts";
import { suggest } from "./next.ts";

test("garage story keeps the ladder and never says to move the car", () => {
  const brief = classify(tc01.story, "");
  assert.equal(brief.garage, true);
  assert.deepEqual(brief.paths, ["succession", "criminal-complaint"]);
  assert.equal(brief.questions.length <= 4, true);
  assert.equal(brief.ladder[0].urgent, true);
  assert.match(JSON.stringify(brief.ladder), /لا تنقل السيارة/);
  assertNoInventedCitation(brief);
  brief.ladder.forEach((step, i) => assertStep(step, `g[${i}]`));
});

test("unknown story still opens a file and labour hides any deadline number", () => {
  const unknown = classify("hello ???", "16");
  assert.deepEqual(unknown.paths, ["open-file"]);
  assertNoInventedCitation(unknown);
  const work = classify("فصلني المستخدم بعد نزاع في مفتشية العمل", "16");
  assert.equal(work.paths.includes("labour"), true);
  assert.doesNotMatch(JSON.stringify(work.ladder), /شهر|mois|\b[0-9]{1,2}\b/);
  work.ladder.forEach((step, i) => assertStep(step, `w[${i}]`));
});

test("import rejects anything that is not the official journal", () => {
  const bad = parseImport(
    JSON.stringify([{ code: "cpca", number: "1", arabic_text: "نص", source_url: "https://example.com/a", publication_date: "2008-04-23" }]),
  );
  assert.equal(bad.ok, false);
  assert.equal(parseImport("[]").ok, false);
  const good = parseImport(
    JSON.stringify([
      {
        code: "cpca",
        number: "1",
        arabic_text: "نص من الجريدة",
        french_working_translation: "",
        source_url: "https://www.joradp.dz/FTP/jo-arabe/2008/A2008021.pdf",
        publication_date: "2008-04-23",
      },
    ]),
  );
  assert.equal(good.ok, true);
  if (good.ok) assert.equal(good.articles[0].status, "PUBLISHED");
});

test("the three missions stay in order", () => {
  assert.equal(suggest(null, 0, 0).to, "/case");
  const done = {
    id: "1",
    story: "x",
    paths: ["open-file"],
    questions: [],
    ladder: [],
    checklist: [],
    understood: { ar: "", fr: "" },
    answers: {},
    phase: "done" as const,
    qIndex: 0,
    missionIndex: 0,
    checks: {},
    papers: [],
    updatedAt: "",
  };
  assert.equal(suggest(done, 0, 0).to, "/law");
  assert.equal(suggest(done, 1, 0).to, "/lawyers");
  assert.equal(suggest(done, 1, 1).to, "/me");
});
