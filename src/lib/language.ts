const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome",
  },
  hi: {
    welcome: "स्वागत है",
  }
};

export function getTranslation(lang: "en" | "hi", key: string): string {
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  return key; // fallback
}
