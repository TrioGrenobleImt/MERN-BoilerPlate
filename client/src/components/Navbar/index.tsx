import { Link, useNavigate } from "react-router-dom";
import { ThemeChanger } from "./themeChanger";
import { LanguageChanger } from "./languageChanger";
import { useTranslation } from "react-i18next";
import { Separator } from "../ui/separator";
import { House, Menu, User, Wrench, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAuthContext } from "@/contexts/authContext";

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  // Handle clicks outside of the menu
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function closeDialogAndNavigate(link: string) {
    setIsOpen(false);
    navigate(link);
  }

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-50 border-b border-primary bg-background">
        <div className="items-center justify-between hidden p-4 px-8 select-none md:flex text-primary">
          <div className="text-3xl font-extrabold">
            <Link to="/">MERN-Boilerplate</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {authUser ? (
                <Button onClick={() => navigate("/account")} variant="link">
                  {t("navbar.account")}
                </Button>
              ) : (
                <Button onClick={() => navigate("/login")} variant="link">
                  {t("navbar.login")}
                </Button>
              )}
              {authUser?.role === "admin" && (
                <Button onClick={() => navigate("/admin/dashboard")} variant="link">
                  {t("navbar.dashboard")}
                </Button>
              )}
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="flex items-center justify-between gap-4">
              <LanguageChanger />
              <ThemeChanger />
            </div>
          </div>
        </div>

        {/* Mobile Navbar with Hamburger Menu */}
        <div className="flex items-center justify-between p-4 md:hidden ">
          <div className="text-3xl font-extrabold">
            <Link to="/"> MERN-Boilerplate</Link>
          </div>
          <Menu onClick={() => setIsOpen(!isOpen)} className="cursor-pointer" />
        </div>
        <div
          ref={menuRef}
          className={cn(
            "fixed top-0 right-0 w-4/5 h-screen overflow-hidden bg-background text-primary transition-transform duration-300 ease-in-out z-20",
            isOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex justify-end">
            <X onClick={() => setIsOpen(!isOpen)} className="m-4 cursor-pointer" />
          </div>
          <div className="flex flex-col gap-4 p-8 pt-2">
            <Button onClick={() => closeDialogAndNavigate("/")} variant="link" className="flex items-center justify-start gap-4">
              <House className="w-4 h-4" />
              {t("navbar.home")}
            </Button>

            <Button onClick={() => closeDialogAndNavigate("/account")} variant="link" className="flex items-center justify-start gap-4">
              <User className="w-4 h-4" />
              {t("navbar.account")}
            </Button>
            {authUser?.role === "admin" && (
              <Button
                onClick={() => closeDialogAndNavigate("/admin/dashboard")}
                variant="link"
                className="flex items-center justify-start gap-4"
              >
                <Wrench className="w-4 h-4" />
                {t("navbar.dashboard")}
              </Button>
            )}
            <Separator />
            <div className="flex items-center justify-center gap-4 ">
              <LanguageChanger />
              <ThemeChanger />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
