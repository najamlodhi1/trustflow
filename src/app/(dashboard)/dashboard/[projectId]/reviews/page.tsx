"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, RefreshCw, X, MessageSquare, Sparkles,
  Copy, RotateCcw, ExternalLink, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, statusBadgeVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/layout/Header";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { timeAgo, cn, copyToClipboard } from "@/lib/utils";
import { PLATFORMS } from "@/lib/constants";
import { toast } from "sonner";

const REVIEWS = [
  {
    id: "r1", name: "David Park", company: "Nomad Studio", rating: 5,
    text: "Absolutely brilliant service. Everything was delivered on time and the quality was superb.",
    source: "google", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r2", name: "Priya Mehta", company: "Clearwave SaaS", rating: 4,
    text: "Great experience overall. A few small hiccups but the team resolved them quickly.",
    source: "trustpilot", createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r3", name: "Tom Bradley", company: "Local Cafe", rating: 5,
    text: "Best in the business. We've seen a huge uptick in customers mentioning they found us through reviews.",
    source: "yelp", createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function PlatformIcon({ source }: { source: string }) {
  const colors: Record<string, string> = {
    google: "text-[#4285F4]",
    trustpilot: "text-[#00B67A]",
    yelp: "text-[#D32323]",
    facebook: "text-[#1877F2]",
  };
  const labels: Record<string, string> = {
    google: "G", trustpilot: "T", yelp: "Y", facebook: "f",
  };
  return (
    <span className={cn("font-bold text-sm", colors[source] || "text-text-secondary")}>
      {labels[source] || source[0].toUpperCase()}
    </span>
  );
}

function AIResponsePanel({ review, onClose }: { review: typeof REVIEWS[0]; onClose: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setGenerating(true);
    setResponse("");
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setResponse(
      `Thank you so much for taking the time to leave such a wonderful review, ${review.name.split(" ")[0]}! 🙏 We're thrilled to hear that your experience exceeded expectations. Feedback like yours genuinely motivates our entire team. We'd love to have you back — please don't hesitate to reach out if there's ever anything we can do for you!`
    );
  }

  async function handleCopy() {
    await copyToClipboard(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Response copied to clipboard");
  }

  return (
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
          AI Response
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Review */}
        <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-subtle)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar name={review.name} size="sm" />
            <div>
              <p className="text-xs font-medium text-text-primary">{review.name}</p>
              <StarRating value={review.rating} size="sm" readonly />
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">&ldquo;{review.text}&rdquo;</p>
        </div>

        {/* Generated response */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-2 block">Generated Response</label>
          {generating ? (
            <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-subtle)] p-4 min-h-24 flex items-center justify-center">
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                <span>Generating response</span>
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
            </div>
          ) : response ? (
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              className="text-xs"
            />
          ) : (
            <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-default)] border-dashed p-8 text-center">
              <p className="text-xs text-text-tertiary mb-3">
                Generate a professional reply using AI
              </p>
              <Button
                variant="gradient"
                size="sm"
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
                onClick={generate}
              >
                Generate response
              </Button>
            </div>
          )}
        </div>
      </div>

      {response && (
        <div className="p-5 border-t border-[var(--border-subtle)] flex gap-2">
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            leftIcon={copied ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Copy className="h-4 w-4" /></motion.div> : <Copy className="h-4 w-4" />}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy response"}
          </Button>
          <Button
            variant="secondary"
            size="md"
            leftIcon={<RotateCcw className="h-4 w-4" />}
            onClick={() => { setResponse(""); generate(); }}
          >
            Regenerate
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function ImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [platform, setPlatform] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleImport() {
    if (!url) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2500));
    setLoading(false);
    setDone(true);
    setTimeout(() => {
      onClose();
      setDone(false);
      setUrl("");
      setPlatform(null);
    }, 1500);
    toast.success("24 reviews imported successfully");
  }

  return (
    <Modal open={open} onClose={onClose} title="Import Reviews" size="sm">
      <div className="p-6 space-y-6">
        <div>
          <p className="text-sm text-text-secondary mb-3">Choose platform:</p>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-[var(--radius-md)] border text-xs font-medium transition-all duration-150",
                  platform === p.id
                    ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                    : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)] hover:bg-bg-overlay"
                )}
              >
                <span className="text-lg">{p.emoji}</span>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {platform && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Input
              label={`Paste your ${PLATFORMS.find((p) => p.id === platform)?.name} URL:`}
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            {loading ? (
              <div className="space-y-2">
                <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-xs text-text-tertiary text-center">Fetching your reviews...</p>
              </div>
            ) : done ? (
              <div className="text-center py-2">
                <p className="text-sm text-brand-success font-medium">✓ Found 24 reviews. Importing...</p>
              </div>
            ) : (
              <Button variant="gradient" size="md" className="w-full" onClick={handleImport} disabled={!url}>
                Import Reviews →
              </Button>
            )}

            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-indigo-500" />
              Auto-sync every 24 hours
            </label>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}

export default function ReviewsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [aiReview, setAiReview] = useState<typeof REVIEWS[0] | null>(null);

  const filtered = REVIEWS.filter(
    (r) =>
      !search ||
      r.text.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header
        title="Reviews"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={() => setImportOpen(true)}
          >
            Import Reviews
          </Button>
        }
      />

      <div className="p-6 max-w-screen-xl mx-auto space-y-5">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<StarRating value={5} size="lg" readonly />}
            title="No reviews imported yet"
            description="Import reviews from Google, Trustpilot, Yelp and more."
            action={{ label: "Import reviews", onClick: () => setImportOpen(true) }}
          />
        ) : (
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {filtered.map((r) => (
              <motion.div
                key={r.id}
                variants={fadeUp}
                className="group rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-surface p-5 hover:border-[var(--border-default)] transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={r.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{r.name}</span>
                      <div className="h-4 w-4 rounded-full bg-bg-overlay flex items-center justify-center">
                        <PlatformIcon source={r.source} />
                      </div>
                      <span className="text-xs text-text-tertiary capitalize">{r.source}</span>
                    </div>
                    <StarRating value={r.rating} size="sm" readonly className="mt-1" />
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      &ldquo;{r.text}&rdquo;
                    </p>
                    <p className="mt-2 text-xs text-text-tertiary">{timeAgo(new Date(r.createdAt))}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Sparkles className="h-3.5 w-3.5 text-indigo-400" />}
                      className="h-7 text-xs"
                      onClick={() => setAiReview(r)}
                    >
                      AI Response
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />

      <AnimatePresence>
        {aiReview && (
          <>
            <motion.div
              className="fixed inset-0 z-30 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAiReview(null)}
            />
            <AIResponsePanel review={aiReview} onClose={() => setAiReview(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
