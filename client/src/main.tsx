import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.js";
import { AuthContextProvider } from "./contexts/authContext.js";
import "./lib/i18n.js";
import { ThemeProvider } from "./providers/theme-provider.js";
import { SocketContextProvider } from "./contexts/socketContext.js";
import { useConfigStore } from "@/stores/configStore"; // Importer le store
import { Loading } from "./components/ui/customs/Loading.js";

if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not defined in the environment file");
}

const GlobalConfigLoader = () => {
  const { isLoaded, loadConfig } = useConfigStore();

  useEffect(() => {
    if (!isLoaded) {
      loadConfig(["APP_NAME", "LOGO_URL"]);
    }
  }, [isLoaded, loadConfig]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <React.StrictMode>
      <AuthContextProvider>
        <SocketContextProvider>
          <BrowserRouter>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
            <Toaster />
          </BrowserRouter>
        </SocketContextProvider>
      </AuthContextProvider>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<GlobalConfigLoader />);
} else {
  console.error("Failed to find the root element");
}
