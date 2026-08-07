import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { Skeleton } from "../components/ui/Skeleton";
import { SearchBar } from "../components/search/SearchBar";
import { SearchResultCard } from "../components/search/SearchResultCard";
import { useSearch } from "../hooks/useSearch";
import { useLeagues } from "../hooks/useLeagues";

export default function PlayersPage() {
  const [query, setQuery] = useState("");
  const { data: leagues } = useLeagues();
  const searchQuery = useSearch(query);

  const supportedSlugs = useMemo(() => new Set((leagues ?? []).map((l) => l.slug)), [leagues]);

  // Only surface players in leagues AthletiX actually has detail/roster
  // pages for — ESPN's search covers far more leagues than our registry.
  const players = (searchQuery.data?.players ?? []).filter(
    (result) => result.league && supportedSlugs.has(result.league)
  );

  const trimmed = query.trim();
  const hasQuery = trimmed.length >= 2;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Database"
        title="Players"
        description="Search for any player across NBA, NHL, NFL, MLB, and major soccer leagues."
      />

      <SearchBar value={query} onChange={setQuery} placeholder="Search players, e.g. LeBron James" />

      {!hasQuery && (
        <EmptyState
          icon={<Users className="h-6 w-6" aria-hidden="true" />}
          title="Search for a player"
          description="Type at least 2 characters to find players across every league AthletiX tracks."
        />
      )}

      {hasQuery && searchQuery.isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[68px]" />
          ))}
        </div>
      )}

      {hasQuery && searchQuery.isError && (
        <ErrorState
          description="We couldn't search right now. Check your connection and try again."
          onRetry={() => searchQuery.refetch()}
        />
      )}

      {hasQuery && searchQuery.isSuccess && players.length === 0 && (
        <EmptyState
          icon={<Users className="h-6 w-6" aria-hidden="true" />}
          title="No players found"
          description={`No players matching "${trimmed}" in a supported league. Try a different spelling or player.`}
        />
      )}

      {hasQuery && searchQuery.isSuccess && players.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((result) => (
            <SearchResultCard key={`${result.league}-${result.id}`} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
