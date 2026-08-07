import { cn } from "../../utils/cn";

interface ComparisonBarProps {
  label: string;
  valueA: number | null;
  valueB: number | null;
  unit?: string;
}

/**
 * Side-by-side proportional bar for one metric. The larger value gets
 * full-width emphasis in brand color; the smaller gets a proportional
 * share in the muted/accent color — makes the gap between two numbers
 * immediately legible without a chart library.
 */
export function ComparisonBar({ label, valueA, valueB, unit }: ComparisonBarProps) {
  const hasData = valueA !== null && valueB !== null;
  const max = hasData ? Math.max(valueA, valueB, 1) : 1;
  const widthA = hasData ? Math.max((valueA / max) * 100, valueA === 0 ? 0 : 4) : 0;
  const widthB = hasData ? Math.max((valueB / max) * 100, valueB === 0 ? 0 : 4) : 0;
  const aLeads = hasData && valueA > valueB;
  const bLeads = hasData && valueB > valueA;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span
          className={cn("font-tabular font-semibold", aLeads ? "text-brand" : "text-text-secondary")}
        >
          {valueA !== null ? `${valueA}${unit ?? ""}` : "—"}
        </span>
        <span className="font-semibold uppercase tracking-wide text-text-muted">{label}</span>
        <span
          className={cn("font-tabular font-semibold", bLeads ? "text-accent" : "text-text-secondary")}
        >
          {valueB !== null ? `${valueB}${unit ?? ""}` : "—"}
        </span>
      </div>
      <div className="flex h-2 w-full items-center gap-1">
        <div className="flex h-full flex-1 justify-end overflow-hidden rounded-l-full bg-surface-elevated">
          <div
            className={cn("h-full rounded-l-full", aLeads ? "bg-brand" : "bg-border-strong")}
            style={{ width: `${widthA}%` }}
          />
        </div>
        <div className="flex h-full flex-1 justify-start overflow-hidden rounded-r-full bg-surface-elevated">
          <div
            className={cn("h-full rounded-r-full", bLeads ? "bg-accent" : "bg-border-strong")}
            style={{ width: `${widthB}%` }}
          />
        </div>
      </div>
    </div>
  );
}
