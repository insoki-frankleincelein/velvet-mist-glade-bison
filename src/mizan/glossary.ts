export type Gloss = {
  ar: string;
  darija: string | null;
  fr: string;
  /** unsure = do not show the Darija in the product until you confirm it. */
  confidence: "ok" | "unsure";
  note: string;
};

/** Step titles and tips only. Never substitute this for a statute. */
export const glossary: Gloss[] = [
  { ar: "المحكمة", darija: "التريبونال", fr: "Tribunal", confidence: "ok", note: "دارجة الجزائر تقول التريبونال يومياً." },
  { ar: "الولاية", darija: "الولاية", fr: "Wilaya", confidence: "ok", note: "نفس الكلمة." },
  { ar: "موثق", darija: "الموثق", fr: "Notaire", confidence: "ok", note: "تُستعمل كما هي." },
  { ar: "سيارة", darija: "طوموبيل", fr: "Voiture", confidence: "ok", note: "دارجة واسعة. راجع الكتابة التي تفضّلها." },
  { ar: "كراج", darija: "قاراج", fr: "Garage", confidence: "unsure", note: "النطق يختلف. لا تُثبَّت الكتابة حتى تراجعها." },
  { ar: "نفقة", darija: "النفقة", fr: "Pension / entretien", confidence: "ok", note: "تُقال بالفصحى في الكلام أيضاً." },
  { ar: "شيك", darija: "الشيك", fr: "Chèque", confidence: "ok", note: "" },
  { ar: "خلع", darija: null, fr: "Khul'", confidence: "unsure", note: "لا أضع دارجة حتى لا أحرّف المصطلح الشرعي." },
  { ar: "تطليق", darija: null, fr: "Divorce demandé par l'épouse", confidence: "unsure", note: "يبقى بالفصحى في العناوين حتى تراجع الدارجة." },
  { ar: "أمانة الضبط", darija: null, fr: "Greffe", confidence: "unsure", note: "يُقال «الغريف» أو «لابيّاس» حسب المدينة. لا أخترع كتابة." },
  { ar: "محضر قضائي", darija: "المحضر", fr: "Huissier", confidence: "ok", note: "«المحضر» في الكلام. اللقب الرسمي يبقى في النص القانوني." },
  { ar: "وكيل الجمهورية", darija: "البروكير", fr: "Procureur de la République", confidence: "unsure", note: "البروكير شائعة. أكّد إن كانت مفهومة في ولايتك قبل عرضها." },
  { ar: "استعجال", darija: null, fr: "Référé", confidence: "unsure", note: "بعض الناس يقولون «ريفي». غير مؤكدة كعنوان." },
  { ar: "حراسة قضائية", darija: null, fr: "Séquestre judiciaire", confidence: "unsure", note: "لا دارجة آمنة عندي." },
  { ar: "محضر معاينة", darija: null, fr: "Procès-verbal de constat", confidence: "unsure", note: "«كونستا» تُسمع. لا أضعها عنواناً حتى تراجعها." },
  { ar: "قسمة قضائية", darija: null, fr: "Partage judiciaire", confidence: "unsure", note: "العنوان يبقى فصيحاً." },
  { ar: "دفتر عقاري", darija: "الدفتر العقاري", fr: "Livret foncier", confidence: "ok", note: "" },
  { ar: "المحافظة العقارية", darija: null, fr: "Conservation foncière", confidence: "unsure", note: "الاسم الرسمي أوضح من أي اختصار." },
  { ar: "مكتب المصالحة", darija: null, fr: "Bureau de conciliation", confidence: "unsure", note: "يُفهم عبر مفتشية العمل. الدارجة غير ثابتة." },
  { ar: "تركة", darija: "الوراثة", fr: "Succession", confidence: "unsure", note: "«الوراثة» قد تعني التركة أو الدعوى. راجعها." },
];
