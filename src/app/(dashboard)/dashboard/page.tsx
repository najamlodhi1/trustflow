"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare, Star, TrendingUp, Eye,
  Plus, Share2, Send, Layout,
  ArrowRight, Check, RefreshCw, X,
} from "lucide-react";
import { Card, StatCard } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, statusBadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { Header } from "@/components/layout/Header";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { formatNumber, timeAgo } from "@/lib/utils";
import { SEED_TESTIMONIALS } from "@/lib/constants";

const STATS = [
  { label: "Total Proof", value: 1284, trend: { value: "12% mo", positive: true }, icon: <MessageSquare className="h-5 w-5" /> },
  { label: "Avg Rating", value: "★ 4.8", trend: { value: "0.2 pts", positive: true }, icon: <Star className="h-5 w-5" /> },
  { label: "This Month", value: "+48", trend: { value: "testimonials", positive: true }, icon: <TrendingUp className="h-5 w-5" /> },
  { label: "Widget Views", value: formatNumber(12420), trend: { value: "8% mo", positive: true }, icon: <Eye className="h-5 w-5" /> },
];

const ACTIVITY = [
  { name: "Sarah Johnson", action: "approved a testimonial", time: new Date(Date.now() - 10 * 60 * 1000), type: "approve" },
  { name: "Google Sync", action: "imported 3 new reviews", time: new Date(Date.now() - 2 * 60 * 60 * 1000), type: "import" },
  { name: "Mike Torres", action: "submitted a testimonial", time: new Date(Date.now() - 5 * 60 * 60 * 1000), type: "submit" },
  { name: "Widget", action: "viewed 420 times today", time: new Date(Date.now() - 8 * 60 * 60 * 1000), type: "view" },
  { name: "Anna Li", action: "request email opened", time: new Date(Date.now() - 24 * 60 * 60 * 1000), type: "email" },
  { name: "James Okafor", action: "left a 5-star review", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), type: "review" },
];

const QUICK_ACTIONS = [
  { label: "Share collection link", icon: Share2, href: "/collect/demo" },
  { label: "Send review request", icon: Send, href: "/dashboard/demo/requests" },
  { label: "Import reviews", icon: RefreshCw, href: "/dashboard/demo/reviews" },
  { label: "Create widget", icon: Layout, href: "/dashboard/demo/widgets" },
];

const CHECKLIST = [
  { label: "Create your account", done: true },
  { label: "Customise your collection page", done: false, href: "/dashboard/demo/settings" },
  { label: "Share your collection link", done: false, href: "/collect/demo" },
  { label: "Create your first widget", done: false, href: "/dashboard/demo/widgets" },
  { label: "Embed widget on your website", done: false },
] as const;

function GettingStartedChecklist() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("tf-checklist-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem("tf-checklist-dismissed", "1");
  }

  if (!mounted || dismissed) return null;

  const doneCount = CHECKLIST.filter((i) => i.done).length;
  const progress = (doneCount / CHECKLIST.length) * 100;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Getting started with TrustFlow</h3>
          <p className="text-xs text-text-tertiary mt-0.5">
            {doneCount} of {CHECKLIST.length} complete
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss checklist"
          className="text-text-tertiary hover:text-text-secondary transition-colors p-1 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="h-1 bg-bg-overlay">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="divide-y divide-[var(--border-subtle)]">
        {CHECKLIST.map((item, i) => (
          <li key={i} className="flex items-center gap-3 px-6 py-3">
            <div
              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                item.done
                  ? "border-brand-success bg-brand-success/10"
                  : "border-[var(--border-default)]"
              }`}
            >
              {item.done && <Check className="h-3 w-3 text-brand-success" aria-hidden="true" />}
            </div>
            <span
              className={`text-sm flex-1 ${
                item.done ? "text-text-tertiary line-through" : "text-text-secondary"
              }`}
            >
              {item.label}
            </span>
            {"href" in item && !item.done && (
              <Link href={item.href as string}>
                <button className="text-xs text-brand-primary hover:underline">
                  Go →
                </button>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const raf = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);

  return <>{formatNumber(count)}</>;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const pending = SEED_TESTIMONIALS.filter((t) => t.status === "pending");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <Header
        title="Overview"
        actions={
          <Link href="/dashboard/demo/testimonials">
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              New request
            </Button>
          </Link>
        }
      />

      <div className="p-6 max-w-screen-xl mx-auto space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            {greeting} 👋
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Here&apos;s what&apos;s happening with TrustFlow Demo
          </p>
        </div>

        {/* Getting started checklist */}
        <GettingStartedChecklist />

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : STATS.map((stat, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <StatCard
                    icon={stat.icon}
                    label={stat.label}
                    value={typeof stat.value === "number"
                      ? <CountUp target={stat.value} />
                      : stat.value
                    }
                    trend={stat.trend}
                  />
                </motion.div>
              ))}
        </motion.div>

        {/* Activity + Quick Actions */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-6">
          {/* Activity feed */}
          <Card padding="none">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
              <Link href="/dashboard/demo/testimonials">
                <Button variant="ghost" size="sm" className="text-xs">
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
            <ul className="divide-y divide-[var(--border-subtle)]">
              {ACTIVITY.map((item, i) => (
                <li key={i} className="flex items-center gap-3 px-6 py-3 hover:bg-bg-overlay/50 transition-colors">
                  <Avatar name={item.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary">
                      <span className="font-medium">{item.name}</span>{" "}
                      <span className="text-text-secondary">{item.action}</span>
                    </p>
                  </div>
                  <span className="text-xs text-text-tertiary whitespace-nowrap flex-shrink-0">
                    {timeAgo(item.time)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Quick Actions */}
          <Card className="h-fit w-full lg:w-64">
            <h2 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-overlay transition-all duration-150 group">
                      <Icon className="h-4 w-4 text-text-tertiary group-hover:text-brand-primary transition-colors" />
                      {action.label}
                    </button>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Pending approvals */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-text-primary">
                Pending Approvals
                <Badge variant="warning" className="ml-2">{pending.length}</Badge>
              </h2>
              <Link href="/dashboard/demo/testimonials">
                <Button variant="ghost" size="sm" className="text-xs">
                  Approve all
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {pending.map((t) => (
                <div
                  key={t.id}
                  className="flex-shrink-0 w-72 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-surface p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={t.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">{t.name}</p>
                      <p className="text-[10px] text-text-tertiary">{t.company}</p>
                    </div>
                    <Badge variant="warning" dot className="ml-auto">Pending</Badge>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1 text-xs h-7" leftIcon={<Check className="h-3 w-3" />}>
                      Approve
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-xs h-7">
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
