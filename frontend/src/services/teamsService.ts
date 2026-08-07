import { apiGet } from "./apiClient";
import type { Team, TeamWithRoster } from "../types/espn";

export function fetchTeamsByLeague(leagueSlug: string): Promise<Team[]> {
  return apiGet<Team[]>("/teams", { league: leagueSlug });
}

export function fetchTeamById(leagueSlug: string, teamId: string): Promise<TeamWithRoster> {
  return apiGet<TeamWithRoster>(`/teams/${leagueSlug}/${teamId}`);
}
