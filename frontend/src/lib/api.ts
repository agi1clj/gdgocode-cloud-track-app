import { getApiBaseUrl } from "../config";
import type { EventsResponse } from "../types";

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
  const apiBaseUrl = getApiBaseUrl();

  console.error("[gdgocode-cloud-track-frontend]", message, {
    error: error instanceof Error ? error.message : error,
    apiBaseUrl
  });
}

export async function fetchEvents() {
  const response = await fetch(`${getApiBaseUrl()}/api/events`);

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to load events from the backend.")
    );
  }

  return (await response.json()) as EventsResponse;
}

export async function seedEvents() {
  const response = await fetch(`${getApiBaseUrl()}/api/events/seed`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to seed event data.")
    );
  }
}

export async function clearEvents() {
  const response = await fetch(`${getApiBaseUrl()}/api/events`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Failed to clear the event data.")
    );
  }
}
