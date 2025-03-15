import { type LucideIcon } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    icon: LucideIcon;
    isActive?: boolean;
    url: string;
  }[];
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const isActive = (path: string, includeSubroutes = false) => (includeSubroutes ? pathname.startsWith(path) : pathname === path);
  const styleDefault = "px-4 py-3 font-light flex items-center justify-center gap-3";
  const styleActive = ` mx-4 my-3 flex items-center justify-center gap-3 text-primary border-b border-primary`;

  function handleClick(url: string) {
    if (isMobile) {
      setOpenMobile(false);
    }
    navigate(url);
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>MERN-BoilerPlate</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title} onClick={() => handleClick(item.url)}>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span className={`${isActive(item.url, true) ? styleActive : styleDefault}`}>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
