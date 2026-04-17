import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  className,
  hover,
  glow,
  padding = "md",
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border transition-all duration-200",
        "bg-bg-surface border-[var(--border-subtle)]",
        "shadow-[var(--shadow-sm)]",
        hover && "hover:border-[var(--border-default)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 cursor-pointer",
        glow && "hover:shadow-[var(--shadow-glow)]",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.positive ? "text-brand-success" : "text-brand-danger"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="text-text-tertiary p-2 rounded-[var(--radius-md)] bg-bg-elevated">
          {icon}
        </div>
      </div>
    </Card>
  );
}
