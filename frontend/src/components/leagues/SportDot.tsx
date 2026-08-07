import { SPORT_COLOR_VARS } from "../../utils/sport";
import type { Sport } from "../../types/espn";
import { cn } from "../../utils/cn";

interface SportDotProps {
  sport: Sport;
  className?: string;
}

/** Small color-coded dot identifying a sport — used next to league names throughout the app. */
export function SportDot({ sport, className }: SportDotProps) {
  return (
    <span
      className={cn("inline-block h-2 w-2 shrink-0 rounded-full", className)}
      style={{
        backgroundColor: SPORT_COLOR_VARS[sport],
        boxShadow: `0 0 8px 0 ${SPORT_COLOR_VARS[sport]}`,
      }}
      aria-hidden="true"
    />
  );
}
