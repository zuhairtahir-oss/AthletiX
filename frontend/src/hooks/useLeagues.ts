import { useQuery } from "@tanstack/react-query";
import { fetchLeagues } from "../services/leaguesService";

/** The curated league registry — rarely changes, cache aggressively. */
export function useLeagues() {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: fetchLeagues,
    staleTime: Infinity,
  });
}
