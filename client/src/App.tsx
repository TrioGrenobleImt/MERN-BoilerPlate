import { Router } from "./router/routes.js";
import "./styles/index.css";
import { useAuthContext } from "./contexts/authContext.js";
import { Loading } from "./components/ui/customs/Loading.js";

function App() {
  const { loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return <Router />;
}

export default App;
