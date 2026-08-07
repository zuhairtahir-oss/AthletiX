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
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <TeamBadge team={team} size="sm" />
        <span
          className={cn(
            "truncate text-sm transition-colors",
            emphasize ? "font-semibold text-text" : "font-medium text-text-secondary"
          )}
        >
          {team.name}
        </span>
      </div>
      {score !== null && (
        <span
          className={cn(
            "font-tabular text-xl font-bold leading-none transition-colors",
            emphasize ? "text-text" : "text-text-muted"
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
 * status. Live games get a pulsing status badge + a left accent rail;
 * final games emphasize the winning score; scheduled games show
 * kickoff time instead of 0-0.
 */
export function GameCard({ game, className }: GameCardProps) {
  const hasScore = game.homeScore !== null || game.awayScore !== null;
  const homeWinning = (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const awayWinning = (game.awayScore ?? 0) > (game.homeScore ?? 0);
  const isFinal = game.status === "final";
  const isLive = game.status === "live";

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden p-5",
        isLive && "border-l-2 border-l-live",
        className
      )}
    >
      {isLive && (
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-live/60 to-transparent"
          aria-hidden="true"
        />
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-muted">
          {game.league}
        </span>
        <StatusBadge
          status={isLive ? "live" : isFinal ? "final" : "upcoming"}
          label={game.statusLabel}
          pulse={isLive}
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
        <p className="text-xs font-medium text-text-muted">{formatKickoff(game.date)}</p>
      )}
    </Card>
  );
}
