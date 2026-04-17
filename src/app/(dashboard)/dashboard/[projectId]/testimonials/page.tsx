"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Download, Filter, Search, MoreHorizontal,
  Check, X, Star as StarIcon, Sparkles, ChevronDown,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, statusBadgeVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { TestimonialCardSkeleton } from "@/components/ui/Skeleton";
import { Header } from "@/components/layout/Header";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { timeAgo, cn } from "@/lib/utils";
import { SEED_TESTIMONIALS } from "@/lib/constants";
import { toast } from "sonner";

type Tab = "all" | "pending" | "approved" | "rejected" | "featured";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "featured", label: "Featured" },
];

interface Testimonial {
  id: string;
  name: string;
  title?: string;
  company?: string;
  rating: number;
  text: string;
  tags: readonly string[];
  status: string;
  source: string;
  createdAt: string;
  featured: boolean;
}

function TestimonialCard({
  t,
  selected,
  onSelect,
  onApprove,
  onReject,
  onFeature,
  onOpen,
}: {
  t: Testimonial;
  selected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  onFeature: () => void;
  onOpen: () => void;
}) {
  const [polishOpen, setPolishOpen] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [polished, setPolished] = useState<string | null>(null);

  async function handlePolish() {
    setPolishOpen(true);
    setPolishing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPolishing(false);
    setPolished(
      `Working with ${t.company || "this team"} completely transformed our approach. The results were exceptional — exceeding every metric we had set. I'd recommend them without hesitation to anyone looking for genuine expertise and outstanding outcomes.`
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      layout
      className={cn(
        "group rounded-[var(--radius-lg)] border transition-all duration-200 bg-bg-surface",
        selected
          ? "border-brand-primary/40 shadow-[0_0_0_1px_rgba(99,102,241,0.3)]"
          : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
      )}
    >
      <div className="p-5 cursor-pointer" onClick={onOpen}>
        {/* Header row */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => { e.stopPropagation(); onSelect(); }}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 h-4 w-4 rounded border-[var(--border-default)] accent-indigo-500"
            aria-label={`Select testimonial from ${t.name}`}
          />
          <Avatar name={t.name} size="md" sourceBadge={t.source as never} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-text-primary">{t.name}</span>
              {t.title && t.company && (
                <span className="text-xs text-text-tertiary">{t.title} at {t.company}</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={t.rating} size="sm" readonly />
              <span className="text-xs text-text-tertiary">·</span>
              <span className="text-xs text-text-tertiary capitalize">{t.source}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={statusBadgeVariant(t.status)} dot>
              {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
            </Badge>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-md)] text-text-tertiary hover:text-text-secondary hover:bg-bg-overlay transition-all opacity-0 group-hover:opacity-100"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Testimonial text */}
        <p className="mt-3 ml-11 text-sm text-text-secondary leading-relaxed">
          &ldquo;{t.text}&rdquo;
        </p>

        {/* Tags + time */}
        <div className="mt-3 ml-11 flex items-center gap-2 flex-wrap">
          {t.tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-[10px]">
              {tag}
            </Badge>
          ))}
          <span className="text-[10px] text-text-tertiary ml-auto">{timeAgo(new Date(t.createdAt))}</span>
        </div>

        {/* Action buttons (show on hover) */}
        <div className="mt-4 ml-11 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          {t.status !== "approved" && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Check className="h-3.5 w-3.5" />}
              onClick={onApprove}
              className="h-7 text-xs"
            >
              Approve
            </Button>
          )}
          {t.status !== "rejected" && (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<X className="h-3.5 w-3.5" />}
              onClick={onReject}
              className="h-7 text-xs"
            >
              Reject
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<StarIcon className="h-3.5 w-3.5" />}
            onClick={onFeature}
            className="h-7 text-xs"
          >
            {t.featured ? "Unfeature" : "Feature"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-400" />}
            onClick={handlePolish}
            className="h-7 text-xs"
          >
            AI Polish
          </Button>
        </div>
      </div>

      {/* AI Polish panel */}
      <AnimatePresence>
        {polishOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-5 rounded-[var(--radius-md)] border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
              <p className="text-xs font-medium text-text-secondary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                AI Polish
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-text-tertiary mb-1 font-medium uppercase tracking-wide">Original</p>
                  <p className="text-xs text-text-secondary leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-tertiary mb-1 font-medium uppercase tracking-wide">Enhanced</p>
                  {polishing ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-tertiary">Generating</span>
                      <span className="inline-flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-text-primary leading-relaxed">&ldquo;{polished}&rdquo;</p>
                  )}
                </div>
              </div>
              {!polishing && polished && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      toast.success("Polished version applied");
                      setPolishOpen(false);
                    }}
                  >
                    Use this version
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => { setPolished(null); setPolishing(true); handlePolish(); }}
                  >
                    Try again
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setPolishOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TestimonialsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    SEED_TESTIMONIALS.map((t) => ({ ...t, tags: [...t.tags] }))
  );
  const [loading] = useState(false);
  const [detailPanel, setDetailPanel] = useState<Testimonial | null>(null);

  // suppress unused warning — projectId will be used for data fetching
  void projectId;

  const counts = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    rejected: testimonials.filter((t) => t.status === "rejected").length,
    featured: testimonials.filter((t) => t.featured).length,
  };

  const filtered = testimonials.filter((t) => {
    if (tab === "pending" && t.status !== "pending") return false;
    if (tab === "approved" && t.status !== "approved") return false;
    if (tab === "rejected" && t.status !== "rejected") return false;
    if (tab === "featured" && !t.featured) return false;
    if (search && !t.text.toLowerCase().includes(search.toLowerCase()) && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function updateStatus(id: string, status: string) {
    setTestimonials((prev) =>
      prev.map((t) => t.id === id ? { ...t, status } : t)
    );
    toast.success(`Testimonial ${status}`);
  }

  function toggleFeature(id: string) {
    const current = testimonials.find((t) => t.id === id);
    const wasFeatured = current?.featured ?? false;
    setTestimonials((prev) =>
      prev.map((t) => t.id === id ? { ...t, featured: !t.featured } : t)
    );
    toast.success(wasFeatured ? "Removed from featured" : "Marked as featured ⭐");
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      <Header
        title="Testimonials"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Import
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Request
            </Button>
          </div>
        }
      />

      <div className="p-6 max-w-screen-xl mx-auto space-y-5">
        {/* Stats row */}
        <p className="text-sm text-text-secondary">
          <span className="text-text-primary font-medium">{counts.all}</span> total ·{" "}
          <span className="text-amber-400 font-medium">{counts.pending}</span> pending ·{" "}
          <span className="text-emerald-400 font-medium">{counts.approved}</span> approved ·{" "}
          <span className="text-red-400 font-medium">{counts.rejected}</span> rejected
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] -mb-px overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150",
                tab === t.id
                  ? "border-brand-primary text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {t.label}
              {counts[t.id] > 0 && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  tab === t.id ? "bg-indigo-500/20 text-indigo-400" : "bg-bg-overlay text-text-tertiary"
                )}>
                  {counts[t.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search testimonials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Filter className="h-4 w-4" />}
            rightIcon={<ChevronDown className="h-4 w-4" />}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter
          </Button>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <TestimonialCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MessageSquare />}
            title="No testimonials yet"
            description="Share your collection link with customers to start gathering testimonials."
            action={{ label: "Share collection link", href: "/collect/demo" }}
          />
        ) : (
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {filtered.map((t) => (
              <TestimonialCard
                key={t.id}
                t={t}
                selected={selected.has(t.id)}
                onSelect={() => toggleSelect(t.id)}
                onApprove={() => updateStatus(t.id, "approved")}
                onReject={() => updateStatus(t.id, "rejected")}
                onFeature={() => toggleFeature(t.id)}
                onOpen={() => setDetailPanel(t)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-3 bg-bg-elevated border border-[var(--border-default)] rounded-full px-5 py-2.5 shadow-[var(--shadow-md)]">
              <span className="text-sm font-medium text-text-primary">
                {selected.size} selected
              </span>
              <div className="w-px h-4 bg-[var(--border-subtle)]" />
              <Button
                variant="primary"
                size="sm"
                className="rounded-full h-7 text-xs"
                onClick={() => {
                  selected.forEach((id) => updateStatus(id, "approved"));
                  setSelected(new Set());
                }}
              >
                Approve all
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="rounded-full h-7 text-xs"
                onClick={() => {
                  selected.forEach((id) => updateStatus(id, "rejected"));
                  setSelected(new Set());
                }}
              >
                Reject all
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-7 text-xs"
                onClick={() => setSelected(new Set())}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detail panel backdrop ─────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 transition-opacity duration-300",
          detailPanel ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setDetailPanel(null)}
      />

      {/* ── Detail panel ──────────────────────────────────────── */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-full max-w-md flex flex-col",
          "bg-bg-elevated border-l border-[var(--border-default)]",
          "shadow-[var(--shadow-md)]",
          "transition-transform duration-300 ease-out",
          detailPanel ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Testimonial detail"
      >
        {detailPanel && (
          <>
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
              <h2 className="text-sm font-semibold text-text-primary">Testimonial details</h2>
              <Button variant="ghost" size="icon" onClick={() => setDetailPanel(null)} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Author */}
              <div className="flex items-center gap-4">
                <Avatar name={detailPanel.name} size="md" sourceBadge={detailPanel.source as never} />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{detailPanel.name}</p>
                  {detailPanel.title && detailPanel.company && (
                    <p className="text-xs text-text-tertiary">{detailPanel.title} · {detailPanel.company}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating value={detailPanel.rating} size="sm" readonly />
                    <Badge variant={statusBadgeVariant(detailPanel.status)} dot>
                      {detailPanel.status.charAt(0).toUpperCase() + detailPanel.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Full testimonial text */}
              <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-subtle)] p-4">
                <p className="text-sm text-text-secondary leading-relaxed">
                  &ldquo;{detailPanel.text}&rdquo;
                </p>
              </div>

              {/* Meta */}
              <div className="space-y-2">
                {detailPanel.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {detailPanel.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-text-tertiary">
                  Source: <span className="capitalize text-text-secondary">{detailPanel.source}</span>
                  {" · "}{timeAgo(new Date(detailPanel.createdAt))}
                </p>
                <p className="text-xs text-text-tertiary flex items-center gap-1">
                  Featured:{" "}
                  <span className={detailPanel.featured ? "text-amber-400" : "text-text-tertiary"}>
                    {detailPanel.featured ? "⭐ Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>

            {/* Panel actions */}
            <div className="border-t border-[var(--border-subtle)] p-4 space-y-2">
              <div className="flex gap-2">
                {detailPanel.status !== "approved" && (
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1"
                    leftIcon={<Check className="h-4 w-4" />}
                    onClick={() => {
                      updateStatus(detailPanel.id, "approved");
                      setDetailPanel((p) => p ? { ...p, status: "approved" } : null);
                    }}
                  >
                    Approve
                  </Button>
                )}
                {detailPanel.status !== "rejected" && (
                  <Button
                    variant="danger"
                    size="md"
                    className="flex-1"
                    leftIcon={<X className="h-4 w-4" />}
                    onClick={() => {
                      updateStatus(detailPanel.id, "rejected");
                      setDetailPanel((p) => p ? { ...p, status: "rejected" } : null);
                    }}
                  >
                    Reject
                  </Button>
                )}
              </div>
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                leftIcon={<StarIcon className="h-4 w-4" />}
                onClick={() => {
                  toggleFeature(detailPanel.id);
                  setDetailPanel((p) => p ? { ...p, featured: !p.featured } : null);
                }}
              >
                {detailPanel.featured ? "Remove from featured" : "Mark as featured"}
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="w-full"
                leftIcon={<Sparkles className="h-4 w-4 text-indigo-400" />}
              >
                AI Polish
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
