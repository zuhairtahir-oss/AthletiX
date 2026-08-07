import { useQuery } from "@tanstack/react-query";
import { fetchTeamById, fetchTeamsByLeague } from "../services/teamsService";

export function useTeamsByLeague(leagueSlug: string | undefined) {
  return useQuery({
    queryKey: ["teams", "league", leagueSlug],
    queryFn: () => fetchTeamsByLeague(leagueSlug as string),
    enabled: leagueSlug !== undefined,
  });
}

export function useTeam(leagueSlug: string | undefined, teamId: string | undefined) {
  return useQuery({
    queryKey: ["team", leagueSlug, teamId],
    queryFn: () => fetchTeamById(leagueSlug as string, teamId as string),
    enabled: leagueSlug !== undefined && teamId !== undefined,
  });
}
