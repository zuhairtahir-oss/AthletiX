import { apiGet } from "./apiClient";
import type { GameEvent } from "../types/espn";

/** Games currently live across every configured league. */
export function fetchLiveGames(): Promise<GameEvent[]> {
  return apiGet<GameEvent[]>("/games/live");
}

/** Today's scoreboard (any status) for a single league. */
export function fetchLeagueScoreboard(leagueSlug: string): Promise<GameEvent[]> {
  return apiGet<GameEvent[]>(`/games/${leagueSlug}`);
}
