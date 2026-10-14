import type { L, LegalRef } from "../schema";

export type ImportResult = { ok: true; articles: LegalRef[] } | { ok: false; error: L };

export function parseImport(raw: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      error: { ar: "هذا ليس JSON. الصق المصفوفة كما استخرجتها.", fr: "Ceci n'est pas du JSON. Collez le tableau extrait." },
    };
  }
  if (!Array.isArray(data) || data.length === 0) {
    return {
      ok: false,
      error: { ar: "المصفوفة فارغة. لا نملأ نصاً من الذاكرة.", fr: "Tableau vide. Aucun texte n'est inventé." },
    };
  }
  const articles: LegalRef[] = [];
  for (const [i, row] of data.entries()) {
    if (!row || typeof row !== "object") {
      return { ok: false, error: fail(i, "سطر ليس كائناً", "ligne qui n'est pas un objet") };
    }
    const rec = row as Record<string, unknown>;
    const need = ["code", "number", "arabic_text", "source_url", "publication_date"] as const;
    for (const key of need) {
      if (typeof rec[key] !== "string" || !rec[key].trim()) {
        return { ok: false, error: fail(i, `ينقص ${key}`, `il manque ${key}`) };
      }
    }
    let url: URL;
    try {
      url = new URL(String(rec.source_url));
    } catch {
      return { ok: false, error: fail(i, "رابط المصدر غير صالح", "source_url invalide") };
    }
    if (url.hostname !== "joradp.dz" && url.hostname !== "www.joradp.dz") {
      return {
        ok: false,
        error: fail(i, "المصدر يجب أن يكون موقع الجريدة الرسمية", "la source doit être le Journal officiel"),
      };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(rec.publication_date))) {
      return { ok: false, error: fail(i, "التاريخ بصيغة سنة-شهر-يوم", "la date doit être AAAA-MM-JJ") };
    }
    articles.push({
      code: String(rec.code).trim(),
      number: String(rec.number).trim(),
      arabic_text: String(rec.arabic_text).trim(),
      french_working_translation: typeof rec.french_working_translation === "string" ? rec.french_working_translation.trim() : "",
      status: "PUBLISHED",
      source_url: url.toString(),
      publication_date: String(rec.publication_date),
    });
  }
  return { ok: true, articles };
}

function fail(i: number, ar: string, fr: string): L {
  return { ar: `السطر ${i + 1}: ${ar}`, fr: `Ligne ${i + 1} : ${fr}` };
}
