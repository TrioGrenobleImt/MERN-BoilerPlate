import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.js";
import { AuthContextProvider } from "./contexts/authContext.js";
import { ThemeProvider } from "./providers/theme-provider.js";
import { SocketContextProvider } from "./contexts/socketContext.js";
import { ConfigProvider } from "./contexts/configContext.js";
import { AppInitializer } from "./initializer.js";
import "./lib/i18n.js";

if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not defined in the environment file");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ConfigProvider>
        <AppInitializer>
          <AuthContextProvider>
            <SocketContextProvider>
              <BrowserRouter>
                <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                  <App />
                  <Toaster />
                </ThemeProvider>
              </BrowserRouter>
            </SocketContextProvider>
          </AuthContextProvider>
        </AppInitializer>
      </ConfigProvider>
    </React.StrictMode>,
  );
}
