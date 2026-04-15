import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className, width, height, rounded = "md", ...props }: SkeletonProps) {
  const roundedClasses = {
    sm: "rounded-[var(--radius-sm)]",
    md: "rounded-[var(--radius-md)]",
    lg: "rounded-[var(--radius-lg)]",
    full: "rounded-full",
  };

  return (
    <div
      className={cn("skeleton", roundedClasses[rounded], className)}
      style={{ width, height }}
      aria-hidden="true"
      {...props}
    />
  );
}

export function TestimonialCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-surface p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width="40px" height="40px" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton height="14px" width="140px" />
          <Skeleton height="12px" width="100px" />
        </div>
        <Skeleton height="22px" width="70px" rounded="full" />
      </div>
      <div className="space-y-2">
        <Skeleton height="13px" className="w-full" />
        <Skeleton height="13px" className="w-5/6" />
        <Skeleton height="13px" className="w-4/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton height="22px" width="60px" rounded="full" />
        <Skeleton height="22px" width="80px" rounded="full" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-surface p-6 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton height="14px" width="100px" />
        <Skeleton height="36px" width="36px" rounded="md" />
      </div>
      <Skeleton height="32px" width="80px" />
      <Skeleton height="12px" width="60px" />
    </div>
  );
}
