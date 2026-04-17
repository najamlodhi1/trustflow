"use client";

import { useState, use } from "react";
import { Check, ArrowRight, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { StarRating } from "@/components/ui/StarRating";
import { cn } from "@/lib/utils";

type Step = "rating" | "testimonial" | "feedback" | "thanks";

const STEP_NUMBER: Record<Step, number> = {
  rating: 1,
  testimonial: 2,
  feedback: 2,
  thanks: 3,
};

const RATING_LABEL: Record<number, string> = {
  1: "We're really sorry to hear that.",
  2: "We're sorry your experience wasn't great.",
  3: "Thanks for your honest feedback!",
  4: "That's great to hear! 😊",
  5: "Amazing! Thank you so much! 🎉",
};

export default function CollectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: _slug } = use(params);

  const [step, setStep] = useState<Step>("rating");
  const [visible, setVisible] = useState(true);
  const [rating, setRating] = useState(0);
  const [path, setPath] = useState<"happy" | "unhappy">("happy");
  const [hovered, setHovered] = useState(0);
  const [bouncingStar, setBouncingStar] = useState(0);
  const [showThanks, setShowThanks] = useState(false);

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

  function goToStep(nextStep: Step, delay = 0) {
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setStep(nextStep);
        setVisible(true);
      }, 280);
    }, delay);
  }

  function handleRating(star: number) {
    if (rating > 0) return; // prevent re-selection
    setRating(star);
    setBouncingStar(star);
    setShowThanks(true);
    setTimeout(() => setBouncingStar(0), 520);
    const isHappy = star >= 4;
    setPath(isHappy ? "happy" : "unhappy");
    goToStep(isHappy ? "testimonial" : "feedback", 700);
  }

  async function handleSubmitTestimonial() {
    if (!name || text.length < 10) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    goToStep("thanks");
  }

  async function handleSubmitFeedback() {
    if (!feedbackText) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    goToStep("thanks");
  }

  const stepNumber = STEP_NUMBER[step];
  const progressPct = (stepNumber / 3) * 100;

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

      {/* Step progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">Step {stepNumber} of 3</span>
          <span className="text-xs text-text-tertiary">
            {step === "rating" && "Rate your experience"}
            {step === "testimonial" && "Write your testimonial"}
            {step === "feedback" && "Share your feedback"}
            {step === "thanks" && "All done!"}
          </span>
        </div>
        <div
          className="h-1.5 rounded-full bg-bg-overlay overflow-hidden"
          role="progressbar"
          aria-valuenow={stepNumber}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label={`Step ${stepNumber} of 3`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="w-full max-w-lg">
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3 pointer-events-none"
          )}
        >
          {/* ── Step 1: Star rating ─────────────────────────────── */}
          {step === "rating" && (
            <div className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 text-center space-y-8">
              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  How would you rate your experience?
                </h2>
                <p className="text-sm text-text-secondary mt-1">Tap a star to get started</p>
              </div>

              {/* Interactive stars */}
              <div
                className="flex justify-center gap-3"
                role="radiogroup"
                aria-label="Star rating"
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hovered || rating);
                  const isBouncing = bouncingStar === star;
                  const fillDelay = isFilled
                    ? `${(star - 1) * 35}ms`
                    : `${(5 - star) * 35}ms`;

                  return (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => !rating && setHovered(star)}
                      onMouseLeave={() => !rating && setHovered(0)}
                      disabled={rating > 0}
                      className={cn(
                        "text-4xl min-w-[48px] min-h-[48px] flex items-center justify-center",
                        "transition-transform duration-150 select-none",
                        "active:scale-90",
                        !rating && "hover:scale-110 cursor-pointer",
                        rating > 0 && "cursor-default",
                        isBouncing && "animate-star-bounce"
                      )}
                    >
                      <span
                        className="inline-block transition-all duration-200"
                        style={{
                          filter: isFilled
                            ? "drop-shadow(0 0 6px rgba(251,191,36,0.55))"
                            : "grayscale(1)",
                          opacity: isFilled ? 1 : 0.35,
                          transitionDelay: fillDelay,
                        }}
                      >
                        ⭐
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Micro-text */}
              <div className="h-5">
                {showThanks ? (
                  <p
                    className="text-sm font-medium text-brand-success transition-opacity duration-300"
                    aria-live="polite"
                  >
                    ✓ Thanks! One more step...
                  </p>
                ) : rating > 0 ? (
                  <p className="text-sm text-text-secondary">{RATING_LABEL[rating]}</p>
                ) : null}
              </div>
            </div>
          )}

          {/* ── Step 2a: Testimonial form (happy path: 4–5 stars) ── */}
          {step === "testimonial" && (
            <div className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-5">
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
            </div>
          )}

          {/* ── Step 2b: Private feedback (unhappy path: 1–3 stars) ── */}
          {step === "feedback" && (
            <div className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-5">
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
            </div>
          )}

          {/* ── Step 3: Thank you ───────────────────────────────── */}
          {step === "thanks" && (
            <div className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-12 text-center space-y-6">
              <div
                className="mx-auto h-16 w-16 rounded-full bg-brand-success/10 border-2 border-brand-success/30 flex items-center justify-center animate-pop-in"
              >
                <Check className="h-8 w-8 text-brand-success" aria-hidden="true" />
              </div>

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
            </div>
          )}
        </div>
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
