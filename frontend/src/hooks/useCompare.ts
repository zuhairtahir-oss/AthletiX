import { useQuery } from "@tanstack/react-query";
import { comparePlayers, compareTeams } from "../services/compareService";
import type { ComparisonSide } from "../services/compareService";

export function usePlayerComparison(a: ComparisonSide | undefined, b: ComparisonSide | undefined) {
  return useQuery({
    queryKey: ["compare", "players", a?.league, a?.id, b?.league, b?.id],
    queryFn: () => comparePlayers(a as ComparisonSide, b as ComparisonSide),
    enabled: a !== undefined && b !== undefined,
  });
}

export function useTeamComparison(a: ComparisonSide | undefined, b: ComparisonSide | undefined) {
  return useQuery({
    queryKey: ["compare", "teams", a?.league, a?.id, b?.league, b?.id],
    queryFn: () => compareTeams(a as ComparisonSide, b as ComparisonSide),
    enabled: a !== undefined && b !== undefined,
  });
}
