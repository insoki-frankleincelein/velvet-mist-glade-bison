import { createFileRoute, Link } from "@tanstack/react-router";
import { usePrefs } from "@/lib/prefs";

export const Route = createFileRoute("/root/$codeId")({ component: Moved });

function Moved() {
  const lang = usePrefs((s) => s.lang);
  return (
    <section>
      <h1 className="font-display text-4xl text-green">{lang === "ar" ? "لا مادة منشورة هنا" : "Pas d'article publié ici"}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {lang === "ar" ? "الصق النص من الجريدة الرسمية في المكتبة." : "Collez le texte du Journal officiel dans la bibliothèque."}
      </p>
      <Link to="/law" className="mt-5 flex h-12 items-center justify-center rounded-md bg-green font-medium text-on-green">
        {lang === "ar" ? "أصل القانون" : "Le texte de loi"}
      </Link>
    </section>
  );
}
