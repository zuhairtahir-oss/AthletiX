import { espnRoster, espnTeam, espnTeams, espnTeamSchedule } from "./espnClient.js";
import { flattenRoster, toGameEvent, toPlayer, toTeam } from "./espnTransforms.js";
import { withCache } from "../utils/cache.js";
import { findLeague } from "../config/leagues.js";
import type {
  GameEvent,
  Player,
  RawRosterResponse,
  RawScoreboardResponse,
  RawTeamDetailResponse,
  RawTeamsListResponse,
  Team,
} from "../types/espn.js";

const TEAMS_CACHE_TTL_MS = 60 * 60 * 1000;

export async function getTeamsByLeague(leagueSlug: string): Promise<Team[]> {
  const league = findLeague(leagueSlug);
  if (!league) return [];

  return withCache(`teams:league:${leagueSlug}`, TEAMS_CACHE_TTL_MS, async () => {
    const data = await espnTeams<RawTeamsListResponse>(league.sportPath);
    const rawTeams = data.sports?.[0]?.leagues?.[0]?.teams ?? [];
    return rawTeams.map((entry) => toTeam(entry.team, league.name));
  });
}

export async function getTeamById(leagueSlug: string, teamId: string): Promise<Team | null> {
  const league = findLeague(leagueSlug);
  if (!league) return null;

  return withCache(`teams:id:${leagueSlug}:${teamId}`, TEAMS_CACHE_TTL_MS, async () => {
    try {
      const data = await espnTeam<RawTeamDetailResponse>(league.sportPath, teamId);
      return toTeam(data.team, league.name);
    } catch {
      return null;
    }
  });
}

export interface TeamSchedule {
  recent: GameEvent[];
  upcoming: GameEvent[];
}

/**
 * A team's season schedule, split into completed (recent) and
 * not-yet-played (upcoming) games — used on the team detail page.
 * Reuses toGameEvent since ESPN's schedule endpoint returns the same
 * event/competition shape as the scoreboard endpoint.
 */
export async function getTeamSchedule(leagueSlug: string, teamId: string): Promise<TeamSchedule> {
  const league = findLeague(leagueSlug);
  if (!league) return { recent: [], upcoming: [] };

  return withCache(`teams:schedule:${leagueSlug}:${teamId}`, TEAMS_CACHE_TTL_MS, async () => {
    try {
      const data = await espnTeamSchedule<RawScoreboardResponse>(league.sportPath, teamId);
      const events = (data.events ?? [])
        .map((event) => toGameEvent(event, league.name))
        .filter((event): event is GameEvent => event !== null);

      return {
        recent: events.filter((event) => event.status === "final").slice(-5).reverse(),
        upcoming: events.filter((event) => event.status !== "final").slice(0, 5),
      };
    } catch {
      return { recent: [], upcoming: [] };
    }
  });
}

export async function getTeamRoster(leagueSlug: string, teamId: string): Promise<Player[]> {
  const league = findLeague(leagueSlug);
  if (!league) return [];

  return withCache(`teams:roster:${leagueSlug}:${teamId}`, TEAMS_CACHE_TTL_MS, async () => {
    try {
      const data = await espnRoster<RawRosterResponse>(league.sportPath, teamId);
      const team = await getTeamById(leagueSlug, teamId);
      const teamRef = team
        ? { id: team.id, name: team.name, abbreviation: team.abbreviation, logo: team.logo, color: team.color }
        : null;
      return flattenRoster(data.athletes).map((athlete) => toPlayer(athlete, league.name, teamRef));
    } catch {
      return [];
    }
  });
}
