import type {
  EventStatus,
  GameEvent,
  Player,
  PlayerStats,
  RawAthlete,
  RawAthleteStatistics,
  RawCompetitor,
  RawEvent,
  RawGameLog,
  RawRosterGroup,
  RawSearchContent,
  RawStandingsEntry,
  RawTeamRef,
  RecentGameLog,
  SearchResult,
  StandingsRow,
  Team,
  TeamRef,
} from "../types/espn.js";

/** Raw -> domain transforms shared across ESPN-backed services. */

export function toTeamRef(raw: RawTeamRef): TeamRef {
  return {
    id: raw.id,
    name: raw.displayName,
    abbreviation: raw.abbreviation ?? null,
    logo: raw.logo ?? raw.logos?.[0]?.href ?? null,
    color: raw.color ? `#${raw.color}` : null,
  };
}

export function toTeam(raw: RawTeamRef & { venue?: { fullName?: string } }, league: string): Team {
  return {
    ...toTeamRef(raw),
    league,
    location: raw.location ?? null,
    venue: raw.venue?.fullName ?? null,
  };
}

function mapEventStatus(state: "pre" | "in" | "post"): EventStatus {
  if (state === "in") return "live";
  if (state === "post") return "final";
  return "scheduled";
}

function findCompetitor(competitors: RawCompetitor[], homeAway: "home" | "away"): RawCompetitor | undefined {
  return competitors.find((c) => c.homeAway === homeAway);
}

export function toGameEvent(raw: RawEvent, league: string): GameEvent | null {
  const competition = raw.competitions[0];
  if (!competition) return null;

  const home = findCompetitor(competition.competitors, "home");
  const away = findCompetitor(competition.competitors, "away");
  if (!home || !away) return null;

  // The scoreboard endpoint puts status at the top level; the team
  // schedule endpoint only puts it on the competition — support both.
  const statusType = raw.status?.type ?? competition.status?.type;
  if (!statusType) return null;

  return {
    id: raw.id,
    name: raw.name,
    league,
    date: raw.date,
    status: mapEventStatus(statusType.state),
    statusLabel: statusType.state === "in" ? statusType.shortDetail : statusType.description,
    homeTeam: toTeamRef(home.team),
    awayTeam: toTeamRef(away.team),
    homeScore: home.score !== undefined ? Number(home.score) : null,
    awayScore: away.score !== undefined ? Number(away.score) : null,
  };
}

function findStat(stats: RawStandingsEntry["stats"], type: string): RawStandingsEntry["stats"][number] | undefined {
  return stats.find((s) => s.type === type);
}

export function toStandingsRow(raw: RawStandingsEntry): StandingsRow {
  const wins = findStat(raw.stats, "wins");
  const losses = findStat(raw.stats, "losses");
  const winPercent = findStat(raw.stats, "winpercent");
  // Soccer standings use "points" (league points), basketball/hockey use it for scoring average —
  // "leaguewinpercent"/"points" naming varies, so we surface both wins/losses (universal) and a
  // generic "points" figure where present, letting the frontend decide which is meaningful per sport.
  const points = findStat(raw.stats, "points");
  const gamesBehind = findStat(raw.stats, "gamesbehind");

  return {
    team: toTeamRef(raw.team),
    wins: wins?.value ?? null,
    losses: losses?.value ?? null,
    winPercent: winPercent?.displayValue ?? null,
    points: points?.value ?? null,
    gamesBehind: gamesBehind?.displayValue ?? null,
  };
}

/**
 * Normalizes ESPN's two roster response shapes into a flat athlete
 * list. NBA/soccer return athletes directly; NHL/NFL/MLB return them
 * grouped by position (`{position, items: [...]}`) — verified by
 * testing every sport's roster endpoint directly. Without this, three
 * of five sports would silently return only a handful of "players"
 * (the position group count) instead of the real roster.
 */
export function flattenRoster(athletes: Array<RawAthlete | RawRosterGroup> | undefined): RawAthlete[] {
  if (!athletes) return [];

  return athletes.flatMap((entry) => ("items" in entry ? entry.items : [entry]));
}

export function toPlayer(raw: RawAthlete, league: string | null, team: TeamRef | null): Player {
  return {
    id: raw.id,
    name: raw.fullName,
    shortName: raw.shortName ?? null,
    jersey: raw.jersey ?? null,
    position: raw.position?.displayName ?? null,
    height: raw.displayHeight ?? null,
    weight: raw.displayWeight ?? null,
    age: raw.age ?? null,
    headshot: raw.headshot?.href ?? null,
    team,
    league,
  };
}

/** Extracts the plain numeric id from an ESPN uid like "s:40~l:46~t:13" or "s:40~l:46~a:1966". */
export function parseIdFromUid(uid: string): string {
  const segments = uid.split("~");
  const last = segments[segments.length - 1] ?? "";
  const parts = last.split(":");
  return parts[parts.length - 1] ?? last;
}

export function toSearchResult(raw: RawSearchContent, type: "team" | "player"): SearchResult {
  return {
    id: parseIdFromUid(raw.uid),
    type,
    name: raw.displayName,
    subtitle: raw.subtitle ?? raw.description ?? null,
    sport: raw.sport ?? null,
    league: raw.defaultLeagueSlug ?? null,
    image: raw.image?.default ?? null,
  };
}

/**
 * Normalizes ESPN's parallel-array statistic shape into StatGroup[].
 * `names[i]`/`displayNames[i]` line up positionally with every
 * `splits[j].stats[i]` — this holds for every sport tested (NBA, NHL,
 * NFL across QB/receiver/defensive shapes, MLB hitter/pitcher, and
 * soccer's per-competition splits), so one function covers all of
 * them without sport-specific branching here. Values that ESPN omits
 * for a given split are simply absent — nothing is computed/inferred.
 */
export function toPlayerStats(raw: RawAthleteStatistics | undefined): PlayerStats {
  if (!raw) return { summaryLabel: null, groups: [] };

  const groups = raw.splits.map((split) => ({
    label: split.displayName,
    stats: raw.displayNames
      .map((label, index) => ({ label, value: split.stats[index] }))
      .filter((entry): entry is { label: string; value: string } => Boolean(entry.value)),
  }));

  return { summaryLabel: raw.displayName ?? null, groups };
}

/** Same parallel-array pattern as toPlayerStats, but per recent game instead of per split. */
export function toRecentGameLog(raw: RawGameLog | undefined): RecentGameLog {
  if (!raw?.statistics) return { groups: [] };

  const groups = raw.statistics.map((block) => ({
    label: block.displayName,
    games: block.events.map((event) => ({
      eventId: event.eventId,
      stats: block.displayNames
        .map((label, index) => ({ label, value: event.stats[index] }))
        .filter((entry): entry is { label: string; value: string } => Boolean(entry.value)),
    })),
  }));

  return { groups };
}
