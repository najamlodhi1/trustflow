import { create } from "zustand";
import { SEED_TESTIMONIALS, SEED_AI_SUGGESTIONS, SEED_CAMPAIGNS } from "./constants";

// ── Types ────────────────────────────────────────────────────────────────────

export type SentimentLabel = "positive" | "neutral" | "negative";
export type TestimonialStatus = "pending" | "approved" | "rejected";
export type SuggestionStatus = "pending" | "accepted" | "rejected";

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  rating: number;
  text: string;
  source: string;
  date: string;
  tags: readonly string[];
  status: TestimonialStatus;
  featured: boolean;
  aiSummary?: string;
  aiTone?: readonly string[];
  aiTopics?: readonly string[];
  sentimentScore?: number;
  sentimentLabel?: SentimentLabel;
  aiVariants?: { landingPage: string; social: string };
}

export interface Suggestion {
  id: string;
  type: "landing_section" | "hero_quote" | "social_snippet";
  targetPage: string;
  headline: string;
  subheadline: string;
  quotes: Array<{ testimonialId: string; variant: string; preview: string }>;
  status: SuggestionStatus;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: "active" | "draft" | "completed";
  sentCount: number;
  openedCount: number;
  completedCount: number;
  customers: Array<{ id: string; name: string; email: string; company: string; responded: boolean }>;
  createdAt: string;
}

// ── Store ─────────────────────────────────────────────────────────────────────

interface AppStore {
  // Testimonials
  testimonials: Testimonial[];
  updateTestimonialStatus: (id: string, status: TestimonialStatus) => void;
  toggleFeatured: (id: string) => void;

  // Suggestions
  suggestions: Suggestion[];
  acceptSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;

  // Campaigns
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // ── Testimonials ──────────────────────────────────────────────────────────
  testimonials: SEED_TESTIMONIALS.map((t) => ({ ...t })) as unknown as Testimonial[],

  updateTestimonialStatus: (id, status) =>
    set((s) => ({
      testimonials: s.testimonials.map((t) => t.id === id ? { ...t, status } : t),
    })),

  toggleFeatured: (id) =>
    set((s) => ({
      testimonials: s.testimonials.map((t) => t.id === id ? { ...t, featured: !t.featured } : t),
    })),

  // ── Suggestions ───────────────────────────────────────────────────────────
  suggestions: SEED_AI_SUGGESTIONS.map((s) => ({ ...s })) as unknown as Suggestion[],

  acceptSuggestion: (id) =>
    set((s) => ({
      suggestions: s.suggestions.map((sg) => sg.id === id ? { ...sg, status: "accepted" as const } : sg),
    })),

  rejectSuggestion: (id) => {
    const current = get().suggestions.find((s) => s.id === id);
    const next: SuggestionStatus = current?.status === "accepted" ? "pending"
      : current?.status === "rejected" ? "pending"
      : "rejected";
    set((s) => ({
      suggestions: s.suggestions.map((sg) => sg.id === id ? { ...sg, status: next } : sg),
    }));
  },

  // ── Campaigns ─────────────────────────────────────────────────────────────
  campaigns: SEED_CAMPAIGNS.map((c) => ({ ...c })) as unknown as Campaign[],

  addCampaign: (campaign) =>
    set((s) => ({ campaigns: [campaign, ...s.campaigns] })),
}));
