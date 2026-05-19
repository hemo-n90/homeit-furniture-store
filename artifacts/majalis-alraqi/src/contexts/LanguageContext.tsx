import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { translations, type Lang } from "@/i18n/translations";

type TranslationSet = (typeof translations)[Lang];

interface LanguageContextValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: TranslationSet;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "homeit_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored === "en" || stored === "ar") ? stored : "ar";
  });

  const t = translations[lang];
  const dir = t.dir;

  // Apply dir/lang to <html> element
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    document.title = lang === "ar"
      ? "هوميت للأثاث - أثاث فاخر"
      : "Homeit Furniture - Premium Home Décor";
  }, [lang, dir]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "ar" ? "en" : "ar");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
