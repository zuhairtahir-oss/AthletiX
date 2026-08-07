/**
 * Types for ESPN's public, unauthenticated JSON endpoints
 * (site.api.espn.com/apis/site/v2, apis/v2, and site.web.api.espn.com
 * for cross-sport search). No API key is required for any of these.
 *
 * "Raw*" types model the upstream JSON shape closely (kept loose with
 * optional fields since ESPN's shape varies slightly between sports).
 * Application code should consume the clean domain types below
 * (League, Team, Player, GameEvent, StandingsRow, SearchResult),
 * produced by the transform functions in services/espnTransforms.ts.
 */

export interface RawLogo {
  href: string;
}

export interface RawTeamRef {
  id: string;
  uid?: string;
  location?: string;
  name?: string;
  abbreviation?: string;
  displayName: string;
  shortDisplayName?: string;
  color?: string;
  alternateColor?: string;
  logo?: string;
  logos?: RawLogo[];
}

export interface RawCompetitor {
  id: string;
  homeAway: "home" | "away";
  score?: string;
  team: RawTeamRef;
  winner?: boolean;
}

export interface RawStatusType {
  id: string;
  name: string;
  state: "pre" | "in" | "post";
  completed: boolean;
  description: string;
  detail: string;
  shortDetail: string;
}

export interface RawCompetition {
  id: string;
  date: string;
  competitors: RawCompetitor[];
  status?: { type: RawStatusType };
  venue?: { fullName?: string };
}

export interface RawEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  season?: { year: number; slug?: string };
  /** Present on scoreboard events; absent on team-schedule events (which carry status on the competition instead). */
  status?: { type: RawStatusType };
  competitions: RawCompetition[];
}

export interface RawScoreboardResponse {
  leagues?: Array<{ id: string; name: string; abbreviation?: string; logos?: RawLogo[] }>;
  events?: RawEvent[];
}

export interface RawTeamsListResponse {
  sports?: Array<{
    leagues?: Array<{
      teams?: Array<{ team: RawTeamRef & { isActive?: boolean; venue?: { fullName?: string } } }>;
    }>;
  }>;
}

export interface RawTeamDetailResponse {
  team: RawTeamRef & {
    isActive?: boolean;
    venue?: { fullName?: string; address?: { city?: string; state?: string; country?: string } };
    standingSummary?: string;
  };
}

export interface RawAthletePosition {
  id: string;
  name: string;
  displayName: string;
  abbreviation: string;
}

export interface RawAthleteHeadshot {
  href: string;
}

export interface RawAthlete {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  displayName?: string;
  shortName?: string;
  weight?: number;
  displayWeight?: string;
  height?: number;
  displayHeight?: string;
  age?: number;
  dateOfBirth?: string;
  jersey?: string;
  position?: RawAthletePosition;
  headshot?: RawAthleteHeadshot;
  birthPlace?: { city?: string; state?: string; country?: string };
  college?: { name?: string };
  team?: RawTeamRef;
}

/**
 * ESPN's team roster endpoint returns one of two shapes depending on
 * sport: NBA and soccer return a flat array of athletes directly;
 * NHL, NFL, and MLB return athletes grouped by position
 * (`{position, items: RawAthlete[]}[]`) — confirmed by testing every
 * sport directly, not assumed. Both are normalized by flattenRoster()
 * in espnTransforms.ts before use.
 */
export interface RawRosterGroup {
  position: string;
  items: RawAthlete[];
}

export interface RawRosterResponse {
  athletes?: Array<RawAthlete | RawRosterGroup>;
}

export interface RawStandingsStat {
  name: string;
  type: string;
  value?: number;
  displayValue: string;
}

export interface RawStandingsEntry {
  team: RawTeamRef;
  stats: RawStandingsStat[];
}

export interface RawStandingsGroup {
  name: string;
  standings: { entries: RawStandingsEntry[] };
}

export interface RawStandingsResponse {
  name?: string;
  children?: RawStandingsGroup[];
  standings?: { entries: RawStandingsEntry[] };
}

export interface RawSearchContent {
  uid: string;
  displayName: string;
  subtitle?: string;
  description?: string;
  sport?: string;
  defaultLeagueSlug?: string;
  image?: { default?: string };
}

export interface RawSearchResultGroup {
  type: string;
  totalFound: number;
  contents?: RawSearchContent[];
}

export interface RawSearchResponse {
  results?: RawSearchResultGroup[];
}

/**
 * Shape of `.../athletes/{id}/overview` — the endpoint that actually
 * carries real statistic values (verified directly against ESPN; the
 * sibling `/stats` endpoint returns labels but always-empty value
 * rows, so it is not used).
 *
 * The stat arrays are parallel: `names[i]` / `displayNames[i]` line up
 * with `splits[j].stats[i]` for every split `j`. Some player types
 * (e.g. NFL receivers) also report a `categories` breakdown, but the
 * flat parallel arrays remain valid in every case, so categories are
 * informational only and not required to read the data correctly.
 */
export interface RawStatCategory {
  name: string;
  displayName: string;
  count: number;
}

export interface RawStatSplitValues {
  displayName: string;
  stats: string[];
}

export interface RawAthleteStatistics {
  displayName: string;
  categories?: RawStatCategory[];
  labels?: string[];
  names: string[];
  displayNames: string[];
  splits: RawStatSplitValues[];
}

export interface RawGameLogEvent {
  eventId: string;
  stats: string[];
}

export interface RawGameLogStatBlock {
  displayName: string;
  labels: string[];
  names: string[];
  displayNames: string[];
  events: RawGameLogEvent[];
}

export interface RawGameLog {
  displayName?: string;
  statistics?: RawGameLogStatBlock[];
}

export interface RawAthleteOverviewResponse {
  statistics?: RawAthleteStatistics;
  gameLog?: RawGameLog;
}

// ---- Domain types consumed by controllers / the frontend ----

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

export interface TeamScheduleData {
  recent: GameEvent[];
  upcoming: GameEvent[];
}

export interface TeamWithRoster extends Team {
  roster: Player[];
  schedule: TeamScheduleData;
}

export interface StandingsRow {
  team: TeamRef;
  wins: number | null;
  losses: number | null;
  winPercent: string | null;
  points: number | null;
  gamesBehind: string | null;
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

/**
 * Normalized, sport-agnostic statistic model. The frontend never sees
 * ESPN's raw arrays/splits — it only ever sees StatGroup[], each with
 * a human label and a flat list of {label, value} pairs. Every value
 * here traces back to a real ESPN displayName/stat pairing; nothing is
 * computed or invented.
 */
export interface StatEntry {
  label: string;
  value: string;
}

export interface StatGroup {
  /** e.g. "Regular Season", "Career", "2026 MLS" (soccer splits are per-competition, not per season-type). */
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
