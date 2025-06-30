import { User2, ShieldCheck, ShieldQuestion } from "lucide-react";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

const defaultRoles: Record<string, { icon: JSX.Element; color: string }> = {
  admin: { icon: <ShieldCheck size={16} />, color: "text-purple-500" },
  user: { icon: <User2 size={16} />, color: "text-blue-500" },
};

export const UserRoleBadge = ({ role }: { role: "admin" | "user" }) => {
  const { t } = useTranslation();

  const { icon, color } = defaultRoles[role] || { icon: <ShieldQuestion size={16} />, color: "text-gray-500" };

  return (
    <span className={`flex items-center gap-1 font-medium ${color}`}>
      {icon}
      {t(`pages.admin.users_page.roles.${role}`)}
    </span>
  );
};
