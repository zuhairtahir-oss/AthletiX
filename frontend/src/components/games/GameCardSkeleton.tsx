import { Card } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

/** Loading placeholder matching GameCard's layout so the page doesn't jump when data arrives. */
export function GameCardSkeleton() {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-14" />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-6" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-6" />
        </div>
      </div>
    </Card>
  );
}
