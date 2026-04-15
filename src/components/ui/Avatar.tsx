import Image from "next/image";
import { cn, getInitials, generateGradient } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  sourceBadge?: "google" | "trustpilot" | "yelp" | "facebook" | "direct";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const badgeSizes = {
  sm: "h-3.5 w-3.5 -bottom-0.5 -right-0.5",
  md: "h-4 w-4 -bottom-0.5 -right-0.5",
  lg: "h-5 w-5 -bottom-0.5 -right-0.5",
  xl: "h-6 w-6 -bottom-1 -right-1",
};

function SourceIcon({ source }: { source: AvatarProps["sourceBadge"] }) {
  const icons: Record<string, string> = {
    google: "G",
    trustpilot: "★",
    yelp: "Y",
    facebook: "f",
  };
  const colors: Record<string, string> = {
    google: "bg-white text-[#4285F4]",
    trustpilot: "bg-[#00B67A] text-white",
    yelp: "bg-[#D32323] text-white",
    facebook: "bg-[#1877F2] text-white",
  };
  if (!source || source === "direct") return null;
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-full text-[8px] font-bold border border-bg-base",
        colors[source] || "bg-bg-overlay text-text-secondary"
      )}
      aria-label={`Source: ${source}`}
    >
      {icons[source]}
    </span>
  );
}

export function Avatar({ name, src, size = "md", sourceBadge, className }: AvatarProps) {
  const gradient = generateGradient(name);
  const initials = getInitials(name);

  return (
    <div className={cn("relative inline-flex flex-shrink-0", className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={64}
          height={64}
          className={cn("rounded-full object-cover", sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            "rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br",
            gradient,
            sizeClasses[size]
          )}
          aria-label={`Avatar for ${name}`}
        >
          {initials}
        </div>
      )}
      {sourceBadge && sourceBadge !== "direct" && (
        <span className={cn("absolute", badgeSizes[size])}>
          <SourceIcon source={sourceBadge} />
        </span>
      )}
    </div>
  );
}

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: "sm" | "md";
}

export function AvatarGroup({ names, max = 5, size = "sm" }: AvatarGroupProps) {
  const visible = names.slice(0, max);
  const extra = names.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((name, i) => (
        <div key={i} className="ring-2 ring-bg-base rounded-full">
          <Avatar name={name} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div
          className={cn(
            "ring-2 ring-bg-base rounded-full bg-bg-overlay flex items-center justify-center text-xs font-medium text-text-secondary",
            sizeClasses[size]
          )}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
