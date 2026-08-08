import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface StatCardProps {
  label: string;
  value: ReactNode;
  helpText?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Compact stat display: small uppercase label, large tabular value.
 * Used for dashboard highlights and single-number call-outs.
 */
export function StatCard({ label, value, helpText, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "surface-hairline group relative overflow-hidden rounded-lg border border-border bg-surface p-4 shadow-elevation-1 transition-colors duration-[var(--duration-fast)] hover:border-border-strong",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">
          {label}
        </span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <p className="mt-2 font-tabular text-2xl font-bold leading-none text-text">{value}</p>
      {helpText && <p className="mt-2 text-xs text-text-secondary">{helpText}</p>}
    </div>
  );
}
