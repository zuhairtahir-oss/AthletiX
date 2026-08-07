import { toPlayer, toTeamRef } from "./espnTransforms.js";
import { withCache } from "../utils/cache.js";
import { findLeague } from "../config/leagues.js";
import type { Player, RawAthlete, RawTeamRef } from "../types/espn.js";

const PLAYER_CACHE_TTL_MS = 60 * 60 * 1000;

interface RawAthleteDetailResponse {
  athlete: RawAthlete & { team?: RawTeamRef };
}

/**
 * Individual player lookup by id within a league — ESPN's per-athlete
 * endpoint lives under a different host (`site.api.espn.com/apis/common/v3`)
 * than scoreboard/teams/roster, so it isn't in espnClient's shared
 * helpers; kept local to this one call site.
 */
export async function getPlayerById(leagueSlug: string, playerId: string): Promise<Player | null> {
  const league = findLeague(leagueSlug);
  if (!league) return null;

  return withCache(`players:id:${leagueSlug}:${playerId}`, PLAYER_CACHE_TTL_MS, async () => {
    const url = new URL(
      `https://site.api.espn.com/apis/common/v3/sports/${league.sportPath}/athletes/${playerId}`
    );
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = (await res.json()) as RawAthleteDetailResponse;
    if (!data.athlete) return null;

    const teamRef = data.athlete.team ? toTeamRef(data.athlete.team) : null;
    return toPlayer(data.athlete, league.name, teamRef);
  });
}
