import { Router } from "./router/routes.js";
import { useAuthContext } from "./contexts/authContext.js";
import { Loading } from "./components/customs/loading.js";
import "./styles/index.css";
import { useAxiosInterceptor } from "./hooks/useAxiosInterceptors.js";

function App() {
  const { loading } = useAuthContext();
  useAxiosInterceptor();

  if (loading) {
    return <Loading />;
  }

  return <Router />;
}

export default App;
