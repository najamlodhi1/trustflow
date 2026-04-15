"use client";

import { use } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { MessageSquare, Star, TrendingUp, Eye } from "lucide-react";
import { StatCard } from "@/components/ui/Card";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { formatNumber } from "@/lib/utils";

const last30Days = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    testimonials: Math.floor(Math.random() * 8) + 1,
    reviews: Math.floor(Math.random() * 5),
    requests: Math.floor(Math.random() * 6) + 2,
  };
});

const SOURCE_DATA = [
  { name: "Direct", value: 48, color: "#6366f1" },
  { name: "Google", value: 28, color: "#4285F4" },
  { name: "Trustpilot", value: 12, color: "#00B67A" },
  { name: "Yelp", value: 8, color: "#D32323" },
  { name: "Other", value: 4, color: "#52525b" },
];

const TOP_TAGS = [
  { tag: "results", count: 42 },
  { tag: "communication", count: 38 },
  { tag: "quality", count: 35 },
  { tag: "speed", count: 28 },
  { tag: "value", count: 24 },
  { tag: "ease-of-use", count: 19 },
];

const TOP_TESTIMONIALS = [
  { name: "Sarah Johnson", company: "TechCorp", rating: 5, text: "Game-changing results..." },
  { name: "Mike Torres", company: "GrowthLabs", rating: 5, text: "Best social proof tool..." },
  { name: "James Okafor", company: "BuildFast", rating: 5, text: "Took less than 5 minutes..." },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated border border-[var(--border-default)] rounded-[var(--radius-md)] px-3 py-2 shadow-[var(--shadow-md)]">
      <p className="text-xs font-medium text-text-primary mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-xs text-text-secondary">
          {p.dataKey}: <span className="text-text-primary font-medium">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  return (
    <div>
      <Header title="Analytics" />

      <div className="p-6 max-w-screen-xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<MessageSquare className="h-5 w-5" />} label="Total Proof" value={formatNumber(1284)} trend={{ value: "12% mo", positive: true }} />
          <StatCard icon={<Star className="h-5 w-5" />} label="Avg Rating" value="★ 4.8" trend={{ value: "0.2 pts", positive: true }} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="This Month" value="+48" trend={{ value: "testimonials", positive: true }} />
          <StatCard icon={<Eye className="h-5 w-5" />} label="Widget Views" value={formatNumber(12420)} trend={{ value: "8% mo", positive: true }} />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6">
          {/* Line chart */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-text-primary">Activity over time</h2>
              <div className="flex gap-1 text-xs">
                {["Testimonials", "Reviews", "Requests"].map((l, i) => (
                  <span key={l} className="flex items-center gap-1.5 px-2 py-1 rounded-[var(--radius-sm)] bg-bg-overlay text-text-secondary">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: ["#6366f1", "#4285F4", "#10b981"][i] }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={last30Days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#52525b", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={6}
                />
                <YAxis tick={{ fill: "#52525b", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="testimonials" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="reviews" stroke="#4285F4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="requests" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Donut chart */}
          <Card>
            <h2 className="text-sm font-semibold text-text-primary mb-5">Source breakdown</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={SOURCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {SOURCE_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {SOURCE_DATA.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-text-secondary">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-text-primary font-medium">{s.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sentiment + Tags */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sentiment */}
          <Card>
            <h2 className="text-sm font-semibold text-text-primary mb-4">Sentiment breakdown</h2>
            <div className="space-y-4">
              {[
                { label: "Positive", pct: 82, color: "bg-brand-success" },
                { label: "Neutral", pct: 12, color: "bg-bg-overlay" },
                { label: "Negative", pct: 6, color: "bg-brand-danger" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-secondary">{s.label}</span>
                    <span className="text-text-primary font-medium">{s.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className={`h-full rounded-full ${s.color} transition-all duration-700`}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top tags */}
          <Card>
            <h2 className="text-sm font-semibold text-text-primary mb-4">Top Tags</h2>
            <div className="space-y-3">
              {TOP_TAGS.map((t, i) => (
                <div key={t.tag} className="flex items-center gap-3">
                  <span className="text-xs text-text-tertiary w-4 text-right">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary capitalize">{t.tag}</span>
                      <span className="text-text-primary font-medium">{t.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                        style={{ width: `${(t.count / TOP_TAGS[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top testimonials */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Top Testimonials</h2>
            <Badge variant="indigo">5-star · Featured</Badge>
          </div>
          <div className="space-y-4">
            {TOP_TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar name={t.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-primary">{t.name}</span>
                    <span className="text-xs text-text-tertiary">· {t.company}</span>
                  </div>
                  <StarRating value={t.rating} size="sm" readonly className="mt-0.5" />
                  <p className="text-xs text-text-secondary mt-1">&ldquo;{t.text}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
