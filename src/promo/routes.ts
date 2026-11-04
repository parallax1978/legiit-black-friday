/**
 * Which destination and label each Command Center promotion button gets in
 * each offer state. Live: the plan's annual checkout, where the Black Friday
 * price applies. Expired: the existing regular route (the Business trial, or
 * the Agency month-to-month checkout), so no button ever sends a visitor to a
 * price the page cannot promise.
 */
import type { Attribution } from './attribution'
import { planCheckoutUrl, trialStartUrl } from './attribution'
import type { PromoPageCopy } from './content'
import type { OfferStatus } from './status'
import type { BillingPeriod, PaidPlanId } from '../pricing/plans'

export interface PromoRoute {
  href: string
  label: string
  headerLabel: string
  plan: PaidPlanId
  billing: BillingPeriod
  /** 'offer' when the button opens the first-year checkout; 'regular' otherwise. */
  kind: 'offer' | 'regular'
}

export function promoRoute(copy: PromoPageCopy, status: OfferStatus, attribution: Attribution): PromoRoute {
  const plan = copy.offer.planId
  if (status === 'live') {
    return { href: planCheckoutUrl(plan, 'yearly', attribution), label: copy.cta.live, headerLabel: copy.cta.liveHeader, plan, billing: 'yearly', kind: 'offer' }
  }
  if (copy.page === 'business') {
    return { href: trialStartUrl(attribution), label: copy.cta.fallback, headerLabel: copy.cta.fallbackHeader, plan, billing: 'monthly', kind: 'regular' }
  }
  return { href: planCheckoutUrl(plan, 'monthly', attribution), label: copy.cta.fallback, headerLabel: copy.cta.fallbackHeader, plan, billing: 'monthly', kind: 'regular' }
}
