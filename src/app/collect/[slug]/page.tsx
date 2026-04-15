"use client";

import { useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { StarRating } from "@/components/ui/StarRating";
import { scaleIn, staggerContainer, fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4 | 5;

const PROMPTS = [
  "What problem were you trying to solve before working with us?",
  "What specific results did you achieve?",
  "Would you recommend us, and why?",
];

export default function CollectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [step, setStep] = useState<Step>(1);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [polishedText, setPolishedText] = useState<string | null>(null);
  const [polishing, setPolishing] = useState(false);
  const [usePolished, setUsePolished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handlePolish() {
    setPolishing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setPolishing(false);
    setPolishedText(
      "Working with this team was truly transformative for our business. The expertise and dedication they brought to every interaction exceeded our highest expectations. The results we achieved in such a short time were nothing short of remarkable, and I would recommend them wholeheartedly to anyone looking for exceptional quality and real outcomes."
    );
    setStep(4);
  }

  async function handleSubmit() {
    if (!name || !email || !text) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setStep(5);
  }

  const canProceedStep2 = text.length >= 20;

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

      {/* Progress dots */}
      {step < 5 && (
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                s === step ? "w-6 bg-brand-primary" : s < step ? "w-2 bg-indigo-500/60" : "w-2 bg-bg-overlay"
              )}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {/* Step 1: Rating */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 text-center space-y-8"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary">How would you rate your experience?</h2>
                <p className="text-sm text-text-secondary mt-1">Tap a star to get started</p>
              </div>

              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setRating(star);
                      setTimeout(() => setStep(2), 300);
                    }}
                    className="text-4xl transition-all duration-150"
                    aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                  >
                    <span className={cn(
                      "transition-all duration-150",
                      star <= rating ? "filter-none" : "grayscale opacity-40"
                    )}>
                      ⭐
                    </span>
                  </motion.button>
                ))}
              </div>

              {rating > 0 && (
                <p className="text-sm text-text-secondary animate-pulse">
                  {rating <= 2 ? "We're sorry to hear that..." : rating <= 3 ? "Thanks for your honest feedback!" : rating <= 4 ? "That's great!" : "Amazing! 🎉"}
                </p>
              )}
            </motion.div>
          )}

          {/* Step 2: Write testimonial */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-6"
            >
              <div>
                <div className="flex justify-center mb-2">
                  <StarRating value={rating} size="lg" readonly />
                </div>
                <h2 className="text-xl font-bold text-text-primary text-center">We&apos;d love to hear more!</h2>
                <p className="text-sm text-text-secondary text-center mt-1">Here are some prompts to help:</p>
              </div>

              <ul className="space-y-2">
                {PROMPTS.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-brand-primary mt-0.5 flex-shrink-0">•</span>
                    {p}
                  </li>
                ))}
              </ul>

              <Textarea
                placeholder="Your testimonial..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                charCount={{ current: text.length, max: 500 }}
              />

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Continue
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Sparkles className="h-4 w-4 text-indigo-400" />}
                  onClick={handlePolish}
                  disabled={!canProceedStep2}
                >
                  AI Enhance
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Your details */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-text-primary">Your details</h2>
                <p className="text-sm text-text-secondary mt-1">Help readers know who this is from</p>
              </div>

              <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
                <motion.div variants={fadeUp}>
                  <Input
                    label="Your name"
                    placeholder="Sarah Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </motion.div>
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
                  <Input
                    label="Job title (optional)"
                    placeholder="CEO"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    label="Company (optional)"
                    placeholder="TechCorp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input
                    type="email"
                    label="Email (private, not displayed)"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    helperText="Used to verify your submission only"
                  />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon={<Upload className="h-4 w-4" />}
                    className="w-full"
                  >
                    Upload photo (optional)
                  </Button>
                </motion.div>
              </motion.div>

              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={!name || !email}
                loading={submitting}
                onClick={handleSubmit}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Submit testimonial
              </Button>
            </motion.div>
          )}

          {/* Step 4: AI Polish review */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={scaleIn}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-8 space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-xl font-bold text-text-primary">AI Enhanced version</h2>
                </div>
                <p className="text-sm text-text-secondary">Review the polished version of your testimonial</p>
              </div>

              {polishing ? (
                <div className="py-8 text-center space-y-3">
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-text-secondary">Enhancing your testimonial...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-[var(--radius-md)] bg-bg-elevated border border-[var(--border-subtle)] p-4">
                    <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide mb-2">Original</p>
                    <p className="text-sm text-text-secondary leading-relaxed">&ldquo;{text}&rdquo;</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] bg-indigo-500/5 border border-indigo-500/20 p-4">
                    <p className="text-xs font-medium text-indigo-400 uppercase tracking-wide mb-2">Enhanced</p>
                    <p className="text-sm text-text-primary leading-relaxed">&ldquo;{polishedText}&rdquo;</p>
                  </div>
                </div>
              )}

              {!polishing && polishedText && (
                <div className="flex gap-3">
                  <Button
                    variant="gradient"
                    size="md"
                    className="flex-1"
                    onClick={() => { setUsePolished(true); setStep(3); }}
                  >
                    ✓ Use enhanced version
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setStep(3)}
                  >
                    Keep my original
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 5: Thank you */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-bg-surface rounded-[var(--radius-xl)] border border-[var(--border-subtle)] p-12 text-center space-y-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mx-auto h-16 w-16 rounded-full bg-brand-success/10 border-2 border-brand-success/30 flex items-center justify-center"
              >
                <Check className="h-8 w-8 text-brand-success" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  Thank you{name ? `, ${name.split(" ")[0]}` : ""}!
                </h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed max-w-xs mx-auto">
                  Your testimonial has been submitted and is awaiting approval. We really appreciate your feedback.
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-text-tertiary">Want to help us spread the word?</p>
                <div className="flex justify-center gap-2 mt-3">
                  <Button variant="secondary" size="sm">Share on Twitter</Button>
                  <Button variant="ghost" size="sm">Close</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TrustFlow badge */}
      <p className="mt-8 text-[10px] text-text-tertiary">
        Powered by{" "}
        <a href="/" className="text-brand-primary hover:underline">TrustFlow</a>
      </p>
    </div>
  );
}
