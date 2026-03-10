import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/latin-300.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import "./App.css";
import { appTheme } from "./theme";

async function bootstrap() {
  try {
    const response = await fetch("/config.json");

    if (!response.ok) {
      throw new Error(`Config request failed with status ${response.status}`);
    }

    const config = (await response.json()) as {
      VITE_API_BASE_URL?: string;
      VITE_EVENT_NAME?: string;
    };

    window.__APP_CONFIG__ = config;
  } catch (error) {
    console.warn(
      "[gdgocode-cloud-track-frontend] Falling back to default runtime config",
      error
    );
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}

void bootstrap();
