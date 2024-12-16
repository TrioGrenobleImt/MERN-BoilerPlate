import NavBar from "./components/NavBar.jsx";
import { Router } from "./router/Routes.jsx";
import "./styles/index.css";

import { useAuthContext } from "./contexts/authContext.jsx";
import { Loading } from "./components/Loading.jsx";

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
