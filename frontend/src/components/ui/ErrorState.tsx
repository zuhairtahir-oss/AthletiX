import { TriangleAlert as AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Failure state for data fetches. Always explains what happened and
 * gives the user a way forward (retry) rather than a raw error dump.
 */
export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-error/30 bg-error-soft px-6 py-16 text-center"
    >
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-error/30 bg-surface-elevated">
        <AlertTriangle className="h-5 w-5 text-error" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
