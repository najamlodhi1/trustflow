import { PrismaClient, AiJobType, AiJobStatus, Channel, RequestStatus, Sentiment, TestimonialSource, WidgetType } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required for seeding')
const adapter = new PrismaPg({ connectionString })
const db = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding TrustFlow...')

  // ── Workspace ──────────────────────────────────────────────────────────────
  const workspace = await db.workspace.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'TrustFlow Demo',
      slug: 'demo',
      plan: 'PRO',
      brandVoice: {
        tone: 'professional',
        person: 'we',
        language: 'en',
        companyDescription:
          'TrustFlow is a SaaS platform that helps businesses collect testimonials, import reviews, and display social proof widgets on their websites.',
      },
      aiSettings: {
        autoEnrich: true,
        autoSuggest: true,
        responseTone: 'friendly',
        signOff: 'The TrustFlow Team',
        escalationEmail: 'support@trustflow.app',
      },
    },
  })

  // ── Owner user ─────────────────────────────────────────────────────────────
  const user = await db.user.upsert({
    where: { email: 'demo@trustflow.app' },
    update: {},
    create: {
      email: 'demo@trustflow.app',
      name: 'Demo User',
    },
  })

  await db.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: { workspaceId: workspace.id, userId: user.id, role: 'OWNER' },
  })

  // ── Customers ──────────────────────────────────────────────────────────────
  const customerData = [
    { name: 'Sarah Johnson', email: 'sarah@acmecorp.io', company: 'Acme Corp', tags: ['enterprise', 'power-user'] },
    { name: 'Mike Torres', email: 'mike@startupxyz.com', company: 'StartupXYZ', tags: ['startup', 'growth'] },
    { name: 'Anna Li', email: 'anna@designstudio.co', company: 'Design Studio', tags: ['agency', 'creative'] },
    { name: 'James Okafor', email: 'james@techventures.ng', company: 'Tech Ventures', tags: ['enterprise'] },
    { name: 'Emma Wilson', email: 'emma@ecommercehub.uk', company: 'eCommerce Hub', tags: ['ecommerce'] },
    { name: 'Luca Ferrari', email: 'luca@saasbuilder.it', company: 'SaaS Builder', tags: ['startup'] },
    { name: 'Priya Patel', email: 'priya@growthlab.in', company: 'Growth Lab', tags: ['growth', 'power-user'] },
    { name: 'David Kim', email: 'david@cloudfoundry.kr', company: 'Cloud Foundry', tags: ['enterprise'] },
  ]

  const customers = await Promise.all(
    customerData.map((c) =>
      db.customer.upsert({
        where: { workspaceId_email: { workspaceId: workspace.id, email: c.email } },
        update: {},
        create: { workspaceId: workspace.id, ...c },
      })
    )
  )

  // ── Testimonials ───────────────────────────────────────────────────────────
  const testimonialData = [
    {
      customerId: customers[0].id,
      rawText:
        'TrustFlow completely transformed how we collect and display customer feedback. The AI-generated summaries save us hours every week, and the widgets look stunning on our landing pages. Our conversion rate jumped 23% in the first month.',
      rating: 5,
      source: TestimonialSource.FORM,
      aiSummary: '"Conversion rate jumped 23% in the first month."',
      aiTone: ['enthusiastic', 'data-driven'],
      aiTopics: ['conversion', 'AI features', 'widgets', 'efficiency'],
      sentimentScore: 0.97,
      sentimentLabel: Sentiment.POSITIVE,
      isApproved: true,
      isFeatured: true,
      aiVariants: {
        landingPage: 'TrustFlow boosted our conversion rate by 23%—and the AI handles all the heavy lifting.',
        social: '23% conversion uplift in month one. TrustFlow is the real deal. 🚀',
      },
    },
    {
      customerId: customers[1].id,
      rawText:
        "We were spending 3 hours a week manually responding to Google reviews. TrustFlow's AI drafts responses in seconds. The quality is genuinely impressive—I barely edit them.",
      rating: 5,
      source: TestimonialSource.FORM,
      aiSummary: '"Saved 3 hours a week on review responses with AI."',
      aiTone: ['practical', 'impressed'],
      aiTopics: ['time-saving', 'AI responses', 'Google reviews'],
      sentimentScore: 0.91,
      sentimentLabel: Sentiment.POSITIVE,
      isApproved: true,
      isFeatured: false,
      aiVariants: {
        landingPage: 'Stop spending hours on review responses. TrustFlow\'s AI drafts them in seconds.',
        social: 'From 3 hours to 3 seconds per review response. TrustFlow changed the game.',
      },
    },
    {
      customerId: customers[2].id,
      rawText:
        'The wall of love widget is beautiful out of the box. Our clients always comment on how professional it looks. Setup took less than 10 minutes.',
      rating: 5,
      source: TestimonialSource.IMPORTED,
      aiSummary: '"Professional-looking widget, live in under 10 minutes."',
      aiTone: ['calm', 'appreciative'],
      aiTopics: ['design', 'widgets', 'ease of use'],
      sentimentScore: 0.88,
      sentimentLabel: Sentiment.POSITIVE,
      isApproved: true,
      isFeatured: false,
    },
    {
      customerId: customers[3].id,
      rawText:
        "Solid product. Does what it says. I wish the analytics were a bit deeper—would love cohort analysis—but for collecting and displaying reviews it's excellent.",
      rating: 4,
      source: TestimonialSource.FORM,
      aiSummary: '"Excellent for collecting and displaying reviews."',
      aiTone: ['balanced', 'constructive'],
      aiTopics: ['analytics', 'reviews', 'feature request'],
      sentimentScore: 0.62,
      sentimentLabel: Sentiment.POSITIVE,
      isApproved: true,
      isFeatured: false,
    },
    {
      customerId: customers[4].id,
      rawText:
        "The automated outreach campaigns are a game-changer for us. We used to chase customers individually for feedback—now TrustFlow handles it automatically and our testimonial count went from 12 to 87 in two months.",
      rating: 5,
      source: TestimonialSource.FORM,
      aiSummary: '"Testimonials grew from 12 to 87 in two months."',
      aiTone: ['enthusiastic', 'specific'],
      aiTopics: ['outreach', 'automation', 'growth'],
      sentimentScore: 0.96,
      sentimentLabel: Sentiment.POSITIVE,
      isApproved: true,
      isFeatured: true,
      aiVariants: {
        landingPage: 'Automated outreach took us from 12 to 87 testimonials in 60 days.',
        social: '12 → 87 testimonials in 2 months. Automated outreach works.',
      },
    },
    {
      customerId: customers[5].id,
      rawText:
        "I had some trouble with the initial Google Reviews import—took a few back-and-forth with support to sort out. Once it was working though, the sync is flawless.",
      rating: 3,
      source: TestimonialSource.FORM,
      aiSummary: '"Sync works flawlessly once configured."',
      aiTone: ['mixed', 'fair'],
      aiTopics: ['Google import', 'support', 'onboarding'],
      sentimentScore: 0.1,
      sentimentLabel: Sentiment.NEUTRAL,
      isApproved: false,
      isFeatured: false,
    },
    {
      customerId: customers[6].id,
      rawText:
        "TrustFlow's AI suggestions are spookily good. It recommended a specific quote combination for our pricing page and I was skeptical—but after A/B testing, the variant with TrustFlow's suggestion won with p<0.01.",
      rating: 5,
      source: TestimonialSource.FORM,
      aiSummary: '"AI suggestions won an A/B test with p<0.01."',
      aiTone: ['data-driven', 'enthusiastic', 'analytical'],
      aiTopics: ['AI suggestions', 'A/B testing', 'pricing page', 'conversion'],
      sentimentScore: 0.98,
      sentimentLabel: Sentiment.POSITIVE,
      isApproved: true,
      isFeatured: true,
      aiVariants: {
        landingPage: "Our AI-suggested quote combination won an A/B test—Priya's words, not ours.",
        social: "TrustFlow's AI picked the winning quote for our pricing page. A/B test confirmed it. 📊",
      },
    },
    {
      customerId: customers[7].id,
      rawText:
        'We evaluated four testimonial tools before choosing TrustFlow. The AI enrichment—especially sentiment analysis and auto-tagging—is miles ahead of the competition. Worth every penny.',
      rating: 5,
      source: TestimonialSource.FORM,
      aiSummary: '"AI enrichment is miles ahead of the competition."',
      aiTone: ['comparative', 'confident'],
      aiTopics: ['sentiment analysis', 'AI enrichment', 'competitive advantage'],
      sentimentScore: 0.94,
      sentimentLabel: Sentiment.POSITIVE,
      isApproved: true,
      isFeatured: false,
    },
  ]

  const testimonials = await Promise.all(
    testimonialData.map((t) =>
      db.testimonial.create({
        data: { workspaceId: workspace.id, ...t },
      })
    )
  )

  // ── Prompt Templates ───────────────────────────────────────────────────────
  await db.promptTemplate.create({
    data: {
      workspaceId: workspace.id,
      name: 'Friendly Outreach',
      type: AiJobType.OUTREACH_DRAFT,
      isDefault: true,
      template: `You are writing a testimonial request email on behalf of {{companyName}}.

Customer: {{customerName}} ({{customerEmail}})
Company they work for: {{customerCompany}}
Context: {{aiContext}}
Brand voice: {{brandVoice}}

Write 2 email variants asking for a testimonial. Be genuine, brief (under 100 words each), and make it easy to say yes. Include a clear call-to-action. Do not invent claims about the product.

Return JSON: { "variants": [{ "subject": "...", "body": "..." }, ...] }`,
    },
  })

  await db.promptTemplate.create({
    data: {
      workspaceId: workspace.id,
      name: 'Testimonial Enricher',
      type: AiJobType.TESTIMONIAL_ENRICH,
      isDefault: true,
      template: `Analyze this testimonial for a SaaS company.

Company: {{companyDescription}}
Testimonial: {{rawText}}
Rating: {{rating}}/5

Extract:
1. A short hero quote (max 15 words) — the single most powerful sentence
2. Sentiment score (-1.0 to 1.0)
3. Sentiment label (POSITIVE | NEUTRAL | NEGATIVE)
4. 3-5 topic tags (lowercase, relevant to SaaS: "onboarding", "support", "AI features", etc.)
5. Tone tags (1-3 from: enthusiastic, calm, analytical, practical, impressed, data-driven, constructive)
6. A landing-page variant (max 20 words, conversion-focused)
7. A social media variant (max 20 words, shareable)

Return JSON: { "aiSummary": "...", "sentimentScore": 0.0, "sentimentLabel": "POSITIVE", "aiTopics": [], "aiTone": [], "variants": { "landingPage": "...", "social": "..." } }`,
    },
  })

  await db.promptTemplate.create({
    data: {
      workspaceId: workspace.id,
      name: 'Review Response',
      type: AiJobType.REVIEW_RESPONSE_DRAFT,
      isDefault: true,
      template: `Draft a response to this customer review on behalf of {{companyName}}.

Review: {{rawText}}
Rating: {{rating}}/5
Sentiment: {{sentimentLabel}}
Brand voice: {{brandVoice}}
Sign-off: {{signOff}}

Guidelines:
- Positive (4-5★): Thank warmly, reinforce the specific value mentioned, invite them to share.
- Neutral (3★): Acknowledge feedback, highlight the positive, gently address the concern.
- Negative (1-2★): Apologise sincerely, do NOT make excuses, offer to resolve privately (include support email {{escalationEmail}}), never argue.

Keep it under 80 words. Do not invent facts.

Return JSON: { "response": "..." }`,
    },
  })

  // ── AI Jobs (enrichment records) ───────────────────────────────────────────
  await Promise.all(
    testimonials.slice(0, 5).map((t) =>
      db.aiJob.create({
        data: {
          workspaceId: workspace.id,
          testimonialId: t.id,
          type: AiJobType.TESTIMONIAL_ENRICH,
          status: AiJobStatus.SUCCEEDED,
          input: { testimonialId: t.id },
          output: { aiSummary: t.aiSummary, sentimentScore: t.sentimentScore },
          durationMs: Math.floor(Math.random() * 1800) + 400,
        },
      })
    )
  )

  // ── AI Asset Suggestion ────────────────────────────────────────────────────
  await db.aiJob.create({
    data: {
      workspaceId: workspace.id,
      type: AiJobType.SUGGESTED_ASSET,
      status: AiJobStatus.SUCCEEDED,
      input: { targetPage: 'homepage' },
      output: {
        targetPage: 'homepage',
        headline: 'Trusted by growth teams worldwide',
        subheadline: 'Real results, real customers — no cherry-picking.',
        quotes: [
          { testimonialId: testimonials[0].id, variant: 'original' },
          { testimonialId: testimonials[4].id, variant: 'landingPage' },
          { testimonialId: testimonials[6].id, variant: 'original' },
        ],
      },
      durationMs: 2341,
    },
  })

  await db.aiJob.create({
    data: {
      workspaceId: workspace.id,
      type: AiJobType.SUGGESTED_ASSET,
      status: AiJobStatus.SUCCEEDED,
      input: { targetPage: 'pricing' },
      output: {
        targetPage: 'pricing',
        headline: 'Worth every penny — our customers agree',
        subheadline: 'See why teams choose TrustFlow over the alternatives.',
        quotes: [
          { testimonialId: testimonials[7].id, variant: 'original' },
          { testimonialId: testimonials[6].id, variant: 'landingPage' },
          { testimonialId: testimonials[1].id, variant: 'landingPage' },
        ],
      },
      durationMs: 1987,
    },
  })

  // ── Widget ─────────────────────────────────────────────────────────────────
  await db.widget.create({
    data: {
      workspaceId: workspace.id,
      name: 'Homepage Wall of Love',
      type: WidgetType.WALL_OF_LOVE,
      published: true,
      config: {
        theme: 'dark',
        columns: 3,
        maxItems: 9,
        filters: { minRating: 4, onlyApproved: true },
        showAvatar: true,
        showRating: true,
        showCompany: true,
      },
    },
  })

  await db.widget.create({
    data: {
      workspaceId: workspace.id,
      name: 'Pricing Page Carousel',
      type: WidgetType.CAROUSEL,
      published: false,
      config: {
        theme: 'dark',
        autoplay: true,
        interval: 4000,
        filters: { topics: ['conversion', 'pricing page'], onlyFeatured: true },
      },
    },
  })

  // ── Testimonial Requests ───────────────────────────────────────────────────
  await db.testimonialRequest.create({
    data: {
      workspaceId: workspace.id,
      customerId: customers[5].id,
      channel: Channel.EMAIL,
      status: RequestStatus.SENT,
      subject: 'Quick question about your TrustFlow experience',
      body: "Hi Luca,\n\nHope things are going well at SaaS Builder! We noticed you've been using TrustFlow for a couple of months now — we'd love to hear how it's been going.\n\nWould you be open to leaving a short testimonial? It takes less than 2 minutes and really helps us.\n\nThanks so much,\nThe TrustFlow Team",
      sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      aiContext: 'Post-onboarding, 2 months after signup',
    },
  })

  console.log(`✅ Seed complete.`)
  console.log(`   Workspace: ${workspace.slug} (id: ${workspace.id})`)
  console.log(`   Customers: ${customers.length}`)
  console.log(`   Testimonials: ${testimonials.length}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
