import { useState } from "react";
import { cn } from "../../utils/cn";
import type { TeamRef } from "../../types/espn";

interface TeamBadgeProps {
  team: TeamRef;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-14 w-14 text-base",
};

/**
 * Team logo with a graceful fallback (initials on a dark chip) when no
 * logo is available or the image fails to load — avoids broken-image
 * icons anywhere a team appears.
 */
export function TeamBadge({ team, size = "md", className }: TeamBadgeProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showFallback = !team.logo || imageFailed;

  if (showFallback) {
    const initials = (team.abbreviation ?? team.name).slice(0, 3).toUpperCase();
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface-elevated font-bold text-text-secondary",
          sizeClasses[size],
          className
        )}
        aria-hidden="true"
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={team.logo ?? undefined}
      alt={`${team.name} logo`}
      className={cn("shrink-0 object-contain", sizeClasses[size], className)}
      onError={() => setImageFailed(true)}
    />
  );
}
