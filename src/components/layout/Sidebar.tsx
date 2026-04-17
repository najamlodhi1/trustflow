"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Star,
  Layout,
  Send,
  BarChart2,
  Settings,
  Zap,
  ChevronDown,
  LogOut,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/demo/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/dashboard/demo/reviews", label: "Reviews", icon: Star },
  { href: "/dashboard/demo/widgets", label: "Widgets", icon: Layout },
  { href: "/dashboard/demo/requests", label: "Requests", icon: Send },
  { href: "/dashboard/demo/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/demo/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-[var(--border-subtle)] bg-bg-surface transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 py-5 border-b border-[var(--border-subtle)]", collapsed && "justify-center px-0")}>
        <div className="flex-shrink-0 h-8 w-8 rounded-[var(--radius-md)] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-text-primary tracking-tight">TrustFlow</span>
        )}
      </div>

      {/* Project switcher */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-[var(--border-subtle)]">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors text-left">
            <div className="h-5 w-5 rounded-sm bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-text-primary truncate">TrustFlow Demo</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-tertiary flex-shrink-0" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Main navigation">
        <ul className="space-y-0.5" role="list">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150",
                    collapsed ? "justify-center" : "",
                    active
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-overlay"
                  )}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  {active && (
                    <motion.div
                      className="absolute inset-0 rounded-[var(--radius-md)] bg-indigo-500/10"
                      layoutId="nav-active"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0 relative z-10",
                      active ? "text-brand-primary" : "text-text-tertiary group-hover:text-text-secondary"
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && (
                    <span className="relative z-10">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom: plan + user */}
      <div className="border-t border-[var(--border-subtle)] p-3 space-y-2">
        {!collapsed && (
          <>
            <div className="px-3 py-2 rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-text-secondary">Free plan</span>
                <Badge variant="indigo" className="text-[10px]">8/10</Badge>
              </div>
              <div className="h-1 rounded-full bg-bg-overlay overflow-hidden">
                <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" />
              </div>
              <Link href="/dashboard/billing">
                <Button variant="gradient" size="sm" className="w-full mt-2 text-xs h-7">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-md)] hover:bg-bg-overlay transition-colors cursor-pointer group">
              <Avatar name="Demo User" size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">Demo User</p>
                <p className="text-[10px] text-text-tertiary truncate">demo@trustflow.app</p>
              </div>
              <button
                aria-label="Sign out"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-text-secondary"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-2">
            <Link href="/dashboard/billing" title="Billing">
              <CreditCard className="h-4 w-4 text-text-tertiary" />
            </Link>
            <Avatar name="Demo User" size="sm" />
          </div>
        )}
      </div>
    </aside>
  );
}
