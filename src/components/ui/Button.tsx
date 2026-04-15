"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-primary text-white hover:bg-indigo-500 shadow-sm",
        secondary:
          "bg-bg-surface text-text-primary border border-[var(--border-default)] hover:bg-bg-overlay hover:border-[var(--border-strong)]",
        ghost:
          "text-text-secondary hover:text-text-primary hover:bg-bg-overlay",
        danger:
          "bg-brand-danger text-white hover:bg-red-500",
        outline:
          "border border-[var(--border-default)] text-text-primary hover:bg-bg-overlay hover:border-[var(--border-strong)]",
        gradient:
          "text-white shadow-sm bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-[var(--radius-sm)]",
        md: "h-10 px-4 text-sm rounded-[var(--radius-md)]",
        lg: "h-11 px-6 text-base rounded-[var(--radius-md)]",
        icon: "h-9 w-9 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  loading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
