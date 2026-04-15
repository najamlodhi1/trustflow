import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
  {
    variants: {
      variant: {
        default: "bg-bg-overlay text-text-secondary border-[var(--border-subtle)]",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        danger: "bg-red-500/10 text-red-400 border-red-500/20",
        info: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        purple: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-emerald-400",
            variant === "warning" && "bg-amber-400",
            variant === "danger" && "bg-red-400",
            variant === "info" && "bg-cyan-400",
            variant === "purple" && "bg-violet-400",
            variant === "indigo" && "bg-indigo-400",
            (!variant || variant === "default") && "bg-zinc-400"
          )}
        />
      )}
      {children}
    </span>
  );
}

export function statusBadgeVariant(
  status: string
): VariantProps<typeof badgeVariants>["variant"] {
  switch (status) {
    case "approved": return "success";
    case "pending": return "warning";
    case "rejected": return "danger";
    case "featured": return "purple";
    case "completed": return "success";
    case "opened": return "info";
    case "sent": return "warning";
    case "bounced": return "danger";
    default: return "default";
  }
}
