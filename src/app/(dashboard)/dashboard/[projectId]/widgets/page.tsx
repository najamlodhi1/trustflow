"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Tablet, Smartphone, Copy, Check, ExternalLink,
  Sun, Moon, ChevronDown, ChevronLeft, ChevronRight,
  Plus, Eye, EyeOff, Sparkles, ArrowRight, X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import { Header } from "@/components/layout/Header";
import { cn, copyToClipboard, timeAgo } from "@/lib/utils";
import { WIDGET_TYPES, SEED_TESTIMONIALS, SEED_WIDGETS, SEED_AI_SUGGESTIONS } from "@/lib/constants";
import { toast } from "sonner";
import { staggerContainer, fadeUp } from "@/lib/animations";

type DeviceType = "desktop" | "tablet" | "mobile";
type View = "gallery" | "builder";

const ACCENT_COLORS = [
  { id: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { id: "violet", label: "Violet", class: "bg-violet-500" },
  { id: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { id: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { id: "amber", label: "Amber", class: "bg-amber-500" },
];

const PLATFORMS_EMBED = ["WordPress", "Shopify", "Webflow", "Wix", "Framer", "Plain HTML"];

interface Config {
  name: string;
  type: string;
  theme: "dark" | "light";
  accentColor: string;
  showAvatar: boolean;
  showName: boolean;
  showStars: boolean;
  showDate: boolean;
  showCompany: boolean;
  minRating: number;
  maxItems: number;
}

// ── Widget preview (unchanged logic) ────────────────────────────────────────

function WidgetPreview({ config, device }: { config: Config; device: DeviceType }) {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const approved = SEED_TESTIMONIALS.filter((t) => t.status === "approved" && t.rating >= config.minRating).slice(0, Math.min(config.maxItems, 8));

  useEffect(() => { setCarouselIdx(0); }, [config.type]);
  useEffect(() => {
    if (config.type !== "carousel" || approved.length <= 1) return;
    const id = setInterval(() => setCarouselIdx((i) => (i + 1) % approved.length), 3000);
    return () => clearInterval(id);
  }, [config.type, approved.length]);

  const deviceWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };
  const isDark = config.theme === "dark";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-zinc-300" : "text-gray-700";
  const textMuted = isDark ? "text-zinc-500" : "text-gray-500";
  const cardBg = isDark ? "bg-[#18181b] border-white/10" : "bg-white border-gray-200 shadow-sm";
  const t0 = approved[carouselIdx] ?? approved[0];

  function AuthorRow({ t }: { t: typeof approved[0] }) {
    return (
      <div className="flex items-center gap-2 mt-3">
        {config.showAvatar && <Avatar name={t.name} size="sm" />}
        <div>
          {config.showName && <p className={cn("text-xs font-medium", textPrimary)}>{t.name}</p>}
          {config.showCompany && <p className={cn("text-[10px]", textMuted)}>{t.company}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto overflow-hidden rounded-[var(--radius-lg)] transition-all duration-300" style={{ maxWidth: deviceWidths[device] }}>
      <div className={cn("p-6 rounded-[var(--radius-lg)]", isDark ? "bg-[#111113]" : "bg-gray-50")}>
        {config.type === "wall" && (
          <div className="columns-1 sm:columns-2 gap-4 space-y-4">
            {approved.map((t) => (
              <div key={t.id} className={cn("break-inside-avoid p-4 rounded-[var(--radius-md)] border", cardBg)}>
                {config.showStars && <StarRating value={t.rating} size="sm" readonly className="mb-2" />}
                <p className={cn("text-sm leading-relaxed", textSecondary)}>&ldquo;{t.text.slice(0, 110)}&rdquo;</p>
                <AuthorRow t={t} />
              </div>
            ))}
          </div>
        )}
        {config.type === "grid" && (
          <div className="grid grid-cols-3 gap-3">
            {approved.slice(0, 6).map((t) => (
              <div key={t.id} className={cn("p-3 rounded-[var(--radius-md)] border", cardBg)}>
                {config.showStars && <StarRating value={t.rating} size="sm" readonly className="mb-2" />}
                <p className={cn("text-xs leading-relaxed line-clamp-3", textSecondary)}>&ldquo;{t.text}&rdquo;</p>
                {config.showName && <p className={cn("text-[10px] font-medium mt-2", textPrimary)}>{t.name}</p>}
              </div>
            ))}
          </div>
        )}
        {config.type === "carousel" && t0 && (
          <div className="relative">
            <div className={cn("p-5 rounded-[var(--radius-lg)] border", cardBg)}>
              {config.showStars && <StarRating value={t0.rating} size="md" readonly className="mb-3" />}
              <p className={cn("text-sm leading-relaxed", textSecondary)}>&ldquo;{t0.text}&rdquo;</p>
              <AuthorRow t={t0} />
            </div>
            {approved.length > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button onClick={() => setCarouselIdx((i) => (i - 1 + approved.length) % approved.length)} className={cn("p-1.5 rounded-full border transition-colors", cardBg, "hover:border-indigo-400")}>
                  <ChevronLeft className={cn("h-4 w-4", textMuted)} />
                </button>
                <div className="flex gap-1.5">
                  {approved.map((_, i) => (
                    <button key={i} onClick={() => setCarouselIdx(i)} className={cn("h-1.5 rounded-full transition-all duration-300", i === carouselIdx ? "w-4 bg-indigo-500" : "w-1.5 bg-white/20")} />
                  ))}
                </div>
                <button onClick={() => setCarouselIdx((i) => (i + 1) % approved.length)} className={cn("p-1.5 rounded-full border transition-colors", cardBg, "hover:border-indigo-400")}>
                  <ChevronRight className={cn("h-4 w-4", textMuted)} />
                </button>
              </div>
            )}
          </div>
        )}
        {config.type === "badge" && (
          <div className="flex justify-center">
            <div className={cn("inline-flex items-center gap-3 px-4 py-2.5 rounded-full border", cardBg)}>
              <StarRating value={4.8} size="sm" readonly />
              <span className={cn("text-sm font-bold", textPrimary)}>4.8</span>
              <div className={cn("w-px h-4", isDark ? "bg-white/10" : "bg-gray-200")} />
              <span className={cn("text-xs", textMuted)}>500+ reviews</span>
            </div>
          </div>
        )}
        {config.type === "card" && t0 && (
          <div className={cn("p-5 rounded-[var(--radius-lg)] border max-w-sm mx-auto", cardBg)}>
            {config.showStars && <StarRating value={t0.rating} size="md" readonly className="mb-3" />}
            <p className={cn("text-sm leading-relaxed", textSecondary)}>&ldquo;{t0.text}&rdquo;</p>
            <AuthorRow t={t0} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Embed modal ────────────────────────────────────────────────────────────

function EmbedModal({ open, onClose, widgetId }: { open: boolean; onClose: () => void; widgetId: string }) {
  const [platform, setPlatform] = useState("Plain HTML");
  const [copied, setCopied] = useState(false);
  const code = `<script src="https://trustflow.app/widget.js" data-widget-id="${widgetId}"></script>`;

  async function handleCopy() {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Embed code copied!");
  }

  return (
    <Modal open={open} onClose={onClose} title="Add to your website">
      <div className="p-6 space-y-5">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-2">1. Copy this code</p>
          <div className="relative rounded-[var(--radius-md)] bg-bg-base border border-[var(--border-subtle)] p-4">
            <code className="text-xs text-text-secondary font-mono break-all">{code}</code>
            <Button variant="secondary" size="sm" className="absolute top-2 right-2 h-7 text-xs"
              leftIcon={copied ? <Check className="h-3.5 w-3.5 text-brand-success" /> : <Copy className="h-3.5 w-3.5" />}
              onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary mb-3">2. Choose your platform</p>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS_EMBED.map((p) => (
              <button key={p} onClick={() => setPlatform(p)}
                className={cn("px-3 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all",
                  platform === p ? "border-brand-primary bg-indigo-500/10 text-brand-primary" : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]")}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── AI Suggestion panel (inside builder) ──────────────────────────────────

function AISuggestionPanel({ onApply }: { onApply: (headline: string) => void }) {
  const suggestions = SEED_AI_SUGGESTIONS.slice(0, 2);
  const [applied, setApplied] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-400">
        <Sparkles className="h-3.5 w-3.5" />
        AI-suggested sections
      </div>
      {suggestions.map((s) => (
        <div key={s.id} className={cn(
          "rounded-[var(--radius-md)] border p-3 space-y-2 transition-all",
          applied.has(s.id) ? "border-emerald-500/30 bg-emerald-500/5" : "border-indigo-500/20 bg-indigo-500/5"
        )}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-text-primary">{s.headline}</p>
              <p className="text-[10px] text-text-tertiary mt-0.5">{s.targetPage} · {s.quotes.length} quotes</p>
            </div>
            {applied.has(s.id) ? (
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 flex-shrink-0">
                <Check className="h-3 w-3" /> Applied
              </span>
            ) : (
              <button
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium flex-shrink-0"
                onClick={() => { setApplied((p) => new Set([...p, s.id])); onApply(s.headline); toast.success("AI suggestion applied to widget!"); }}
              >
                Apply →
              </button>
            )}
          </div>
          <div className="space-y-1">
            {s.quotes.slice(0, 2).map((q, i) => (
              <p key={i} className="text-[10px] text-text-tertiary italic line-clamp-1">{q.preview}</p>
            ))}
          </div>
        </div>
      ))}
      <Button variant="ghost" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="h-3 w-3" />}
        onClick={() => window.location.href = `/dashboard/demo/suggestions`}>
        View all suggestions
      </Button>
    </div>
  );
}

// ── Widget gallery card ────────────────────────────────────────────────────

function WidgetGalleryCard({
  widget,
  onEdit,
  onTogglePublish,
}: {
  widget: typeof SEED_WIDGETS[number];
  onEdit: () => void;
  onTogglePublish: () => void;
}) {
  const [published, setPublished] = useState(widget.published);

  const typeLabel: Record<string, string> = {
    wall: "Wall of Love", carousel: "Carousel", card: "Card", badge: "Badge", grid: "Grid",
  };

  return (
    <motion.div variants={fadeUp} className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-bg-surface overflow-hidden hover:border-[var(--border-default)] transition-all group">
      {/* Mini preview */}
      <div className="bg-[#111113] p-4 border-b border-[var(--border-subtle)] aspect-video flex items-center justify-center relative">
        <div className="scale-75 w-full">
          {widget.type === "wall" ? (
            <div className="grid grid-cols-2 gap-2">
              {SEED_TESTIMONIALS.filter((t) => t.status === "approved").slice(0, 4).map((t) => (
                <div key={t.id} className="rounded-md bg-[#18181b] border border-white/10 p-2">
                  <StarRating value={t.rating} size="sm" readonly className="mb-1" />
                  <p className="text-[8px] text-zinc-400 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-[8px] text-white mt-1 font-medium">{t.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md bg-[#18181b] border border-white/10 p-3">
              <StarRating value={5} size="sm" readonly className="mb-1" />
              <p className="text-[8px] text-zinc-300 line-clamp-2">&ldquo;{SEED_TESTIMONIALS[0].text}&rdquo;</p>
              <p className="text-[8px] text-white mt-1">{SEED_TESTIMONIALS[0].name}</p>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button variant="secondary" size="sm" className="text-xs" onClick={onEdit}>
            Edit widget
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-text-primary">{widget.name}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{typeLabel[widget.type] ?? widget.type} · {widget.testimonialCount} quotes</p>
          </div>
          <button
            onClick={() => { setPublished(!published); onTogglePublish(); toast.success(published ? "Widget unpublished" : "Widget published!"); }}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all flex-shrink-0",
              published ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-[var(--border-subtle)] text-text-tertiary hover:border-[var(--border-default)]"
            )}
          >
            {published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            {published ? "Live" : "Draft"}
          </button>
        </div>

        {published && (
          <p className="text-[10px] text-text-tertiary mt-2">
            {widget.views.toLocaleString()} views · Updated {timeAgo(widget.updatedAt)}
          </p>
        )}

        <div className="flex gap-2 mt-3">
          <Button variant="secondary" size="sm" className="flex-1 text-xs h-7" onClick={onEdit}>Configure</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" leftIcon={<Copy className="h-3 w-3" />}
            onClick={() => { copyToClipboard(`<script src="https://trustflow.app/widget.js" data-widget-id="${widget.id}"></script>`); toast.success("Embed code copied!"); }}>
            Embed
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WidgetsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  void projectId;

  const [view, setView] = useState<View>("gallery");
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [previewDark, setPreviewDark] = useState(true);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [config, setConfig] = useState<Config>({
    name: "Homepage Wall",
    type: "wall",
    theme: "dark",
    accentColor: "indigo",
    showAvatar: true,
    showName: true,
    showStars: true,
    showDate: true,
    showCompany: true,
    minRating: 4,
    maxItems: 12,
  });

  function update(partial: Partial<Config>) {
    setConfig((prev) => ({ ...prev, ...partial }));
  }

  if (view === "gallery") {
    return (
      <div>
        <Header
          title="Widgets"
          actions={
            <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setView("builder")}>
              New widget
            </Button>
          }
        />
        <div className="p-6 max-w-screen-xl mx-auto space-y-6">
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={staggerContainer} initial="hidden" animate="show">
            {SEED_WIDGETS.map((w) => (
              <WidgetGalleryCard
                key={w.id}
                widget={w}
                onEdit={() => { setConfig((c) => ({ ...c, name: w.name, type: w.type })); setView("builder"); }}
                onTogglePublish={() => {}}
              />
            ))}
            {/* New widget placeholder */}
            <motion.button
              variants={fadeUp}
              onClick={() => setView("builder")}
              className="rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--border-subtle)] hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-3 p-8 text-text-tertiary hover:text-indigo-400 aspect-[4/3]"
            >
              <Plus className="h-8 w-8" />
              <span className="text-sm font-medium">New widget</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Widget Builder"
        actions={
          <Button variant="ghost" size="sm" leftIcon={<X className="h-4 w-4" />} onClick={() => setView("gallery")}>
            Back to gallery
          </Button>
        }
      />

      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        {/* Configurator */}
        <div className="w-80 flex-shrink-0 border-r border-[var(--border-subtle)] overflow-y-auto bg-bg-surface">
          <div className="p-5 space-y-5">
            <Input label="Widget name" value={config.name} onChange={(e) => update({ name: e.target.value })} />

            {/* Type */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Type</p>
              <div className="grid grid-cols-4 gap-1.5">
                {WIDGET_TYPES.map((w) => (
                  <button key={w.id} title={w.description} onClick={() => update({ type: w.id })}
                    className={cn("px-2 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all",
                      config.type === w.id ? "bg-indigo-500/20 text-brand-primary border border-indigo-500/30" : "bg-bg-elevated text-text-secondary hover:bg-bg-overlay border border-transparent")}>
                    {w.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Min rating */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Min rating</p>
              <StarRating value={config.minRating} size="md" onChange={(v) => update({ minRating: v })} />
            </div>

            {/* Theme */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-text-secondary">Appearance</p>
              <div className="flex gap-2">
                {(["dark", "light"] as const).map((t) => (
                  <button key={t} onClick={() => update({ theme: t })}
                    className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all",
                      config.theme === t ? "border-brand-primary bg-indigo-500/10 text-brand-primary" : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]")}>
                    {t === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button key={c.id} onClick={() => update({ accentColor: c.id })} title={c.label}
                    className={cn("h-6 w-6 rounded-full transition-all", c.class, config.accentColor === c.id && "ring-2 ring-white ring-offset-2 ring-offset-bg-surface")}
                    aria-label={c.label} />
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Display</p>
              <div className="space-y-2">
                {([
                  { key: "showAvatar", label: "Avatar" },
                  { key: "showName", label: "Name" },
                  { key: "showStars", label: "Stars" },
                  { key: "showDate", label: "Date" },
                  { key: "showCompany", label: "Company" },
                ] as const).map((item) => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <button role="switch" aria-checked={config[item.key]} onClick={() => update({ [item.key]: !config[item.key] } as Partial<Config>)}
                      className={cn("relative h-5 w-9 rounded-full transition-colors duration-200", config[item.key] ? "bg-brand-primary" : "bg-bg-overlay")}>
                      <span className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200", config[item.key] && "translate-x-4")} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* AI suggestions */}
            <div className="border-t border-[var(--border-subtle)] pt-4">
              <AISuggestionPanel onApply={(headline) => update({ name: headline.slice(0, 40) })} />
            </div>

            <div className="pt-1 space-y-2">
              <Button variant="primary" size="md" className="w-full" onClick={() => toast.success("Widget saved!")}>
                Save changes
              </Button>
              <Button variant="secondary" size="md" className="w-full" leftIcon={<Copy className="h-4 w-4" />} onClick={() => setEmbedOpen(true)}>
                Copy embed code
              </Button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-bg-surface">
            <div className="flex items-center gap-1 bg-bg-elevated rounded-[var(--radius-md)] p-1">
              {([
                { id: "desktop", icon: Monitor },
                { id: "tablet", icon: Tablet },
                { id: "mobile", icon: Smartphone },
              ] as const).map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setDevice(id)}
                  className={cn("p-1.5 rounded-[var(--radius-sm)] transition-all", device === id ? "bg-bg-overlay text-text-primary" : "text-text-tertiary hover:text-text-secondary")}
                  title={id} aria-label={`Preview on ${id}`}>
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm"
                leftIcon={previewDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                onClick={() => setPreviewDark(!previewDark)} className="text-xs">
                {previewDark ? "Dark" : "Light"} bg
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="h-4 w-4" />} onClick={() => setEmbedOpen(true)} className="text-xs">
                Get embed code
              </Button>
            </div>
          </div>
          <div className={cn("flex-1 overflow-auto p-8 flex items-start justify-center", previewDark ? "bg-bg-base" : "bg-gray-100")}>
            <div className="w-full"><WidgetPreview config={config} device={device} /></div>
          </div>
        </div>
      </div>

      <EmbedModal open={embedOpen} onClose={() => setEmbedOpen(false)} widgetId="wgt_abc123" />
    </div>
  );
}
