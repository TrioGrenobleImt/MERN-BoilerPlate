import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "../locales/en.json";
import * as fr from "../locales/fr.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: localStorage.getItem("i18nextLng") || navigator.language.split("-")[0] || "en",
});

export const listOfLocales = ["en", "fr"];

const localeNames: { [key: string]: string } = {
  en: "English",
  fr: "Français",
  // ...
};

export const getFullNamesOfLocales = (locale: string) => {
  return localeNames[locale] || "";
};
