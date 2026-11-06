import { describe, expect, it } from 'vitest'
import { BUCKS_DEPOSIT, CAMPAIGN_NAME, CREDITS, FIRST_YEAR, OFFER_WINDOW, PROMO_ROUTES, bucksTotal, extraCreditsFirstYear, firstYearSaving } from './offer'
import { offerStatus, previewOverride, showsOfferTerms } from './status'
import { DEFAULT_ATTRIBUTION, attributionParams, checkoutPath, depositUrl, parseAttribution, planCheckoutUrl, resolveAttribution, signInThen, trialStartUrl, withAttribution } from './attribution'
import { promoRoute } from './routes'
import { businessPage, agencyPage } from './content'

describe('offer terms', () => {
  it('matches the announced offer', () => {
    expect(FIRST_YEAR.business.firstYearPrice).toBe(399)
    expect(FIRST_YEAR.agency.firstYearPrice).toBe(1399)
    expect([FIRST_YEAR.business.regularAnnualPrice, FIRST_YEAR.agency.regularAnnualPrice]).toEqual([470.4, 1622.4])
    expect(CREDITS).toEqual({ offerMonthly: 100_000, standardMonthly: 50_000, offerMonths: 12 })
    expect(extraCreditsFirstYear()).toBe(600_000)
    expect(firstYearSaving(FIRST_YEAR.business)).toBe(71.4)
    expect(firstYearSaving(FIRST_YEAR.agency)).toBe(223.4)
    expect(BUCKS_DEPOSIT).toEqual({ deposit: 100, bonus: 25, increment: 100 })
    expect(bucksTotal()).toBe(125)
    expect(CAMPAIGN_NAME).toBe('legiit_60d_2026')
  })

  it('ends November 30, 2026 at 11:59 p.m. Eastern, and the label says so', () => {
    const end = new Date(OFFER_WINDOW.endsAt)
    const formatted = new Intl.DateTimeFormat('en-US', { timeZone: OFFER_WINDOW.timeZone, dateStyle: 'long', timeStyle: 'short' }).format(end)
    expect(formatted).toBe('November 30, 2026 at 11:59 PM')
    expect(OFFER_WINDOW.endsAtLabel).toBe('November 30, 2026, at 11:59 p.m. Eastern')
    expect(new Intl.DateTimeFormat('en-US', { timeZone: OFFER_WINDOW.timeZone, dateStyle: 'long' }).format(new Date(OFFER_WINDOW.startsAt))).toBe(OFFER_WINDOW.opensLabel)
  })

  it('uses only routes verified on the live site', () => {
    expect(PROMO_ROUTES.depositFunds).toBe('https://legiit.com/earning-history?deposite_wallet=true')
    expect(PROMO_ROUTES.bucksHistory).toBe('https://legiit.com/legiit-bucks/history')
    expect(PROMO_ROUTES.activeSubscriptions).toBe('https://legiit.com/buyer/active-subscriptions')
    expect(PROMO_ROUTES.trialStart).toBe('https://legiit.com/command-center/start')
  })
})

describe('offer status', () => {
  const at = (iso: string) => new Date(iso)
  it('is live until the end instant and expired after it', () => {
    expect(offerStatus(at('2026-11-05T00:00:00-05:00'))).toBe('live')
    expect(offerStatus(at('2026-11-30T23:59:59-05:00'))).toBe('live')
    expect(offerStatus(at('2026-12-01T00:00:00-05:00'))).toBe('expired')
    expect(offerStatus(at('2026-11-30T21:00:00-08:00'))).toBe('expired') // 9 p.m. Pacific is past midnight Eastern
  })
  it('shows offer terms while live only', () => {
    expect(showsOfferTerms('live')).toBe(true)
    expect(showsOfferTerms('expired')).toBe(false)
  })
  it('honours a preview override only on local hosts', () => {
    expect(previewOverride('?offer_preview=expired', 'localhost')).toBe('expired')
    expect(previewOverride('?offer_preview=live', '127.0.0.1')).toBe('live')
    expect(previewOverride('?offer_preview=live', 'legiit.com')).toBeNull()
    expect(previewOverride('', 'localhost', '#offer_preview=expired')).toBe('expired')
    expect(previewOverride('?offer_preview=live', 'legiit.com', '', true)).toBe('live')
    expect(previewOverride('?offer_preview=bogus', 'localhost')).toBeNull()
  })
})

describe('attribution', () => {
  const utm = { utm_source: 'youtube', utm_medium: 'video', utm_campaign: 'legiit_60d_2026', utm_content: 'owner_brief_a' }
  const search = '?utm_source=youtube&utm_medium=video&utm_campaign=legiit_60d_2026&utm_content=owner_brief_a'

  it('reads UTM parameters and the campaign from the URL, defaulting to the campaign name', () => {
    expect(parseAttribution(search)).toEqual({ campaign: 'legiit_60d_2026', utm })
    expect(parseAttribution('?campaign=legiit_60d_2026')).toEqual({ campaign: 'legiit_60d_2026', utm: {} })
    expect(parseAttribution('?utm_source=email')).toEqual({ campaign: 'legiit_60d_2026', utm: { utm_source: 'email' } })
    expect(parseAttribution('')).toBeNull()
    expect(DEFAULT_ATTRIBUTION).toEqual({ campaign: 'legiit_60d_2026', utm: {} })
  })

  it('keeps the attribution for the visit and survives broken storage', () => {
    const store = new Map<string, string>()
    const storage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v) }
    expect(resolveAttribution(search, storage)).toEqual({ campaign: 'legiit_60d_2026', utm })
    expect(resolveAttribution('', storage)).toEqual({ campaign: 'legiit_60d_2026', utm })
    const broken = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(resolveAttribution('', broken)).toEqual(DEFAULT_ATTRIBUTION)
    expect(resolveAttribution(search, broken)).toEqual({ campaign: 'legiit_60d_2026', utm })
  })

  it('forwards every UTM value plus the campaign on outbound links, without overwriting existing parameters', () => {
    expect(attributionParams(DEFAULT_ATTRIBUTION)).toEqual([
      ['utm_campaign', 'legiit_60d_2026'],
      ['campaign', 'legiit_60d_2026'],
    ])
    expect(withAttribution('https://legiit.com/register', DEFAULT_ATTRIBUTION)).toBe('https://legiit.com/register?utm_campaign=legiit_60d_2026&campaign=legiit_60d_2026')
    expect(withAttribution('./black-friday-agency.html#offer', { campaign: 'x', utm: { utm_source: 'ad' } })).toBe('./black-friday-agency.html?utm_source=ad&utm_campaign=x&campaign=x#offer')
    expect(withAttribution('https://legiit.com/a?utm_source=keep', { campaign: 'x', utm: { utm_source: 'new' } })).toBe('https://legiit.com/a?utm_source=keep&utm_campaign=x&campaign=x')
  })

  it('builds the plain checkout destination with plan and billing, direct by default, and can still carry it through sign-in', () => {
    const path = checkoutPath('business_dashboard', 'yearly')
    expect(path).toBe('/subscription-purchase?plan=business_dashboard&billing=yearly')
    expect(signInThen(path)).toBe(`https://legiit.com/sign-in?redirect=${encodeURIComponent(path)}`)
    expect(planCheckoutUrl('business_dashboard', 'yearly', DEFAULT_ATTRIBUTION)).toBe('https://legiit.com/subscription-purchase?plan=business_dashboard&billing=yearly')
    expect(planCheckoutUrl('agency_dashboard', 'yearly', DEFAULT_ATTRIBUTION)).toBe('https://legiit.com/subscription-purchase?plan=agency_dashboard&billing=yearly')
    expect(planCheckoutUrl('agency_dashboard', 'yearly', DEFAULT_ATTRIBUTION, 'sign-in-redirect')).toBe(signInThen(checkoutPath('agency_dashboard', 'yearly')))
    expect(depositUrl(DEFAULT_ATTRIBUTION)).toBe(`https://legiit.com/sign-in?redirect=${encodeURIComponent('/earning-history?deposite_wallet=true&utm_campaign=legiit_60d_2026&campaign=legiit_60d_2026')}`)
    expect(trialStartUrl(DEFAULT_ATTRIBUTION)).toBe('https://legiit.com/command-center/start?utm_campaign=legiit_60d_2026&campaign=legiit_60d_2026')
  })
})

describe('promotion routes', () => {
  it('sends live visitors to the annual checkout and everyone else to the regular route', () => {
    const business = businessPage(true)
    const agency = agencyPage(true)
    const live = promoRoute(business, 'live', DEFAULT_ATTRIBUTION)
    expect(live).toMatchObject({ plan: 'business_dashboard', billing: 'yearly', kind: 'offer', label: 'Get Command Center For $399' })
    expect(live.href).toBe('https://legiit.com/subscription-purchase?plan=business_dashboard&billing=yearly')
    expect(promoRoute(business, 'expired', DEFAULT_ATTRIBUTION)).toMatchObject({ kind: 'regular', label: 'Start My 7-Day Free Trial', href: trialStartUrl(DEFAULT_ATTRIBUTION) })
    expect(promoRoute(agency, 'expired', DEFAULT_ATTRIBUTION)).toMatchObject({ kind: 'regular', billing: 'monthly', label: 'Choose Agency' })
    expect(promoRoute(agency, 'live', DEFAULT_ATTRIBUTION)).toMatchObject({ plan: 'agency_dashboard', billing: 'yearly', label: 'Get Agency For $1,399' })
  })
})
