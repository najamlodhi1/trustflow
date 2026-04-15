"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import {
  Monitor, Tablet, Smartphone, Copy, Check, ExternalLink,
  Sun, Moon, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StarRating } from "@/components/ui/StarRating";
import { Avatar } from "@/components/ui/Avatar";
import { Header } from "@/components/layout/Header";
import { cn, copyToClipboard } from "@/lib/utils";
import { WIDGET_TYPES, SEED_TESTIMONIALS } from "@/lib/constants";
import { toast } from "sonner";

type DeviceType = "desktop" | "tablet" | "mobile";

const ACCENT_COLORS = [
  { id: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { id: "violet", label: "Violet", class: "bg-violet-500" },
  { id: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { id: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { id: "amber", label: "Amber", class: "bg-amber-500" },
];

const PLATFORMS_EMBED = [
  { id: "wordpress", label: "WordPress" },
  { id: "shopify", label: "Shopify" },
  { id: "webflow", label: "Webflow" },
  { id: "wix", label: "Wix" },
  { id: "framer", label: "Framer" },
  { id: "html", label: "Plain HTML" },
];

const EMBED_INSTRUCTIONS: Record<string, string> = {
  wordpress: "Paste the code into a Custom HTML block in your page editor.",
  shopify: "Add a Custom Liquid section and paste the code inside.",
  webflow: "Add an Embed element and paste the code.",
  wix: "Use the HTML Embed app from the Wix App Market.",
  framer: "Add a Code component and paste the snippet.",
  html: "Paste the code anywhere in your HTML before the closing </body> tag.",
};

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

function WidgetPreview({ config, device }: { config: Config; device: DeviceType }) {
  const approvedTestimonials = SEED_TESTIMONIALS.filter(
    (t) => t.status === "approved" && t.rating >= config.minRating
  ).slice(0, Math.min(config.maxItems, 4));

  const deviceWidths = { desktop: "100%", tablet: "768px", mobile: "375px" };
  const isDark = config.theme === "dark";

  return (
    <motion.div
      key={config.type + config.theme + device}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="mx-auto overflow-hidden rounded-[var(--radius-lg)]"
      style={{ maxWidth: deviceWidths[device] }}
    >
      <div
        className={cn(
          "p-6 rounded-[var(--radius-lg)]",
          isDark ? "bg-[#111113]" : "bg-white"
        )}
      >
        {config.type === "wall" || config.type === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {approvedTestimonials.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "p-4 rounded-[var(--radius-md)] border",
                  isDark
                    ? "bg-[#18181b] border-white/10 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                )}
              >
                {config.showStars && <StarRating value={t.rating} size="sm" readonly className="mb-3" />}
                <p className={cn("text-sm leading-relaxed", isDark ? "text-zinc-300" : "text-gray-700")}>
                  &ldquo;{t.text.slice(0, 120)}...&rdquo;
                </p>
                {(config.showAvatar || config.showName) && (
                  <div className="flex items-center gap-2 mt-3">
                    {config.showAvatar && <Avatar name={t.name} size="sm" />}
                    {config.showName && (
                      <div>
                        <p className={cn("text-xs font-medium", isDark ? "text-white" : "text-gray-900")}>{t.name}</p>
                        {config.showCompany && <p className={cn("text-[10px]", isDark ? "text-zinc-500" : "text-gray-500")}>{t.company}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : config.type === "badge" ? (
          <div className={cn(
            "inline-flex items-center gap-3 px-4 py-2.5 rounded-full border",
            isDark ? "bg-[#18181b] border-white/10" : "bg-white border-gray-200 shadow-sm"
          )}>
            <StarRating value={4.8} size="sm" readonly />
            <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>4.8</span>
            <span className={cn("text-xs", isDark ? "text-zinc-400" : "text-gray-500")}>500+ reviews</span>
          </div>
        ) : (
          <div className={cn(
            "p-5 rounded-[var(--radius-lg)] border max-w-md",
            isDark ? "bg-[#18181b] border-white/10" : "bg-white border-gray-200 shadow-sm"
          )}>
            {approvedTestimonials[0] && (
              <>
                {config.showStars && <StarRating value={approvedTestimonials[0].rating} size="md" readonly className="mb-3" />}
                <p className={cn("text-sm leading-relaxed", isDark ? "text-zinc-300" : "text-gray-700")}>
                  &ldquo;{approvedTestimonials[0].text}&rdquo;
                </p>
                {config.showName && (
                  <div className="flex items-center gap-2 mt-4">
                    {config.showAvatar && <Avatar name={approvedTestimonials[0].name} size="sm" />}
                    <div>
                      <p className={cn("text-xs font-medium", isDark ? "text-white" : "text-gray-900")}>{approvedTestimonials[0].name}</p>
                      {config.showCompany && <p className={cn("text-[10px]", isDark ? "text-zinc-500" : "text-gray-500")}>{approvedTestimonials[0].company}</p>}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmbedModal({ open, onClose, widgetId }: { open: boolean; onClose: () => void; widgetId: string }) {
  const [platform, setPlatform] = useState("html");
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
      <div className="p-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-2">1. Copy this code</p>
          <div className="relative rounded-[var(--radius-md)] bg-bg-base border border-[var(--border-subtle)] p-4">
            <code className="text-xs text-text-secondary font-mono break-all">{code}</code>
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 h-7 text-xs"
              leftIcon={copied ? <Check className="h-3.5 w-3.5 text-brand-success" /> : <Copy className="h-3.5 w-3.5" />}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-text-secondary mb-3">2. Choose your platform</p>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS_EMBED.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "px-3 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all",
                  platform === p.id
                    ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                    : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-md)] bg-bg-surface border border-[var(--border-subtle)] p-4">
          <p className="text-xs text-text-secondary leading-relaxed">
            {EMBED_INSTRUCTIONS[platform]}
          </p>
          <button className="mt-2 text-xs text-brand-primary hover:underline flex items-center gap-1">
            View step-by-step guide <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function WidgetsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
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

  return (
    <div>
      <Header title="Widget Builder" />

      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        {/* Left: Configurator */}
        <div className="w-80 flex-shrink-0 border-r border-[var(--border-subtle)] overflow-y-auto bg-bg-surface">
          <div className="p-5 space-y-5">
            <Input
              label="Widget name"
              value={config.name}
              onChange={(e) => update({ name: e.target.value })}
            />

            {/* Type */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Type</p>
              <div className="grid grid-cols-4 gap-1.5">
                {WIDGET_TYPES.map((w) => (
                  <button
                    key={w.id}
                    title={w.description}
                    onClick={() => update({ type: w.id })}
                    className={cn(
                      "px-2 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all",
                      config.type === w.id
                        ? "bg-indigo-500/20 text-brand-primary border border-indigo-500/30"
                        : "bg-bg-elevated text-text-secondary hover:bg-bg-overlay border border-transparent"
                    )}
                  >
                    {w.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Min rating */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Min rating</p>
              <StarRating
                value={config.minRating}
                size="md"
                onChange={(v) => update({ minRating: v })}
              />
            </div>

            {/* Appearance */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-text-secondary">Appearance</p>
              <div className="flex gap-2">
                {(["dark", "light"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => update({ theme: t })}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all",
                      config.theme === t
                        ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                        : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]"
                    )}
                  >
                    {t === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Accent */}
              <div className="flex gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update({ accentColor: c.id })}
                    title={c.label}
                    className={cn(
                      "h-6 w-6 rounded-full transition-all",
                      c.class,
                      config.accentColor === c.id && "ring-2 ring-white ring-offset-2 ring-offset-bg-surface"
                    )}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Show/hide toggles */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-2">Display</p>
              <div className="space-y-2">
                {(
                  [
                    { key: "showAvatar", label: "Avatar" },
                    { key: "showName", label: "Name" },
                    { key: "showStars", label: "Stars" },
                    { key: "showDate", label: "Date" },
                    { key: "showCompany", label: "Company" },
                  ] as const
                ).map((item) => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <button
                      role="switch"
                      aria-checked={config[item.key]}
                      onClick={() => update({ [item.key]: !config[item.key] } as Partial<Config>)}
                      className={cn(
                        "relative h-5 w-9 rounded-full transition-colors duration-200",
                        config[item.key] ? "bg-brand-primary" : "bg-bg-overlay"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                          config[item.key] && "translate-x-4"
                        )}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button variant="primary" size="md" className="w-full" onClick={() => toast.success("Widget saved!")}>
                Save changes
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                leftIcon={<Copy className="h-4 w-4" />}
                onClick={() => setEmbedOpen(true)}
              >
                Copy embed code
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] bg-bg-surface">
            <div className="flex items-center gap-1 bg-bg-elevated rounded-[var(--radius-md)] p-1">
              {(
                [
                  { id: "desktop", icon: Monitor },
                  { id: "tablet", icon: Tablet },
                  { id: "mobile", icon: Smartphone },
                ] as const
              ).map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setDevice(id)}
                  className={cn(
                    "p-1.5 rounded-[var(--radius-sm)] transition-all",
                    device === id ? "bg-bg-overlay text-text-primary" : "text-text-tertiary hover:text-text-secondary"
                  )}
                  title={id}
                  aria-label={`Preview on ${id}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={previewDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                onClick={() => setPreviewDark(!previewDark)}
                className="text-xs"
              >
                {previewDark ? "Dark" : "Light"} bg
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<ExternalLink className="h-4 w-4" />}
                onClick={() => setEmbedOpen(true)}
                className="text-xs"
              >
                Get embed code
              </Button>
            </div>
          </div>

          {/* Preview canvas */}
          <div
            className={cn(
              "flex-1 overflow-auto p-8 flex items-start justify-center",
              previewDark ? "bg-bg-base" : "bg-gray-100"
            )}
          >
            <div className="w-full">
              <WidgetPreview config={config} device={device} />
            </div>
          </div>
        </div>
      </div>

      <EmbedModal
        open={embedOpen}
        onClose={() => setEmbedOpen(false)}
        widgetId="wgt_abc123"
      />
    </div>
  );
}
