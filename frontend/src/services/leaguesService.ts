import { apiGet } from "./apiClient";
import type { League } from "../types/espn";

/** The curated set of leagues AthletiX supports (see backend/src/config/leagues.ts). */
export function fetchLeagues(): Promise<League[]> {
  return apiGet<League[]>("/leagues");
}
