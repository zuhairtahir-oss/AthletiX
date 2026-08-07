import { useState } from "react";
import { cn } from "../../utils/cn";
import type { PlayerStats } from "../../types/espn";

interface PlayerStatsPanelProps {
  stats: PlayerStats;
}

/**
 * Renders a player's normalized season statistics. Splits become
 * tabs (e.g. "Regular Season" / "Postseason" / "Career" for most
 * sports, or per-competition names for soccer) so the page doesn't
 * try to cram every split on screen at once. Every label/value pair
 * comes straight from ESPN via the backend's StatGroup model — no
 * client-side computation.
 */
export function PlayerStatsPanel({ stats }: PlayerStatsPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGroup = stats.groups[activeIndex];

  if (stats.groups.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {stats.summaryLabel && (
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-text-secondary">
            {stats.summaryLabel}
          </h2>
        )}
        {stats.groups.length > 1 && (
          <div className="scroll-slim flex gap-1 overflow-x-auto" role="tablist" aria-label="Statistic period">
            {stats.groups.map((group, index) => (
              <button
                key={group.label}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-soft)]",
                  index === activeIndex
                    ? "bg-brand-soft text-brand ring-1 ring-brand/30"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text"
                )}
              >
                {group.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeGroup && activeGroup.stats.length > 0 ? (
        <div className="stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {activeGroup.stats.map((entry) => (
            <div
              key={entry.label}
              className="surface-hairline rounded-lg border border-border bg-surface p-4 shadow-elevation-1 transition-colors duration-[var(--duration-fast)] hover:border-border-strong"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">{entry.label}</p>
              <p className="mt-2 font-tabular text-2xl font-bold leading-none text-text">{entry.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary">No statistics available for this period.</p>
      )}
    </div>
  );
}
