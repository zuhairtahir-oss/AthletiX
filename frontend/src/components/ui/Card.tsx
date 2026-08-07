import type { HTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation + border for clickable cards (player/team/game cards). */
  interactive?: boolean;
}

/**
 * Base surface for all card-style content. Deliberately restrained:
 * modest radius, single-level border, no gradients or heavy shadow.
 * A faint top hairline gives premium definition without a glow.
 */
export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "surface-hairline rounded-lg border border-border bg-surface shadow-elevation-1",
        interactive &&
          "cursor-pointer transition-all duration-[var(--duration-base)] ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-hover hover:shadow-elevation-2",
        className
      )}
      {...props}
    />
  );
}
