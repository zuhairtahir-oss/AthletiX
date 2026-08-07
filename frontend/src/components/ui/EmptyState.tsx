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
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-16 text-center">
      {icon && <div className="mb-4 text-text-muted">{icon}</div>}
      <p className="text-sm font-semibold text-text">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
