import { apiGet } from "./apiClient";
import type { StandingsGroup } from "../types/espn";

export function fetchStandings(leagueSlug: string): Promise<StandingsGroup[]> {
  return apiGet<StandingsGroup[]>(`/standings/${leagueSlug}`);
}
