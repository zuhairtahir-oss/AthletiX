import { espnScoreboard } from "./espnClient.js";
import { toGameEvent } from "./espnTransforms.js";
import { withCache } from "../utils/cache.js";
import { findLeague, LEAGUES } from "../config/leagues.js";
import type { GameEvent, RawScoreboardResponse } from "../types/espn.js";

const LIVE_CACHE_TTL_MS = 20_000;

/** Games for one league's current scoreboard (today's games, any status). */
export async function getLeagueScoreboard(leagueSlug: string): Promise<GameEvent[]> {
  const league = findLeague(leagueSlug);
  if (!league) return [];

  return withCache(`games:scoreboard:${leagueSlug}`, LIVE_CACHE_TTL_MS, async () => {
    const data = await espnScoreboard<RawScoreboardResponse>(league.sportPath);
    return (data.events ?? [])
      .map((event) => toGameEvent(event, league.name))
      .filter((event): event is GameEvent => event !== null);
  });
}

/** Games currently live across every configured league — the core of the Live page. */
export async function getAllLiveGames(): Promise<GameEvent[]> {
  return withCache("games:live:all", LIVE_CACHE_TTL_MS, async () => {
    const results = await Promise.all(
      LEAGUES.map(async (league) => {
        try {
          const data = await espnScoreboard<RawScoreboardResponse>(league.sportPath);
          return (data.events ?? [])
            .map((event) => toGameEvent(event, league.name))
            .filter((event): event is GameEvent => event !== null)
            .filter((event) => event.status === "live");
        } catch {
          // One league's upstream hiccup shouldn't take down the whole feed.
          return [];
        }
      })
    );

    return results.flat();
  });
}
