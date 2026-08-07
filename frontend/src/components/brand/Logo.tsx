import { cn } from "../../utils/cn";

interface LogoProps {
  /** Hides the wordmark, showing only the mark — used in tight spaces. */
  markOnly?: boolean;
  className?: string;
}

/**
 * AthletiX brand mark: two crossing bars forming an X, rising left to
 * right to suggest performance/trend. Paired with a condensed uppercase
 * wordmark. Reused from the favicon geometry so the icon is consistent
 * across browser tab, nav, and any future app icon.
 */
export function Logo({ markOnly = false, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" aria-hidden="true">
        <rect x="3" y="13.5" width="18" height="3.4" rx="1" transform="rotate(-18 12 15.2)" fill="var(--color-brand)" />
        <rect x="3" y="7" width="18" height="3.4" rx="1" transform="rotate(18 12 8.7)" fill="var(--color-accent)" />
      </svg>
      {!markOnly && (
        <span className="font-display text-xl font-bold tracking-tight text-text">
          AthletiX
        </span>
      )}
    </span>
  );
}
