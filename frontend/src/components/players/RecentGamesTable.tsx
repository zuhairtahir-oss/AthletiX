import type { RecentGameLog } from "../../types/espn";

interface RecentGamesTableProps {
  gameLog: RecentGameLog;
}

/**
 * Per-game statistic table for a player's most recent appearances.
 * Column set is whatever ESPN reports for this sport (already
 * normalized by the backend) — no fixed column list, so it adapts
 * automatically across NBA/NHL/NFL/MLB/soccer without special-casing.
 */
export function RecentGamesTable({ gameLog }: RecentGamesTableProps) {
  const group = gameLog.groups[0];
  if (!group || group.games.length === 0) return null;

  const columns = group.games[0]?.stats.map((s) => s.label) ?? [];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Recent Games</h2>
      <div className="overflow-x-auto rounded-lg border border-border shadow-elevation-1">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-elevated text-left text-xs uppercase tracking-wide text-text-muted">
              {columns.map((label) => (
                <th key={label} scope="col" className="whitespace-nowrap px-3 py-2 text-right font-semibold first:text-left">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.games.map((game, index) => (
              <tr key={game.eventId} className={index % 2 === 1 ? "bg-surface" : undefined}>
                {game.stats.map((entry) => (
                  <td
                    key={entry.label}
                    className="whitespace-nowrap px-3 py-2 text-right font-tabular text-text-secondary first:text-left first:text-text"
                  >
                    {entry.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
