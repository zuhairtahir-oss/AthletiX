import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Shield } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";
import { SearchBar } from "../components/search/SearchBar";
import { SearchResultCard } from "../components/search/SearchResultCard";
import { LeagueTabs } from "../components/leagues/LeagueTabs";
import { TeamCard } from "../components/teams/TeamCard";
import { useLeagues } from "../hooks/useLeagues";
import { useTeamsByLeague } from "../hooks/useTeams";
import { useSearch } from "../hooks/useSearch";

export default function TeamsPage() {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: leagues, isLoading: leaguesLoading } = useLeagues();

  const leagueFromUrl = searchParams.get("league") ?? undefined;
  const [activeSlug, setActiveSlug] = useState<string | undefined>(leagueFromUrl);
  const activeLeague = activeSlug ?? leagueFromUrl ?? leagues?.[0]?.slug;

  // Keep the URL in sync so links to /teams?league=X (from Home,
  // search, etc.) land on the right tab and the choice is shareable.
  useEffect(() => {
    if (activeSlug) setSearchParams({ league: activeSlug }, { replace: true });
  }, [activeSlug, setSearchParams]);

  const teamsQuery = useTeamsByLeague(query.trim().length >= 2 ? undefined : activeLeague);
  const searchQuery = useSearch(query);

  const supportedSlugs = useMemo(() => new Set((leagues ?? []).map((l) => l.slug)), [leagues]);
  const trimmed = query.trim();
  const isSearching = trimmed.length >= 2;

  const searchTeams = (searchQuery.data?.teams ?? []).filter(
    (result) => result.league && supportedSlugs.has(result.league)
  );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Database"
        title="Teams"
        description="Browse rosters, standings, and schedules across every supported league."
      />

      <SearchBar value={query} onChange={setQuery} placeholder="Search teams, e.g. Arsenal" />

      {!isSearching && (
        <>
          {leaguesLoading && <Skeleton className="h-9 w-full max-w-md" />}
          {leagues && leagues.length > 0 && (
            <LeagueTabs leagues={leagues} activeSlug={activeLeague} onSelect={setActiveSlug} />
          )}
        </>
      )}

      {isSearching && searchQuery.isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px]" />
          ))}
        </div>
      )}

      {isSearching && searchQuery.isError && (
        <ErrorState
          description="We couldn't search right now. Check your connection and try again."
          onRetry={() => searchQuery.refetch()}
        />
      )}

      {isSearching && searchQuery.isSuccess && searchTeams.length === 0 && (
        <EmptyState
          icon={<Shield className="h-5 w-5" aria-hidden="true" />}
          title="No teams found"
          description={`No teams matching "${trimmed}" in a supported league.`}
        />
      )}

      {isSearching && searchQuery.isSuccess && searchTeams.length > 0 && (
        <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {searchTeams.map((result) => (
            <SearchResultCard key={`${result.league}-${result.id}`} result={result} />
          ))}
        </div>
      )}

      {!isSearching && teamsQuery.isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[60px]" />
          ))}
        </div>
      )}

      {!isSearching && teamsQuery.isError && (
        <ErrorState
          description="We couldn't load teams for this league. Check your connection and try again."
          onRetry={() => teamsQuery.refetch()}
        />
      )}

      {!isSearching && teamsQuery.isSuccess && teamsQuery.data.length === 0 && (
        <EmptyState
          icon={<Shield className="h-5 w-5" aria-hidden="true" />}
          title="No teams available"
          description="This league doesn't have team data right now."
        />
      )}

      {!isSearching && teamsQuery.isSuccess && teamsQuery.data.length > 0 && activeLeague && (
        <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teamsQuery.data.map((team) => (
            <TeamCard key={team.id} team={team} leagueSlug={activeLeague} />
          ))}
        </div>
      )}
    </div>
  );
}
