import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

export const LANGUAGE_STORAGE_KEY = 'gymmi.language';
export const supportedLanguages = ['en', 'es'] as const;

export type AppLanguage = (typeof supportedLanguages)[number];

/** Used until the person picks a language; their choice is then stored. */
export const DEFAULT_LANGUAGE: AppLanguage = 'es';

const isAppLanguage = (value: string | null): value is AppLanguage =>
  value === 'en' || value === 'es';

export const getStoredLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isAppLanguage(storedLanguage) ? storedLanguage : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const syncDocumentLanguage = (language: string) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language.startsWith('en') ? 'en' : 'es';
  }
};

syncDocumentLanguage(i18n.language ?? DEFAULT_LANGUAGE);
i18n.on('languageChanged', syncDocumentLanguage);

export const setAppLanguage = async (language: AppLanguage) => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Storage can be blocked (private mode); the switch still applies now.
    }
  }

  await i18n.changeLanguage(language);
};

export default i18n;
