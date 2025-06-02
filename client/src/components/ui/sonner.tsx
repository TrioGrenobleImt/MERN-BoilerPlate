// sonner.tsx
import { useTheme } from "@/providers/theme-provider";
import { AlertTriangle, CheckCircle, Info, Loader, XCircle } from "lucide-react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

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
        success: <CheckCircle className="w-4 h-4 text-accent" />,
        info: <Info className="w-4 h-4 text-accent" />,
        warning: <AlertTriangle className="w-4 h-4 text-accent" />,
        error: <XCircle className="w-4 h-4 text-accent" />,
        loading: <Loader className="w-4 h-4 text-accent animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
