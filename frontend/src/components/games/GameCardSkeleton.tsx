import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

/** Loading placeholder matching GameCard's layout so the page doesn't jump when data arrives. */
export function GameCardSkeleton() {
  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="-mx-6 -mt-6 h-1.5 rounded-t-lg bg-surface-elevated" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-14" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-7 w-14" />
        <div className="flex flex-1 items-center justify-end gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
