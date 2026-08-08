import { Link, useParams } from "react-router-dom";
import { ArrowLeft, User, BarChart3 } from "lucide-react";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/ui/StatCard";
import { TeamBadge } from "../components/teams/TeamBadge";
import { PlayerStatsPanel } from "../components/players/PlayerStatsPanel";
import { RecentGamesTable } from "../components/players/RecentGamesTable";
import { usePlayer, usePlayerStats } from "../hooks/usePlayer";

export default function PlayerDetailPage() {
  const { league, id } = useParams<{ league: string; id: string }>();
  const { data: player, isLoading, isError, refetch } = usePlayer(league, id);
  const statsQuery = usePlayerStats(league, id);

  const hasStats = (statsQuery.data?.stats.groups.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-8">
      <Link
        to="/players"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Players
      </Link>

      {isLoading && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      )}

      {isError && (
        <ErrorState
          title="Player not found"
          description="We couldn't load this player. They may no longer be active, or the link may be incorrect."
          onRetry={() => refetch()}
        />
      )}

      {player && (
        <>
          <div
            className="border-l-2 pl-4"
            style={{ borderLeftColor: player.team?.color ?? "var(--color-border)" }}
          >
            <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center gap-4">
                {player.headshot ? (
                  <img
                    src={player.headshot}
                    alt={player.name}
                    className="h-20 w-20 shrink-0 rounded-full border border-border bg-surface-elevated object-cover shadow-elevation-1"
                  />
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-muted shadow-elevation-1">
                    <User className="h-8 w-8" aria-hidden="true" />
                  </span>
                )}
                <div>
                  {player.league && (
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                      {player.league}
                    </p>
                  )}
                  <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
                    {player.name}
                  </h1>
                  {player.position && (
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{player.position}</p>
                  )}
                </div>
              </div>
              {player.team && (
                <Link
                  to={`/teams/${league}/${player.team.id}`}
                  className="flex shrink-0 items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-text-secondary hover:border-border-strong hover:text-text"
                >
                  <TeamBadge team={player.team} size="sm" />
                  {player.team.name}
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Jersey" value={player.jersey ?? "—"} />
            <StatCard label="Height" value={player.height ?? "—"} />
            <StatCard label="Weight" value={player.weight ?? "—"} />
            <StatCard label="Age" value={player.age ?? "—"} />
          </div>

          {statsQuery.isLoading && (
            <div className="flex flex-col gap-4">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            </div>
          )}

          {statsQuery.isError && (
            <ErrorState
              title="Statistics unavailable"
              description="We couldn't load this player's statistics right now."
              onRetry={() => statsQuery.refetch()}
            />
          )}

          {statsQuery.isSuccess && !hasStats && (
            <EmptyState
              icon={<BarChart3 className="h-6 w-6" aria-hidden="true" />}
              title="No statistics available"
              description="ESPN hasn't published season statistics for this player yet."
            />
          )}

          {statsQuery.isSuccess && hasStats && statsQuery.data && (
            <PlayerStatsPanel stats={statsQuery.data.stats} />
          )}

          {statsQuery.data && statsQuery.data.recentGames.groups.length > 0 && (
            <RecentGamesTable gameLog={statsQuery.data.recentGames} />
          )}
        </>
      )}
    </div>
  );
}
