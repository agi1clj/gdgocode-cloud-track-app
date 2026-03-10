import { API_BASE_URL } from "../config";
import type { ReadingsResponse } from "../types";

export async function parseApiError(
  response: Response,
  fallbackMessage: string
) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export function logClientError(message: string, error: unknown) {
  console.error("[gdgocode-cloud-track-frontend]", message, {
    error: error instanceof Error ? error.message : error,
    apiBaseUrl: API_BASE_URL
  });
}

export async function fetchReadings() {
  const response = await fetch(`${API_BASE_URL}/api/readings`);

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to load readings from the backend.")
    );
  }

  return (await response.json()) as ReadingsResponse;
}

export async function seedReadings() {
  const response = await fetch(`${API_BASE_URL}/api/readings/seed`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to seed sample data.")
    );
  }
}

export async function clearReadings() {
  const response = await fetch(`${API_BASE_URL}/api/readings`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to clear the sample data.")
    );
  }
}
