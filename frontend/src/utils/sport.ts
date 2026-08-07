import type { Sport } from "../types/espn";

/**
 * Central mapping from Sport -> display label and CSS color token.
 * Any component that needs to color-code or label a sport reads from
 * here instead of re-deriving it, so the mapping only exists once.
 */
export const SPORT_LABELS: Record<Sport, string> = {
  basketball: "Basketball",
  hockey: "Hockey",
  football: "Football",
  baseball: "Baseball",
  soccer: "Soccer",
};

export const SPORT_COLOR_VARS: Record<Sport, string> = {
  basketball: "var(--color-sport-basketball)",
  hockey: "var(--color-sport-hockey)",
  football: "var(--color-sport-football)",
  baseball: "var(--color-sport-baseball)",
  soccer: "var(--color-sport-soccer)",
};
