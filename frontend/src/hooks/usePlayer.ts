import { useQuery } from "@tanstack/react-query";
import { fetchPlayerById, fetchPlayerStats } from "../services/playersService";

export function usePlayer(leagueSlug: string | undefined, playerId: string | undefined) {
  return useQuery({
    queryKey: ["player", leagueSlug, playerId],
    queryFn: () => fetchPlayerById(leagueSlug as string, playerId as string),
    enabled: leagueSlug !== undefined && playerId !== undefined,
  });
}

export function usePlayerStats(leagueSlug: string | undefined, playerId: string | undefined) {
  return useQuery({
    queryKey: ["player-stats", leagueSlug, playerId],
    queryFn: () => fetchPlayerStats(leagueSlug as string, playerId as string),
    enabled: leagueSlug !== undefined && playerId !== undefined,
  });
}
