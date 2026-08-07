import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import { TeamBadge } from "../teams/TeamBadge";
import { cn } from "../../utils/cn";
import type { GameEvent, TeamRef } from "../../types/espn";

interface GameCardProps {
  game: GameEvent;
  className?: string;
}

function formatKickoff(date: string): string {
  return new Date(date).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TeamRow({
  team,
  score,
  emphasize,
}: {
  team: TeamRef;
  score: number | null;
  emphasize: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <TeamBadge team={team} size="sm" />
        <span
          className={cn(
            "truncate text-sm",
            emphasize ? "font-semibold text-text" : "text-text-secondary"
          )}
        >
          {team.name}
        </span>
      </div>
      {score !== null && (
        <span
          className={cn(
            "font-tabular text-lg font-bold",
            emphasize ? "text-text" : "text-text-secondary"
          )}
        >
          {score}
        </span>
      )}
    </div>
  );
}

/**
 * Core unit of the Live page: two teams, their score, and current
 * status. Live games get a pulsing status badge; final games emphasize
 * the winning score; scheduled games show kickoff time instead of 0-0.
 */
export function GameCard({ game, className }: GameCardProps) {
  const hasScore = game.homeScore !== null || game.awayScore !== null;
  const homeWinning = (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const awayWinning = (game.awayScore ?? 0) > (game.homeScore ?? 0);
  const isFinal = game.status === "final";

  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-5",
        game.status === "live" && "border-l-2 border-l-live",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {game.league}
        </span>
        <StatusBadge
          status={game.status === "live" ? "live" : game.status === "final" ? "final" : "upcoming"}
          label={game.statusLabel}
          pulse={game.status === "live"}
        />
      </div>

      <div className="flex flex-col divide-y divide-border">
        <TeamRow
          team={game.homeTeam}
          score={hasScore ? game.homeScore : null}
          emphasize={!isFinal || homeWinning}
        />
        <TeamRow
          team={game.awayTeam}
          score={hasScore ? game.awayScore : null}
          emphasize={!isFinal || awayWinning}
        />
      </div>

      {game.status === "scheduled" && (
        <p className="text-xs text-text-muted">{formatKickoff(game.date)}</p>
      )}
    </Card>
  );
}
