declare global {
  interface Window {
    __APP_CONFIG__?: {
      VITE_API_BASE_URL?: string;
      VITE_EVENT_NAME?: string;
    };
  }
}

function getRuntimeConfig() {
  return window.__APP_CONFIG__ || {};
}

export function getApiBaseUrl() {
  return getRuntimeConfig().VITE_API_BASE_URL || "http://localhost:3001";
}

export function getEventName() {
  return getRuntimeConfig().VITE_EVENT_NAME || "GDGoCode 2026";
}
