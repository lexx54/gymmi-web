import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

export const LANGUAGE_STORAGE_KEY = 'gymmi.language';
export const supportedLanguages = ['en', 'es'] as const;

export type AppLanguage = (typeof supportedLanguages)[number];

const isAppLanguage = (value: string | null): value is AppLanguage =>
  value === 'en' || value === 'es';

const detectBrowserLanguage = (): AppLanguage => {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
};

export const getStoredLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isAppLanguage(storedLanguage) ? storedLanguage : detectBrowserLanguage();
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

export const setAppLanguage = async (language: AppLanguage) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  await i18n.changeLanguage(language);
};

export default i18n;
