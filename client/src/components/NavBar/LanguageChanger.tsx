import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useState } from "react";
import { FR, GB } from "country-flag-icons/react/3x2";

export const LanguageChanger = () => {
  const {
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "fr" ? "en" : "fr";
    localStorage.setItem("i18nextLng", newLanguage);
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleChangeLanguage}>
      <FR
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          currentLanguage === "fr" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <GB
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          currentLanguage === "en" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
    </Button>
  );
};
