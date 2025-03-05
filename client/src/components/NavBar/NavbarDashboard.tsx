import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const NavbarDashboard = () => {
  const { pathname } = useLocation();

  const styleDefault = "px-4 py-3 font-semibold flex items-center justify-center gap-3";
  const styleActive = `${styleDefault} text-primary border-b-2 border-primary pb-2.5`;

  const isActive = (path: string, includeSubroutes = false) => (includeSubroutes ? pathname.startsWith(path) : pathname === path);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 gap-4 px-4 border-b bg-card md:px-6">
      {/* Navigation pour grands écrans */}
      <nav className="flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <h1 className="text-xl font-extrabold">
          <Link to={`/`}>Accueil</Link>
        </h1>
        <Link to={`/admin`} className={`text-foreground transition-colors ${isActive(`/admin`) ? styleActive : styleDefault}`}>
          Tableau de bord
        </Link>
        <Link
          to={`/admin/users`}
          className={`text-foreground transition-colors ${isActive(`/admin/users`, true) ? styleActive : styleDefault}`}
        >
          Utilisateurs
        </Link>
        <Link
          to={`/admin/logs`}
          className={`text-foreground transition-colors ${isActive(`/admin/logs`, true) ? styleActive : styleDefault}`}
        >
          Journal
        </Link>
      </nav>

      {/* Menu hamburger pour petits écrans, aligné à droite */}
      <Sheet>
        <Link className="text-xl font-extrabold md:hidden" to={`/`}>
          Accueil
        </Link>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="ml-auto shrink-0 md:hidden">
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        {/* Menu qui s'ouvre à partir de la droite */}
        <SheetContent side="right">
          <nav className="grid gap-6 text-lg font-medium">
            <Link to={`/`} className="flex items-center gap-2 text-lg font-semibold">
              <span className="sr-only">Accueil</span>
            </Link>
            <Link to={`/admin`} className="hover:text-foreground">
              Tableau de bord
            </Link>
            <Link to={`/admin/users`} className="hover:text-foreground">
              Utilisateurs
            </Link>
            <Link
              to={`/admin/logs`}
              className={`text-foreground transition-colors ${isActive(`/admin/logs`, true) ? styleActive : styleDefault}`}
            >
              Journal
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};
