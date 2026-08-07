/**
 * Single low-level HTTP client for talking to the AthletiX backend.
 * Every feature service (games/players/teams/compare) builds on top of
 * this instead of calling fetch() directly, so base URL, error
 * handling, and response unwrapping live in exactly one place.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface Envelope<T> {
  data: T;
}

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.message ?? `Request failed with status ${res.status}`, res.status);
  }

  const body = (await res.json()) as Envelope<T>;
  return body.data;
}
