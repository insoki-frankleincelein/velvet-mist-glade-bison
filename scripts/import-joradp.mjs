#!/usr/bin/env node
/**
 * Import statute rows YOU extracted from a Journal officiel PDF.
 *
 * It does not download, OCR, or invent text.
 *
 * Input JSON array, each item:
 *   { "code", "number", "arabic_text", "french_working_translation",
 *     "source_url", "publication_date" }
 * source_url must be on joradp.dz (or a file:// note you control is rejected —
 * only https://www.joradp.dz/...). publication_date is YYYY-MM-DD.
 *
 * Usage:
 *   node scripts/import-joradp.mjs src/mizan/law/inbox.json
 * Writes src/mizan/law/articles.json (replaces the array).
 */
import { readFileSync, writeFileSync } from "node:fs";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Pass the inbox JSON extracted from your JO PDF.");
  process.exit(1);
}

const raw = JSON.parse(readFileSync(inputPath, "utf8"));
if (!Array.isArray(raw) || raw.length === 0) {
  console.error("Inbox must be a non-empty array. Empty means nothing was imported.");
  process.exit(1);
}

const out = [];
for (const [i, row] of raw.entries()) {
  const need = ["code", "number", "arabic_text", "source_url", "publication_date"];
  for (const key of need) {
    if (!row[key] || !String(row[key]).trim()) {
      console.error(`Row ${i} missing ${key}. Not filled from memory.`);
      process.exit(1);
    }
  }
  let url;
  try {
    url = new URL(row.source_url);
  } catch {
    console.error(`Row ${i} source_url is not a URL.`);
    process.exit(1);
  }
  if (url.hostname !== "www.joradp.dz" && url.hostname !== "joradp.dz") {
    console.error(`Row ${i} source must be joradp.dz, got ${url.hostname}`);
    process.exit(1);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.publication_date)) {
    console.error(`Row ${i} publication_date must be YYYY-MM-DD`);
    process.exit(1);
  }
  out.push({
    code: String(row.code),
    number: String(row.number),
    arabic_text: String(row.arabic_text).trim(),
    french_working_translation: String(row.french_working_translation ?? "").trim(),
    status: "PUBLISHED",
    source_url: url.toString(),
    publication_date: row.publication_date,
  });
}

const target = new URL("../src/mizan/law/articles.json", import.meta.url);
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
console.log(`Imported ${out.length} published articles. No gaps were filled.`);
