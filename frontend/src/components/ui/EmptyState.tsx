import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Explains *why* there's nothing to show (no results, no live games
 * right now, etc.) instead of leaving a blank area.
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-field px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-radial-brand opacity-60"
        aria-hidden="true"
      />
      {icon && (
        <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-muted">
          {icon}
        </div>
      )}
      <p className="relative text-sm font-semibold text-text">{title}</p>
      {description && (
        <p className="relative mt-1.5 max-w-sm text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="relative mt-5">{action}</div>}
    </div>
  );
}
