import { espnStandings } from "./espnClient.js";
import { toStandingsRow } from "./espnTransforms.js";
import { withCache } from "../utils/cache.js";
import { findLeague } from "../config/leagues.js";
import type { RawStandingsResponse, StandingsRow } from "../types/espn.js";

const STANDINGS_CACHE_TTL_MS = 15 * 60 * 1000;

export interface StandingsGroup {
  name: string;
  rows: StandingsRow[];
}

/**
 * Standings, grouped the way ESPN groups them (e.g. Eastern/Western
 * conference for the NBA, a single group for most soccer leagues).
 */
export async function getStandings(leagueSlug: string): Promise<StandingsGroup[]> {
  const league = findLeague(leagueSlug);
  if (!league) return [];

  return withCache(`standings:${leagueSlug}`, STANDINGS_CACHE_TTL_MS, async () => {
    const data = await espnStandings<RawStandingsResponse>(league.sportPath);
    const groups = data.children ?? [];

    return groups.map((group) => ({
      name: group.name,
      rows: group.standings.entries.map(toStandingsRow),
    }));
  });
}
