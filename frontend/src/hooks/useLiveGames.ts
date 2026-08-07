import { useQuery } from "@tanstack/react-query";
import { fetchLiveGames } from "../services/gamesService";

/** Polls the live-games endpoint every 20s — fast enough to feel live, gentle enough on the upstream. */
export function useLiveGames() {
  return useQuery({
    queryKey: ["games", "live"],
    queryFn: fetchLiveGames,
    refetchInterval: 20_000,
  });
}
