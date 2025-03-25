import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner.js";
import { AuthContextProvider } from "./contexts/authContext.js";
import "./lib/i18n.js";
import { ThemeProvider } from "./providers/theme-provider.js";
import { SocketContextProvider } from "./contexts/socketContext.js";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <SocketContextProvider>
        <BrowserRouter>
          <AuthContextProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <App />
            </ThemeProvider>
          </AuthContextProvider>
          <Toaster />
        </BrowserRouter>
      </SocketContextProvider>
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element");
}
