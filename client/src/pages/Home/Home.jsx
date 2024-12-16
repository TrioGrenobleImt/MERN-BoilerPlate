import { useTranslation } from "react-i18next";

export const Home = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const handleChangeLanguage = () => {
    const newLanguage = language === "en" ? "fr" : "en";
    changeLanguage(newLanguage);
  };

  return (
    <div>
      <h1>{t("home")}</h1>
      <h3>Current Language: {language}</h3>
      <button type="button" onClick={handleChangeLanguage}>
        Change Language
      </button>
    </div>
  );
};
