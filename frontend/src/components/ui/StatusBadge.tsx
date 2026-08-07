import { cn } from "../../utils/cn";

export type GameStatus = "live" | "upcoming" | "final" | "success" | "warning" | "error" | "neutral";

interface StatusBadgeProps {
  status: GameStatus;
  label: string;
  /** Renders a pulsing dot for "live" — the only place animation-as-signal is used. */
  pulse?: boolean;
  className?: string;
}

const statusClasses: Record<GameStatus, string> = {
  live: "bg-live-soft text-live border-live/30",
  upcoming: "bg-surface-elevated text-text-secondary border-border-strong",
  final: "bg-surface-elevated text-text-secondary border-border",
  success: "bg-success-soft text-success border-success/30",
  warning: "bg-warning-soft text-warning border-warning/30",
  error: "bg-error-soft text-error border-error/30",
  neutral: "bg-surface-elevated text-text-muted border-border",
};

/**
 * Status is always communicated with both color AND a text label (never
 * color alone), satisfying the accessibility requirement in the brief.
 */
export function StatusBadge({ status, label, pulse, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em]",
        statusClasses[status],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
        </span>
      )}
      {label}
    </span>
  );
}
