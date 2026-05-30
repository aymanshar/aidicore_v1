import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Language } from '../types';
import { translations } from './dictionary';

type LanguageContextValue = { lang: Language; dir: 'rtl' | 'ltr'; setLang: (lang: Language) => void; t: (key: keyof typeof translations.en) => string; };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('aidicore_lang') as Language) || 'en');
  const setLang = (next: Language) => { localStorage.setItem('aidicore_lang', next); setLangState(next); };
  const value = useMemo<LanguageContextValue>(() => {
  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';

  return {
    lang,
    dir,
    setLang,
    t: (key: keyof typeof translations.en) => translations[lang][key] || key,
  };
}, [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { const ctx = useContext(LanguageContext); if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider'); return ctx; }
