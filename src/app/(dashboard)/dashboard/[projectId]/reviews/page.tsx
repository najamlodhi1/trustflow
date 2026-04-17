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

type Review = {
  id: string; name: string; company: string; rating: number;
  text: string; source: string; replied: boolean; createdAt: string;
};

const REVIEWS_SEED: Review[] = [
  {
    id: "r1", name: "David Park", company: "Nomad Studio", rating: 5,
    text: "Absolutely brilliant service. Everything was delivered on time and the quality was superb.",
    source: "google", replied: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r2", name: "Priya Mehta", company: "Clearwave SaaS", rating: 4,
    text: "Great experience overall. A few small hiccups but the team resolved them quickly.",
    source: "trustpilot", replied: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "r3", name: "Tom Bradley", company: "Local Cafe", rating: 5,
    text: "Best in the business. We've seen a huge uptick in customers mentioning they found us through reviews.",
    source: "yelp", replied: false,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const PLATFORM_META: Record<string, { label: string; bg: string; text: string }> = {
  google:     { label: "G",  bg: "bg-[#4285F4]",  text: "text-white" },
  trustpilot: { label: "T",  bg: "bg-[#00B67A]",  text: "text-white" },
  yelp:       { label: "Y",  bg: "bg-[#D32323]",  text: "text-white" },
  facebook:   { label: "f",  bg: "bg-[#1877F2]",  text: "text-white" },
};

function PlatformBadge({ source }: { source: string }) {
  const meta = PLATFORM_META[source] ?? { label: source[0].toUpperCase(), bg: "bg-bg-overlay", text: "text-text-secondary" };
  return (
    <span
      title={source.charAt(0).toUpperCase() + source.slice(1)}
      className={cn(
        "inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold flex-shrink-0",
        meta.bg, meta.text
      )}
    >
      {meta.label}
    </span>
  );
}

function AIResponsePanel({ review, onClose }: { review: Review; onClose: () => void }) {
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

function ImportModal({
  open, onClose, onManualAdd,
}: {
  open: boolean;
  onClose: () => void;
  onManualAdd: (r: Review) => void;
}) {
  const [tab, setTab] = useState<"import" | "manual">("import");
  const [platform, setPlatform] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  // Manual add form
  const [manualName, setManualName] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualRating, setManualRating] = useState(5);
  const [manualText, setManualText] = useState("");
  const [manualSource, setManualSource] = useState("google");
  const [adding, setAdding] = useState(false);

  async function handleImport() {
    if (!url) return;
    setImporting(true);
    await new Promise((r) => setTimeout(r, 2500));
    setImporting(false);
    setDone(true);
    toast.success("24 reviews imported successfully");
    setTimeout(() => { onClose(); setDone(false); setUrl(""); setPlatform(null); }, 1500);
  }

  async function handleManualAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!manualName || !manualText) return;
    setAdding(true);
    await new Promise((r) => setTimeout(r, 600));
    setAdding(false);
    onManualAdd({
      id: `r-${Date.now()}`,
      name: manualName,
      company: manualCompany,
      rating: manualRating,
      text: manualText,
      source: manualSource,
      replied: false,
      createdAt: new Date().toISOString(),
    });
    toast.success(`Review from ${manualName} added`);
    setManualName(""); setManualCompany(""); setManualRating(5); setManualText("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Reviews" size="sm">
      {/* Tabs */}
      <div className="flex border-b border-[var(--border-subtle)] px-6">
        {(["import", "manual"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "pb-3 pt-4 px-1 mr-5 text-sm font-medium border-b-2 transition-all",
              tab === t
                ? "border-brand-primary text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            )}
          >
            {t === "import" ? "Import from URL" : "Add manually"}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "import" && (
          <div className="space-y-5">
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
              <div className="space-y-3">
                <Input
                  label={`Paste your ${PLATFORMS.find((p) => p.id === platform)?.name} URL:`}
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                {importing ? (
                  <div className="space-y-2">
                    <div className="h-1.5 rounded-full bg-bg-overlay overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-[2500ms] ease-in-out"
                        style={{ width: importing ? "100%" : "0%" }}
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
              </div>
            )}
          </div>
        )}

        {tab === "manual" && (
          <form onSubmit={handleManualAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Reviewer name *"
                placeholder="Jane Smith"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                required
              />
              <Input
                label="Company"
                placeholder="Acme Inc."
                value={manualCompany}
                onChange={(e) => setManualCompany(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Rating *</p>
              <StarRating value={manualRating} onChange={setManualRating} size="lg" />
            </div>
            <Textarea
              label="Review text *"
              placeholder="What did they say?"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={3}
              required
            />
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Source</p>
              <div className="flex gap-2 flex-wrap">
                {["google", "trustpilot", "yelp", "facebook", "other"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setManualSource(s)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                      manualSource === s
                        ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                        : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]"
                    )}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              variant="gradient"
              size="md"
              className="w-full"
              loading={adding}
              disabled={!manualName || !manualText}
            >
              Add review
            </Button>
          </form>
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
  void projectId;
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_SEED);
  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [aiReview, setAiReview] = useState<Review | null>(null);

  const filtered = reviews.filter(
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-text-primary">{r.name}</span>
                      <PlatformBadge source={r.source} />
                      <span className="text-xs text-text-tertiary capitalize">{r.source}</span>
                      <Badge variant={r.replied ? "success" : "default"} className="text-[10px]">
                        {r.replied ? "Replied" : "Not replied"}
                      </Badge>
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

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onManualAdd={(r) => setReviews((prev) => [r, ...prev])}
      />

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
