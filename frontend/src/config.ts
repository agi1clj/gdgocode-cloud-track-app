declare global {
  interface Window {
    __APP_CONFIG__?: {
      VITE_API_BASE_URL?: string;
      VITE_EVENT_NAME?: string;
    };
  }
}

const runtimeConfig = window.__APP_CONFIG__ || {};

export const API_BASE_URL =
  runtimeConfig.VITE_API_BASE_URL || "http://localhost:3001";
export const EVENT_NAME = runtimeConfig.VITE_EVENT_NAME || "GDGoCode 2026";
