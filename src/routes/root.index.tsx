import { createFileRoute, Link } from "@tanstack/react-router";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/root/")({ component: Moved });

function Moved() {
  const lang = usePrefs((s) => s.lang);
  return (
    <section>
      <h1 className="font-display text-4xl text-green">{lang === "ar" ? "النص لم يُستورد" : "Texte non importé"}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {lang === "ar"
          ? "المسودة السابقة أُخرجت من الشاشة لأنها لم تُنسخ من الجريدة الرسمية."
          : "L'ancien brouillon n'est plus affiché : il n'avait pas été copié du Journal officiel."}
      </p>
      <Link to="/law" className="mt-5 flex h-12 items-center justify-center rounded-md bg-green font-medium text-on-green">
        {lang === "ar" ? "إلى الاستيراد" : "Vers l'import"}
      </Link>
    </section>
  );
}
