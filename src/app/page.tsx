"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Zap, ArrowRight, Check, ChevronDown, Play,
  MessageSquare, Sparkles, BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { staggerContainer, fadeUp, scaleIn, slideInLeft, slideInRight } from "@/lib/animations";
import { cn } from "@/lib/utils";

const AI_FEATURES = [
  { icon: <Sparkles className="h-5 w-5" />, title: "Smart Prompts", desc: "AI guides customers to write more compelling, specific testimonials." },
  { icon: <Zap className="h-5 w-5" />, title: "Testimonial Polish", desc: "One click to transform rough feedback into polished, professional copy." },
  { icon: <MessageSquare className="h-5 w-5" />, title: "Response Generator", desc: "Auto-generate professional replies to every public review instantly." },
  { icon: <BarChart2 className="h-5 w-5" />, title: "Auto-Tagging", desc: "AI categorises testimonials by theme so you can filter and showcase the right ones." },
];

const PLANS = [
  { name: "Free", price: 0, features: ["10 testimonials", "1 widget", "Basic page"], cta: "Start free" },
  { name: "Pro", price: 12, popular: true, features: ["Unlimited testimonials", "All widgets", "No branding", "AI features", "50 request emails/mo"], cta: "Start Pro trial" },
  { name: "Business", price: 25, features: ["Everything in Pro", "Team seats", "Custom domain", "API access", "White-label"], cta: "Get Business" },
];

const FAQ = [
  { q: "Is there a free trial?", a: "Yes. The Free plan is free forever with no credit card required. Pro and Business come with a 14-day free trial." },
  { q: "How do I embed widgets on my site?", a: "Copy a single script tag and paste it into your HTML. Works with WordPress, Shopify, Webflow, Wix, Framer, and plain HTML." },
  { q: "Which review platforms can I import from?", a: "Google, Trustpilot, Facebook, G2, Yelp, and Twitter/X. We're adding more regularly." },
  { q: "What does the AI actually do?", a: "AI helps customers write better testimonials, polishes submitted text, generates review responses, and auto-tags your testimonials by theme." },
  { q: "How is my data protected?", a: "All data is encrypted at rest and in transit. We never share your data with third parties. You own your data and can export or delete it at any time." },
  { q: "Can I remove TrustFlow branding from widgets?", a: "Yes — the Pro plan and above remove all TrustFlow branding from your widgets." },
  { q: "What's smart routing?", a: "Customers who rate 1–3 stars go to a private feedback form. Those who rate 4–5 are guided to write a testimonial or leave a Google review." },
  { q: "Do you offer refunds?", a: "Yes, we offer a full refund within 14 days if you're not happy. No questions asked." },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 flex items-center h-16 px-6 transition-all duration-300",
        scrolled ? "glass border-b border-[var(--border-subtle)]" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center">
        <Link href="/" className="flex items-center gap-2 mr-10">
          <div className="h-8 w-8 rounded-[var(--radius-md)] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-text-primary">TrustFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary flex-1">
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#pricing" className="hover:text-text-primary transition-colors">Pricing</a>
          <a href="#story" className="hover:text-text-primary transition-colors">Story</a>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/login">
            <Button variant="gradient" size="sm">Start free</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="h-[600px] w-[800px] rounded-full bg-indigo-500/8 blur-3xl" />
        <div className="absolute h-[400px] w-[600px] rounded-full bg-violet-500/6 blur-3xl translate-y-20" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative max-w-4xl mx-auto space-y-8"
      >
        <motion.div variants={fadeUp} className="flex justify-center">
          <Badge variant="indigo" className="px-4 py-1.5 text-sm">
            ✦ Now in public beta · Free plan available
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl md:text-7xl leading-tight text-text-primary"
        >
          Collect reviews.{" "}
          <span className="gradient-text">Import from anywhere.</span>
          {" "}Display everywhere.
        </motion.h1>

        <motion.p variants={fadeUp} className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          TrustFlow helps freelancers, founders, and agencies collect testimonials, import reviews from Google and Trustpilot, and display them on any website — in under 10 minutes.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/login">
            <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />} className="shadow-[var(--shadow-glow)]">
              Start for free
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" leftIcon={<Play className="h-4 w-4" />}>
              See how it works
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 flex-wrap text-sm text-text-tertiary">
          {["Free forever", "No credit card required", "Setup in 10 minutes"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand-success flex-shrink-0" />
              {item}
            </span>
          ))}
        </motion.div>

        <motion.div variants={scaleIn} className="relative mt-8">
          <div className="animate-float rounded-[var(--radius-xl)] border border-[var(--border-default)] bg-bg-surface shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden glow-primary max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--border-subtle)] bg-bg-elevated">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <div className="flex-1 mx-3 h-5 rounded-full bg-bg-overlay text-[10px] text-text-tertiary flex items-center px-3">
                trustflow.app/dashboard
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total Proof", value: "1,284", trend: "↑ 12%" },
                  { label: "Avg Rating", value: "★ 4.8", trend: "↑ 0.2" },
                  { label: "This Month", value: "+48", trend: "testimonials" },
                  { label: "Widget Views", value: "12.4K", trend: "↑ 8%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-3">
                    <p className="text-[10px] text-text-tertiary">{s.label}</p>
                    <p className="text-sm font-bold text-text-primary mt-1">{s.value}</p>
                    <p className="text-[10px] text-emerald-400">{s.trend}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Sarah J.", "Mike T."].map((name) => (
                  <div key={name} className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={name} size="sm" />
                      <div>
                        <p className="text-[10px] font-medium text-text-primary">{name}</p>
                        <StarRating value={5} size="sm" readonly />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-bg-overlay w-full" />
                      <div className="h-2 rounded-full bg-bg-overlay w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function WorksWithSection() {
  const platforms = ["WordPress", "Shopify", "Webflow", "Wix", "Framer", "Next.js", "HTML"];

  return (
    <section className="py-12 border-y border-[var(--border-subtle)] bg-bg-surface">
      <div className="max-w-4xl mx-auto px-6">
        <p className="text-center text-xs text-text-tertiary mb-6 uppercase tracking-widest font-medium">
          Works with any website platform
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
          {platforms.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-text-tertiary/50 hover:text-text-tertiary/80 transition-colors select-none"
            >
              {name}
            </span>
          ))}
        </div>
        <p className="text-center text-xs text-text-tertiary/50 mt-5">
          One script tag. No framework lock-in.
        </p>
      </div>
    </section>
  );
}

function FeatureSection({
  id,
  badge,
  title,
  description,
  bullets,
  visual,
  reverse = false,
}: {
  id?: string;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id={id} ref={ref} className="py-24 px-6">
      <div className={cn(
        "max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center",
        reverse && "md:grid-flow-dense"
      )}>
        <motion.div
          variants={reverse ? slideInRight : slideInLeft}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className={cn("space-y-6", reverse && "md:col-start-2")}
        >
          <Badge variant="indigo">{badge}</Badge>
          <h2 className="font-display text-4xl text-text-primary leading-tight">{title}</h2>
          <p className="text-text-secondary leading-relaxed">{description}</p>
          <ul className="space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-text-secondary">
                <Check className="h-4 w-4 text-brand-success flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
          <Link href="/login">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Get started free
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={reverse ? slideInLeft : slideInRight}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className={cn(reverse && "md:col-start-1")}
        >
          {visual}
        </motion.div>
      </div>
    </section>
  );
}

function CollectVisual() {
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-bg-surface p-8 space-y-5 shadow-[var(--shadow-md)]">
      <div className="text-center space-y-4">
        <p className="text-sm font-medium text-text-secondary">How would you rate your experience?</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-3xl">⭐</span>
          ))}
        </div>
      </div>
      <textarea
        readOnly
        className="w-full h-20 px-3 py-2.5 rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] text-xs text-text-secondary resize-none"
        value="Working with this team was an absolute game-changer for our business..."
      />
      <Button variant="gradient" size="md" className="w-full" rightIcon={<Sparkles className="h-4 w-4" />}>
        AI Enhance ✨
      </Button>
    </div>
  );
}

function ImportVisual() {
  const platforms = ["🔵 Google", "🟢 Trustpilot", "🔴 Yelp", "🟡 G2", "🔷 Facebook"];
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-bg-surface p-6 shadow-[var(--shadow-md)]">
      <p className="text-xs font-medium text-text-secondary mb-4">Connect your review platforms</p>
      <div className="space-y-2">
        {platforms.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)]"
          >
            <span className="text-sm text-text-secondary">{p}</span>
            <Badge variant={i < 2 ? "success" : "default"} dot>
              {i < 2 ? "Connected" : "Connect →"}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WidgetVisual() {
  const [active, setActive] = useState(0);
  const tabs = ["Wall", "Carousel", "Badge"];
  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-bg-surface overflow-hidden shadow-[var(--shadow-md)]">
      <div className="flex border-b border-[var(--border-subtle)]">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              active === i ? "text-brand-primary border-b-2 border-brand-primary" : "text-text-secondary"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="p-5">
        {active === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {["Sarah J", "Mike T", "Anna L", "Chris P"].map((name) => (
              <div key={name} className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-3">
                <StarRating value={5} size="sm" readonly />
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 rounded-full bg-bg-overlay w-full" />
                  <div className="h-1.5 rounded-full bg-bg-overlay w-4/5" />
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <Avatar name={name} size="sm" />
                  <span className="text-[10px] text-text-tertiary">{name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {active === 1 && (
          <div className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-4">
            <StarRating value={5} size="md" readonly className="mb-2" />
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-bg-overlay w-full" />
              <div className="h-2 rounded-full bg-bg-overlay w-5/6" />
              <div className="h-2 rounded-full bg-bg-overlay w-4/6" />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Avatar name="Sarah J" size="sm" />
              <div>
                <div className="h-2 rounded-full bg-bg-overlay w-20 mb-1" />
                <div className="h-1.5 rounded-full bg-bg-overlay w-14" />
              </div>
            </div>
          </div>
        )}
        {active === 2 && (
          <div className="flex justify-center py-4">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[var(--border-default)] bg-bg-elevated">
              <StarRating value={5} size="sm" readonly />
              <span className="text-sm font-bold text-text-primary">4.9</span>
              <span className="text-xs text-text-secondary">verified reviews</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AISection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 px-6 bg-bg-surface">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-14"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="purple" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by AI
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-4xl text-text-primary">
            AI that works quietly in the background
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-secondary mt-4 max-w-xl mx-auto">
            Every feature is enhanced by AI so you get better results with less effort.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {AI_FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <Card hover glow className="group">
                <div className="h-10 w-10 rounded-[var(--radius-md)] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:border-indigo-500/40 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FounderSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const roadmap = [
    { status: "done", label: "Testimonial collection + AI polish" },
    { status: "done", label: "Widget builder with 8 styles" },
    { status: "building", label: "Google & Trustpilot import" },
    { status: "next", label: "Video testimonials" },
  ];

  return (
    <section id="story" ref={ref} className="py-24 px-6 bg-bg-surface">
      <div className="max-w-2xl mx-auto space-y-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="space-y-6"
        >
          <motion.div variants={fadeUp} className="text-center">
            <Badge variant="purple" className="mb-4">Built in public</Badge>
            <h2 className="font-display text-4xl text-text-primary">
              Built by a developer who needed this
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-bg-elevated p-8 space-y-6"
          >
            <blockquote className="text-text-secondary leading-relaxed text-base italic border-l-2 border-brand-primary pl-5">
              &ldquo;I was paying for 3 separate tools — one for testimonials, one for Google reviews,
              one for social proof popups. TrustFlow combines all of them for £12/month.&rdquo;
            </blockquote>

            <div className="flex items-center gap-3">
              <Avatar name="Najam Khan" size="md" />
              <div>
                <p className="text-sm font-semibold text-text-primary">Najam Khan</p>
                <p className="text-xs text-text-tertiary">Founder &amp; Developer</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <p className="text-sm text-text-secondary mb-4">
                Currently in public beta. Be one of the first to try it.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/login">
                  <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Start free
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={() => {}}>
                  Follow the journey on Twitter →
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="space-y-5"
        >
          <motion.h3 variants={fadeUp} className="font-display text-2xl text-text-primary text-center">
            What&apos;s coming
          </motion.h3>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="space-y-3"
          >
            {roadmap.map((item, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="flex items-center gap-3 p-4 rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)]"
              >
                <span className="text-lg flex-shrink-0">
                  {item.status === "done" ? "✅" : item.status === "building" ? "🔄" : "🔜"}
                </span>
                <span className="text-sm text-text-secondary flex-1">{item.label}</span>
                <Badge
                  variant={item.status === "done" ? "success" : item.status === "building" ? "warning" : "default"}
                  className="text-[10px] flex-shrink-0"
                >
                  {item.status === "done" ? "Shipped" : item.status === "building" ? "Building now" : "Next"}
                </Badge>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" ref={ref} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeUp} className="font-display text-4xl text-text-primary">
            Simple, honest pricing
          </motion.h2>
          <motion.p variants={fadeUp} className="text-text-secondary mt-3">
            Start free. Upgrade when you need more.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-5 inline-flex items-center gap-2 bg-bg-surface border border-[var(--border-subtle)] rounded-full p-1">
            {(["monthly", "yearly"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  billing === b ? "bg-brand-primary text-white" : "text-text-secondary"
                )}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === "yearly" && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-brand-success/20 text-brand-success text-[10px] font-bold">
                    Save 25%
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {PLANS.map((plan) => {
            const price = billing === "yearly" && plan.price > 0
              ? Math.floor(plan.price * 0.75)
              : plan.price;
            return (
              <motion.div
                key={plan.name}
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
                    <Badge variant="indigo">Most popular</Badge>
                  </div>
                )}
                <div className="mb-5">
                  <p className="text-sm font-medium text-text-secondary">{plan.name}</p>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-text-primary">£{price}</span>
                    {price > 0 && <span className="text-text-tertiary text-sm">/mo</span>}
                    {price === 0 && <span className="text-text-tertiary text-sm">free</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="h-4 w-4 text-brand-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button
                    variant={plan.popular ? "gradient" : "secondary"}
                    size="md"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <p className="text-center text-xs text-text-tertiary mt-8">
          14-day free trial on paid plans · No credit card required · Cancel anytime · Prices in GBP
        </p>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-4xl text-text-primary text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-overlay transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="text-sm font-medium text-text-primary">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-text-tertiary transition-transform duration-200 flex-shrink-0 ml-4",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-text-secondary leading-relaxed">
                  {item.a}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-[var(--radius-md)] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-semibold text-text-primary">TrustFlow</span>
            </div>
            <p className="text-xs text-text-tertiary leading-relaxed max-w-xs">
              The affordable social proof platform for freelancers, founders, and agencies.
              Currently in public beta.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://twitter.com/najamkhan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Twitter / X
              </a>
              <a
                href="https://github.com/najamkhan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-primary uppercase tracking-wide mb-3">Product</p>
            <ul className="space-y-2">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-primary uppercase tracking-wide mb-3">Legal</p>
            <ul className="space-y-2">
              {["Privacy Policy", "Terms of Service"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-tertiary">© 2026 TrustFlow. All rights reserved.</p>
          <p className="text-xs text-text-tertiary">Built with ♥ in London</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <WorksWithSection />
        <FeatureSection
          id="features"
          badge="Collect"
          title="Beautiful collection forms that customers actually fill in"
          description="Your custom collection page with smart AI prompts, star ratings, and optional AI enhancement. Customers love it because it's simple."
          bullets={[
            "Mobile-first design — most views happen on phones",
            "AI-guided questions help customers write better testimonials",
            "Optional AI Polish makes every submission shine",
            "Smart routing: 4-5 stars → public, 1-3 → private feedback",
          ]}
          visual={<CollectVisual />}
        />
        <FeatureSection
          badge="Import"
          title="Pull in reviews from every platform you're on"
          description="Connect Google, Trustpilot, Yelp, and more with one click. We sync automatically every 24 hours so you never miss a review."
          bullets={[
            "Google Business, Trustpilot, Yelp, Facebook, G2, Twitter",
            "Auto-syncs every 24 hours in the background",
            "AI-generated response drafts for each review",
            "Combine imported reviews with direct testimonials seamlessly",
          ]}
          visual={<ImportVisual />}
          reverse
        />
        <FeatureSection
          badge="Display"
          title="Widgets that work on any website, any framework"
          description="Choose from Wall, Carousel, Badge, Marquee and more. Configure in the dashboard and go live with a single script tag."
          bullets={[
            "8 widget types for every use case",
            "Live preview as you configure — no guessing",
            "Works with WordPress, Shopify, Webflow, Framer, and plain HTML",
            "Dark and light themes to match your brand",
          ]}
          visual={<WidgetVisual />}
        />
        <AISection />
        <FounderSection />
        <PricingSection />
        <FAQSection />

        <section className="py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl" />
          </div>
          <div className="relative max-w-xl mx-auto space-y-6">
            <h2 className="font-display text-5xl text-text-primary">
              Ready to build trust?
            </h2>
            <p className="text-text-secondary">
              Start free, no credit card required. Set up in under 10 minutes.
            </p>
            <Link href="/login">
              <Button variant="gradient" size="lg" className="shadow-[var(--shadow-glow)]" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start for free today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
