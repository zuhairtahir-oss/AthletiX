/**
 * Domain types mirrored from the backend (backend/src/types/espn.ts).
 * The frontend never talks to ESPN directly — it only ever sees these
 * already-clean, already-transformed shapes coming back from our own
 * backend's /api routes.
 */

export type EventStatus = "scheduled" | "live" | "final";

export type Sport = "basketball" | "hockey" | "football" | "baseball" | "soccer";

export interface League {
  slug: string;
  sportPath: string;
  name: string;
  sport: Sport;
}

export interface TeamRef {
  id: string;
  name: string;
  abbreviation: string | null;
  logo: string | null;
  color: string | null;
}

export interface Team extends TeamRef {
  league: string;
  location: string | null;
  venue: string | null;
}

export interface Player {
  id: string;
  name: string;
  shortName: string | null;
  jersey: string | null;
  position: string | null;
  height: string | null;
  weight: string | null;
  age: number | null;
  headshot: string | null;
  team: TeamRef | null;
  league: string | null;
}

export interface TeamScheduleData {
  recent: GameEvent[];
  upcoming: GameEvent[];
}

export interface TeamWithRoster extends Team {
  roster: Player[];
  schedule: TeamScheduleData;
}

export interface GameEvent {
  id: string;
  name: string;
  league: string;
  date: string;
  status: EventStatus;
  statusLabel: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  homeScore: number | null;
  awayScore: number | null;
}

export interface StandingsRow {
  team: TeamRef;
  wins: number | null;
  losses: number | null;
  winPercent: string | null;
  points: number | null;
  gamesBehind: string | null;
}

export interface StandingsGroup {
  name: string;
  rows: StandingsRow[];
}

export interface SearchResult {
  id: string;
  type: "team" | "player";
  name: string;
  subtitle: string | null;
  sport: string | null;
  league: string | null;
  image: string | null;
}

export interface SearchResults {
  teams: SearchResult[];
  players: SearchResult[];
}

export interface ComparisonMetric {
  label: string;
  a: number | null;
  b: number | null;
  unit?: string;
}

export interface PlayerComparison {
  a: Player;
  b: Player;
  /** e.g. "Career", "Regular Season", or "Profile" when falling back to bio metrics. */
  metricsLabel: string;
  metrics: ComparisonMetric[];
}

export interface TeamComparison {
  a: Team;
  b: Team;
  rosterSizeA: number;
  rosterSizeB: number;
}

/**
 * Normalized, sport-agnostic statistic model — mirrors
 * backend/src/types/espn.ts exactly. Every value traces back to a
 * real ESPN stat; nothing here is computed or invented on either side.
 */
export interface StatEntry {
  label: string;
  value: string;
}

export interface StatGroup {
  /** e.g. "Regular Season", "Career", or a competition name for soccer ("2026 MLS"). */
  label: string;
  stats: StatEntry[];
}

export interface PlayerStats {
  /** ESPN's own heading for this stat set, e.g. "2025 Offense", "2026 Pitching", "Career Batting". */
  summaryLabel: string | null;
  groups: StatGroup[];
}

export interface RecentGameStat {
  eventId: string;
  stats: StatEntry[];
}

export interface RecentGameLog {
  groups: Array<{
    label: string;
    games: RecentGameStat[];
  }>;
}

export interface PlayerStatsResult {
  stats: PlayerStats;
  recentGames: RecentGameLog;
}
