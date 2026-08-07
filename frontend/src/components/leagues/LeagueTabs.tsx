import { cn } from "../../utils/cn";
import { SportDot } from "./SportDot";
import type { League, Sport } from "../../types/espn";

interface LeagueTabsProps {
  leagues: Array<Pick<League, "slug" | "name"> & { sport?: Sport }>;
  activeSlug: string | undefined;
  onSelect: (slug: string) => void;
}

/**
 * Horizontal, scrollable league filter used on Live/Teams. Pills
 * rather than a dropdown — the league list is short and switching
 * should be a single click, not a menu interaction. Each pill carries
 * a small sport-colored dot so switching leagues also reinforces which
 * sport you're looking at (basketball vs. soccer vs. baseball, etc).
 */
export function LeagueTabs({ leagues, activeSlug, onSelect }: LeagueTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Select league">
      {leagues.map((league) => {
        const isActive = league.slug === activeSlug;
        return (
          <button
            key={league.slug}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(league.slug)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors duration-150",
              isActive
                ? "border-brand bg-brand-soft text-brand"
                : "border-border text-text-secondary hover:border-border-strong hover:text-text"
            )}
          >
            {league.sport && <SportDot sport={league.sport} />}
            {league.name}
          </button>
        );
      })}
    </div>
  );
}
