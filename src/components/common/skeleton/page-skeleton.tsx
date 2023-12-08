import { Skeleton } from "./skeleton";

export function PageSkeleton() {
  return (
    <div className="absolute inset-0 pt-24 px-4">
      <div className="flex gap-4">
        <Skeleton className="w-40 h-40 rounded-xl" />
        <div className="space-y-4 flex-1">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1 rounded-xl" />
            <Skeleton className="h-10 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <Skeleton className="h-40 w-28 rounded-xl" />
        <Skeleton className="h-40 w-28 rounded-xl" />
      </div>
    </div>
  );
}
