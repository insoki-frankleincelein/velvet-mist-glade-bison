import { useEffect } from "react";
import { usePrefs } from "@/lib/prefs";
import { useGuide } from "@/mizan/store";

export function Boot() {
  const lang = usePrefs((s) => s.lang);
  const theme = useGuide((s) => s.theme);
  useEffect(() => {
    void Promise.resolve(usePrefs.persist.rehydrate());
    void Promise.resolve(useGuide.persist.rehydrate());
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return null;
}
