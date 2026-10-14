import tc01 from "./cases/tc-01-garage.json" with { type: "json" };
import type { L } from "./schema";

export type Example = { id: string; title: L; story: string };

/** Logic samples. They open a path. They are not your file and not a judgment. */
export const examples: Example[] = [
  {
    id: "garage",
    title: { ar: "سيارة في الكراج", fr: "Voiture au garage" },
    story: tc01.story,
  },
  {
    id: "work",
    title: { ar: "فصل من العمل", fr: "Licenciement" },
    story: "فصلني المستخدم. عندي محضر من مفتشية العمل ولا أعرف أي شباك آتي بعده.",
  },
  {
    id: "lock",
    title: { ar: "تهديد القفل", fr: "Menace sur la serrure" },
    story: "صاحب السكن يريد إخراجي وهدد بتغيير القفل.",
  },
  {
    id: "cheque",
    title: { ar: "شيك عاد", fr: "Chèque revenu" },
    story: "استلمت شيكاً من زبون وعاد من البنك بلا رصيد.",
  },
  {
    id: "name",
    title: { ar: "خطأ في الاسم", fr: "Erreur de nom" },
    story: "اسمي في شهادة الميلاد مكتوب بخطأ وأريد تصحيح الحالة المدنية.",
  },
  {
    id: "admin",
    title: { ar: "قرار إداري", fr: "Décision administrative" },
    story: "بلغوني بقرار إداري يرفض طلبي وأريد أن أسأل عن إلغائه.",
  },
];
