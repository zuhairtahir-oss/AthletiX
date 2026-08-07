import { apiGet } from "./apiClient";
import type { SearchResults } from "../types/espn";

/** Free-text, cross-sport search for teams and players, backed by ESPN's public search index. */
export function search(query: string): Promise<SearchResults> {
  return apiGet<SearchResults>("/search", { q: query });
}
