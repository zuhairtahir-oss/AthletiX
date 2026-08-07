import { useQuery } from "@tanstack/react-query";
import { fetchLeagueScoreboard } from "../services/gamesService";

export function useLeagueScoreboard(leagueSlug: string | undefined) {
  return useQuery({
    queryKey: ["games", "scoreboard", leagueSlug],
    queryFn: () => fetchLeagueScoreboard(leagueSlug as string),
    enabled: leagueSlug !== undefined,
    refetchInterval: 30_000,
  });
}
