"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    current: true,
    features: [
      { label: "10 testimonials", included: true },
      { label: "1 widget", included: true },
      { label: "Basic collection page", included: true },
      { label: "AI features", included: false },
      { label: "Remove TrustFlow branding", included: false },
      { label: "Review request emails", included: false },
      { label: "All import sources", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 12,
    yearlyPrice: 9,
    popular: true,
    current: false,
    features: [
      { label: "Unlimited testimonials", included: true },
      { label: "All widget types", included: true },
      { label: "No branding", included: true },
      { label: "AI features (Polish + Responses)", included: true },
      { label: "50 request emails/mo", included: true },
      { label: "All import sources", included: true },
      { label: "Team seats", included: false },
    ],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 25,
    yearlyPrice: 19,
    current: false,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Team seats", included: true },
      { label: "Custom domain", included: true },
      { label: "API access", included: true },
      { label: "White-label widgets", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Priority support", included: true },
    ],
  },
];

export default function BillingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [upgrading, setUpgrading] = useState<string | null>(null);

  async function handleUpgrade(planId: string) {
    setUpgrading(planId);
    await new Promise((r) => setTimeout(r, 1500));
    setUpgrading(null);
    toast.success("🎉 Welcome to Pro! Your plan has been upgraded.", { duration: 5000 });
  }

  return (
    <div>
      <Header title="Billing" />

      <div className="p-6 max-w-screen-lg mx-auto space-y-8">
        {/* Current plan */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-text-secondary">Current plan</p>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">Free</h2>
            </div>
            <div className="space-y-3 sm:w-64">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Testimonials</span>
                  <span className="text-text-primary font-medium">8/10</span>
                </div>
                <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-secondary">Widgets</span>
                  <span className="text-brand-warning font-medium">1/1</span>
                </div>
                <div className="h-2 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full w-full rounded-full bg-brand-warning" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing toggle */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-lg font-bold text-text-primary">Choose your plan</h2>
          <div className="flex items-center gap-3 bg-bg-surface border border-[var(--border-subtle)] rounded-full p-1">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  billing === b
                    ? "bg-brand-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === "yearly" && (
                  <span className="ml-1.5 text-[10px] text-brand-success font-bold">-25%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {PLANS.map((plan) => {
            const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                className={cn(
                  "relative rounded-[var(--radius-xl)] border p-6 flex flex-col",
                  plan.popular
                    ? "border-brand-primary bg-indigo-500/5 shadow-[var(--shadow-glow)]"
                    : "border-[var(--border-subtle)] bg-bg-surface"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="indigo" className="shadow-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most popular
                    </Badge>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-base font-bold text-text-primary">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-text-primary">
                      £{price}
                    </span>
                    {price > 0 && (
                      <span className="text-sm text-text-tertiary">/mo</span>
                    )}
                    {price === 0 && (
                      <span className="text-sm text-text-tertiary">forever</span>
                    )}
                  </div>
                  {billing === "yearly" && price > 0 && (
                    <p className="text-xs text-text-tertiary mt-0.5">
                      Billed £{price * 12}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f.label} className="flex items-center gap-2 text-sm">
                      {f.included ? (
                        <Check className="h-4 w-4 text-brand-success flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-text-tertiary flex-shrink-0" />
                      )}
                      <span className={f.included ? "text-text-secondary" : "text-text-tertiary line-through"}>
                        {f.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <Button variant="secondary" size="md" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant={plan.popular ? "gradient" : "primary"}
                    size="md"
                    className="w-full"
                    loading={upgrading === plan.id}
                    onClick={() => handleUpgrade(plan.id)}
                    leftIcon={plan.popular ? <Zap className="h-4 w-4" /> : undefined}
                  >
                    {plan.popular ? `Upgrade to Pro` : `Get ${plan.name}`}
                    {price > 0 && ` · £${price}/mo`}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <p className="text-center text-xs text-text-tertiary">
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
