import { useTranslation } from "react-i18next";
import { FR, GB } from "country-flag-icons/react/3x2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Globe } from "lucide-react";
import { getFullNamesOfLocales, listOfLocales } from "@/lib/i18n";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const LanguageChanger = () => {
  const {
    i18n: { changeLanguage, language, t },
  } = useTranslation();

  const handleChangeLanguage = (l: string) => {
    localStorage.setItem("i18nextLng", l);
    changeLanguage(l);
    toast.success(t("navbar.languageChanged"));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer text-primary">
        <Button variant="outline" size="sm">
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>{t("navbar.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {listOfLocales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => handleChangeLanguage(l)}
            className={` cursor-pointer flex items-center ${language === l ? "bg-secondary" : ""}`}
          >
            {l === "fr" && <FR />}
            {l === "en" && <GB />}

            {getFullNamesOfLocales(l)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
