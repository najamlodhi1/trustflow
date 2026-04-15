"use client";

import { useState, use } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, Send, ChevronDown, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, statusBadgeVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Input, Textarea } from "@/components/ui/Input";
import { StarRating } from "@/components/ui/StarRating";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { timeAgo, cn } from "@/lib/utils";
import { toast } from "sonner";

const REQUESTS = [
  { id: "req1", name: "Sarah Johnson", email: "sarah@techcorp.io", status: "completed", rating: 5, sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { id: "req2", name: "Mike Torres", email: "mike@growthlabs.co", status: "opened", rating: null, sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  { id: "req3", name: "Anna Li", email: "anna@bloomagency.com", status: "sent", rating: null, sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
  { id: "req4", name: "Chris Patel", email: "chris@launchpad.io", status: "bounced", rating: null, sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  { id: "req5", name: "Emma Wilson", email: "emma@willowco.uk", status: "completed", rating: 4, sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
];

const STATUS_COLORS: Record<string, string> = {
  completed: "success",
  opened: "info",
  sent: "warning",
  bounced: "danger",
};

export default function RequestsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    toast.success(`Review request sent to ${name}`);
    setName("");
    setEmail("");
  }

  return (
    <div>
      <Header
        title="Review Requests"
        actions={
          <Button variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
            Import CSV
          </Button>
        }
      />

      <div className="p-6 max-w-screen-xl mx-auto space-y-6">
        {/* Usage banner */}
        <div className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] bg-amber-500/10 border border-amber-500/20">
          <p className="text-sm text-amber-400">
            <span className="font-medium">0/50 emails</span>{" "}
            <span className="text-amber-400/70">used this month · Resets in 14 days</span>
          </p>
          <Button variant="warning" size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-400 text-white">
            Upgrade →
          </Button>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Compose */}
          <Card>
            <h2 className="text-sm font-semibold text-text-primary mb-5">Send a Review Request</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="customer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Name"
                placeholder="Customer name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div>
                <p className="text-sm font-medium text-text-secondary mb-2">Message preview</p>
                <div className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-3 text-xs text-text-secondary leading-relaxed">
                  Hi {name || "[Name]"}, we&apos;d love to hear your feedback about working with us. It takes just 2 minutes and really helps our business grow. Click below to share your experience!
                  <button type="button" className="text-brand-primary hover:underline ml-1 text-xs">Edit</button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="md"
                className="w-full"
                loading={sending}
                rightIcon={<Send className="h-4 w-4" />}
              >
                Send Request
              </Button>
            </form>
          </Card>

          {/* Table */}
          <div className="space-y-4">
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-subtle)]">
                      {["Name", "Email", "Status", "Rating", "Sent"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-[var(--border-subtle)]"
                  >
                    {REQUESTS.map((req) => (
                      <>
                        <motion.tr
                          key={req.id}
                          variants={fadeUp}
                          className="hover:bg-bg-overlay/50 cursor-pointer transition-colors"
                          onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <Avatar name={req.name} size="sm" />
                              <span className="font-medium text-text-primary">{req.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-text-secondary">{req.email}</td>
                          <td className="px-5 py-3.5">
                            <Badge variant={STATUS_COLORS[req.status] as never} dot>
                              {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            {req.rating ? (
                              <StarRating value={req.rating} size="sm" readonly />
                            ) : (
                              <span className="text-text-tertiary">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-text-tertiary text-xs">
                            <div className="flex items-center justify-between gap-2">
                              {timeAgo(req.sentAt)}
                              <ChevronDown
                                className={cn(
                                  "h-3.5 w-3.5 transition-transform",
                                  expanded === req.id && "rotate-180"
                                )}
                              />
                            </div>
                          </td>
                        </motion.tr>
                        {expanded === req.id && (
                          <tr key={`${req.id}-expand`}>
                            <td colSpan={5} className="px-5 py-3 bg-bg-elevated">
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-text-secondary space-y-0.5">
                                  <p>Sent to <span className="text-text-primary">{req.email}</span></p>
                                  <p>Status: <span className="text-text-primary capitalize">{req.status}</span></p>
                                </div>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                                  className="h-7 text-xs"
                                  onClick={() => toast.success(`Request resent to ${req.name}`)}
                                >
                                  Resend
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            </Card>

            {/* Smart routing tip */}
            <div className="flex gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-indigo-500/5 border border-indigo-500/15">
              <Info className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary leading-relaxed">
                <span className="font-medium text-text-primary">Smart routing is active.</span>{" "}
                Customers who rate 1–3 stars are routed to a private feedback form. Those who rate 4–5 stars are guided to leave a public testimonial or Google review.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
