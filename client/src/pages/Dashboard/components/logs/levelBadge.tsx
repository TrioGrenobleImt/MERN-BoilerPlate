import { AlertCircle, CircleHelp, TriangleAlert, Bug, ShieldQuestion } from "lucide-react";
import { logLevels } from "../../../../../../server/src/utils/enums/logLevel";

const defaultIcons: Record<string, { icon: JSX.Element; color: string }> = {
  info: { icon: <CircleHelp size={16} />, color: "text-blue-500" },
  warn: { icon: <TriangleAlert size={16} />, color: "text-yellow-500" },
  error: { icon: <AlertCircle size={16} />, color: "text-red-500" },
  debug: { icon: <Bug size={16} />, color: "text-green-500" },
};

export const LevelBadge = ({ level }: { level: keyof typeof logLevels }) => {
  const { icon, color } = defaultIcons[level] || { icon: <ShieldQuestion size={16} />, color: "text-gray-500" };

  return (
    <span className={`flex items-center gap-1 font-medium ${color}`}>
      {icon}
      {level.toString().charAt(0).toUpperCase() + level.toString().slice(1)}
    </span>
  );
};
