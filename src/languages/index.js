import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import enLang from "./en";
import viLang from "./vi"

i18next.use(initReactI18next).init(
  {
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: "en",
    resources: {
      en: enLang,
      vi: viLang,
    },
    defaultNS: "common",  
  },
  (err) => {
    if (err) {
      return console.error(err);
    }
  }
);

export default i18next;

export const getLabel = (key) => i18next.getFixedT(i18next.language)(key);