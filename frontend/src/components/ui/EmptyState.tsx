import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Explains *why* there's nothing to show (no results, no live games
 * right now, etc.) instead of leaving a blank area. Compact horizontal
 * row on a solid surface (not a large dashed placeholder box) so it
 * reads as a deliberate state in a data-dense app, not an unfinished
 * screen.
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface px-6 py-8 text-center sm:flex-row sm:text-left">
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-elevated text-text-muted">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-text">{title}</p>
        {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      </div>
      {action && <div className="sm:ml-auto">{action}</div>}
    </div>
  );
}
