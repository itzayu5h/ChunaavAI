'use client'

/**
 * LanguageContext — provides bilingual (HI/EN) toggle across all pages.
 * Persists choice to localStorage so it survives page reloads.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'EN' | 'HI'

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  isHindi: boolean
  t: (en: string, hi: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  toggleLanguage: () => {},
  isHindi: false,
  t: (en) => en,
})

/**
 * Wrap your app with this provider to enable bilingual support.
 * @param children - React children
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN')

  useEffect(() => {
    const saved = localStorage.getItem('chunaavai-lang') as Language | null
    if (saved === 'HI' || saved === 'EN') setLanguage(saved)
  }, [])

  function toggleLanguage() {
    const next: Language = language === 'EN' ? 'HI' : 'EN'
    setLanguage(next)
    localStorage.setItem('chunaavai-lang', next)
  }

  /** Translate: returns Hindi string when HI is active, English otherwise */
  function t(en: string, hi: string): string {
    return language === 'HI' ? hi : en
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, isHindi: language === 'HI', t }}>
      {children}
    </LanguageContext.Provider>
  )
}

/** Hook to consume language context */
export function useLanguage() {
  return useContext(LanguageContext)
}
