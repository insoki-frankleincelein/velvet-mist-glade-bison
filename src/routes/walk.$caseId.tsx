import { createFileRoute, Link } from "@tanstack/react-router";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/walk/$caseId")({ component: Moved });

function Moved() {
  const lang = usePrefs((s) => s.lang);
  return (
    <section>
      <h1 className="font-display text-4xl text-green">{lang === "ar" ? "المسار صار مهمات" : "Le parcours est devenu des missions"}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {lang === "ar"
          ? "الخطوات القديمة كانت تذكر مواداً بلا نص من الجريدة. ابدأ من القصة."
          : "Les anciennes étapes citaient des articles sans texte du Journal. Partez du récit."}
      </p>
      <Link to="/case" className="mt-5 flex h-12 items-center justify-center rounded-md bg-green font-medium text-on-green">
        {lang === "ar" ? "قضيتي" : "Mon dossier"}
      </Link>
    </section>
  );
}
