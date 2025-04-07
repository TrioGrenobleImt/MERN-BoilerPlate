// sonner.tsx
import { AlertTriangle, CheckCircle, Info, Loader, XCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        success: <CheckCircle className="w-4 h-4 text-green-500" />,
        info: <Info className="w-4 h-4 text-blue-500" />,
        warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        error: <XCircle className="w-4 h-4 text-red-500" />,
        loading: <Loader className="w-4 h-4 text-gray-500 animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
