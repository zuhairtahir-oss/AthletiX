import { useQuery } from "@tanstack/react-query";
import { fetchStandings } from "../services/standingsService";

export function useStandings(leagueSlug: string | undefined) {
  return useQuery({
    queryKey: ["standings", leagueSlug],
    queryFn: () => fetchStandings(leagueSlug as string),
    enabled: leagueSlug !== undefined,
  });
}
