import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer";

interface LayoutWrapperProps {
  withLayout?: boolean;
}

export const LayoutWrapper = ({ withLayout = true }: LayoutWrapperProps) => {
  return (
    <>
      {withLayout && <NavBar />}
      <Outlet /> {/* Affiche les enfants des routes */}
      {withLayout && <Footer />}
    </>
  );
};
