import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// "Inline" English and Arabic translations.

// We can localize to any language and any number of languages.

const resources = {
  en: {
    translation: {
      app_name: 'Novo',
      greeting: 'Hello',
      welcome: 'Welcome',
    },
  },

  fr: {
    translation: {
      app_name: 'Novo',
      greeting: 'Bonjour',
      welcome: 'Bienvenue',
    },
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en', // if you're using a language detector, do not define the lng option
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
