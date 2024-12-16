import React from "react";
import { useTranslation } from "react-i18next";

export const LanguageChanger = () => {
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();

  const handleChangeLanguage = () => {
    const newLanguage = language === "en" ? "fr" : "en";
    changeLanguage(newLanguage);
    localStorage.setItem("i18nextLng", newLanguage);
  };

  return (
    <div className="flex items-start gap-12">
      <h3>Current Language: {language}</h3>
      <button type="button" onClick={handleChangeLanguage}>
        Change Language
      </button>
    </div>
  );
};
