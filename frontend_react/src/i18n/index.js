import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import mr from './locales/mr/translation.json';

export const LANGUAGE_STORAGE_KEY = 'si_language';

const resolveInitialLanguage = () => {
  if (typeof localStorage === 'undefined') return 'en';
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'en' || stored === 'hi' || stored === 'mr') {
    return stored;
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: resolveInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'hi', 'mr'],
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
