import { useState } from "react";
import { cn } from "../../utils/cn";
import type { TeamRef } from "../../types/espn";

interface TeamBadgeProps {
  team: TeamRef;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-14 w-14 text-sm",
  xl: "h-20 w-20 text-base",
};

const imgSizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-9 w-9",
};

/**
 * Team logo with a graceful fallback (initials on a dark chip) when no
 * logo is available or the image fails to load — avoids broken-image
 * icons anywhere a team appears. When the backend supplies a real team
 * color, it's used as a subtle tinted ring around the badge so team
 * identity reads at a glance without relying on brand teal everywhere.
 */
export function TeamBadge({ team, size = "md", className }: TeamBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showFallback = !team.logo || imageFailed;

  const accentStyle = team.color
    ? { backgroundColor: `${team.color}1f`, borderColor: `${team.color}80` }
    : undefined;

  if (showFallback) {
    const initials = (team.abbreviation ?? team.name).slice(0, 3).toUpperCase();
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated font-display font-bold uppercase text-text-secondary",
          sizeClasses[size],
          className
        )}
        style={accentStyle}
        aria-hidden="true"
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated",
        sizeClasses[size],
        className
      )}
      style={accentStyle}
    >
      <img
        src={team.logo ?? undefined}
        alt={`${team.name} logo`}
        className={cn("object-contain", imgSizeClasses[size])}
        onError={() => setImageFailed(true)}
      />
    </span>
  );
}
