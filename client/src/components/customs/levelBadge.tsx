import { Bug, ShieldQuestion, Info, AlertTriangle, XCircle } from "lucide-react";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

const defaultIcons: Record<string, { icon: JSX.Element; color: string }> = {
  info: { icon: <Info size={16} />, color: "text-blue-500" },
  warn: { icon: <AlertTriangle size={16} />, color: "text-yellow-500" },
  error: { icon: <XCircle size={16} />, color: "text-red-500" },
  debug: { icon: <Bug size={16} />, color: "text-green-500" },
};

export const LevelBadge = ({ level }: { level: keyof typeof logLevels }) => {
  const { t } = useTranslation();

  const logLevels = {
    info: "info",
    warn: "warn",
    error: "error",
    debug: "debug",
  };

  const { icon, color } = defaultIcons[level] || { icon: <ShieldQuestion size={16} />, color: "text-gray-500" };

  return (
    <span className={`flex items-center gap-1 font-medium ${color}`}>
      {icon}
      {t(`pages.admin.log_page.levels.${level}`)}
    </span>
  );
};
