import { useQuery } from "@tanstack/react-query";
import { search } from "../services/searchService";

/** Cross-sport free-text search for teams and players, used by the Players/Teams search bars. */
export function useSearch(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["search", trimmed],
    queryFn: () => search(trimmed),
    enabled: trimmed.length >= 2,
  });
}
