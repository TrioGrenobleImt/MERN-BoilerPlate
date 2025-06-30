import { ChevronRight, House, LogOut, User, Wrench } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserInterface } from "@/interfaces/User";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export function NavUser({ user }: { user: UserInterface | null }) {
  if (!user) return null;
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { logout, loading } = useLogout();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const { t } = useTranslation();

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem ref={dropdownRef}>
        <DropdownMenu open={isDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <Avatar className="w-8 h-8 rounded-lg">
                <AvatarImage src={user.avatar} alt="User Avatar" className="object-cover object-center w-full h-full rounded-full" />
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-semibold truncate">{user.username}</span>
                <span className="text-xs truncate">{user.email}</span>
              </div>
              <ChevronRight className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="w-8 h-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt="User Avatar" className="object-cover object-center w-full h-full rounded-full" />
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-semibold truncate">{user.username}</span>
                  <span className="text-xs truncate">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer" onClick={() => navigate("/")}>
                {t("navbar.home")}
                <DropdownMenuShortcut>
                  <House className="w-4 h-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer" onClick={() => navigate("/account")}>
                {t("navbar.account")}
                <DropdownMenuShortcut>
                  <User className="w-4 h-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
                {t("navbar.dashboard")}
                <DropdownMenuShortcut>
                  <Wrench className="w-4 h-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:cursor-pointer" onClick={() => logout()} disabled={loading}>
                {t("navbar.logout")}
                <DropdownMenuShortcut>
                  <LogOut className="w-4 h-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
