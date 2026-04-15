"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  value,
  onChange,
  size = "md",
  readonly = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const display = readonly ? value : (hovered || value);

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={readonly ? "img" : "radiogroup"}
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        const halfFilled = !filled && star - 0.5 <= display;

        return (
          <button
            key={star}
            type="button"
            role={readonly ? undefined : "radio"}
            aria-checked={readonly ? undefined : value === star}
            aria-label={readonly ? undefined : `${star} star${star !== 1 ? "s" : ""}`}
            disabled={readonly}
            className={cn(
              "transition-transform duration-100",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default pointer-events-none"
            )}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-100",
                filled || halfFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-text-tertiary"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

interface RatingDisplayProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
}

export function RatingDisplay({ value, count, size = "sm" }: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-1.5">
      <StarRating value={value} size={size} readonly />
      <span className="text-xs font-medium text-text-secondary">
        {value.toFixed(1)}
        {count !== undefined && (
          <span className="text-text-tertiary"> ({count.toLocaleString()})</span>
        )}
      </span>
    </div>
  );
}
