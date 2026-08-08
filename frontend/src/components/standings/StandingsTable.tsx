import { Link } from "react-router-dom";
import { TeamBadge } from "../teams/TeamBadge";
import { cn } from "../../utils/cn";
import type { StandingsGroup } from "../../types/espn";

interface StandingsTableProps {
  group: StandingsGroup;
  leagueSlug: string;
  /** Highlights the row matching this team id, e.g. on a team detail page. */
  highlightTeamId?: string;
}

/**
 * Compact standings table. Shows wins/losses/win% universally, plus
 * points and games-behind only when the league actually reports them
 * (soccer points vs. NBA games-behind aren't both meaningful at once).
 */
export function StandingsTable({ group, leagueSlug, highlightTeamId }: StandingsTableProps) {
  const hasPoints = group.rows.some((row) => row.points !== null);
  const hasGamesBehind = group.rows.some((row) => row.gamesBehind !== null && row.gamesBehind !== "-");

  return (
    <div className="scroll-slim overflow-x-auto rounded-lg border border-border bg-surface shadow-elevation-1">
      <table className="w-full min-w-[420px] text-sm">
        <caption className="sr-only">{group.name} standings</caption>
        <thead>
          <tr className="border-b border-border bg-surface-elevated text-left text-[11px] uppercase tracking-[0.1em] text-text-muted">
            <th scope="col" className="px-3 py-2.5 font-bold">
              {group.name}
            </th>
            <th scope="col" className="px-3 py-2.5 text-right font-bold">
              W
            </th>
            <th scope="col" className="px-3 py-2.5 text-right font-bold">
              L
            </th>
            <th scope="col" className="px-3 py-2.5 text-right font-bold">
              Win%
            </th>
            {hasPoints && (
              <th scope="col" className="px-3 py-2.5 text-right font-bold">
                Pts
              </th>
            )}
            {hasGamesBehind && (
              <th scope="col" className="px-3 py-2.5 text-right font-bold">
                GB
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {group.rows.map((row, index) => (
            <tr
              key={row.team.id}
              className={cn(
                "border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-hover",
                row.team.id === highlightTeamId
                  ? "bg-brand-soft hover:bg-brand-soft"
                  : index % 2 === 1
                    ? "bg-surface/60"
                    : undefined
              )}
            >
              <td className="px-3 py-2.5">
                <Link
                  to={`/teams/${leagueSlug}/${row.team.id}`}
                  className="flex items-center gap-2 font-medium text-text transition-colors hover:text-brand"
                >
                  <TeamBadge team={row.team} size="sm" />
                  <span className="truncate">{row.team.name}</span>
                </Link>
              </td>
              <td className="px-3 py-2.5 text-right font-tabular font-semibold text-text">{row.wins ?? "—"}</td>
              <td className="px-3 py-2.5 text-right font-tabular font-semibold text-text">{row.losses ?? "—"}</td>
              <td className="px-3 py-2.5 text-right font-tabular text-text-secondary">{row.winPercent ?? "—"}</td>
              {hasPoints && (
                <td className="px-3 py-2.5 text-right font-tabular font-semibold text-text">{row.points ?? "—"}</td>
              )}
              {hasGamesBehind && (
                <td className="px-3 py-2.5 text-right font-tabular text-text-secondary">{row.gamesBehind ?? "—"}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
