import { getPlayerById } from "./playersService.js";
import { getPlayerStats } from "./playerStatsService.js";
import { getTeamById, getTeamRoster } from "./teamsService.js";
import type { Player, StatGroup, Team } from "../types/espn.js";

export interface ComparisonMetric {
  label: string;
  a: number | null;
  b: number | null;
  unit?: string;
}

export interface PlayerComparison {
  a: Player;
  b: Player;
  /** e.g. "Career", "Regular Season" — which stat split the metrics below come from. */
  metricsLabel: string;
  metrics: ComparisonMetric[];
}

export interface TeamComparison {
  a: Team;
  b: Team;
  rosterSizeA: number;
  rosterSizeB: number;
}

/** Parses ESPN's displayHeight, e.g. `6' 5"` -> total inches (77). */
function parseHeightInches(height: string | null): number | null {
  const match = height?.match(/(\d+)'\s*(\d+)/);
  if (!match) return null;
  return Number(match[1]) * 12 + Number(match[2]);
}

/** Parses ESPN's displayWeight, e.g. "205 lbs" -> 205. */
function parseWeightPounds(weight: string | null): number | null {
  const match = weight?.match(/([\d.]+)\s*lbs/);
  return match ? Number(match[1]) : null;
}

/** Parses a plain numeric stat value (handles thousands separators like "35,939"). Returns null for non-numeric values (e.g. "22:59" time-on-ice). */
function parseStatNumber(value: string): number | null {
  const cleaned = value.replace(/,/g, "");
  return /^-?\d+(\.\d+)?$/.test(cleaned) ? Number(cleaned) : null;
}

function bioMetrics(a: Player, b: Player): ComparisonMetric[] {
  return [
    { label: "Height", a: parseHeightInches(a.height), b: parseHeightInches(b.height), unit: "in" },
    { label: "Weight", a: parseWeightPounds(a.weight), b: parseWeightPounds(b.weight), unit: "lbs" },
    { label: "Age", a: a.age, b: b.age, unit: "yrs" },
  ].filter((m) => m.a !== null || m.b !== null);
}

/** Picks the best pair of stat groups to compare: same split label on both sides, preferring "Career". */
function pickComparableGroups(aGroups: StatGroup[], bGroups: StatGroup[]): { a: StatGroup; b: StatGroup } | null {
  const bByLabel = new Map(bGroups.map((g) => [g.label, g]));

  const career = aGroups.find((g) => g.label === "Career");
  if (career && bByLabel.has("Career")) {
    return { a: career, b: bByLabel.get("Career")! };
  }

  for (const group of aGroups) {
    const match = bByLabel.get(group.label);
    if (match) return { a: group, b: match };
  }

  return null;
}

/** Intersects two stat groups by label, keeping only pairs where both sides report a real numeric value. */
function toStatMetrics(a: StatGroup, b: StatGroup): ComparisonMetric[] {
  const bByLabel = new Map(b.stats.map((s) => [s.label, s.value]));
  const metrics: ComparisonMetric[] = [];

  for (const entry of a.stats) {
    const bValue = bByLabel.get(entry.label);
    if (bValue === undefined) continue;

    const aNum = parseStatNumber(entry.value);
    const bNum = parseStatNumber(bValue);
    if (aNum === null || bNum === null) continue;

    metrics.push({ label: entry.label, a: aNum, b: bNum });
  }

  return metrics;
}

/**
 * Compares two players using their real season statistics (the same
 * normalized StatGroup data shown on the player detail page) — PPG
 * for NBA, goals/assists for NHL/soccer, passing/rushing/defensive
 * splits for NFL, batting/pitching splits for MLB. Falls back to
 * physical bio metrics (height/weight/age) only when neither player
 * has any statistics ESPN reports (e.g. hasn't played yet), so the
 * comparison is never blank. Every number traces back to a real ESPN
 * value — nothing is computed or invented.
 */
export async function comparePlayers(
  leagueA: string,
  idA: string,
  leagueB: string,
  idB: string
): Promise<PlayerComparison> {
  const [a, b, statsA, statsB] = await Promise.all([
    getPlayerById(leagueA, idA),
    getPlayerById(leagueB, idB),
    getPlayerStats(leagueA, idA),
    getPlayerStats(leagueB, idB),
  ]);

  if (!a || !b) {
    throw new Error("One or both players could not be found.");
  }

  const groups = pickComparableGroups(statsA?.stats.groups ?? [], statsB?.stats.groups ?? []);
  const statMetrics = groups ? toStatMetrics(groups.a, groups.b) : [];

  if (statMetrics.length > 0 && groups) {
    return { a, b, metricsLabel: groups.a.label, metrics: statMetrics };
  }

  return { a, b, metricsLabel: "Profile", metrics: bioMetrics(a, b) };
}

export async function compareTeams(
  leagueA: string,
  idA: string,
  leagueB: string,
  idB: string
): Promise<TeamComparison> {
  const [a, b, rosterA, rosterB] = await Promise.all([
    getTeamById(leagueA, idA),
    getTeamById(leagueB, idB),
    getTeamRoster(leagueA, idA),
    getTeamRoster(leagueB, idB),
  ]);

  if (!a || !b) {
    throw new Error("One or both teams could not be found.");
  }

  return {
    a,
    b,
    rosterSizeA: rosterA.length,
    rosterSizeB: rosterB.length,
  };
}
