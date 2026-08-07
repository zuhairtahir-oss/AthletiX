import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

/**
 * Consistent page-level heading used at the top of every route.
 * Keeps title/description/actions layout identical across pages so the
 * app doesn't feel like a set of loosely related screens.
 */
export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>
        )}
        <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
