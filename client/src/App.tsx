import { Router } from "./router/routes.js";
import "./styles/index.css";
import { useAuthContext } from "./contexts/authContext.js";
import { Loading } from "./components/Loading.js";

function App() {
  const { loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return <Router />;
}

export default App;
