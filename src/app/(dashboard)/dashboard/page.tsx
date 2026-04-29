"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare, TrendingUp, Lightbulb, Clock,
  Plus, ArrowRight, Check, X, Sparkles, ThumbsUp,
  Share2, Send, Layout, RefreshCw, Zap,
} from "lucide-react";
import { Card, StatCard } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { Header } from "@/components/layout/Header";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { formatNumber, timeAgo } from "@/lib/utils";
import { SEED_TESTIMONIALS } from "@/lib/constants";
import { toast } from "sonner";

const SENTIMENT = { positive: 78, neutral: 14, negative: 8 };

const AI_ACTIONS = [
  {
    icon: Sparkles,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    message: "Hero quote generated for Sarah Johnson",
    sub: '"Game-changing results that exceeded every expectation."',
    time: new Date(Date.now() - 10 * 60 * 1000),
    action: { label: "Review", href: "/dashboard/demo/suggestions" },
  },
  {
    icon: Sparkles,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10",
    message: "2 AI outreach drafts ready for review",
    sub: "Post-launch outreach · enterprise segment",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    action: { label: "Open", href: "/dashboard/demo/requests" },
  },
  {
    icon: ThumbsUp,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    message: "Testimonial enriched from Mike Torres",
    sub: 'Sentiment: Positive · Topics: conversion, results, speed',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    action: { label: "View", href: "/dashboard/demo/testimonials" },
  },
  {
    icon: Lightbulb,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    message: "New homepage section suggested by AI",
    sub: '"Trusted by growth teams worldwide" — 3 quotes selected',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000),
    action: { label: "Apply", href: "/dashboard/demo/suggestions" },
  },
  {
    icon: Sparkles,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    message: "Pricing page section suggestion ready",
    sub: '"Worth every penny — our customers agree"',
    time: new Date(Date.now() - 14 * 60 * 60 * 1000),
    action: { label: "Review", href: "/dashboard/demo/suggestions" },
  },
];

const QUICK_ACTIONS = [
  { label: "Share collection link", icon: Share2, href: "/collect/demo" },
  { label: "Send campaign", icon: Send, href: "/dashboard/demo/requests" },
  { label: "Import reviews", icon: RefreshCw, href: "/dashboard/demo/reviews" },
  { label: "Create widget", icon: Layout, href: "/dashboard/demo/widgets" },
];

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

function SentimentBar() {
  return (
    <div className="space-y-2">
      {[
        { label: "Positive", pct: SENTIMENT.positive, color: "bg-emerald-500" },
        { label: "Neutral", pct: SENTIMENT.neutral, color: "bg-bg-overlay" },
        { label: "Negative", pct: SENTIMENT.negative, color: "bg-red-500" },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-3">
          <span className="text-xs text-text-tertiary w-14 flex-shrink-0">{s.label}</span>
          <div className="flex-1 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${s.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
          <span className="text-xs font-medium text-text-secondary w-8 text-right">{s.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState<Set<string>>(
    () => new Set(SEED_TESTIMONIALS.filter((t) => t.status === "pending").map((t) => t.id))
  );
  const pending = SEED_TESTIMONIALS.filter((t) => pendingIds.has(t.id));

  function approveItem(id: string, name: string) {
    setPendingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    toast.success(`Approved testimonial from ${name}`);
  }

  function rejectItem(id: string, name: string) {
    setPendingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    toast.success(`Rejected testimonial from ${name}`);
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const STATS = [
    {
      label: "This Month",
      value: loading ? 0 : 48,
      display: loading ? "—" : <><CountUp target={48} /><span className="text-xs text-text-tertiary ml-1">testimonials</span></>,
      trend: { value: "+12 vs last month", positive: true },
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      label: "Sentiment",
      value: null,
      display: !loading && <SentimentBar />,
      trend: null,
      icon: <TrendingUp className="h-5 w-5" />,
      isCustom: true,
    },
    {
      label: "Pending Approvals",
      value: pending.length,
      display: loading ? "—" : pending.length,
      trend: pending.length > 0 ? { value: "need review", positive: false } : { value: "all clear", positive: true },
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "AI Suggestions",
      value: 2,
      display: loading ? "—" : 2,
      trend: { value: "ready to apply", positive: true },
      icon: <Lightbulb className="h-5 w-5" />,
    },
  ];

  return (
    <div>
      <Header
        title="Overview"
        actions={
          <Link href="/dashboard/demo/requests">
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              New campaign
            </Button>
          </Link>
        }
      />

      <div className="p-6 max-w-screen-xl mx-auto space-y-8">
        <div>
          <h1 className="text-xl font-bold text-text-primary">{greeting} 👋</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Here&apos;s what&apos;s happening with TrustFlow Demo
          </p>
        </div>

        {/* KPI cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
            : STATS.map((stat, i) =>
                stat.isCustom ? (
                  <motion.div key={i} variants={fadeUp}>
                    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-bg-surface p-5 h-full">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-[var(--radius-md)] bg-bg-elevated flex items-center justify-center text-text-tertiary">
                          {stat.icon}
                        </div>
                        <span className="text-sm text-text-secondary font-medium">{stat.label}</span>
                      </div>
                      {stat.display}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={i} variants={fadeUp}>
                    <StatCard
                      icon={stat.icon}
                      label={stat.label}
                      value={stat.display as React.ReactNode}
                      trend={stat.trend ?? undefined}
                    />
                  </motion.div>
                )
              )}
        </motion.div>

        {/* AI Actions + Quick Actions */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-6">
          {/* AI Actions feed */}
          <Card padding="none">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Zap className="h-4 w-4 text-indigo-400" />
                Recent AI Actions
              </h2>
              <Link href="/dashboard/demo/suggestions">
                <Button variant="ghost" size="sm" className="text-xs">
                  View suggestions <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
            <ul className="divide-y divide-[var(--border-subtle)]">
              {AI_ACTIONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-bg-overlay/50 transition-colors">
                    <div className={`mt-0.5 h-7 w-7 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
                      <Icon className={`h-3.5 w-3.5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary">{item.message}</p>
                      <p className="text-xs text-text-tertiary mt-0.5 truncate">{item.sub}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-text-tertiary whitespace-nowrap">
                        {timeAgo(item.time)}
                      </span>
                      <Link href={item.action.href}>
                        <button className="text-xs text-brand-primary hover:underline whitespace-nowrap">
                          {item.action.label} →
                        </button>
                      </Link>
                    </div>
                  </li>
                );
              })}
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
                  View all <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {pending.map((t) => (
                <div
                  key={t.id}
                  className="flex-shrink-0 w-76 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-surface p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Avatar name={t.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate">{t.name}</p>
                      <p className="text-[10px] text-text-tertiary">{t.company}</p>
                    </div>
                    <Badge variant="warning" dot className="ml-auto">Pending</Badge>
                  </div>

                  {/* AI summary */}
                  {t.aiSummary && (
                    <div className="rounded-[var(--radius-sm)] bg-indigo-500/5 border border-indigo-500/15 px-3 py-2">
                      <p className="text-[10px] text-indigo-400 font-medium flex items-center gap-1 mb-0.5">
                        <Sparkles className="h-3 w-3" /> AI Summary
                      </p>
                      <p className="text-xs text-text-secondary italic">{t.aiSummary}</p>
                    </div>
                  )}

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs h-7"
                      leftIcon={<Check className="h-3 w-3" />}
                      onClick={() => approveItem(t.id, t.name)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-xs h-7"
                      leftIcon={<X className="h-3 w-3" />}
                      onClick={() => rejectItem(t.id, t.name)}
                    >
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
