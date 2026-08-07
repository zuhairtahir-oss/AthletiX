import { Link, useParams } from "react-router-dom";
import { ArrowLeft, User, ChartBar as BarChart3, Hash, Ruler, Weight, Calendar } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { TeamBadge } from "../components/teams/TeamBadge";
import { PlayerStatsPanel } from "../components/players/PlayerStatsPanel";
import { RecentGamesTable } from "../components/players/RecentGamesTable";
import { usePlayer, usePlayerStats } from "../hooks/usePlayer";

export default function PlayerDetailPage() {
  const { league, id } = useParams<{ league: string; id: string }>();
  const { data: player, isLoading, isError, refetch } = usePlayer(league, id);
  const statsQuery = usePlayerStats(league, id);

  const hasStats = (statsQuery.data?.stats.groups.length ?? 0) > 0;

  const bioStats = [
    { label: "Jersey", value: player?.jersey ?? "—", icon: Hash },
    { label: "Height", value: player?.height ?? "—", icon: Ruler },
    { label: "Weight", value: player?.weight ?? "—", icon: Weight },
    { label: "Age", value: player?.age ?? "—", icon: Calendar },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/players"
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
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
          <PageHeader
            eyebrow={player.league ?? undefined}
            title={player.name}
            description={player.position ?? undefined}
            actions={
              player.team ? (
                <Link
                  to={`/teams/${league}/${player.team.id}`}
                  className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-text-secondary transition-all duration-[var(--duration-fast)] hover:border-border-strong hover:bg-surface-hover hover:text-text"
                >
                  <TeamBadge team={player.team} size="sm" />
                  {player.team.name}
                </Link>
              ) : undefined
            }
          />

          <div className="flex items-center gap-4">
            {player.headshot ? (
              <img
                src={player.headshot}
                alt={player.name}
                className="h-20 w-20 rounded-full border border-border bg-surface-elevated object-cover shadow-elevation-2"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-muted shadow-elevation-2">
                <User className="h-8 w-8" aria-hidden="true" />
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {bioStats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="surface-hairline rounded-lg border border-border bg-surface p-4 shadow-elevation-1"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">{label}</span>
                </div>
                <p className="mt-2 font-tabular text-xl font-bold leading-none text-text">{value}</p>
              </div>
            ))}
          </div>

          {statsQuery.isLoading && (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-40" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
              icon={<BarChart3 className="h-5 w-5" aria-hidden="true" />}
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
