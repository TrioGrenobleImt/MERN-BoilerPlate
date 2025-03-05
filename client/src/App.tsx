import { Router } from "./router/Routes.js";
import "./styles/index.css";
import { useAuthContext } from "./contexts/authContext.js";
import { Loading } from "./components/Loading.js";
import { NavBar } from "./components/NavBar/NavBar.js";
import { useLocation } from "react-router-dom";

function App() {
  const { loading } = useAuthContext();
  const location = useLocation();

  const noNavBarRoutes = ["/login", "/register", "/admin"];

  const shouldHideNavBar = noNavBarRoutes.some((route) => location.pathname.startsWith(route));

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {!shouldHideNavBar && <NavBar />}
      <Router />
    </>
  );
}

export default App;
