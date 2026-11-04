/**
 * The offer's state at a moment in time. The pages only exist while the
 * promotion runs, so there is no pre-launch state: the offer is 'live' until
 * the end instant and 'expired' after it. There is no countdown: the pages
 * state the end date and re-check the clock once a minute so an open page
 * flips to 'expired' on time.
 */
import { useEffect, useMemo, useState } from 'react'
import { OFFER_WINDOW } from './offer'

export type OfferStatus = 'live' | 'expired'

export const OFFER_STATUSES: readonly OfferStatus[] = ['live', 'expired']

export function offerStatus(now: Date, window: { endsAt: string } = OFFER_WINDOW): OfferStatus {
  return now.getTime() > Date.parse(window.endsAt) ? 'expired' : 'live'
}

/** The offer's terms are shown in every state but 'expired'. */
export function showsOfferTerms(status: OfferStatus): boolean {
  return status !== 'expired'
}

/** Hosts where `?offer_preview=<status>` (or `#offer_preview=<status>`) may force a state, for reviewing and QA. Never a public host. */
const PREVIEW_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', ''])

/** Review builds (`VITE_PROMO_PREVIEW=1`, used for the shared cloud previews) honour the override on any host. */
const PREVIEW_BUILD = import.meta.env.VITE_PROMO_PREVIEW === '1'

export function previewOverride(search: string, hostname: string, hash = '', anyHost = PREVIEW_BUILD): OfferStatus | null {
  if (!anyHost && !PREVIEW_HOSTS.has(hostname)) return null
  const value = new URLSearchParams(search).get('offer_preview') ?? new URLSearchParams(hash.replace(/^#/, '')).get('offer_preview')
  return OFFER_STATUSES.includes(value as OfferStatus) ? (value as OfferStatus) : null
}

/** Current status, re-evaluated every minute and whenever the tab regains focus. */
export function useOfferStatus(): OfferStatus {
  const override = useMemo(() => (typeof window === 'undefined' ? null : previewOverride(window.location.search, window.location.hostname, window.location.hash)), [])
  const [status, setStatus] = useState<OfferStatus>(() => override ?? offerStatus(new Date()))

  useEffect(() => {
    if (override) return
    const tick = () => setStatus(offerStatus(new Date()))
    tick()
    const id = window.setInterval(tick, 60_000)
    window.addEventListener('focus', tick)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', tick)
    }
  }, [override])

  return status
}
