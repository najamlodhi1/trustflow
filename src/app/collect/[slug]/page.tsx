"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { StarRating } from "@/components/ui/StarRating";
import { scaleIn } from "@/lib/animations";
import { cn } from "@/lib/utils";

type Step = "rating" | "testimonial" | "feedback" | "thanks";

export default function CollectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: _slug } = use(params);

  const [step, setStep] = useState<Step>("rating");
  const [rating, setRating] = useState(0);
  const [path, setPath] = useState<"happy" | "unhappy">("happy");

  // Happy path fields
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(true);

  // Unhappy path fields
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);

  function handleRating(star: number) {
    setRating(star);
    const isHappy = star >= 4;
    setPath(isHappy ? "happy" : "unhappy");
    setTimeout(() => setStep(isHappy ? "testimonial" : "feedback"), 500);
  }

  async function handleSubmitTestimonial() {
    if (!name || text.length < 10) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setStep("thanks");
  }

  async function handleSubmitFeedback() {
    if (!feedbackText) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setStep("thanks");
  }

  // 0 = rating, 1 = form (testimonial/feedback)
  const stepIndex = step === "rating" ? 0 : 1;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      {/* Business header */}
      <div className="w-full max-w-lg mb-8 text-center">
        <div className="inline-flex h-14 w-14 rounded-[var(--radius-lg)] bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center mx-auto mb-3">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <h1 className="text-lg font-bold text-text-primary">TrustFlow Demo</h1>
        <p className="text-sm text-text-secondary mt-0.5">Share your experience with us</p>
      </div>

      {/* Progress indicator */}
      {step !== "thanks" && (
        <div className="flex items-center gap-2 mb-8" role="progressbar" aria-valuenow={stepIndex + 1} aria-valuemin={1} aria-valuemax={2}>
          {[0, 1].map((i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === stepIndex
                  ? "w-6 bg-brand-primary"
                  : i < stepIndex
                  ? "w-2 bg-indigo-500/60"
                  : "w-2 bg-bg-overlay"
              )}
            />
          ))}
          <span className="sr-only">Step {stepIndex + 1} of 2</span>
        </div>
      )}

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* Step 1: Rating */}
          {step === "rating" && (
            <motion.div
              key="rating"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 text-center space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  How would you rate your experience?
                </h2>
                <p className="text-sm text-text-secondary mt-1">Tap a star to get started</p>
              </div>

              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRating(star)}
                    className="text-4xl min-w-[48px] min-h-[48px] flex items-center justify-center transition-all duration-150"
                    aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                  >
                    <span
                      className={cn(
                        "transition-all duration-150",
                        star <= rating ? "filter-none" : "grayscale opacity-40"
                      )}
                    >
                      ⭐
                    </span>
                  </motion.button>
                ))}
              </div>

              {rating > 0 && (
                <p className="text-sm text-text-secondary animate-pulse">
                  {rating <= 2
                    ? "We're sorry to hear that..."
                    : rating === 3
                    ? "Thanks for your honest feedback!"
                    : rating === 4
                    ? "That's great! 😊"
                    : "Amazing! 🎉"}
                </p>
              )}
            </motion.div>
          )}

          {/* Step 2a: Testimonial form — happy path (4–5 stars) */}
          {step === "testimonial" && (
            <motion.div
              key="testimonial"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-5"
            >
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <StarRating value={rating} size="lg" readonly />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  We&apos;d love to share your experience!
                </h2>
                <p className="text-sm text-text-secondary mt-1">Fill in your details below</p>
              </div>

              <Input
                label="Your name *"
                placeholder="Sarah Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Job title (optional)"
                  placeholder="CEO"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <Input
                  label="Company (optional)"
                  placeholder="TechCorp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div>
                <Textarea
                  label="Your testimonial *"
                  placeholder="What did you enjoy most about working with us?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  charCount={{ current: text.length, max: 500 }}
                />
                <div className="mt-2 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-indigo-400" aria-hidden="true" />
                  <span className="text-[11px] text-indigo-400 font-medium">
                    ✨ AI Polish available after submission
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-text-tertiary">
                  💡 Tip: Mention specific results or outcomes — it helps future customers!
                </p>
              </div>

              <Button
                variant="secondary"
                size="md"
                leftIcon={<Upload className="h-4 w-4" aria-hidden="true" />}
                className="w-full"
              >
                Upload photo (optional)
              </Button>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-indigo-500 h-4 w-4 flex-shrink-0"
                />
                <span className="text-xs text-text-secondary leading-relaxed">
                  I&apos;m happy for this to be displayed publicly
                </span>
              </label>

              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={!name || text.length < 10}
                loading={submitting}
                onClick={handleSubmitTestimonial}
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Submit testimonial
              </Button>

              <div className="pt-3 border-t border-[var(--border-subtle)] text-center space-y-2">
                <p className="text-xs text-text-tertiary">Want to help us even more?</p>
                <Button variant="secondary" size="sm">
                  ⭐ Leave a Google Review
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2b: Private feedback form — unhappy path (1–3 stars) */}
          {step === "feedback" && (
            <motion.div
              key="feedback"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-5"
            >
              <div>
                <div className="flex justify-center mb-3">
                  <StarRating value={rating} size="lg" readonly />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  We&apos;re sorry your experience wasn&apos;t great.
                </h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  Your feedback helps us improve. This is private and won&apos;t be published.
                </p>
              </div>

              <Textarea
                label="What could we have done better? *"
                placeholder="Tell us what went wrong or what we could improve..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
              />

              <Input
                type="email"
                label="Your email (optional — if you'd like us to follow up)"
                placeholder="you@company.com"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
              />

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!feedbackText}
                loading={submitting}
                onClick={handleSubmitFeedback}
                rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              >
                Send feedback
              </Button>
            </motion.div>
          )}

          {/* Step 3: Thank you */}
          {step === "thanks" && (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-12 text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mx-auto h-16 w-16 rounded-full bg-brand-success/10 border-2 border-brand-success/30 flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-brand-success" aria-hidden="true" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Thank you{name ? `, ${name.split(" ")[0]}` : ""}! 🎉
                </h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed max-w-xs mx-auto">
                  {path === "happy"
                    ? "Your testimonial has been received and is pending review. We really appreciate it!"
                    : "Your feedback has been received. Thank you for helping us improve."}
                </p>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => (window.location.href = "/")}
              >
                Return to TrustFlow Demo
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-8 text-[10px] text-text-tertiary">
        Powered by{" "}
        <a href="/" className="text-brand-primary hover:underline">
          TrustFlow
        </a>
      </p>
    </div>
  );
}
