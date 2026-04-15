"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  Layout,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/demo/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/dashboard/demo/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/demo/widgets", label: "Widgets", icon: Layout },
  { href: "/dashboard/demo/analytics", label: "Analytics", icon: BarChart2 },
];

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden border-t border-[var(--border-subtle)] bg-bg-base/90 backdrop-blur-md"
      aria-label="Mobile navigation"
    >
      {MOBILE_NAV.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-medium transition-colors duration-150",
              active ? "text-brand-primary" : "text-text-tertiary"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
