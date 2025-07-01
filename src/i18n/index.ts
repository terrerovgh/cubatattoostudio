import en from './locales/en.json';
import es from './locales/es.json';

export const languages = {
  en: 'English',
  es: 'Español'
} as const;

export const defaultLang = 'en';

export const translations = {
  en,
  es
} as const;

export type Language = keyof typeof languages;

export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Language;
  return defaultLang;
}

export function useTranslations(lang: Language) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: any = translations[lang];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations[defaultLang];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key not found: ${key} for language: ${lang}`);
            return key; // Return the key itself as fallback
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
}

export function getStaticPaths() {
  return Object.keys(languages).map((lang) => ({
    params: { lang }
  }));
}

// Helper function to get the opposite language for language switcher
export function getAlternateLang(currentLang: Language): Language {
  return currentLang === 'en' ? 'es' : 'en';
}

// Helper function to build localized URLs
export function localizeUrl(url: string, lang: Language): string {
  if (lang === defaultLang) {
    return url;
  }
  return `/${lang}${url}`;
}

// Helper to remove locale from URL for default language
export function removeLocaleFromUrl(url: string): string {
  const [, maybeLang, ...rest] = url.split('/');
  if (maybeLang in languages) {
    return '/' + rest.join('/');
  }
  return url;
}
