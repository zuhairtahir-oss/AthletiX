import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation + border for clickable cards (player/team/game cards). */
  interactive?: boolean;
}

/**
 * Base surface for all card-style content. Sits one clear step above
 * the page background (see the surface hierarchy in tokens.css) with a
 * border that actually reads against it, plus a subtle top highlight so
 * the card reads as physically raised rather than just outlined.
 */
export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-elevation-1",
        interactive &&
          "cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover hover:shadow-elevation-2",
        className
      )}
      {...props}
    />
  );
}
