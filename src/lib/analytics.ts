/**
 * Optional analytics hooks. Inactive unless a handler is registered; the
 * default is a no-op and nothing is sent anywhere. No tracker is installed.
 *
 * Video events fire only from real media events (play, timeupdate, ended).
 * A CTA click is a click, not a signup or an activated trial. Downstream
 * attribution on the Legiit side is a separate integration (see README).
 */
export type Milestone = 25 | 50 | 75

export interface EventMap {
  cta_click: { placement: 'header' | 'hero' | 'offer' | 'final' }
  video_play: Record<string, never>
  video_progress: { milestone: Milestone }
  video_complete: Record<string, never>
  walkthrough_open: { placement: 'hero' | 'video-fallback' }
  walkthrough_step: { chapterId: string; index: number }
  image_enlarge: { screenId: string }
  faq_toggle: { id: string; expanded: boolean }
  allowances_toggle: { expanded: boolean }
  /** Pricing page: a plan button was clicked. A click is not a signup, trial, or purchase. */
  plan_cta_click: { plan: 'business_dashboard' | 'agency_dashboard' | 'marketplace'; billing?: 'monthly' | 'yearly'; placement: string }
  /** Pricing page: the visitor switched the billing period. */
  billing_change: { billing: 'monthly' | 'yearly' }
  /** Promotion pages: a page rendered, with the offer state it showed and the visit's attribution. */
  promo_view: { page: PromoPage; status: PromoStatus; campaign: string; utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string; utm_term?: string }
  /** Promotion pages: a button or plan link was clicked. A click is not a purchase or a deposit. */
  promo_cta_click: { page: PromoPage; placement: string; plan: 'business_dashboard' | 'agency_dashboard' | 'legiit_bucks' | 'marketplace'; billing?: 'monthly' | 'yearly'; status: PromoStatus; campaign: string; destination: string }
}

export type PromoPage = 'business' | 'agency' | 'legiit-bucks'
export type PromoStatus = 'upcoming' | 'pending' | 'live' | 'expired'

export type EventName = keyof EventMap
export type AnalyticsEvent<K extends EventName = EventName> = { name: K } & EventMap[K]
export type AnalyticsHandler = (event: AnalyticsEvent) => void

const noop: AnalyticsHandler = () => {}
let handler: AnalyticsHandler = noop

export function setAnalyticsHandler(next?: AnalyticsHandler): void {
  handler = next ?? noop
}

export function track<K extends EventName>(name: K, props: EventMap[K]): void {
  const event = { name, ...props } as AnalyticsEvent<K>
  if (import.meta.env.DEV) console.debug('[cc-events]', event)
  try {
    handler(event)
  } catch {
    // A faulty handler must never break the page.
  }
}
