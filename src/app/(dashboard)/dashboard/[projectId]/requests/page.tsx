"use client";

import { useState, use } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Upload, Send, Check, X, Sparkles, ChevronDown,
  RefreshCw, Users, Mail, Link2, Info, CalendarIcon,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Badge, statusBadgeVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Input, Textarea } from "@/components/ui/Input";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { timeAgo, cn } from "@/lib/utils";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Campaign } from "@/lib/store";

type Channel = "Email" | "Link" | "SMS";
type Step = "compose" | "drafts" | "schedule";
type SendMode = "now" | "scheduled";

const SEGMENTS = [
  { id: "all",         label: "All customers", count: 24 },
  { id: "enterprise",  label: "Enterprise",    count: 8  },
  { id: "startup",     label: "Startups",      count: 10 },
  { id: "power-user",  label: "Power users",   count: 6  },
  { id: "agency",      label: "Agencies",      count: 4  },
];

const AI_DRAFTS = [
  {
    id: "d1",
    tone: "Friendly",
    subject: "Quick favour — 2 minutes of your time?",
    body: `Hi {{firstName}},

Hope things are going well! We've loved having you as a TrustFlow customer, and your feedback means the world to us.

Would you be open to leaving a quick testimonial? It takes less than 2 minutes, and it genuinely helps other teams find us.

Just click the link below when you have a moment — no login required.

Thanks so much,
The TrustFlow Team`,
  },
  {
    id: "d2",
    tone: "Professional",
    subject: "We'd love your feedback on TrustFlow",
    body: `Hi {{firstName}},

As a valued TrustFlow customer, your perspective is incredibly important to us.

We'd be grateful if you could take a moment to share your experience. Your testimonial helps other businesses make confident decisions — and takes less than two minutes to complete.

Click the link below to get started.

Best regards,
The TrustFlow Team`,
  },
  {
    id: "d3",
    tone: "Concise",
    subject: "Your TrustFlow story — share it?",
    body: `Hi {{firstName}},

One quick ask: would you share a few words about your TrustFlow experience?

It takes 2 minutes. No login. Just honest feedback.

→ [Leave your testimonial]

Thank you!
The TrustFlow Team`,
  },
];

const composeSchema = z.object({
  name:      z.string().min(1, "Campaign name is required"),
  segment:   z.string().min(1),
  channel:   z.enum(["Email", "Link", "SMS"]),
  aiContext: z.string().optional(),
});
type ComposeForm = z.infer<typeof composeSchema>;

function CampaignRow({ c }: { c: Campaign }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor: Record<string, string> = {
    active: "warning", draft: "default", completed: "success",
  };

  return (
    <div className="border border-[var(--border-subtle)] rounded-[var(--radius-lg)] bg-bg-surface overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-4 hover:bg-bg-overlay/50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-text-primary">{c.name}</span>
            <Badge variant={statusColor[c.status] as never} dot className="text-[10px]">
              {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-text-tertiary mt-0.5">
            {timeAgo(new Date(c.createdAt))}
          </p>
        </div>
        <div className="flex items-center gap-6 flex-shrink-0 text-center">
          <div>
            <p className="text-sm font-semibold text-text-primary">{c.sentCount}</p>
            <p className="text-[10px] text-text-tertiary">Sent</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{c.openedCount}</p>
            <p className="text-[10px] text-text-tertiary">Opened</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-400">{c.completedCount}</p>
            <p className="text-[10px] text-text-tertiary">Completed</p>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-text-tertiary transition-transform", expanded && "rotate-180")} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && c.customers.length > 0 && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)]">
              {c.customers.map((cu, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-bg-elevated">
                  <Avatar name={cu.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary">{cu.name}</p>
                    <p className="text-[10px] text-text-tertiary">{cu.email}</p>
                  </div>
                  <Badge variant={statusBadgeVariant(cu.responded ? "approved" : "pending")} dot className="text-[10px]">
                    {cu.responded ? "Responded" : "Pending"}
                  </Badge>
                  {!cu.responded && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" leftIcon={<RefreshCw className="h-3 w-3" />}
                      onClick={() => toast.success(`Request resent to ${cu.name}`)}>
                      Resend
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CampaignsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  void projectId;

  const { campaigns, addCampaign } = useStore();

  const [step, setStep] = useState<Step>("compose");
  const [generating, setGenerating] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendMode, setSendMode] = useState<SendMode>("now");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<ComposeForm>({
    resolver: zodResolver(composeSchema),
    defaultValues: { name: "", segment: "all", channel: "Email", aiContext: "" },
  });

  const watchedName    = watch("name");
  const watchedSegment = watch("segment");
  const watchedChannel = watch("channel");

  async function onComposeSubmit() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2200));
    setGenerating(false);
    setStep("drafts");
  }

  async function handleSend(data: ComposeForm) {
    if (!selectedDraft) { toast.error("Select a draft first"); return; }
    if (sendMode === "scheduled" && !scheduledDate) { toast.error("Pick a scheduled date"); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);

    const seg = SEGMENTS.find((s) => s.id === data.segment);
    const newCampaign: Campaign = {
      id: `c-${Date.now()}`,
      name: data.name,
      status: sendMode === "scheduled" ? "draft" : "active",
      sentCount: sendMode === "now" ? (seg?.count ?? 0) : 0,
      openedCount: 0,
      completedCount: 0,
      customers: [],
      createdAt: new Date().toISOString(),
    };
    addCampaign(newCampaign);

    const msg = sendMode === "scheduled" && scheduledDate
      ? `Campaign scheduled for ${format(scheduledDate, "MMM d, yyyy")}`
      : `Campaign "${data.name}" sent to ${seg?.count} customers`;
    toast.success(msg);

    reset();
    setSelectedDraft(null);
    setScheduledDate(undefined);
    setSendMode("now");
    setStep("compose");
  }

  const selectedSegment = SEGMENTS.find((s) => s.id === watchedSegment);

  return (
    <div>
      <Header
        title="Campaigns"
        actions={
          <Button variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />}>Import CSV</Button>
        }
      />

      <div className="p-6 max-w-screen-xl mx-auto space-y-6">
        {/* Usage */}
        <div className="rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/20 px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-amber-400">Email quota · <span className="font-normal text-amber-400/70">Resets in 14 days</span></p>
            <div className="flex items-center gap-3 mt-1">
              <div className="w-32 h-1.5 rounded-full bg-amber-500/20 overflow-hidden">
                <div className="h-full w-0 rounded-full bg-amber-500" />
              </div>
              <span className="text-xs font-bold text-amber-400">0 / 50 used</span>
            </div>
          </div>
          <Button variant="warning" size="sm">Upgrade for unlimited →</Button>
        </div>

        <div className="grid lg:grid-cols-[440px_1fr] gap-6 items-start">
          {/* ── New Campaign panel ───────────────────────────────────────── */}
          <Card className="space-y-5">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {(["compose", "drafts", "schedule"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  {i > 0 && <div className={cn("flex-1 h-px w-8", step === "compose" ? "bg-bg-overlay" : "bg-indigo-500/40")} />}
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                    step === s ? "bg-brand-primary text-white"
                      : i < ["compose","drafts","schedule"].indexOf(step) ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-bg-overlay text-text-tertiary"
                  )}>
                    {i < ["compose","drafts","schedule"].indexOf(step) ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className={cn("text-xs font-medium capitalize", step === s ? "text-text-primary" : "text-text-tertiary")}>
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Compose */}
            {step === "compose" && (
              <form onSubmit={handleSubmit(onComposeSubmit)} className="space-y-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Campaign name"
                      placeholder="e.g. Post-launch check-in"
                      {...field}
                      error={errors.name?.message}
                    />
                  )}
                />

                {/* Segment */}
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> Segment
                  </p>
                  <Controller
                    name="segment"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2">
                        {SEGMENTS.map((seg) => (
                          <button
                            key={seg.id}
                            type="button"
                            onClick={() => field.onChange(seg.id)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] border text-left transition-all",
                              field.value === seg.id
                                ? "border-brand-primary bg-indigo-500/10"
                                : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                            )}
                          >
                            <span className={cn("text-xs font-medium", field.value === seg.id ? "text-brand-primary" : "text-text-secondary")}>
                              {seg.label}
                            </span>
                            <span className="text-[10px] text-text-tertiary">{seg.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                {/* Channel */}
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">Channel</p>
                  <Controller
                    name="channel"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        {(["Email", "Link", "SMS"] as Channel[]).map((ch) => {
                          const Icon = ch === "Email" ? Mail : ch === "Link" ? Link2 : Send;
                          return (
                            <button
                              key={ch}
                              type="button"
                              onClick={() => field.onChange(ch)}
                              className={cn(
                                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all",
                                field.value === ch
                                  ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                                  : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" /> {ch}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>

                {/* AI context */}
                <div>
                  <label className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1.5 block">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    AI context <span className="text-text-tertiary font-normal">(optional)</span>
                  </label>
                  <Controller
                    name="aiContext"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="e.g. Post-launch of our new AI features, asking for feedback on the enrichment workflow"
                        rows={2}
                        {...field}
                      />
                    )}
                  />
                  <p className="text-[10px] text-text-tertiary mt-1">Helps AI craft more relevant outreach drafts</p>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="md"
                  className="w-full"
                  leftIcon={generating ? undefined : <Sparkles className="h-4 w-4" />}
                  loading={generating}
                >
                  {generating ? "Generating drafts…" : "Generate drafts with AI"}
                </Button>
              </form>
            )}

            {/* Step 2: Pick a draft */}
            {step === "drafts" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary">Choose a draft</p>
                  <button className="text-xs text-brand-primary hover:underline flex items-center gap-1"
                    onClick={() => handleSubmit(onComposeSubmit)()}>
                    <RefreshCw className="h-3 w-3" /> Regenerate
                  </button>
                </div>

                <div className="space-y-3">
                  {AI_DRAFTS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDraft(d.id)}
                      className={cn(
                        "w-full text-left rounded-[var(--radius-lg)] border p-4 transition-all",
                        selectedDraft === d.id
                          ? "border-brand-primary bg-indigo-500/5 shadow-[0_0_0_1px_rgba(99,102,241,0.3)]"
                          : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={selectedDraft === d.id ? "indigo" : "default"} className="text-[10px]">{d.tone}</Badge>
                        {selectedDraft === d.id && <Check className="h-4 w-4 text-brand-primary" />}
                      </div>
                      <p className="text-xs font-medium text-text-primary mb-1">{d.subject}</p>
                      <p className="text-xs text-text-tertiary line-clamp-3 leading-relaxed">{d.body}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep("compose")}>Back</Button>
                  <Button
                    variant="primary" size="md" className="flex-1"
                    disabled={!selectedDraft}
                    onClick={() => setStep("schedule")}
                    rightIcon={<ChevronDown className="h-4 w-4 -rotate-90" />}
                  >
                    Use this draft
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Schedule / Send */}
            {step === "schedule" && (
              <div className="space-y-4">
                <p className="text-sm font-medium text-text-primary">Review & send</p>

                <div className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-4 space-y-2 text-xs text-text-secondary">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Campaign</span>
                    <span className="text-text-primary font-medium">{watchedName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Segment</span>
                    <span className="text-text-primary">{selectedSegment?.label} ({selectedSegment?.count} customers)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Channel</span>
                    <span className="text-text-primary">{watchedChannel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Draft tone</span>
                    <span className="text-text-primary">{AI_DRAFTS.find((d) => d.id === selectedDraft)?.tone}</span>
                  </div>
                </div>

                {/* Send mode toggle */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2">When to send</p>
                  <div className="flex gap-2">
                    {(["now", "scheduled"] as SendMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setSendMode(mode)}
                        className={cn(
                          "flex-1 py-2 rounded-[var(--radius-md)] border text-xs font-medium transition-all",
                          sendMode === mode
                            ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                            : "border-[var(--border-subtle)] text-text-secondary hover:border-[var(--border-default)]"
                        )}
                      >
                        {mode === "now" ? "Send now" : "Schedule"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date picker */}
                {sendMode === "scheduled" && (
                  <div>
                    <button
                      onClick={() => setCalendarOpen(!calendarOpen)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border text-xs transition-all",
                        scheduledDate
                          ? "border-brand-primary bg-indigo-500/10 text-brand-primary"
                          : "border-[var(--border-subtle)] text-text-tertiary hover:border-[var(--border-default)]"
                      )}
                    >
                      <CalendarIcon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{scheduledDate ? format(scheduledDate, "MMMM d, yyyy") : "Pick a date"}</span>
                    </button>

                    <AnimatePresence>
                      {calendarOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="mt-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-elevated p-3 overflow-hidden"
                        >
                          <DayPicker
                            mode="single"
                            selected={scheduledDate}
                            onSelect={(d) => { setScheduledDate(d); setCalendarOpen(false); }}
                            disabled={{ before: new Date() }}
                            classNames={{
                              root: "text-xs",
                              month_caption: "text-xs font-semibold text-text-primary mb-2 flex items-center justify-between",
                              nav: "flex items-center gap-1",
                              button_previous: "h-6 w-6 flex items-center justify-center rounded hover:bg-bg-overlay text-text-tertiary",
                              button_next: "h-6 w-6 flex items-center justify-center rounded hover:bg-bg-overlay text-text-tertiary",
                              weekdays: "grid grid-cols-7 mb-1",
                              weekday: "text-[10px] text-text-tertiary text-center font-medium py-1",
                              weeks: "space-y-1",
                              week: "grid grid-cols-7",
                              day: "h-7 w-7 flex items-center justify-center rounded-full text-xs text-text-secondary hover:bg-bg-overlay cursor-pointer mx-auto transition-colors",
                              selected: "bg-brand-primary text-white hover:bg-brand-primary",
                              today: "font-bold text-brand-primary",
                              disabled: "opacity-30 cursor-not-allowed",
                              outside: "opacity-30",
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Preview */}
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-2">Message preview</p>
                  <div className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-3 text-xs text-text-secondary leading-relaxed font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {AI_DRAFTS.find((d) => d.id === selectedDraft)?.body}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-secondary rounded-[var(--radius-md)] bg-indigo-500/5 border border-indigo-500/15 px-3 py-2">
                  <Info className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                  Smart routing active — 1–3★ customers see a private form, 4–5★ are guided to leave a public testimonial.
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep("drafts")}>Back</Button>
                  <Button
                    variant="gradient" size="md" className="flex-1"
                    loading={sending}
                    rightIcon={<Send className="h-4 w-4" />}
                    onClick={handleSubmit(handleSend)}
                  >
                    {sendMode === "scheduled" ? "Schedule" : "Send now"}
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* ── Campaign list ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary">Campaigns</h2>
              <Button variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} className="text-xs" onClick={() => setStep("compose")}>
                New
              </Button>
            </div>

            <motion.div className="space-y-3" variants={staggerContainer} initial="hidden" animate="show">
              {campaigns.map((c) => (
                <motion.div key={c.id} variants={fadeUp}>
                  <CampaignRow c={c} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
