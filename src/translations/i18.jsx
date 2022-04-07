import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

import { initReactI18next } from 'react-i18next';

import common_pt from '../translations/pt/common.json';
import common_en from '../translations/en/common.json';

const resources = {
  'pt-BR': common_pt,
  'en-US': common_en,
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language,
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
