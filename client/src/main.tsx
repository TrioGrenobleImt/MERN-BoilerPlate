import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.js";
import { AuthContextProvider } from "./contexts/authContext.js";
import { ThemeProvider } from "./providers/theme-provider.js";
import { SocketContextProvider } from "./contexts/socketContext.js";
import { ConfigProvider } from "./contexts/configContext.js";
import "./lib/i18n.js";

if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not defined in the environment file");
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ConfigProvider>
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
      </ConfigProvider>
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element");
}
