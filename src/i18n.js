import i18n from "i18next";
import Cookies from "js-cookie";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./translations/en.json";
import translationAR from "./translations/ar.json";

const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    detection: {
      order: ["path"],
      checkWhitelist: true
    },
    resources,
    fallbackLng: "en",
    // languages: ['en', 'ar'],
    // lng: Cookies.get('language') || 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
