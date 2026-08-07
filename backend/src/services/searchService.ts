import { espnSearch } from "./espnClient.js";
import { toSearchResult } from "./espnTransforms.js";
import { withCache } from "../utils/cache.js";
import type { RawSearchResponse, SearchResult } from "../types/espn.js";

const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Free-text, cross-sport search backed by ESPN's public search index —
 * the user types "Lakers", "Messi", "Arsenal", etc. and gets real
 * results across every sport ESPN covers, not just the leagues
 * AthletiX has a curated registry for. No name is ever hardcoded.
 */
export async function search(query: string): Promise<{ teams: SearchResult[]; players: SearchResult[] }> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return { teams: [], players: [] };

  return withCache(`search:${trimmed.toLowerCase()}`, SEARCH_CACHE_TTL_MS, async () => {
    const data = await espnSearch<RawSearchResponse>(trimmed);
    const teamGroup = data.results?.find((group) => group.type === "team");
    const playerGroup = data.results?.find((group) => group.type === "player");

    return {
      teams: (teamGroup?.contents ?? []).map((content) => toSearchResult(content, "team")),
      players: (playerGroup?.contents ?? []).map((content) => toSearchResult(content, "player")),
    };
  });
}
