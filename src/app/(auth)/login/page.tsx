"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Mail, ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { fadeUp, staggerContainer } from "@/lib/animations";

const FLOATING_CARDS = [
  {
    name: "Sarah Johnson",
    company: "TechCorp",
    text: "Game-changing results. Our conversions went up 34%.",
    rating: 5,
  },
  {
    name: "Mike Torres",
    company: "GrowthLabs",
    text: "The only social proof tool that actually works.",
    rating: 5,
  },
  {
    name: "Anna Li",
    company: "Bloom Agency",
    text: "Beautiful widgets. Clients love seeing real reviews.",
    rating: 5,
  },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col px-8 py-10 max-w-lg mx-auto lg:mx-0">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="h-8 w-8 rounded-[var(--radius-md)] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-text-primary">TrustFlow</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-sm">
          {!sent ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold text-text-primary mb-1">
                  Get started free
                </h1>
                <p className="text-sm text-text-secondary">
                  No credit card required. Start collecting in minutes.
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-3"
                  onClick={() => {}}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-[var(--border-subtle)]" />
                <span className="text-xs text-text-tertiary">or continue with email</span>
                <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              </motion.div>

              <motion.form variants={fadeUp} onSubmit={handleMagicLink} className="space-y-3">
                <Input
                  type="email"
                  label="Email address"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Send magic link
                </Button>
              </motion.form>

              <motion.p variants={fadeUp} className="text-xs text-text-tertiary text-center leading-relaxed">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-text-secondary hover:text-text-primary underline underline-offset-2">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-text-secondary hover:text-text-primary underline underline-offset-2">
                  Privacy Policy
                </Link>
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-brand-success/10 border border-brand-success/20 flex items-center justify-center">
                <Check className="h-7 w-7 text-brand-success" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Check your inbox</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  We sent a magic link to{" "}
                  <span className="text-text-primary font-medium">{email}</span>
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-text-tertiary hover:text-text-secondary underline underline-offset-2"
              >
                Use a different email
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-bg-surface border-l border-[var(--border-subtle)] p-12 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-sm w-full space-y-4">
          <p className="text-sm text-text-tertiary text-center mb-6">
            Join 500+ businesses displaying better social proof
          </p>

          {FLOATING_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              style={{
                animation: `float ${3.5 + i * 0.5}s ease-in-out ${i * 0.8}s infinite`,
              }}
              className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-bg-elevated p-4 shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center gap-3 mb-2">
                <Avatar name={card.name} size="sm" />
                <div>
                  <p className="text-xs font-medium text-text-primary">{card.name}</p>
                  <p className="text-[10px] text-text-tertiary">{card.company}</p>
                </div>
                <div className="ml-auto">
                  <StarRating value={card.rating} size="sm" readonly />
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">"{card.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
