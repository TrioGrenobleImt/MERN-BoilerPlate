import { Router } from "./router/Routes.js";
import "./styles/index.css";
import { useAuthContext } from "./contexts/authContext.js";
import { Loading } from "./components/Loading.js";
import { NavBar } from "./components/NavBar/NavBar.js";

function App() {
  const { loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <NavBar />
      <Router />
    </>
  );
}

export default App;
