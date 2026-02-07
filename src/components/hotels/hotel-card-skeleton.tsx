import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden border-[var(--border)] bg-[var(--surface)]">
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-[var(--surface-elevated)]" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4 bg-[var(--surface-elevated)]" />
        <Skeleton className="h-4 w-1/2 bg-[var(--surface-elevated)]" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-sm bg-[var(--surface-elevated)]" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <Skeleton className="h-6 w-20 bg-[var(--surface-elevated)]" />
        <Skeleton className="h-9 w-24 rounded-button bg-[var(--surface-elevated)]" />
      </CardFooter>
    </Card>
  );
}
