import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { assertNoInventedCitation, assertStep, ensurePaths } from "./schema.ts";
import type { CatalogEntry, PathDef, Step, WorkedCase } from "./schema.ts";

function read(name: string) {
  return JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
}

test("tc-01 garage ladder stays unsourced and does not move the car", () => {
  const tc = read("./cases/tc-01-garage.json") as WorkedCase;
  assert.equal(tc.questions.length <= 4, true);
  assert.deepEqual(
    tc.questions.map((q) => q.rank),
    [1, 2, 3, 4],
  );
  const rungs = new Set(tc.ladder.map((s) => s.rung));
  for (const rung of ["emergency", "main", "pressure", "unblock"]) {
    assert.equal(rungs.has(rung as Step["rung"]), true, rung);
  }
  assert.equal(tc.paths.includes("succession"), true);
  assert.deepEqual(ensurePaths([]), ["open-file"]);
  assert.deepEqual(ensurePaths(tc.paths), ["succession", "criminal-complaint"]);

  const blob = JSON.stringify(tc);
  assert.match(blob, /لا تنقل السيارة/);
  assert.doesNotMatch(blob, /اسحب السيارة|أخرج السيارة بنفسك|انقل السيارة/);
  assertNoInventedCitation(tc);
  for (const [i, step] of tc.ladder.entries()) assertStep(step, `ladder[${i}]`);
  assert.equal(tc.ladder[0].urgent, true);
  assert.equal(tc.ladder.every((s) => s.articles.length === 0), true);
  assert.equal(tc.ladder.every((s) => s.cost.kind === "ASK_DEVIS"), true);
});

test("succession path and catalog have no published gaps", () => {
  const path = read("./paths/succession.json") as PathDef;
  const catalog = read("./paths/catalog.json") as CatalogEntry[];
  const articles = read("./law/articles.json") as unknown[];
  const offices = read("./lawyers/offices.json") as unknown[];
  assert.equal(articles.length, 0);
  assert.equal(offices.length, 0);
  assert.equal(path.id, "succession");
  assert.equal(catalog.filter((c) => c.id === "succession").length, 1);
  const extra = [
    "land-title",
    "traffic-insurance",
    "consumer",
    "neighbour",
    "commercial-lease",
    "company-partners",
    "work-accident",
    "kafala",
    "judgment-enforcement",
    "filiation",
    "coownership",
    "construction-works",
    "tax-dispute",
    "building-permit",
  ];
  for (const id of extra) {
    const row = catalog.find((c) => c.id === id);
    assert.ok(row, id);
    assert.equal(row.status, "GUIDED");
  }
  assert.equal(catalog.some((c) => c.id === "open-file"), true);
  assertNoInventedCitation(path);
  path.steps.forEach((s, i) => assertStep(s, `succession[${i}]`));
});
