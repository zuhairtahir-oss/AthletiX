import { StatusBadge } from "../ui/StatusBadge";
import { TeamBadge } from "../teams/TeamBadge";
import { cn } from "../../utils/cn";
import type { GameEvent } from "../../types/espn";

interface GameListRowProps {
  game: GameEvent;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/**
 * Compact single-line game entry used in schedule lists (team detail
 * recent/upcoming) where a full GameCard grid would take up too much
 * vertical space for 5 short entries.
 */
export function GameListRow({ game }: GameListRowProps) {
  const hasScore = game.homeScore !== null || game.awayScore !== null;
  const isLive = game.status === "live";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between",
        isLive && "bg-live-soft/40"
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <TeamBadge team={game.awayTeam} size="sm" />
        <span className="min-w-0 truncate text-sm font-medium text-text-secondary">
          {game.awayTeam.abbreviation ?? game.awayTeam.name}
        </span>
        <span className="shrink-0 text-xs text-text-muted">@</span>
        <TeamBadge team={game.homeTeam} size="sm" />
        <span className="min-w-0 truncate text-sm font-medium text-text-secondary">
          {game.homeTeam.abbreviation ?? game.homeTeam.name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {hasScore && (
          <span className="font-tabular text-sm font-bold text-text">
            {game.awayScore}-{game.homeScore}
          </span>
        )}
        <StatusBadge
          status={isLive ? "live" : game.status === "final" ? "final" : "upcoming"}
          label={game.status === "final" ? "Final" : isLive ? game.statusLabel : formatDate(game.date)}
          pulse={isLive}
        />
      </div>
    </div>
  );
}
