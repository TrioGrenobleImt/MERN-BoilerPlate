import * as React from "react";
import { Home, NotebookText, Presentation, Settings, UsersIcon } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LanguageChanger } from "@/components/Navbar/languageChanger";
import { ThemeChanger } from "@/components/Navbar/themeChanger";
import { useTranslation } from "react-i18next";

const adminMenus = {
  navMain: [
    {
      title: "dashboard",
      icon: Presentation,
      url: "/admin/dashboard",
      isActive: true,
    },
    {
      title: "users",
      icon: UsersIcon,
      url: "/admin/users",
    },
    {
      title: "logs",
      icon: NotebookText,
      url: "/admin/logs",
    },
    {
      title: "settings",
      icon: Settings,
      url: "/admin/settings",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={() => navigate("/")}>
        <Button variant="outline" className="p-4">
          <Home className="w-6 h-6" />
          {state === "expanded" ? <span>{t("pages.admin.back_to_app")}</span> : null}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminMenus.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeChanger />
        <LanguageChanger />
        <NavUser user={authUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
