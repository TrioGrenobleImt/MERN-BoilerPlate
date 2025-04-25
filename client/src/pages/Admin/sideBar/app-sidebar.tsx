import * as React from "react";
import { Home, NotebookText, Presentation, Settings, UsersIcon } from "lucide-react";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { useAuthContext } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const adminMenus = {
  navMain: [
    {
      title: "Dashboard",
      icon: Presentation,
      url: "/admin/dashboard",
      isActive: true,
    },
    {
      title: "Users",
      icon: UsersIcon,
      url: "/admin/users",
    },
    {
      title: "Logs",
      icon: NotebookText,
      url: "/admin/logs",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/admin/settings",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={() => navigate("/")}>
        <Button variant="outline" className="p-4">
          <Home className="w-6 h-6" />
          {state === "expanded" ? <span>Back to the application</span> : null}
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminMenus.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={authUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
