import { StatusBadge } from "../ui/StatusBadge";
import { TeamBadge } from "../teams/TeamBadge";
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

  return (
    <div className="flex flex-col gap-2 border-b border-border py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <TeamBadge team={game.awayTeam} size="sm" />
        <span className="min-w-0 truncate text-sm text-text-secondary">
          {game.awayTeam.abbreviation ?? game.awayTeam.name}
        </span>
        <span className="shrink-0 text-xs text-text-muted">@</span>
        <TeamBadge team={game.homeTeam} size="sm" />
        <span className="min-w-0 truncate text-sm text-text-secondary">
          {game.homeTeam.abbreviation ?? game.homeTeam.name}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {hasScore && (
          <span className="font-tabular text-sm font-semibold text-text">
            {game.awayScore}-{game.homeScore}
          </span>
        )}
        <StatusBadge
          status={game.status === "live" ? "live" : game.status === "final" ? "final" : "upcoming"}
          label={game.status === "final" ? "Final" : game.status === "live" ? game.statusLabel : formatDate(game.date)}
          pulse={game.status === "live"}
        />
      </div>
    </div>
  );
}
