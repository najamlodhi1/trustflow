"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Download, Search, MoreHorizontal, Check, X,
  Star as StarIcon, Sparkles, ChevronDown, MessageSquare,
  Copy, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, statusBadgeVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { Input, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { TestimonialCardSkeleton } from "@/components/ui/Skeleton";
import { Header } from "@/components/layout/Header";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { timeAgo, cn, copyToClipboard } from "@/lib/utils";
import { SEED_TESTIMONIALS } from "@/lib/constants";
import { toast } from "sonner";

type Tab = "all" | "pending" | "approved" | "rejected";
type SentimentFilter = "all" | "positive" | "neutral" | "negative";
type SourceFilter = "all" | "direct" | "google" | "trustpilot";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const SENTIMENT_META = {
  positive: { label: "Positive", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  neutral:  { label: "Neutral",  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   dot: "bg-amber-400" },
  negative: { label: "Negative", color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     dot: "bg-red-400" },
};

type Testimonial = typeof SEED_TESTIMONIALS[number] & {
  status: string;
  featured: boolean;
};

// ── AI Response panel ─────────────────────────────────────────────────────────

function AIResponsePanel({ t, onClose }: { t: Testimonial; onClose: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setGenerating(true);
    setResponse("");
    await new Promise((r) => setTimeout(r, 1800));
    setGenerating(false);
    const isNeg = t.sentimentLabel === "negative";
    setResponse(
      isNeg
        ? `Hi ${t.name.split(" ")[0]}, thank you for taking the time to share this — we genuinely appreciate the honesty. We're sorry to hear this wasn't the experience we aim for. We'd love to make it right. Could you reach out to us directly at support@trustflow.app so we can resolve this for you personally? — The TrustFlow Team`
        : `Thank you so much for the kind words, ${t.name.split(" ")[0]}! 🙏 It means a lot to the whole team to hear that ${t.aiSummary ? t.aiSummary.replace(/"/g, "").toLowerCase() : "your experience was positive"}. We'd love to have you continue the journey with us. — The TrustFlow Team`
    );
  }

  async function handleCopy() {
    await copyToClipboard(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Response copied to clipboard");
  }

  const sentiment = t.sentimentLabel ? SENTIMENT_META[t.sentimentLabel as keyof typeof SENTIMENT_META] : null;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-30 bg-black/40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-bg-elevated border-l border-[var(--border-default)] shadow-[var(--shadow-md)] flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-subtle)]">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            AI Response Draft
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Testimonial */}
          <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-subtle)] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Avatar name={t.name} size="sm" />
              <div>
                <p className="text-xs font-medium text-text-primary">{t.name}
                  {t.company && <span className="text-text-tertiary font-normal"> · {t.company}</span>}
                </p>
                <StarRating value={t.rating} size="sm" readonly />
              </div>
              {sentiment && (
                <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${sentiment.bg} ${sentiment.color}`}>
                  {sentiment.label}
                </span>
              )}
            </div>
            {t.aiSummary && (
              <div className="rounded-[var(--radius-sm)] bg-indigo-500/5 border border-indigo-500/15 px-3 py-1.5">
                <p className="text-[10px] text-indigo-400 font-medium mb-0.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI Summary
                </p>
                <p className="text-xs text-text-secondary italic">{t.aiSummary}</p>
              </div>
            )}
            <p className="text-xs text-text-secondary leading-relaxed">&ldquo;{t.text}&rdquo;</p>
          </div>

          {/* Response */}
          <div>
            <label className="text-xs font-medium text-text-secondary mb-2 block">
              {t.sentimentLabel === "negative" ? "De-escalation response" : "Generated response"}
            </label>
            {generating ? (
              <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-subtle)] p-4 min-h-24 flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                  <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                  <span>Generating</span>
                  <span className="inline-flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1 w-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </span>
                </div>
              </div>
            ) : response ? (
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={7}
                className="text-xs"
              />
            ) : (
              <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-default)] border-dashed p-8 text-center">
                <p className="text-xs text-text-tertiary mb-3">
                  {t.sentimentLabel === "negative"
                    ? "AI will draft a de-escalation response that moves the conversation offline."
                    : "AI will draft a warm, on-brand reply based on brand voice settings."}
                </p>
                <Button variant="gradient" size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />} onClick={generate}>
                  Generate response
                </Button>
              </div>
            )}
          </div>
        </div>

        {response && (
          <div className="p-5 border-t border-[var(--border-subtle)] flex gap-2">
            <Button variant="primary" size="md" className="flex-1" leftIcon={<Copy className="h-4 w-4" />} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy response"}
            </Button>
            <Button variant="secondary" size="icon" onClick={() => { setResponse(""); generate(); }} aria-label="Regenerate">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────

function TestimonialCard({
  t, selected, onSelect, onApprove, onReject, onFeature, onAIResponse,
}: {
  t: Testimonial;
  selected: boolean;
  onSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
  onFeature: () => void;
  onAIResponse: () => void;
}) {
  const sentiment = t.sentimentLabel ? SENTIMENT_META[t.sentimentLabel as keyof typeof SENTIMENT_META] : null;

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
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 h-4 w-4 rounded border-[var(--border-default)] accent-indigo-500"
            aria-label={`Select testimonial from ${t.name}`}
          />
          <Avatar name={t.name} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-text-primary">{t.name}</span>
              {t.company && <span className="text-xs text-text-tertiary">{t.title} · {t.company}</span>}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <StarRating value={t.rating} size="sm" readonly />
              <span className="text-xs text-text-tertiary">·</span>
              <span className="text-xs text-text-tertiary capitalize">{t.source}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {sentiment && (
              <span className={`hidden sm:flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${sentiment.bg} ${sentiment.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sentiment.dot}`} />
                {sentiment.label}
              </span>
            )}
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

        {/* AI Summary */}
        {t.aiSummary && (
          <div className="mt-3 ml-11 rounded-[var(--radius-sm)] bg-indigo-500/5 border border-indigo-500/15 px-3 py-2">
            <p className="text-[10px] text-indigo-400 font-medium flex items-center gap-1 mb-0.5">
              <Sparkles className="h-3 w-3" /> AI Summary
            </p>
            <p className="text-xs text-text-secondary italic">{t.aiSummary}</p>
          </div>
        )}

        {/* Testimonial text */}
        <p className="mt-3 ml-11 text-sm text-text-secondary leading-relaxed line-clamp-2">
          &ldquo;{t.text}&rdquo;
        </p>

        {/* AI topics + time */}
        <div className="mt-3 ml-11 flex items-center gap-2 flex-wrap">
          {t.aiTopics?.map((tag) => (
            <Badge key={tag} variant="default" className="text-[10px]">{tag}</Badge>
          ))}
          <span className="text-[10px] text-text-tertiary ml-auto">{timeAgo(new Date(t.createdAt))}</span>
        </div>

        {/* Action row */}
        <div className="mt-4 ml-11 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {t.status !== "approved" && (
            <Button variant="primary" size="sm" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={onApprove} className="h-7 text-xs">
              Approve
            </Button>
          )}
          {t.status !== "rejected" && (
            <Button variant="ghost" size="sm" leftIcon={<X className="h-3.5 w-3.5" />} onClick={onReject} className="h-7 text-xs text-red-400 hover:text-red-300">
              Reject
            </Button>
          )}
          <Button variant="ghost" size="sm" leftIcon={<StarIcon className="h-3.5 w-3.5" />} onClick={onFeature} className="h-7 text-xs">
            {t.featured ? "Unfeature" : "Feature"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-400" />}
            onClick={onAIResponse}
            className="h-7 text-xs"
          >
            Draft response
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  void projectId;

  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    SEED_TESTIMONIALS.map((t) => ({ ...t, status: t.status, featured: t.featured }))
  );
  const [aiResponseFor, setAiResponseFor] = useState<Testimonial | null>(null);
  const loading = false;

  const counts = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    rejected: testimonials.filter((t) => t.status === "rejected").length,
  };

  const filtered = testimonials.filter((t) => {
    if (tab !== "all" && t.status !== tab) return false;
    if (sentimentFilter !== "all" && t.sentimentLabel !== sentimentFilter) return false;
    if (sourceFilter !== "all" && t.source !== sourceFilter) return false;
    if (search && !t.text.toLowerCase().includes(search.toLowerCase()) && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function updateStatus(id: string, status: string) {
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
    toast.success(`Testimonial ${status}`);
  }

  function toggleFeature(id: string) {
    const was = testimonials.find((t) => t.id === id)?.featured;
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, featured: !t.featured } : t));
    toast.success(was ? "Removed from featured" : "Marked as featured ⭐");
  }

  function toggleSelect(id: string) {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }

  const activeFilters = (sentimentFilter !== "all" ? 1 : 0) + (sourceFilter !== "all" ? 1 : 0);

  return (
    <div>
      <Header
        title="Inbox"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Download className="h-4 w-4" />}>Import</Button>
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>Request</Button>
          </div>
        }
      />

      <div className="p-6 max-w-screen-xl mx-auto space-y-5">
        {/* Count row */}
        <p className="text-sm text-text-secondary">
          <span className="text-text-primary font-medium">{counts.all}</span> total ·{" "}
          <span className="text-amber-400 font-medium">{counts.pending}</span> pending ·{" "}
          <span className="text-emerald-400 font-medium">{counts.approved}</span> approved
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] -mb-px overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150",
                tab === t.id ? "border-brand-primary text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              {t.label}
              {counts[t.id] > 0 && (
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", tab === t.id ? "bg-indigo-500/20 text-indigo-400" : "bg-bg-overlay text-text-tertiary")}>
                  {counts[t.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-48">
            <Input placeholder="Search testimonials..." value={search} onChange={(e) => setSearch(e.target.value)} leftIcon={<Search className="h-4 w-4" />} />
          </div>
          <Button
            variant={filterOpen || activeFilters > 0 ? "primary" : "secondary"}
            size="md"
            leftIcon={<ChevronDown className={cn("h-4 w-4 transition-transform", filterOpen && "rotate-180")} />}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            Filter{activeFilters > 0 && ` (${activeFilters})`}
          </Button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-surface p-4 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-2">Sentiment</p>
                    <div className="flex gap-2 flex-wrap">
                      {(["all", "positive", "neutral", "negative"] as SentimentFilter[]).map((s) => {
                        const meta = s !== "all" ? SENTIMENT_META[s] : null;
                        return (
                          <button
                            key={s}
                            onClick={() => setSentimentFilter(s)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all",
                              sentimentFilter === s
                                ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                                : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]"
                            )}
                          >
                            {meta && <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />}
                            {s === "all" ? "All" : meta?.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-secondary mb-2">Source</p>
                    <div className="flex gap-2 flex-wrap">
                      {(["all", "direct", "google", "trustpilot"] as SourceFilter[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSourceFilter(s)}
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize",
                            sourceFilter === s
                              ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                              : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]"
                          )}
                        >
                          {s === "all" ? "All sources" : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {activeFilters > 0 && (
                  <button
                    className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
                    onClick={() => { setSentimentFilter("all"); setSourceFilter("all"); }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <TestimonialCardSkeleton key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MessageSquare />}
            title="No testimonials match"
            description="Try adjusting your filters or search query."
            action={{ label: "Clear filters", onClick: () => { setTab("all"); setSentimentFilter("all"); setSourceFilter("all"); setSearch(""); } }}
          />
        ) : (
          <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="show">
            {filtered.map((t) => (
              <TestimonialCard
                key={t.id}
                t={t}
                selected={selected.has(t.id)}
                onSelect={() => toggleSelect(t.id)}
                onApprove={() => updateStatus(t.id, "approved")}
                onReject={() => updateStatus(t.id, "rejected")}
                onFeature={() => toggleFeature(t.id)}
                onAIResponse={() => setAiResponseFor(t)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-3 bg-bg-elevated border border-[var(--border-default)] rounded-full px-5 py-2.5 shadow-[var(--shadow-md)]">
              <span className="text-sm font-medium text-text-primary">{selected.size} selected</span>
              <div className="w-px h-4 bg-[var(--border-subtle)]" />
              <Button variant="primary" size="sm" className="rounded-full h-7 text-xs" onClick={() => { selected.forEach((id) => updateStatus(id, "approved")); setSelected(new Set()); }}>
                Approve all
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full h-7 text-xs" onClick={() => setSelected(new Set())}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Response panel */}
      <AnimatePresence>
        {aiResponseFor && (
          <AIResponsePanel t={aiResponseFor} onClose={() => setAiResponseFor(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
