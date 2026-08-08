import { cn } from "../../utils/cn";

/**
 * Loading placeholder. Uses a subtle gradient shimmer sweep rather
 * than a flat pulse, so a screen full of skeletons feels calm and
 * premium rather than busy.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-surface-elevated",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[ax-shimmer_1.6s_var(--ease-in-out-soft)_infinite] before:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.04),transparent)] before:bg-[length:200%_100%]",
        className
      )}
      aria-hidden="true"
    />
  );
}
