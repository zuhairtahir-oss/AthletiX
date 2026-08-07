import { espnAthleteOverview, UpstreamApiError } from "./espnClient.js";
import { toPlayerStats, toRecentGameLog } from "./espnTransforms.js";
import { withCache } from "../utils/cache.js";
import { findLeague } from "../config/leagues.js";
import type { PlayerStats, RawAthleteOverviewResponse, RecentGameLog } from "../types/espn.js";

const STATS_CACHE_TTL_MS = 30 * 60 * 1000;

export interface PlayerStatsResult {
  stats: PlayerStats;
  recentGames: RecentGameLog;
}

const EMPTY_RESULT: PlayerStatsResult = {
  stats: { summaryLabel: null, groups: [] },
  recentGames: { groups: [] },
};

/**
 * Real season statistics + recent-game log for one player, normalized
 * into AthletiX's sport-agnostic StatGroup model. Backed by ESPN's
 * `.../athletes/{id}/overview` endpoint — the only one confirmed (via
 * direct testing) to return actual stat values rather than empty rows.
 *
 * Returns an empty stats/recentGames shape (never throws, never
 * invents data) when ESPN has nothing for this player — e.g. a player
 * who hasn't appeared in a game yet.
 */
export async function getPlayerStats(leagueSlug: string, playerId: string): Promise<PlayerStatsResult | null> {
  const league = findLeague(leagueSlug);
  if (!league) return null;

  return withCache(`player-stats:${leagueSlug}:${playerId}`, STATS_CACHE_TTL_MS, async () => {
    try {
      const data = await espnAthleteOverview<RawAthleteOverviewResponse>(league.sportPath, playerId);
      return {
        stats: toPlayerStats(data.statistics),
        recentGames: toRecentGameLog(data.gameLog),
      };
    } catch (err) {
      // A player with no ESPN overview data (e.g. hasn't played yet)
      // is a normal, expected case — not a real request failure.
      if (err instanceof UpstreamApiError && err.status === 404) {
        return EMPTY_RESULT;
      }
      throw err;
    }
  });
}
