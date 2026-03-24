interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

export default function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
}: SkeletonProps) {
  const base = "animate-pulse bg-gray-200";
  const shape =
    variant === "circular"
      ? "rounded-full"
      : variant === "text"
        ? "rounded"
        : "rounded-xl";

  return (
    <div
      className={`${base} ${shape} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex gap-3.5 p-3 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <Skeleton className="w-16 h-16 flex-shrink-0" />
      <div className="flex-1 space-y-2 py-1">
        <Skeleton className="h-4 w-3/4" variant="text" />
        <Skeleton className="h-3 w-1/2" variant="text" />
      </div>
    </div>
  );
}

export function BroadcastCardSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <Skeleton className="w-12 h-12 flex-shrink-0" />
      <div className="flex-1 space-y-1.5 py-0.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/2" variant="text" />
          <Skeleton className="h-3 w-10" variant="text" />
        </div>
        <Skeleton className="h-3.5 w-3/4" variant="text" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12 rounded-md" variant="text" />
          <Skeleton className="h-3 w-10" variant="text" />
          <Skeleton className="h-3 w-10" variant="text" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3, variant = "card" }: { count?: number; variant?: "card" | "broadcast" }) {
  return (
    <div className="flex flex-col gap-2.5 px-4 py-3">
      {Array.from({ length: count }, (_, i) => (
        variant === "broadcast" ? <BroadcastCardSkeleton key={i} /> : <CardSkeleton key={i} />
      ))}
    </div>
  );
}
