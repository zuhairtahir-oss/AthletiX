import { apiGet } from "./apiClient";
import type { Player, PlayerStatsResult } from "../types/espn";

export function fetchPlayerById(leagueSlug: string, playerId: string): Promise<Player> {
  return apiGet<Player>(`/players/${leagueSlug}/${playerId}`);
}

export function fetchPlayerStats(leagueSlug: string, playerId: string): Promise<PlayerStatsResult> {
  return apiGet<PlayerStatsResult>(`/players/${leagueSlug}/${playerId}/stats`);
}
