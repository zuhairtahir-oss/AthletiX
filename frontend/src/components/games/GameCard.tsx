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

function TeamColumn({
  team,
  align,
  emphasize,
}: {
  team: TeamRef;
  align: "left" | "right";
  emphasize: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center gap-3",
        align === "right" && "flex-row-reverse text-right"
      )}
    >
      <TeamBadge team={team} size="md" />
      <span
        className={cn(
          "truncate text-sm",
          emphasize ? "font-semibold text-text" : "text-text-secondary"
        )}
      >
        {team.abbreviation ?? team.name}
      </span>
    </div>
  );
}

/**
 * Core unit of the Live page: two teams, their score, and current
 * status, laid out as a horizontal scoreboard (team — score — team)
 * so the card's full width carries real content instead of leaving a
 * blank half. The thin two-tone bar at the top uses each team's real
 * ESPN color, the only per-card color signal in the app that isn't
 * brand teal or a fixed status color.
 */
export function GameCard({ game, className }: GameCardProps) {
  const hasScore = game.homeScore !== null || game.awayScore !== null;
  const homeWinning = (game.homeScore ?? 0) > (game.awayScore ?? 0);
  const awayWinning = (game.awayScore ?? 0) > (game.homeScore ?? 0);
  const isFinal = game.status === "final";

  return (
    <Card className={cn("flex flex-col gap-4 p-6", className)}>
      <div className="-mx-6 -mt-6 flex h-1.5 overflow-hidden rounded-t-lg">
        <span
          className="flex-1"
          style={{ backgroundColor: game.homeTeam.color ?? "var(--color-border-strong)" }}
        />
        <span
          className="flex-1"
          style={{ backgroundColor: game.awayTeam.color ?? "var(--color-border-strong)" }}
        />
      </div>

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

      <div className="flex items-center justify-between gap-2">
        <TeamColumn team={game.homeTeam} align="left" emphasize={!isFinal || homeWinning} />

        <div className="flex shrink-0 flex-col items-center px-1">
          {hasScore ? (
            <div className="flex items-baseline gap-2 font-tabular text-2xl font-bold">
              <span className={cn(!isFinal || homeWinning ? "text-text" : "text-text-muted")}>
                {game.homeScore}
              </span>
              <span className="text-sm font-semibold text-text-muted">–</span>
              <span className={cn(!isFinal || awayWinning ? "text-text" : "text-text-muted")}>
                {game.awayScore}
              </span>
            </div>
          ) : (
            <span className="whitespace-nowrap text-xs font-semibold text-text-muted">
              {formatKickoff(game.date)}
            </span>
          )}
        </div>

        <TeamColumn team={game.awayTeam} align="right" emphasize={!isFinal || awayWinning} />
      </div>
    </Card>
  );
}
