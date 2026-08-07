import { cn } from "../../utils/cn";

/**
 * Loading placeholder. Uses a static muted block with a subtle shimmer
 * rather than a bouncing/pulsing animation, so a screen full of
 * skeletons feels calm rather than busy.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-elevated",
        className
      )}
      aria-hidden="true"
    />
  );
}
