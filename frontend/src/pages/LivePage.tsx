import { useMemo, useState } from "react";
import { Radio } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { GameCard } from "../components/games/GameCard";
import { GameCardSkeleton } from "../components/games/GameCardSkeleton";
import { LeagueTabs } from "../components/leagues/LeagueTabs";
import { useLeagues } from "../hooks/useLeagues";
import { useLiveGames } from "../hooks/useLiveGames";
import { useLeagueScoreboard } from "../hooks/useLeagueScoreboard";
import type { GameEvent } from "../types/espn";

const ALL_LIVE_SLUG = "__all_live__";

function GameSection({ title, games }: { title: string; games: GameEvent[] }) {
  if (games.length === 0) return null;

  return (
    <section aria-labelledby={`${title}-heading`} className="flex flex-col gap-4">
      <h2 id={`${title}-heading`} className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
        {title} ({games.length})
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}

/**
 * The Live page has two modes: "All Live" aggregates in-progress games
 * across every supported league (the app's heartbeat view), while a
 * specific league tab shows that league's full daily scoreboard split
 * into Live / Upcoming / Final sections so status is never ambiguous.
 */
export default function LivePage() {
  const [activeSlug, setActiveSlug] = useState<string>(ALL_LIVE_SLUG);
  const { data: leagues } = useLeagues();

  const isAllLive = activeSlug === ALL_LIVE_SLUG;
  const liveGames = useLiveGames();
  const leagueScoreboard = useLeagueScoreboard(isAllLive ? undefined : activeSlug);

  const activeQuery = isAllLive ? liveGames : leagueScoreboard;

  const games = useMemo(() => activeQuery.data ?? [], [activeQuery.data]);

  const grouped = useMemo(
    () => ({
      live: games.filter((g) => g.status === "live"),
      upcoming: games.filter((g) => g.status === "scheduled"),
      final: games.filter((g) => g.status === "final"),
    }),
    [games]
  );

  const tabs = [{ slug: ALL_LIVE_SLUG, name: "All Live" }, ...(leagues ?? [])];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Scoreboard"
        title="Live"
        description="Live scores and game status across every league AthletiX tracks."
      />

      <LeagueTabs leagues={tabs} activeSlug={activeSlug} onSelect={setActiveSlug} />

      {activeQuery.isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      )}

      {activeQuery.isError && (
        <ErrorState
          description="We couldn't load the scoreboard. Check your connection and try again."
          onRetry={() => activeQuery.refetch()}
        />
      )}

      {activeQuery.isSuccess && games.length === 0 && (
        <EmptyState
          icon={<Radio className="h-6 w-6" aria-hidden="true" />}
          title={isAllLive ? "No games live right now" : "No games scheduled today"}
          description={
            isAllLive
              ? "Check back during game hours, or browse a specific league's schedule above."
              : "This league has no games on today's schedule."
          }
        />
      )}

      {activeQuery.isSuccess && games.length > 0 && (
        <div className="flex flex-col gap-8">
          <GameSection title="Live" games={grouped.live} />
          <GameSection title="Upcoming" games={grouped.upcoming} />
          <GameSection title="Final" games={grouped.final} />
        </div>
      )}
    </div>
  );
}
