import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import languageDetector from "i18next-browser-languagedetector";
import { ENV_MODE } from "@/features/common/constants";

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .use(languageDetector)
  .init({
    supportedLngs: ["en", "hi", "mr"],
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    fallbackLng: "en",
    fallbackNS: "common",
    ns: ["common"],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath:
        ENV_MODE === "production"
          ? "./assets/locales/{{ns}}/{{lng}}.json"
          : "/assets/locales/{{ns}}/{{lng}}.json",
    },
    debug: true,
  });

export default i18n;
