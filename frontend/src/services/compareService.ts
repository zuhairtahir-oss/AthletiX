import { apiGet } from "./apiClient";
import type { PlayerComparison, TeamComparison } from "../types/espn";

export interface ComparisonSide {
  league: string;
  id: string;
}

export function comparePlayers(a: ComparisonSide, b: ComparisonSide): Promise<PlayerComparison> {
  return apiGet<PlayerComparison>("/compare/players", {
    leagueA: a.league,
    a: a.id,
    leagueB: b.league,
    b: b.id,
  });
}

export function compareTeams(a: ComparisonSide, b: ComparisonSide): Promise<TeamComparison> {
  return apiGet<TeamComparison>("/compare/teams", {
    leagueA: a.league,
    a: a.id,
    leagueB: b.league,
    b: b.id,
  });
}
