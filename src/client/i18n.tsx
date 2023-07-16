import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";


i18n
.use(LanguageDetector)
.use(Backend)
.use(initReactI18next)
.init({
  backend: {
    loadPath: "/i18n/{{lng}}.json"
  },
  debug: true,
  lng: "fi",
  fallbackLng: "fi",
  saveMissing: true,
  interpolation: {
    escapeValue: false,
  }
});

export default i18n;