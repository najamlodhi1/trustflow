"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, AlertTriangle, Copy, RefreshCw,
  Download, ExternalLink, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Header } from "@/components/layout/Header";
import { cn, copyToClipboard } from "@/lib/utils";
import { BUSINESS_TYPES } from "@/lib/constants";
import { toast } from "sonner";

type Tab = "general" | "integrations" | "collection" | "team" | "danger";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General" },
  { id: "integrations", label: "Integrations" },
  { id: "collection", label: "Collection Page" },
  { id: "team", label: "Team" },
  { id: "danger", label: "Danger Zone" },
];

export default function SettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [tab, setTab] = useState<Tab>("general");
  const [projectName, setProjectName] = useState("TrustFlow Demo");
  const [deleteInput, setDeleteInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success("Settings saved");
  }

  async function handleCopyKey() {
    await copyToClipboard("tf_live_7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    toast.success("API key copied");
  }

  return (
    <div>
      <Header title="Settings" />

      <div className="p-6 max-w-screen-lg mx-auto space-y-5">
        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-[var(--border-subtle)] overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                tab === t.id
                  ? "border-brand-primary text-text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary",
                t.id === "danger" && "text-brand-danger hover:text-brand-danger"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* General */}
        {tab === "general" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <Card>
              <h2 className="text-sm font-semibold text-text-primary mb-5">Project Details</h2>
              <div className="space-y-4 max-w-md">
                <Input
                  label="Project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <div>
                  <Input
                    label="Slug"
                    value="trustflow-demo"
                    readOnly
                    helperText="trustflow.app/collect/trustflow-demo"
                  />
                </div>
                <Input label="Website URL" type="url" defaultValue="https://trustflow.app" />
                <div>
                  <label className="text-sm font-medium text-text-secondary block mb-1.5">Business type</label>
                  <select className="w-full h-10 px-3 rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] text-text-primary text-sm focus:outline-none focus:border-brand-primary">
                    {BUSINESS_TYPES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button variant="primary" size="md" className="mt-6" loading={saving} onClick={handleSave}>
                Save changes
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Integrations */}
        {tab === "integrations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {[
              { name: "Google Business Profile", connected: true, lastSync: "2 hours ago", icon: "🔵" },
              { name: "Trustpilot", connected: false, icon: "🟢" },
              { name: "Yelp", connected: false, icon: "🔴" },
            ].map((platform) => (
              <Card key={platform.name}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{platform.name}</p>
                      {platform.connected && (
                        <p className="text-xs text-text-tertiary">Last synced: {platform.lastSync}</p>
                      )}
                    </div>
                  </div>
                  {platform.connected ? (
                    <div className="flex gap-2">
                      <Badge variant="success" dot>Connected</Badge>
                      <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} className="h-7 text-xs">
                        Sync now
                      </Button>
                      <Button variant="secondary" size="sm" className="h-7 text-xs">Disconnect</Button>
                    </div>
                  ) : (
                    <Button variant="primary" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                      Connect →
                    </Button>
                  )}
                </div>
              </Card>
            ))}

            {/* API Key */}
            <Card>
              <h3 className="text-sm font-semibold text-text-primary mb-4">WordPress / API Access</h3>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-xs font-mono bg-bg-base rounded-[var(--radius-md)] px-3 py-2.5 border border-[var(--border-subtle)] text-text-secondary">
                  tf_live_7a8b9c0d1e2f...
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={copiedKey ? <Check className="h-3.5 w-3.5 text-brand-success" /> : <Copy className="h-3.5 w-3.5" />}
                  onClick={handleCopyKey}
                >
                  {copiedKey ? "Copied!" : "Copy key"}
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
                  Regenerate
                </Button>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>
                  Download plugin
                </Button>
                <Button variant="ghost" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                  View setup guide
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Collection page */}
        {tab === "collection" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <h2 className="text-sm font-semibold text-text-primary mb-5">Collection Page Settings</h2>
              <div className="space-y-5 max-w-md">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">Accent colour</p>
                  <div className="flex gap-3">
                    {["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"].map((c) => (
                      <button
                        key={c}
                        className="h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-bg-surface ring-transparent hover:ring-white transition-all"
                        style={{ background: c }}
                        aria-label={c}
                      />
                    ))}
                  </div>
                </div>
                <Input
                  label="Thank-you message"
                  defaultValue="Thank you for your feedback! We really appreciate it."
                  helperText="Shown after the customer submits their testimonial"
                />
                <label className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Show AI Enhance button</span>
                  <button
                    role="switch"
                    aria-checked={true}
                    className="relative h-5 w-9 rounded-full bg-brand-primary"
                  >
                    <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow translate-x-4" />
                  </button>
                </label>
                <Button variant="primary" size="md" loading={saving} onClick={handleSave}>
                  Save settings
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Team */}
        {tab === "team" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-text-primary">Team Members</h2>
                <Badge variant="warning">Pro feature</Badge>
              </div>
              <div className="py-8 text-center">
                <p className="text-sm text-text-secondary mb-3">
                  Upgrade to Business to add team members
                </p>
                <Button variant="gradient" size="md">Upgrade to Business</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Danger Zone */}
        {tab === "danger" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="border-brand-danger/30">
              <div className="flex items-start gap-3 mb-5">
                <AlertTriangle className="h-5 w-5 text-brand-danger flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-semibold text-brand-danger">Delete this project</h2>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    This will permanently delete all testimonials, reviews, widgets, and data for this project. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="space-y-3 max-w-sm">
                <Input
                  label={`Type "${projectName}" to confirm`}
                  placeholder={projectName}
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                />
                <Button
                  variant="danger"
                  size="md"
                  disabled={deleteInput !== projectName}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => toast.error("Project deleted")}
                >
                  Delete project
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
