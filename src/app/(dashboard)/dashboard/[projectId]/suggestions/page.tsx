"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Lightbulb, Check, X, Copy, Layout,
  FileText, Share2, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { cn, copyToClipboard, timeAgo } from "@/lib/utils";
import { SEED_AI_SUGGESTIONS } from "@/lib/constants";
import { toast } from "sonner";

type SuggestionType = "all" | "landing_section" | "hero_quote" | "social_snippet";
type SuggestionStatus = "pending" | "accepted" | "rejected";

const TYPE_META = {
  landing_section: { label: "Landing section", icon: Layout,      color: "text-indigo-400",  bg: "bg-indigo-500/10",  border: "border-indigo-500/20" },
  hero_quote:      { label: "Hero quote",       icon: FileText,    color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/20" },
  social_snippet:  { label: "Social snippet",   icon: Share2,      color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20" },
};

const TABS: { id: SuggestionType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "landing_section", label: "Landing sections" },
  { id: "hero_quote", label: "Hero quotes" },
  { id: "social_snippet", label: "Social snippets" },
];

interface Suggestion {
  id: string;
  type: "landing_section" | "hero_quote" | "social_snippet";
  targetPage: string;
  headline: string;
  subheadline: string;
  quotes: Array<{ testimonialId: string; variant: string; preview: string }>;
  status: SuggestionStatus;
  createdAt: string;
}

function SuggestionCard({ s, onAccept, onReject }: {
  s: Suggestion;
  onAccept: () => void;
  onReject: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const meta = TYPE_META[s.type];
  const Icon = meta.icon;

  async function handleCopy() {
    const text = s.type === "social_snippet"
      ? s.quotes.map((q) => q.preview).join("\n\n")
      : `${s.headline}\n${s.subheadline}\n\n${s.quotes.map((q) => q.preview).join("\n")}`;
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  }

  const isAccepted = s.status === "accepted";
  const isRejected = s.status === "rejected";

  return (
    <motion.div
      variants={fadeUp}
      layout
      className={cn(
        "rounded-[var(--radius-xl)] border transition-all duration-200 overflow-hidden",
        isAccepted ? "border-emerald-500/30 bg-emerald-500/5" :
        isRejected ? "border-[var(--border-subtle)] bg-bg-surface opacity-50" :
        "border-[var(--border-subtle)] bg-bg-surface hover:border-[var(--border-default)]"
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn("h-9 w-9 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0", meta.bg)}>
            <Icon className={cn("h-4 w-4", meta.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="default" className={cn("text-[10px]", meta.color)}>{meta.label}</Badge>
              <span className="text-[10px] text-text-tertiary">{s.targetPage}</span>
              {isAccepted && (
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="h-3 w-3" /> Applied
                </span>
              )}
              {isRejected && (
                <span className="text-[10px] text-text-tertiary">Rejected</span>
              )}
            </div>
            <h3 className={cn("text-sm font-semibold mt-1", isRejected ? "text-text-tertiary" : "text-text-primary")}>
              {s.headline}
            </h3>
            <p className="text-xs text-text-tertiary mt-0.5">{s.subheadline}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] text-text-tertiary">{timeAgo(new Date(s.createdAt))}</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Quotes preview (always show 1) */}
        <div className="mt-4 space-y-2">
          {s.quotes.slice(0, expanded ? s.quotes.length : 1).map((q, i) => (
            <div key={i} className={cn(
              "rounded-[var(--radius-md)] px-3 py-2 border",
              isAccepted ? "bg-emerald-500/5 border-emerald-500/15" : "bg-bg-elevated border-[var(--border-subtle)]"
            )}>
              <p className="text-xs text-text-secondary italic leading-relaxed">{q.preview}</p>
            </div>
          ))}

          <AnimatePresence>
            {expanded && s.quotes.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[10px] text-text-tertiary pl-1"
              >
                + {s.quotes.length - 1} more quote{s.quotes.length - 1 !== 1 ? "s" : ""}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        {!isRejected && (
          <div className="mt-4 flex items-center gap-2">
            {isAccepted ? (
              <>
                <Button variant="secondary" size="sm" className="h-7 text-xs" leftIcon={<Copy className="h-3 w-3" />} onClick={handleCopy}>
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400 hover:text-red-300" leftIcon={<X className="h-3 w-3" />} onClick={onReject}>
                  Undo
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  className="h-7 text-xs"
                  leftIcon={<Check className="h-3.5 w-3.5" />}
                  onClick={onAccept}
                >
                  Apply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  leftIcon={<Copy className="h-3 w-3" />}
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-text-tertiary hover:text-red-400"
                  leftIcon={<X className="h-3 w-3" />}
                  onClick={onReject}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        )}

        {isRejected && (
          <div className="mt-3">
            <button className="text-xs text-text-tertiary hover:text-text-secondary transition-colors" onClick={onAccept}>
              Undo rejection
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SuggestionsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  void projectId;

  const [tab, setTab] = useState<SuggestionType>("all");
  const [statuses, setStatuses] = useState<Record<string, SuggestionStatus>>(
    () => Object.fromEntries(SEED_AI_SUGGESTIONS.map((s) => [s.id, s.status as SuggestionStatus]))
  );

  function accept(id: string) {
    setStatuses((p) => ({ ...p, [id]: "accepted" }));
    toast.success("Suggestion applied! You can now copy or assign it to a widget.");
  }

  function reject(id: string) {
    setStatuses((p) => ({ ...p, [id]: statuses[id] === "accepted" ? "pending" : "rejected" }));
    if (statuses[id] === "rejected") toast.success("Suggestion restored");
    else toast.success("Suggestion rejected — we'll learn from this");
  }

  const suggestions = (SEED_AI_SUGGESTIONS as unknown as Suggestion[])
    .filter((s) => tab === "all" || s.type === tab)
    .map((s) => ({ ...s, status: statuses[s.id] ?? s.status }));

  const pendingCount = Object.values(statuses).filter((s) => s === "pending").length;
  const acceptedCount = Object.values(statuses).filter((s) => s === "accepted").length;

  return (
    <div>
      <Header title="AI Suggestions" />

      <div className="p-6 max-w-screen-xl mx-auto space-y-6">
        {/* Hero banner */}
        <div className="rounded-[var(--radius-xl)] border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[var(--radius-lg)] bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-text-primary">Your AI reputation agent is working</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Based on your approved testimonials, TrustFlow&apos;s AI has generated{" "}
                <span className="text-indigo-400 font-medium">{pendingCount} new suggestions</span> ready to apply.
                {acceptedCount > 0 && ` · ${acceptedCount} already applied.`}
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-indigo-400 flex-shrink-0" />
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Pending", count: pendingCount, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
            { label: "Applied", count: acceptedCount, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            { label: "Rejected", count: Object.values(statuses).filter((s) => s === "rejected").length, color: "text-text-tertiary bg-bg-elevated border-[var(--border-subtle)]" },
          ].map((pill) => (
            <div key={pill.label} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium", pill.color)}>
              <span>{pill.count}</span>
              <span className="font-normal">{pill.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] overflow-x-auto">
          {TABS.map((t) => {
            const count = SEED_AI_SUGGESTIONS.filter((s) => t.id === "all" || s.type === t.id).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150",
                  tab === t.id ? "border-brand-primary text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"
                )}
              >
                {t.label}
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", tab === t.id ? "bg-indigo-500/20 text-indigo-400" : "bg-bg-overlay text-text-tertiary")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {suggestions.length === 0 ? (
          <div className="text-center py-16 text-text-tertiary">
            <Lightbulb className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No suggestions in this category yet.</p>
          </div>
        ) : (
          <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="show">
            {suggestions.map((s) => (
              <SuggestionCard
                key={s.id}
                s={s}
                onAccept={() => accept(s.id)}
                onReject={() => reject(s.id)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
