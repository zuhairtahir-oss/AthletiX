export class UpstreamApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UpstreamApiError";
    this.status = status;
  }
}

const SITE_BASE = "https://site.api.espn.com/apis/site/v2/sports";
const STANDINGS_BASE = "https://site.api.espn.com/apis/v2/sports";
const SEARCH_BASE = "https://site.web.api.espn.com/apis/search/v2";
const COMMON_V3_BASE = "https://site.api.espn.com/apis/common/v3/sports";

async function getJson<T>(url: URL): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new UpstreamApiError(`ESPN request failed (${res.status}) for ${url.pathname}`, res.status);
  }

  return (await res.json()) as T;
}

/**
 * Thin, typed wrapper around ESPN's public JSON endpoints. This is the
 * ONLY place in the backend that knows ESPN's base URLs — no API key
 * is required for any of these, so unlike the previous providers there
 * is no auth header/query param to attach.
 *
 * ESPN uses two different host+path shapes for the same "sport +
 * league" concept (scoreboard/teams live under `/apis/site/v2/...`,
 * standings under `/apis/v2/...`), confirmed by testing every endpoint
 * directly — not something a single base URL can paper over.
 */
export function espnScoreboard<T>(sportPath: string, params: Record<string, string | undefined> = {}) {
  return getJson<T>(withParams(new URL(`${SITE_BASE}/${sportPath}/scoreboard`), params));
}

export function espnTeams<T>(sportPath: string) {
  return getJson<T>(new URL(`${SITE_BASE}/${sportPath}/teams`));
}

export function espnTeam<T>(sportPath: string, teamId: string) {
  return getJson<T>(new URL(`${SITE_BASE}/${sportPath}/teams/${teamId}`));
}

export function espnRoster<T>(sportPath: string, teamId: string) {
  return getJson<T>(new URL(`${SITE_BASE}/${sportPath}/teams/${teamId}/roster`));
}

export function espnTeamSchedule<T>(sportPath: string, teamId: string) {
  return getJson<T>(new URL(`${SITE_BASE}/${sportPath}/teams/${teamId}/schedule`));
}

export function espnStandings<T>(sportPath: string) {
  return getJson<T>(new URL(`${STANDINGS_BASE}/${sportPath}/standings`));
}

export function espnSearch<T>(query: string, limit = 10) {
  return getJson<T>(withParams(new URL(SEARCH_BASE), { query, limit: String(limit) }));
}

/**
 * Athlete "overview" — the endpoint that actually carries real season
 * statistic values (verified directly against ESPN across NBA, NHL,
 * NFL, MLB, and soccer). Lives on a different host/path family than
 * scoreboard/teams/standings, so it isn't built on SITE_BASE.
 */
export function espnAthleteOverview<T>(sportPath: string, athleteId: string) {
  return getJson<T>(new URL(`${COMMON_V3_BASE}/${sportPath}/athletes/${athleteId}/overview`));
}

function withParams(url: URL, params: Record<string, string | undefined>): URL {
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  return url;
}
