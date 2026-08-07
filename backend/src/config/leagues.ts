import type { League } from "../types/espn.js";

/**
 * The set of leagues AthletiX surfaces, mapped to ESPN's sport/league
 * path segments (e.g. "basketball/nba", "soccer/eng.1"). ESPN has no
 * single "list every league" endpoint, so this registry is the
 * deliberate, curated set of leagues the product supports — adding a
 * new league is a one-line change here, not a code change elsewhere.
 */
export const LEAGUES: League[] = [
  { slug: "nba", sportPath: "basketball/nba", name: "NBA", sport: "basketball" },
  { slug: "nhl", sportPath: "hockey/nhl", name: "NHL", sport: "hockey" },
  { slug: "nfl", sportPath: "football/nfl", name: "NFL", sport: "football" },
  { slug: "mlb", sportPath: "baseball/mlb", name: "MLB", sport: "baseball" },
  { slug: "eng.1", sportPath: "soccer/eng.1", name: "Premier League", sport: "soccer" },
  { slug: "esp.1", sportPath: "soccer/esp.1", name: "La Liga", sport: "soccer" },
  { slug: "ger.1", sportPath: "soccer/ger.1", name: "Bundesliga", sport: "soccer" },
  { slug: "ita.1", sportPath: "soccer/ita.1", name: "Serie A", sport: "soccer" },
  { slug: "uefa.champions", sportPath: "soccer/uefa.champions", name: "UEFA Champions League", sport: "soccer" },
  { slug: "usa.1", sportPath: "soccer/usa.1", name: "MLS", sport: "soccer" },
  { slug: "fifa.world", sportPath: "soccer/fifa.world", name: "FIFA World Cup", sport: "soccer" },
];

export function findLeague(slug: string): League | undefined {
  return LEAGUES.find((league) => league.slug === slug);
}
