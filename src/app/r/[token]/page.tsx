"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ExternalLink, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { scaleIn, staggerContainer, fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type RouteStep = "rate" | "high" | "low" | "done";

export default function SmartRoutingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [step, setStep] = useState<RouteStep>("rate");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleRate(star: number) {
    setRating(star);
    setTimeout(() => {
      if (star >= 4) setStep("high");
      else setStep("low");
    }, 350);
  }

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setStep("done");
    toast.success("Feedback received — thank you!");
  }

  const display = hovered || rating;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      {/* Business header */}
      <div className="mb-8 text-center">
        <div className="inline-flex h-14 w-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center mx-auto mb-3">
          <span className="text-white font-bold text-xl">T</span>
        </div>
      </div>

      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {/* Step: Rate */}
          {step === "rate" && (
            <motion.div
              key="rate"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 text-center space-y-8"
            >
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  How was your experience with
                </h1>
                <h2 className="text-xl font-bold text-brand-primary mt-1">TrustFlow?</h2>
              </div>

              <div className="flex justify-center gap-3" role="radiogroup" aria-label="Rate your experience">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    role="radio"
                    aria-checked={rating === star}
                    aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                    className={cn(
                      "text-4xl transition-all duration-100",
                      star <= display ? "opacity-100" : "opacity-30 grayscale"
                    )}
                  >
                    ⭐
                  </motion.button>
                ))}
              </div>

              <div className="grid grid-cols-5 text-[10px] text-text-tertiary -mt-4 px-1">
                <span className="text-left">Terrible</span>
                <span /><span /><span />
                <span className="text-right">Excellent</span>
              </div>
            </motion.div>
          )}

          {/* Step: High rating → public options */}
          {step === "high" && (
            <motion.div
              key="high"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 text-center space-y-6"
            >
              <div>
                <p className="text-3xl mb-3">🎉</p>
                <h2 className="text-xl font-bold text-text-primary">That&apos;s amazing to hear!</h2>
                <p className="text-sm text-text-secondary mt-2">
                  Would you like to share your experience?
                </p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                <motion.div variants={fadeUp}>
                  <a href="/collect/demo">
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Write a testimonial
                    </Button>
                  </a>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    rightIcon={<ExternalLink className="h-4 w-4" />}
                    onClick={() => window.open("https://maps.google.com", "_blank")}
                  >
                    Leave a Google review
                  </Button>
                </motion.div>
              </motion.div>

              <button
                onClick={() => setStep("done")}
                className="text-xs text-text-tertiary hover:text-text-secondary transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          )}

          {/* Step: Low rating → private feedback */}
          {step === "low" && (
            <motion.div
              key="low"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-6"
            >
              <div className="text-center">
                <p className="text-2xl mb-3">😔</p>
                <h2 className="text-lg font-bold text-text-primary">We&apos;re sorry to hear that.</h2>
                <p className="text-sm text-text-secondary mt-2">
                  Your feedback helps us improve. Would you share what happened?
                </p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <Textarea
                  placeholder="What could we do better?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={submitting}
                  disabled={!feedback.trim()}
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  Send private feedback
                </Button>
              </form>

              <p className="text-[10px] text-text-tertiary text-center">
                Your feedback goes directly to the team and won&apos;t be published publicly.
              </p>
            </motion.div>
          )}

          {/* Done */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-12 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="text-5xl mx-auto"
              >
                🙏
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">Thank you!</h2>
                <p className="text-sm text-text-secondary mt-1">
                  {rating >= 4
                    ? "We really appreciate you taking the time."
                    : "We appreciate your honest feedback. We'll use it to improve."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-[10px] text-text-tertiary">
        Powered by{" "}
        <a href="/" className="text-brand-primary hover:underline">TrustFlow</a>
      </p>
    </div>
  );
}
