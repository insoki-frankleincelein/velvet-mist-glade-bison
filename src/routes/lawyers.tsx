import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { wilayas } from "@/data/wilayas";
import { tx } from "@/lib/copy";
import { usePrefs } from "@/lib/prefs";
import { ASK_DEVIS } from "@/mizan/schema";
import { useGuide } from "@/mizan/store";
import { useReady } from "@/mizan/use-ready";
import type { Cost } from "@/mizan/schema";

export const Route = createFileRoute("/lawyers")({ component: LawyersPage });

function LawyersPage() {
  const lang = usePrefs((s) => s.lang);
  const ready = useReady();
  const offices = useGuide((s) => s.offices);
  const addOffice = useGuide((s) => s.addOffice);
  const removeOffice = useGuide((s) => s.removeOffice);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p className="text-xs text-seal">{lang === "ar" ? "المهمة ٣ من ٣" : "Mission 3 sur 3"}</p>
      <h1 className="mt-1 font-display text-4xl text-green">{lang === "ar" ? "المحامون" : "Avocats"}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {lang === "ar"
          ? "لا دليل من الاتحاد على هذا الجهاز. أضف مكتباً تعرفه. يبقى عندك فقط."
          : "Pas d'annuaire de l'union sur cet appareil. Ajoutez un cabinet que vous connaissez. Il reste chez vous."}
      </p>
      {!ready ? (
        <p className="mt-6 text-sm text-muted">…</p>
      ) : offices.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-line p-6 text-center text-sm text-muted">
          {lang === "ar" ? "لا مكتب بعد." : "Aucun cabinet encore."}
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {offices.map((office) => (
            <li key={office.id} className="rounded-lg border border-line bg-sheet p-4">
              <p className="text-lg font-medium">{office.name}</p>
              <p className="mt-1 text-sm text-muted">
                {office.bar || (lang === "ar" ? "المنظمة غير مذكورة" : "Barreau non indiqué")}
                {" · "}
                {wilayas.find((w) => w.id === office.wilayaId) ? tx(lang, wilayas.find((w) => w.id === office.wilayaId)!.name) : office.wilayaId}
              </p>
              {office.specialty && <p className="mt-2 text-sm">{office.specialty}</p>}
              {office.languages && <p className="text-sm text-muted">{office.languages}</p>}
              <p className="mt-2 text-sm">{priceText(office.price, lang)}</p>
              <p className="mt-1 text-xs text-seal">{lang === "ar" ? "أُضيف محلياً. ليس دليل المنظمة." : "Ajouté localement. Pas l'annuaire de l'ordre."}</p>
              <div className="mt-3 flex gap-2">
                {office.phone && (
                  <a href={`tel:${office.phone}`} className="flex h-11 flex-1 items-center justify-center rounded-md bg-green text-sm text-on-green">
                    {lang === "ar" ? "اتصال" : "Appeler"}
                  </a>
                )}
                {wa(office.whatsapp) && (
                  <a href={wa(office.whatsapp)} className="flex h-11 flex-1 items-center justify-center rounded-md border border-line text-sm">
                    WhatsApp
                  </a>
                )}
              </div>
              <button type="button" onClick={() => removeOffice(office.id)} className="mt-2 text-sm text-muted">
                {lang === "ar" ? "احذف من الجهاز" : "Retirer de l'appareil"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open ? (
        <OfficeForm lang={lang} onClose={() => setOpen(false)} onSave={addOffice} />
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="mt-5 h-12 w-full rounded-md bg-green font-medium text-on-green">
          {lang === "ar" ? "أضف مكتبك" : "Ajouter votre cabinet"}
        </button>
      )}
    </div>
  );
}

function OfficeForm({
  lang,
  onClose,
  onSave,
}: {
  lang: "ar" | "fr";
  onClose: () => void;
  onSave: (office: {
    id: string;
    name: string;
    bar: string;
    wilayaId: string;
    specialty: string;
    languages: string;
    phone: string;
    whatsapp: string;
    price: Cost;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [bar, setBar] = useState("");
  const [wilayaId, setWilayaId] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [languages, setLanguages] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [ranged, setRanged] = useState(false);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !wilayaId) {
      setError(lang === "ar" ? "الاسم والولاية لازمان." : "Le nom et la wilaya sont requis.");
      return;
    }
    let price: Cost = ASK_DEVIS;
    if (ranged) {
      const minDa = Number(min);
      const maxDa = Number(max);
      if (!min || !max || !source.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(minDa) || Number.isNaN(maxDa)) {
        setError(lang === "ar" ? "المدى يحتاج رقمين ومصدراً وتاريخاً. وإلا اترك «اطلب تسعيرة»." : "La fourchette exige deux nombres, une source et une date. Sinon laissez « devis ».");
        return;
      }
      price = { kind: "RANGE", min_da: minDa, max_da: maxDa, currency: "DZD", last_updated: date, source: source.trim() };
    }
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      bar: bar.trim(),
      wilayaId,
      specialty: specialty.trim(),
      languages: languages.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      price,
    });
    onClose();
  }

  const field = "mt-2 h-11 w-full rounded-md border border-line bg-sheet px-3";
  return (
    <form onSubmit={submit} className="mt-5 rounded-lg border border-line bg-sheet p-4">
      <label className="text-sm">{lang === "ar" ? "الاسم" : "Nom"}<input className={field} value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="mt-3 block text-sm">{lang === "ar" ? "المنظمة" : "Barreau"}<input className={field} value={bar} onChange={(e) => setBar(e.target.value)} /></label>
      <label className="mt-3 block text-sm">
        {lang === "ar" ? "الولاية" : "Wilaya"}
        <select className={field} value={wilayaId} onChange={(e) => setWilayaId(e.target.value)}>
          <option value="">{lang === "ar" ? "اختر" : "Choisir"}</option>
          {wilayas.map((w) => (
            <option key={w.id} value={w.id}>
              {tx(lang, w.name)}
            </option>
          ))}
        </select>
      </label>
      <label className="mt-3 block text-sm">{lang === "ar" ? "الاختصاص" : "Spécialité"}<input className={field} value={specialty} onChange={(e) => setSpecialty(e.target.value)} /></label>
      <label className="mt-3 block text-sm">{lang === "ar" ? "اللغات" : "Langues"}<input className={field} value={languages} onChange={(e) => setLanguages(e.target.value)} /></label>
      <label className="mt-3 block text-sm">{lang === "ar" ? "الهاتف" : "Téléphone"}<input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" /></label>
      <label className="mt-3 block text-sm">WhatsApp<input className={field} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="tel" /></label>
      <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" checked={ranged} onChange={(e) => setRanged(e.target.checked)} className="h-5 w-5" />
        {lang === "ar" ? "عندي مدى سعري مكتوب بمصدر وتاريخ" : "J'ai une fourchette écrite, avec source et date"}
      </label>
      {ranged && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input className={field} placeholder="min" value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" />
          <input className={field} placeholder="max" value={max} onChange={(e) => setMax(e.target.value)} inputMode="numeric" />
          <input className={`${field} col-span-2`} placeholder={lang === "ar" ? "المصدر" : "Source"} value={source} onChange={(e) => setSource(e.target.value)} />
          <input className={`${field} col-span-2`} placeholder="YYYY-MM-DD" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      )}
      {!ranged && <p className="mt-2 text-sm">{lang === "ar" ? "التكلفة: اطلب تسعيرة." : "Coût : demandez un devis."}</p>}
      {error && <p className="mt-2 text-sm text-seal">{error}</p>}
      <button type="submit" className="mt-4 h-12 w-full rounded-md bg-green font-medium text-on-green">
        {lang === "ar" ? "احفظ على الجهاز" : "Enregistrer sur l'appareil"}
      </button>
      <button type="button" onClick={onClose} className="mt-2 h-11 w-full text-sm text-muted">
        {lang === "ar" ? "إلغاء" : "Annuler"}
      </button>
    </form>
  );
}

function priceText(price: Cost, lang: "ar" | "fr") {
  if (price.kind !== "RANGE" || price.min_da == null || price.max_da == null || !price.source || !price.last_updated) {
    return lang === "ar" ? "اطلب تسعيرة" : "Demandez un devis";
  }
  return `${price.min_da}–${price.max_da} DZD · ${price.source} · ${price.last_updated}`;
}

function wa(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const n = digits.startsWith("0") ? `213${digits.slice(1)}` : digits;
  return `https://wa.me/${n}`;
}
