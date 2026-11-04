/**
 * Customer-facing copy for the three promotion pages. Every price, date, and
 * credit figure is interpolated from ./offer and the verified plan data, so the
 * words can never disagree with the terms. Writing rules match the rest of the
 * site: no em dashes or emoji, at most two sentences per paragraph, Initial
 * Caps on the H1, every button label and every FAQ question, sentence case
 * elsewhere. The offer is never described as a percentage off, and nothing
 * suggests the first-year price or the doubled credits continue past year one.
 */
import type { FaqItem } from '../config/faq'
import type { ProductSectionCopy } from '../config/copy'
import { PRIMARY_CTA_LABEL } from '../config/site'
import { formatCount, formatUsd } from '../pricing/price'
import { AGENCY_PLAN, BUSINESS_PLAN, LEGIIT_BUCKS_PERCENT } from '../pricing/plans'
import { BUCKS_DEPOSIT, CREDITS, FIRST_YEAR, OFFER_WINDOW, PROMO_PAGES, PROMO_ROUTES, bucksTotal, extraCreditsFirstYear, firstYearSaving, type FirstYearOffer } from './offer'
import type { OfferStatus } from './status'

const money = formatUsd
const count = formatCount
const ENDS = OFFER_WINDOW.endsAtLabel
const OPENS = OFFER_WINDOW.opensLabel

export interface ProblemItem {
  problem: string
  solution: string
}

export interface PromoPageCopy {
  page: 'business' | 'agency'
  offer: FirstYearOffer
  meta: { title: string; description: string }
  eyebrow: string
  h1Line1: string
  h1Line2: string
  subhead: string
  /** Button labels: while the offer is live, and the regular route otherwise. */
  cta: { live: string; liveHeader: string; fallback: string; fallbackHeader: string }
  /** The line under the hero button, by offer state. */
  heroNote: Record<OfferStatus, string>
  /** The one-line route to the other plan's page. */
  switchPlan: { before: string; linkLabel: string; after: string; href: string }
  problem: { eyebrow: string; title: string; lead: string; items: ProblemItem[] }
  features: ProductSectionCopy[]
  demo: { eyebrow: string; title: string; body: string }
  pricing: { eyebrow: string; title: string; expiredTitle: string; included: string[]; afterYearOne: string; creditsNote: string }
  faq: { eyebrow: string; title: string; items: FaqItem[] }
  final: { title: string; body: string }
}

/** The status strip at the top of every promotion page. */
export function statusBanner(status: OfferStatus, kind: 'command-center' | 'legiit-bucks'): string {
  const name = kind === 'command-center' ? 'Black Friday offer' : 'Legiit Bucks deposit bonus'
  switch (status) {
    case 'upcoming':
      return `${name}: opens ${OPENS}.`
    case 'pending':
      return `${name}: not yet available at checkout.`
    case 'live':
      return `${name}: ends ${ENDS}.`
    case 'expired':
      return kind === 'command-center' ? `The ${name} ended ${OFFER_WINDOW.endsShortLabel}, 2026. Regular prices apply.` : `The ${name} ended ${OFFER_WINDOW.endsShortLabel}, 2026.`
  }
}

/** The sentence every page uses for the deadline. One wording, everywhere. */
export const DEADLINE_SENTENCE = `Offer ends ${ENDS}.`

/** The renewal sentence: the introductory price and the doubled credits end with year one. */
export function afterYearOne(offer: FirstYearOffer): string {
  return `After the first 12 months the plan renews at the regular annual price, currently ${money(offer.regularAnnualPrice)}, with the standard ${count(CREDITS.standardMonthly)} AI credits a month.`
}

export function creditsNote(): string {
  return `${count(CREDITS.offerMonthly)} AI credits are allocated at the start of each of your first ${CREDITS.offerMonths} months, instead of the standard ${count(CREDITS.standardMonthly)}. They arrive month by month, not all at once.`
}

/** The first-year price line, e.g. "$399 for your first year, billed annually." */
export function firstYearLine(offer: FirstYearOffer): string {
  return `${money(offer.firstYearPrice)} for your first year, billed annually.`
}

export function regularPriceLine(offer: FirstYearOffer): string {
  return `Regular annual price ${money(offer.regularAnnualPrice)}, so you keep ${money(firstYearSaving(offer))} in year one.`
}

/** What the plan costs once the offer has ended, from the verified plan data. */
export function regularTermsLine(offer: FirstYearOffer): string {
  return `${offer.planName} is ${money(offer.regularMonthlyPrice)}/month billed monthly, or ${money(offer.regularAnnualPrice)} a year billed annually.`
}

const CONTACT_FAQ: FaqItem = {
  id: 'contact',
  question: 'Who Can I Ask Before I Buy?',
  answer: ['Email help@legiit.com or visit the Legiit support center.'],
  links: [
    { text: 'help@legiit.com', href: PROMO_ROUTES.contactEmail },
    { text: 'Legiit support center', href: PROMO_ROUTES.support },
  ],
}

const sharedFaq = (offer: FirstYearOffer): FaqItem[] => [
  {
    id: 'credits-monthly',
    question: 'Are The Credits Delivered All At Once?',
    answer: [`No. You receive ${count(CREDITS.offerMonthly)} AI credits each month for your first ${CREDITS.offerMonths} months, the plan's usual monthly allocation doubled.`],
  },
  {
    id: 'after-year-one',
    question: 'What Happens After The First Year?',
    answer: [afterYearOne(offer), 'You can review or stop renewal from Active Subscriptions in your Legiit account.'],
    links: [{ text: 'Active Subscriptions', href: PROMO_ROUTES.activeSubscriptions }],
  },
  {
    id: 'monthly',
    question: 'Can I Pay Monthly Instead?',
    answer: [`The offer applies to annual billing only. ${offer.planName} is still available at ${money(offer.regularMonthlyPrice)}/month billed monthly, without the first-year price or the doubled credits.`],
  },
  {
    id: 'services',
    question: 'Are Freelance Services Included?',
    answer: [`No. Services from Legiit freelancers are purchased separately, and both paid plans give you ${LEGIIT_BUCKS_PERCENT}% back in Legiit Bucks on completed orders.`],
  },
  {
    id: 'ends',
    question: 'When Does The Offer End?',
    answer: [`${ENDS}. After that, ${regularTermsLine(offer).charAt(0).toLowerCase()}${regularTermsLine(offer).slice(1)}`],
  },
  CONTACT_FAQ,
]

/** The FAQ once the offer has ended: regular prices and plan facts only, from the verified plan data. */
const regularFaq = (offer: FirstYearOffer, page: 'business' | 'agency'): FaqItem[] => [
  {
    id: 'cost',
    question: `What Does ${offer.planName} Cost?`,
    answer: [regularTermsLine(offer), `Each additional business is ${money(BUSINESS_PLAN.additionalBusinessMonthly)}/month on either plan.`],
  },
  page === 'business'
    ? {
        id: 'trial',
        question: 'Is There A Free Trial?',
        answer: [`Yes. Business has a ${BUSINESS_PLAN.trialDays}-day free trial; select ${PRIMARY_CTA_LABEL} to start it.`],
      }
    : {
        id: 'agency-trial',
        question: 'Is There A Free Trial For Agency?',
        answer: [`No, the ${BUSINESS_PLAN.trialDays}-day free trial is for the Business plan. Business can upgrade to Agency when you need more businesses.`],
        links: [{ text: 'Business plan', href: PROMO_PAGES.business }],
      },
  {
    id: 'businesses',
    question: page === 'business' ? 'How Many Businesses Does Business Include?' : 'How Many Businesses Does Agency Include?',
    answer: [page === 'business' ? `One business is included, and the Agency plan includes up to ${AGENCY_PLAN.businessesIncluded}.` : `Up to ${AGENCY_PLAN.businessesIncluded} businesses are included, and businesses beyond that are ${money(AGENCY_PLAN.additionalBusinessMonthly)}/month each.`],
    links: page === 'business' ? [{ text: 'Agency plan', href: PROMO_PAGES.agency }] : undefined,
  },
  {
    id: 'renewal',
    question: 'How Do I Manage My Subscription?',
    answer: ['You can review or stop renewal from Active Subscriptions in your Legiit account.'],
    links: [{ text: 'Active Subscriptions', href: PROMO_ROUTES.activeSubscriptions }],
  },
  {
    id: 'services',
    question: 'Are Freelance Services Included?',
    answer: [`No. Services from Legiit freelancers are purchased separately, and both paid plans give you ${LEGIIT_BUCKS_PERCENT}% back in Legiit Bucks on completed orders.`],
  },
  CONTACT_FAQ,
]

const businessOffer = FIRST_YEAR.business
const agencyOffer = FIRST_YEAR.agency

/** The Business page copy. `showOffer` is false once the offer has expired: every mention of the first-year price and the doubled credits then drops out. */
export function businessPage(showOffer: boolean): PromoPageCopy {
  return {
  page: 'business',
  offer: businessOffer,
  meta: {
    title: showOffer ? `Command Center Black Friday Offer | ${money(businessOffer.firstYearPrice)} First Year For Business Owners | Legiit` : 'Command Center For Business Owners | Legiit',
    description: showOffer
      ? `Get the Command Center Business plan for ${money(businessOffer.firstYearPrice)} for your first year, billed annually, with ${count(CREDITS.offerMonthly)} AI credits a month for 12 months. ${DEADLINE_SENTENCE}`
      : 'Command Center shows business owners the next move, helps create the work with AI, and connects them to Legiit specialists. Business plan from $49/month.',
  },
  eyebrow: showOffer ? 'Black Friday offer for business owners' : 'Command Center for business owners',
  h1Line1: 'Stop Guessing What To Work On.',
  h1Line2: showOffer ? `${money(businessOffer.firstYearPrice)} For Your First Year.` : 'Business Plan.',
  subhead: `Command Center shows you the next move for your business, helps you create the work with AI, and connects you to a Legiit specialist when you want it done for you.${showOffer ? ` Business plan, billed annually, with ${count(CREDITS.offerMonthly)} AI credits every month for your first ${CREDITS.offerMonths} months.` : ''}`,
  cta: { live: `Get Business For ${money(businessOffer.firstYearPrice)}`, liveHeader: 'Claim The Offer', fallback: 'Start My 7-Day Free Trial', fallbackHeader: 'Start Free Trial' },
  heroNote: {
    upcoming: `The ${money(businessOffer.firstYearPrice)} first-year price opens ${OPENS}. Until then, start with the ${BUSINESS_PLAN.trialDays}-day free trial.`,
    pending: `The ${money(businessOffer.firstYearPrice)} first-year price is not yet available at checkout. Start with the ${BUSINESS_PLAN.trialDays}-day free trial and check back soon.`,
    live: `${firstYearLine(businessOffer)} ${DEADLINE_SENTENCE}`,
    expired: `This offer ended ${OFFER_WINDOW.endsShortLabel}, 2026. ${regularTermsLine(businessOffer)}`,
  },
  switchPlan: {
    before: 'Running several businesses or client accounts? ',
    linkLabel: showOffer ? 'See the Agency offer' : 'See the Agency plan',
    after: showOffer ? `: ${money(agencyOffer.firstYearPrice)} for the first year, up to ${agencyOffer.businessesIncluded} businesses.` : `: up to ${agencyOffer.businessesIncluded} businesses in one workspace.`,
    href: PROMO_PAGES.agency,
  },
  problem: {
    eyebrow: 'The problem, and what changes',
    title: 'You know something needs doing. You just don’t know what first.',
    lead: 'Most owners are not short of ideas. They are short of a clear next step, the time to produce it, and someone to hand it to.',
    items: [
      {
        problem: 'Monday brings a dozen things you could do for the business and no way to tell which one matters.',
        solution: 'Do This Next gives you one recommendation at a time, with the reason and the expected impact, so you start with the move that counts.',
      },
      {
        problem: 'Writing the page, the post, or the brief takes a whole evening, so it waits another week.',
        solution: 'Lara and the content tools start from your offers, customers, and brand voice, so you edit a draft instead of staring at a blank page.',
      },
      {
        problem: 'When a job needs a specialist, finding one means another round of searching and vetting.',
        solution: 'Relevant Legiit services appear beside the task, and you choose who to hire. Services are purchased separately.',
      },
    ],
  },
  features: [
    {
      id: 'next-move',
      label: '01 · Know your next move',
      title: 'See where your business stands and what to do first.',
      paragraphs: [
        'Command Center builds your business context from your website: offers, customers, brand voice, competitors, and focus keywords. Your numbers, your backlink data, and your local search presence sit in one overview.',
        'Do This Next turns what it finds into a single recommended action, with the reason and the expected impact. Do it yourself, do it with Lara, or mark it done.',
      ],
      bullets: ['Editable business context built from your website', 'One recommended next action, with the reason', 'SEO, local search, competitor, and performance data in one place'],
      media: [{ screen: 'priorities', caption: 'Actual screen: a Do This Next recommendation with its reason and the Do it with Lara option.' }],
      mediaSide: 'right',
      tinted: false,
    },
    {
      id: 'get-started',
      label: '02 · Get the work started',
      title: 'Turn the next step into a draft you can finish.',
      paragraphs: [
        'Turn a topic into an article draft, build a brief for a writer, or create social captions and images, all connected to what your business sells and how it sounds. Research the questions customers ask and see how AI assistants answer them today.',
        showOffer
          ? `For your first ${CREDITS.offerMonths} months on this offer you have ${count(CREDITS.offerMonthly)} AI credits a month, twice the standard allocation, for drafts, briefs, and research. The credits arrive monthly, not all at once.`
          : `Each month you have ${count(CREDITS.standardMonthly)} AI credits for drafts, briefs, and research. Open the editor to build a draft out, refine it with AI, and save your work.`,
      ],
      bullets: ['Articles, landing-page starters, briefs, and social captions', 'Customer questions, direct answers, and AI visibility checks', showOffer ? `${count(CREDITS.offerMonthly)} AI credits a month for ${CREDITS.offerMonths} months on this offer` : `${count(CREDITS.standardMonthly)} AI credits each month`],
      media: [{ screen: 'brief-builder', caption: 'Actual screen: Brief Builder at step 1, before a keyword has been chosen.' }],
      mediaSide: 'left',
      tinted: true,
    },
    {
      id: 'expert-help',
      label: '03 · Get expert help to finish it',
      title: 'Hand the work to a specialist when you want it done for you.',
      paragraphs: [
        'When a task needs a professional, Command Center points to relevant Legiit freelancers right where the need shows up. You choose who to hire, and the order stays connected to your business.',
        'Tasks hold what you decided to do, orders track the work you bought, and reports keep a record of progress. Open the same workspace tomorrow and pick up where you left off.',
      ],
      bullets: ['Relevant services beside the task that needs them', 'Tasks, orders, and reports in one workspace', 'Connected analytics once your accounts are linked'],
      note: 'Freelance services are purchased separately.',
      media: [
        { screen: 'specialist-help', caption: 'Actual screen: backlink data with a Browse Backlink Services action.' },
        { screen: 'services', caption: 'Actual screen: a recommended service, alongside your business tools.' },
      ],
      mediaSide: 'right',
      tinted: false,
    },
  ],
  demo: {
    eyebrow: 'See it work',
    title: 'Command Center in 42 seconds.',
    body: 'The actual product, screen by screen: where your business stands, what to do next, the content tools, and specialist help.',
  },
  pricing: {
    eyebrow: 'The Black Friday offer',
    title: `Business for ${money(businessOffer.firstYearPrice)} for your first year.`,
    expiredTitle: 'Business plan pricing.',
    included: [`${BUSINESS_PLAN.businessesIncluded} business included`, 'Full business dashboard access', `${BUSINESS_PLAN.allowances.audits} Audits, ${BUSINESS_PLAN.allowances.keywords} Keywords, ${BUSINESS_PLAN.allowances.backlinkData} Backlink Data`, `Additional businesses at ${money(BUSINESS_PLAN.additionalBusinessMonthly)}/month each`, 'Support included'],
    afterYearOne: afterYearOne(businessOffer),
    creditsNote: creditsNote(),
  },
  faq: {
    eyebrow: 'Before you buy',
    title: showOffer ? 'Offer questions, answered.' : 'Questions, answered.',
    items: showOffer
      ? [
          {
            id: 'what-is-it',
            question: 'What Exactly Is The Black Friday Offer?',
            answer: [
              `${money(businessOffer.firstYearPrice)} for your first year of the Business plan, billed annually at purchase, instead of the regular annual price of ${money(businessOffer.regularAnnualPrice)}. It also includes ${count(CREDITS.offerMonthly)} AI credits a month for your first ${CREDITS.offerMonths} months instead of the standard ${count(CREDITS.standardMonthly)}.`,
            ],
          },
          ...sharedFaq(businessOffer).slice(0, 3),
          {
            id: 'trial',
            question: 'Is There Still A Free Trial?',
            answer: [`Yes. You can start the ${BUSINESS_PLAN.trialDays}-day Business trial first; to get the first-year price, complete the annual purchase before the offer ends on ${ENDS}.`],
          },
          {
            id: 'businesses',
            question: 'How Many Businesses Does Business Include?',
            answer: [`One business is included, and additional businesses are ${money(BUSINESS_PLAN.additionalBusinessMonthly)}/month each. The Agency plan includes up to ${AGENCY_PLAN.businessesIncluded} businesses and has its own first-year offer.`],
            links: [{ text: 'its own first-year offer', href: PROMO_PAGES.agency }],
          },
          ...sharedFaq(businessOffer).slice(3),
        ]
      : regularFaq(businessOffer, 'business'),
  },
  final: {
    title: 'Make this the year the work gets done.',
    body: showOffer ? `One business, one clear next step every week, and ${count(CREDITS.offerMonthly)} AI credits a month to produce it. ${firstYearLine(businessOffer)}` : 'One business, one clear next step every week, and the tools to produce it.',
  },
  }
}

const perBusinessYear = Math.round((agencyOffer.firstYearPrice / agencyOffer.businessesIncluded) * 100) / 100
const perBusinessMonth = Math.round((agencyOffer.firstYearPrice / agencyOffer.businessesIncluded / 12) * 100) / 100

/** The Agency page copy; see businessPage for `showOffer`. */
export function agencyPage(showOffer: boolean): PromoPageCopy {
  return {
  page: 'agency',
  offer: agencyOffer,
  meta: {
    title: showOffer ? `Command Center Black Friday Offer | ${money(agencyOffer.firstYearPrice)} First Year For Agencies | Legiit` : 'Command Center For Agencies | Legiit',
    description: showOffer
      ? `Get the Command Center Agency plan for ${money(agencyOffer.firstYearPrice)} for your first year, billed annually, for up to ${agencyOffer.businessesIncluded} businesses with ${count(CREDITS.offerMonthly)} AI credits a month for 12 months. ${DEADLINE_SENTENCE}`
      : `Run up to ${agencyOffer.businessesIncluded} client businesses in one Command Center, with a recommended next step for each and Legiit specialists to fulfil the work. Agency plan from $169/month.`,
  },
  eyebrow: showOffer ? 'Black Friday offer for agencies' : 'Command Center for agencies',
  h1Line1: `Every Client’s Next Move, Every Week.`,
  h1Line2: showOffer ? `${money(agencyOffer.firstYearPrice)} For Your First Year.` : 'Agency Plan.',
  subhead: `Run up to ${agencyOffer.businessesIncluded} client businesses in one Command Center: a recommended next step for each, AI tools to produce the work, and Legiit specialists to fulfil it.${showOffer ? ` Agency plan, billed annually, with ${count(CREDITS.offerMonthly)} AI credits every month for your first ${CREDITS.offerMonths} months.` : ''}`,
  cta: { live: `Get Agency For ${money(agencyOffer.firstYearPrice)}`, liveHeader: 'Claim The Offer', fallback: 'Choose Agency', fallbackHeader: 'Choose Agency' },
  heroNote: {
    upcoming: `The ${money(agencyOffer.firstYearPrice)} first-year price opens ${OPENS}. Agency is ${money(agencyOffer.regularMonthlyPrice)}/month until then.`,
    pending: `The ${money(agencyOffer.firstYearPrice)} first-year price is not yet available at checkout. Check back soon.`,
    live: `${firstYearLine(agencyOffer)} ${DEADLINE_SENTENCE}`,
    expired: `This offer ended ${OFFER_WINDOW.endsShortLabel}, 2026. ${regularTermsLine(agencyOffer)}`,
  },
  switchPlan: {
    before: 'Only running one business? ',
    linkLabel: showOffer ? 'See the Business offer' : 'See the Business plan',
    after: showOffer ? `: ${money(businessOffer.firstYearPrice)} for the first year.` : `: one business, with a ${BUSINESS_PLAN.trialDays}-day free trial.`,
    href: PROMO_PAGES.business,
  },
  problem: {
    eyebrow: 'The problem, and what changes',
    title: 'Twenty clients. One question every Monday: what do we do for each of them?',
    lead: 'An agency’s week disappears into working out priorities, producing deliverables, and finding fulfilment. Command Center takes the first two off the account manager’s plate and makes the third one click away.',
    items: [
      {
        problem: 'Each client needs a reason to stay, and a recommendation takes an hour of digging per account.',
        solution: 'Every business in your workspace gets its own Do This Next, with the reason and expected impact, ready to put in the client update.',
      },
      {
        problem: 'Briefs, pages, and posts for twenty accounts pile up faster than the team can write them.',
        solution: `Each business carries its own context and brand voice, so drafts start from the client’s details, with ${count(showOffer ? CREDITS.offerMonthly : CREDITS.standardMonthly)} AI credits a month${showOffer ? ` for your first ${CREDITS.offerMonths} months` : ''}.`,
      },
      {
        problem: 'Fulfilment means re-vetting freelancers every time a client needs links, citations, or content.',
        solution: 'Relevant Legiit services appear beside the task, and orders stay attached to the client’s business. Services are purchased separately.',
      },
    ],
  },
  features: [
    {
      id: 'every-client',
      label: '01 · Every client in one workspace',
      title: `Up to ${agencyOffer.businessesIncluded} businesses, each with its own context and next move.`,
      paragraphs: [
        'Add each client as its own business, with its offers, customers, brand voice, competitors, and focus keywords built from its website. Switch between them without losing where you were.',
        'Do This Next gives every business one recommended action with the reason and the expected impact. It is the line you can read out in Monday’s client call.',
      ],
      bullets: [`Up to ${agencyOffer.businessesIncluded} businesses included, more at ${money(AGENCY_PLAN.additionalBusinessMonthly)}/month each`, 'A separate context and next action per client', `${AGENCY_PLAN.allowances.audits} Audits, ${AGENCY_PLAN.allowances.keywords} Keywords, ${AGENCY_PLAN.allowances.backlinkData} Backlink Data`],
      media: [{ screen: 'priorities', caption: 'Actual screen: a Do This Next recommendation with its reason and the Do it with Lara option.' }],
      mediaSide: 'right',
      tinted: false,
    },
    {
      id: 'produce',
      label: '02 · Produce client work faster',
      title: 'Start every deliverable from a draft in the client’s voice.',
      paragraphs: [
        'Article drafts, briefs for writers, landing-page starters, captions, and images begin from the client’s own details, so the first draft already sounds like them. Research buyer questions and check how AI assistants answer for each client.',
        showOffer
          ? `For your first ${CREDITS.offerMonths} months on this offer you have ${count(CREDITS.offerMonthly)} AI credits a month across the workspace, twice the standard allocation. The credits arrive monthly, not all at once.`
          : `Each month you have ${count(CREDITS.standardMonthly)} AI credits across the workspace for drafts, briefs, and research. Open any draft in the editor to build it out and save it to the client’s business.`,
      ],
      bullets: ['Drafts, briefs, and captions from each client’s context', 'Keyword, customer question, and AI visibility research per business', showOffer ? `${count(CREDITS.offerMonthly)} AI credits a month for ${CREDITS.offerMonths} months on this offer` : `${count(CREDITS.standardMonthly)} AI credits each month`],
      media: [{ screen: 'ai-visibility', caption: 'Actual screen: the AI Visibility tools for finding what to target, answering buyer questions, and seeing how AI answers.' }],
      mediaSide: 'left',
      tinted: true,
    },
    {
      id: 'fulfil',
      label: '03 · Fulfil through Legiit specialists',
      title: 'Order the work from a specialist and keep it attached to the client.',
      paragraphs: [
        'When a client needs links, citations, content, or design, Command Center points to relevant Legiit freelancers next to the data that shows the need. You choose who to hire, and the order is tracked under that client’s business.',
        'Tasks, orders, and reports stay with each business, so a client review is a page you open rather than a document you assemble.',
      ],
      bullets: ['Relevant services beside each client’s data', 'Orders and tasks tracked per business', 'Reports and connected analytics per client'],
      note: 'Freelance services are purchased separately.',
      media: [
        { screen: 'specialist-help', caption: 'Actual screen: backlink data with a Browse Backlink Services action.' },
        { screen: 'services', caption: 'Actual screen: a recommended service, alongside the business tools.' },
      ],
      mediaSide: 'right',
      tinted: false,
    },
  ],
  demo: {
    eyebrow: 'See it work',
    title: 'Command Center in 42 seconds.',
    body: 'The actual product, screen by screen: where a business stands, what to do next, the content tools, and specialist help.',
  },
  pricing: {
    eyebrow: 'The Black Friday offer',
    title: `Agency for ${money(agencyOffer.firstYearPrice)} for your first year.`,
    expiredTitle: 'Agency plan pricing.',
    included: [`Up to ${AGENCY_PLAN.businessesIncluded} businesses included`, 'Full business dashboard access', `${AGENCY_PLAN.allowances.audits} Audits, ${AGENCY_PLAN.allowances.keywords} Keywords, ${AGENCY_PLAN.allowances.backlinkData} Backlink Data`, `Businesses beyond ${AGENCY_PLAN.businessesIncluded} at ${money(AGENCY_PLAN.additionalBusinessMonthly)}/month each`, 'Support included'],
    afterYearOne: afterYearOne(agencyOffer),
    creditsNote: creditsNote(),
  },
  faq: {
    eyebrow: 'Before you buy',
    title: showOffer ? 'Offer questions, answered.' : 'Questions, answered.',
    items: showOffer
      ? [
          {
            id: 'what-is-it',
            question: 'What Exactly Is The Black Friday Offer?',
            answer: [
              `${money(agencyOffer.firstYearPrice)} for your first year of the Agency plan, billed annually at purchase, instead of the regular annual price of ${money(agencyOffer.regularAnnualPrice)}. It also includes ${count(CREDITS.offerMonthly)} AI credits a month for your first ${CREDITS.offerMonths} months instead of the standard ${count(CREDITS.standardMonthly)}.`,
            ],
          },
          {
            id: 'per-business',
            question: 'What Does That Cost Per Client?',
            answer: [`With all ${agencyOffer.businessesIncluded} businesses in use, ${money(agencyOffer.firstYearPrice)} for the first year is ${money(perBusinessYear)} per business for the year, or ${money(perBusinessMonth)} a month. Businesses beyond ${agencyOffer.businessesIncluded} are ${money(AGENCY_PLAN.additionalBusinessMonthly)}/month each.`],
          },
          ...sharedFaq(agencyOffer).slice(0, 3),
          {
            id: 'upgrade',
            question: 'Can I Start On Business And Upgrade Later?',
            answer: [`Business can upgrade to Agency at any time. To get the Agency first-year price, buy Agency on annual billing before the offer ends on ${ENDS}.`],
          },
          {
            id: 'agency-trial',
            question: 'Is There A Free Trial For Agency?',
            answer: [`No, the ${BUSINESS_PLAN.trialDays}-day free trial is for the Business plan. If you want to try Command Center first, start there and upgrade before the offer ends.`],
            links: [{ text: 'start there', href: PROMO_PAGES.business }],
          },
          ...sharedFaq(agencyOffer).slice(3),
        ]
      : regularFaq(agencyOffer, 'agency'),
  },
  final: {
    title: 'Give every client a next move worth paying for.',
    body: showOffer ? `Up to ${agencyOffer.businessesIncluded} businesses, a recommendation for each, and ${count(CREDITS.offerMonthly)} AI credits a month to produce the work. ${firstYearLine(agencyOffer)}` : `Up to ${agencyOffer.businessesIncluded} businesses, a recommendation for each, and the tools to produce the work.`,
  },
  }
}

export const PROMO_PAGES_COPY = { business: businessPage, agency: agencyPage } as const

/** Shared one-liners used by components. */
export const CREDITS_SCHEDULE = {
  eyebrow: 'AI credits, month by month',
  title: `${count(CREDITS.offerMonthly)} credits a month for ${CREDITS.offerMonths} months. Then the standard ${count(CREDITS.standardMonthly)}.`,
  body: `That is ${count(CREDITS.offerMonthly - CREDITS.standardMonthly)} more each month than the standard allocation, ${count(extraCreditsFirstYear())} more across the year, allocated monthly rather than delivered up front.`,
  offerLabel: 'Months 1 to 12',
  afterLabel: 'Month 13 onward',
} as const

/* ---------------------------------------------------------------------------
 * Legiit Bucks deposit page
 * ------------------------------------------------------------------------- */

const deposit = money(BUCKS_DEPOSIT.deposit)
const bonus = money(BUCKS_DEPOSIT.bonus)
const total = money(bucksTotal())

export const BUCKS_PAGE = {
  meta: {
    title: `Legiit Bucks Deposit Bonus | Deposit ${deposit}, Get ${total} To Spend | Legiit`,
    description: `Add ${deposit} to your Legiit Bucks wallet during the offer and Legiit adds a ${bonus} bonus, for ${total} to spend on freelance services. ${DEADLINE_SENTENCE}`,
  },
  eyebrow: 'For marketplace buyers',
  h1Line1: `Deposit ${deposit}.`,
  h1Line2: `Spend ${total}.`,
  subhead: `Add ${deposit} to your Legiit Bucks wallet during the offer and Legiit adds a ${bonus} bonus. You get ${total} to spend on freelance services: your ${deposit}, plus ${bonus} from Legiit.`,
  cta: { live: `Deposit ${deposit} Now`, liveHeader: 'Deposit Now', upcoming: 'Create A Free Legiit Account', upcomingHeader: 'Create Account', expired: 'Browse Services', expiredHeader: 'Browse Services' },
  heroNote: {
    upcoming: `The deposit bonus opens ${OPENS}. Create your free Legiit account now and you are ready on the day.`,
    pending: `The ${bonus} bonus is not yet applied to deposits. Check back soon.`,
    live: `Your ${deposit} deposit plus a ${bonus} bonus. ${DEADLINE_SENTENCE}`,
    expired: `The deposit bonus ended ${OFFER_WINDOW.endsShortLabel}, 2026. Legiit Bucks you already hold still spend as normal at checkout.`,
  } satisfies Record<OfferStatus, string>,
  math: {
    deposit: { amount: deposit, label: 'Your deposit' },
    bonus: { amount: bonus, label: 'Legiit adds' },
    total: { amount: total, label: 'To spend on services' },
    clarification: `The bonus is ${bonus}. This is not ${total} of free credit, and it is not part of any Command Center subscription.`,
  },
  how: {
    eyebrow: 'How it works',
    title: 'Four steps, no code to enter.',
    steps: [
      { title: 'Sign in to Legiit', body: 'Or create a free marketplace account. There is no subscription to buy.' },
      { title: `Deposit ${deposit} to your wallet`, body: `Open Deposit Funds in your account and add ${deposit}. Deposits count in ${money(BUCKS_DEPOSIT.increment)} steps.` },
      { title: `Legiit adds ${bonus}`, body: `Your Legiit Bucks balance shows your ${deposit} plus the ${bonus} bonus, ${total} in all.` },
      { title: 'Spend it at checkout', body: 'When you buy a service, choose Wallet and turn on “Use your Legiit Bucks first”. You can combine Legiit Bucks with a card or PayPal.' },
    ],
  },
  rules: {
    eyebrow: 'The rules',
    title: 'What the bonus can and cannot do.',
    items: [
      `Legiit Bucks pay for services from Legiit freelancers. The ${bonus} bonus cannot be withdrawn as cash.`,
      `Deposits count in ${money(BUCKS_DEPOSIT.increment)} steps: ${deposit} earns ${bonus}, ${money(BUCKS_DEPOSIT.deposit * 2)} earns ${money(BUCKS_DEPOSIT.bonus * 2)}.`,
      'The bonus is a marketplace offer. It is not a Command Center feature and does not change any subscription’s price or credits.',
      `Deposits made between ${OPENS} and ${ENDS} qualify.`,
      'Your Legiit Bucks balance and history are in your account under Legiit Bucks history.',
    ],
    historyLink: { text: 'Legiit Bucks history', href: PROMO_ROUTES.bucksHistory },
  },
  final: {
    title: `Fund the next job. Legiit adds ${bonus}.`,
    body: `Deposit ${deposit}, spend ${total} on the freelance work your business needs. ${DEADLINE_SENTENCE}`,
  },
  footerLinks: [
    { label: 'Privacy', href: PROMO_ROUTES.privacy },
    { label: 'Terms', href: PROMO_ROUTES.terms },
    { label: 'Support', href: PROMO_ROUTES.support },
    { label: 'Contact', href: PROMO_ROUTES.contactEmail },
    { label: 'Log In', href: PROMO_ROUTES.signIn },
  ],
} as const

/** Footer links on the Command Center promotion pages, the pricing page's set. */
export const PROMO_FOOTER_LINKS = BUCKS_PAGE.footerLinks
