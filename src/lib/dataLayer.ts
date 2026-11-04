import { setAnalyticsHandler, type AnalyticsEvent } from './analytics'

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

/**
 * Forwards the typed events to Google Tag Manager's `dataLayer` when the host
 * page already has one (legiit.com runs GTM container GTM-MXLWTRC). Nothing is
 * installed or loaded here: without a dataLayer on the page the events stay
 * no-ops, exactly as before. Each push is `{ event: <name>, ...props }`, so a
 * GTM trigger on the custom event name can read every property.
 */
export function connectDataLayer(): boolean {
  if (typeof window === 'undefined' || !Array.isArray(window.dataLayer)) return false
  const layer = window.dataLayer
  setAnalyticsHandler((event: AnalyticsEvent) => {
    const { name, ...props } = event
    layer.push({ event: name, ...props })
  })
  return true
}
