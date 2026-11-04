/**
 * Campaign attribution for the promotion pages, in the project's existing
 * style: typed values, no tracking vendor. The page reads the campaign name
 * and any UTM parameters from its own URL, keeps them for the visit, and
 * forwards them on every outbound button so Legiit's own analytics (and the
 * redirect through sign-in) see the same source from click to checkout.
 */
import { CAMPAIGN_NAME, CHECKOUT_ENTRY, PROMO_ROUTES } from './offer'
import { ROUTES, type BillingPeriod, type PaidPlanId } from '../pricing/plans'

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
export type UtmKey = (typeof UTM_KEYS)[number]

export interface Attribution {
  /** The campaign this visit belongs to. Defaults to the November campaign when the URL names none. */
  campaign: string
  utm: Partial<Record<UtmKey, string>>
}

export const STORAGE_KEY = 'legiit_promo_attribution'

const clean = (value: string | null) => (value ?? '').trim().slice(0, 200)

/** Attribution named by a URL's query string, or null when it names none. */
export function parseAttribution(search: string): Attribution | null {
  const params = new URLSearchParams(search)
  const utm: Partial<Record<UtmKey, string>> = {}
  for (const key of UTM_KEYS) {
    const value = clean(params.get(key))
    if (value) utm[key] = value
  }
  const campaign = clean(params.get('campaign')) || utm.utm_campaign || ''
  if (!campaign && Object.keys(utm).length === 0) return null
  return { campaign: campaign || CAMPAIGN_NAME, utm }
}

export const DEFAULT_ATTRIBUTION: Attribution = { campaign: CAMPAIGN_NAME, utm: {} }

interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function readStored(storage: StorageLike | null): Attribution | null {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Attribution>
    if (typeof parsed.campaign !== 'string' || !parsed.campaign) return null
    const utm: Partial<Record<UtmKey, string>> = {}
    for (const key of UTM_KEYS) {
      const value = parsed.utm?.[key]
      if (typeof value === 'string' && value) utm[key] = clean(value)
    }
    return { campaign: clean(parsed.campaign), utm }
  } catch {
    return null
  }
}

/**
 * The visit's attribution: the current URL first, then what an earlier page
 * of this visit stored, then the campaign default. A URL that names a source
 * replaces the stored one. Storage failures (private mode, blocked data) are
 * ignored; the page still works.
 */
export function resolveAttribution(search: string, storage: StorageLike | null): Attribution {
  const fromUrl = parseAttribution(search)
  if (fromUrl) {
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(fromUrl))
    } catch {
      // Storage is a convenience, never a requirement.
    }
    return fromUrl
  }
  return readStored(storage) ?? DEFAULT_ATTRIBUTION
}

export function loadAttribution(): Attribution {
  if (typeof window === 'undefined') return DEFAULT_ATTRIBUTION
  let storage: StorageLike | null = null
  try {
    storage = window.sessionStorage
  } catch {
    storage = null
  }
  return resolveAttribution(window.location.search, storage)
}

/** Query parameters every outbound link carries: each UTM value present, utm_campaign at least, and `campaign`. */
export function attributionParams(attribution: Attribution): [string, string][] {
  const pairs: [string, string][] = []
  for (const key of UTM_KEYS) {
    const value = attribution.utm[key]
    if (value) pairs.push([key, value])
  }
  if (!attribution.utm.utm_campaign) pairs.push(['utm_campaign', attribution.campaign])
  pairs.push(['campaign', attribution.campaign])
  return pairs
}

/** Adds the attribution to any absolute or relative URL without overwriting parameters it already has. */
export function withAttribution(url: string, attribution: Attribution): string {
  const hashIndex = url.indexOf('#')
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : ''
  const beforeHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url
  const queryIndex = beforeHash.indexOf('?')
  const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash
  const params = new URLSearchParams(queryIndex >= 0 ? beforeHash.slice(queryIndex + 1) : '')
  for (const [key, value] of attributionParams(attribution)) {
    if (!params.has(key)) params.set(key, value)
  }
  const query = params.toString()
  return `${path}${query ? `?${query}` : ''}${hash}`
}

/** The checkout path with plan, billing period, and attribution: the intended destination after sign-in. */
export function checkoutPath(planId: PaidPlanId, billing: BillingPeriod, attribution: Attribution): string {
  const params = new URLSearchParams({ plan: planId, billing })
  for (const [key, value] of attributionParams(attribution)) params.set(key, value)
  return `/subscription-purchase?${params.toString()}`
}

/** Legiit's sign-in page with the destination to return to afterwards, the form Legiit's own Business button uses. */
export function signInThen(destinationPath: string): string {
  const url = new URL(ROUTES.signIn)
  url.searchParams.set('redirect', destinationPath)
  return url.toString()
}

/** A plan checkout button's destination, through sign-in or direct, as CHECKOUT_ENTRY decides. */
export function planCheckoutUrl(planId: PaidPlanId, billing: BillingPeriod, attribution: Attribution, entry: typeof CHECKOUT_ENTRY = CHECKOUT_ENTRY): string {
  const path = checkoutPath(planId, billing, attribution)
  return entry === 'direct' ? `https://legiit.com${path}` : signInThen(path)
}

/** The Deposit Funds screen, reached through sign-in so the destination survives the login. */
export function depositUrl(attribution: Attribution): string {
  const target = new URL(PROMO_ROUTES.depositFunds)
  for (const [key, value] of attributionParams(attribution)) target.searchParams.set(key, value)
  return signInThen(`${target.pathname}${target.search}`)
}

/** The landing page's trial route with attribution. */
export function trialStartUrl(attribution: Attribution): string {
  return withAttribution(PROMO_ROUTES.trialStart, attribution)
}
