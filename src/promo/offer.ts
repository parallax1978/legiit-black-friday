/**
 * The November 2026 promotion, in one place. Every price, credit figure,
 * date, route, and readiness flag the three promotion pages show reads from
 * here, so a change to the offer is one edit.
 *
 * Sources: the offer as announced by Jim Sabellico in #legiit on 2026-11-04
 * and the "Legiit, The Next 60 Days" deck (prices, credits, dates, the
 * $100 deposit increment, bonus funds for services only and not
 * withdrawable); the verified plan data in ../pricing/plans (regular
 * prices, allowances); Legiit's support center (Legiit Bucks are spent at
 * checkout through the Wallet option, history at /legiit-bucks/history,
 * subscriptions managed at /buyer/active-subscriptions); and Legiit's app
 * bundle (the Deposit Funds screen is /earning-history?deposite_wallet=true,
 * Legiit's own spelling).
 */
import { AGENCY_PLAN, BUSINESS_PLAN, ROUTES, type PaidPlanId } from '../pricing/plans'
import { CTA_URL } from '../config/site'

/** Campaign name carried on every outbound link from these pages (see ./attribution). */
export const CAMPAIGN_NAME = 'legiit_60d_2026' as const

/**
 * When the offer runs. The pages are published on the opening day and treat
 * the offer as live until `endsAt`, after which they show regular prices.
 * November 2026 is entirely on Eastern Standard Time (UTC-5), so the fixed
 * offsets below are exact. `endsAtLabel` is the only wording of the deadline
 * on the pages; the unit test checks it against the instant.
 */
export const OFFER_WINDOW = {
  startsAt: '2026-11-05T00:00:00-05:00',
  endsAt: '2026-11-30T23:59:59-05:00',
  timeZone: 'America/New_York',
  opensLabel: 'November 5, 2026',
  endsAtLabel: 'November 30, 2026, at 11:59 p.m. Eastern',
  endsShortLabel: 'November 30',
} as const

/**
 * Which entry point every Command Center button uses. Checked 2026-11-06:
 * a signed-out visit to /subscription-purchase redirects to /sign-in, and the
 * sign-in form now carries the checkout URL as its destination, so the plan
 * survives the login. A signed-in visitor opens the checkout directly. The
 * sign-in route itself ignores its `redirect` parameter for signed-in
 * visitors and sends them to the home page, which is why 'sign-in-redirect'
 * is no longer used.
 */
export const CHECKOUT_ENTRY: 'sign-in-redirect' | 'direct' = 'direct'

export interface FirstYearOffer {
  planId: PaidPlanId
  /** Plan name as the pricing page shows it. */
  planName: string
  /** Price of the first year in USD, charged once at purchase. */
  firstYearPrice: number
  /** The plan's regular price per year (verified plan data). */
  regularAnnualPrice: number
  /** Regular month-to-month price (verified plan data). */
  regularMonthlyPrice: number
  businessesIncluded: number
}

export const FIRST_YEAR: Record<'business' | 'agency', FirstYearOffer> = {
  business: {
    planId: BUSINESS_PLAN.id,
    planName: BUSINESS_PLAN.name,
    firstYearPrice: 399,
    regularAnnualPrice: BUSINESS_PLAN.yearlyPrice,
    regularMonthlyPrice: BUSINESS_PLAN.monthlyPrice,
    businessesIncluded: BUSINESS_PLAN.businessesIncluded,
  },
  agency: {
    planId: AGENCY_PLAN.id,
    planName: AGENCY_PLAN.name,
    firstYearPrice: 1399,
    regularAnnualPrice: AGENCY_PLAN.yearlyPrice,
    regularMonthlyPrice: AGENCY_PLAN.monthlyPrice,
    businessesIncluded: AGENCY_PLAN.businessesIncluded,
  },
}

/** AI credits: doubled for the first 12 months, allocated month by month, standard allowance after that. */
export const CREDITS = {
  offerMonthly: 100_000,
  standardMonthly: BUSINESS_PLAN.aiCreditsMonthly,
  offerMonths: 12,
} as const

/** The marketplace deposit offer. Kept apart from the Command Center plans: it is not a subscription benefit. */
export const BUCKS_DEPOSIT = {
  /** What the buyer pays into the wallet, in USD. */
  deposit: 100,
  /** What Legiit adds, in Legiit Bucks. */
  bonus: 25,
  /** Deposits count in steps of this amount (deck: "In $100 increments"). */
  increment: 100,
} as const

/** Routes the promotion pages use beyond the plan checkout. Each was checked on the live site on 2026-11-04. */
export const PROMO_ROUTES = {
  /** Legiit's Deposit Funds screen (its own spelling). Signed-out visitors are sent to sign-in. */
  depositFunds: 'https://legiit.com/earning-history?deposite_wallet=true',
  bucksHistory: 'https://legiit.com/legiit-bucks/history',
  activeSubscriptions: 'https://legiit.com/buyer/active-subscriptions',
  /** The landing page's trial route; the fallback for the Business page while the offer is not live. */
  trialStart: CTA_URL,
  /** Where a service buyer browses once the deposit offer has ended. */
  browseServices: 'https://legiit.com/categories',
  register: ROUTES.register,
  signIn: ROUTES.signIn,
  support: ROUTES.support,
  contactEmail: ROUTES.contactEmail,
  terms: ROUTES.terms,
  privacy: ROUTES.privacy,
} as const

/**
 * Where the promotion pages live relative to each other, so the Business and
 * Agency pages can link to one another. In dev and `vite preview` they are the
 * root HTML files; `npm run build:promo` rewrites these to the deployed paths.
 */
export const PROMO_PAGES = {
  business: import.meta.env.VITE_PROMO_BUSINESS_PATH ?? './black-friday-business.html',
  agency: import.meta.env.VITE_PROMO_AGENCY_PATH ?? './black-friday-agency.html',
  legiitBucks: import.meta.env.VITE_PROMO_BUCKS_PATH ?? './legiit-bucks.html',
} as const

/** Whole dollars a buyer keeps in year one against the regular annual price, e.g. 71.4 for Business. */
export function firstYearSaving(offer: FirstYearOffer): number {
  return (Math.round(offer.regularAnnualPrice * 100) - Math.round(offer.firstYearPrice * 100)) / 100
}

/** Extra credits over the whole first year against the standard allowance: 50,000 x 12 = 600,000. */
export function extraCreditsFirstYear(): number {
  return (CREDITS.offerMonthly - CREDITS.standardMonthly) * CREDITS.offerMonths
}

/** What the buyer has to spend after the deposit: $100 + $25 = $125. */
export function bucksTotal(): number {
  return BUCKS_DEPOSIT.deposit + BUCKS_DEPOSIT.bonus
}
