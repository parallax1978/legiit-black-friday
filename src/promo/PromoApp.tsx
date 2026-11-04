import { useEffect, useMemo } from 'react'
import { track } from '../lib/analytics'
import { loadAttribution } from './attribution'
import type { PromoPageCopy } from './content'
import { CHECKOUT_READY } from './offer'
import { promoRoute } from './routes'
import { showsOfferTerms, useOfferStatus } from './status'
import { CreditsSchedule } from './components/CreditsSchedule'
import { DemoSection } from './components/DemoSection'
import { FeatureSections } from './components/FeatureSections'
import { OfferPricing } from './components/OfferPricing'
import { ProblemSolution } from './components/ProblemSolution'
import { PromoFaq } from './components/PromoFaq'
import { PromoFinal } from './components/PromoFinal'
import { PromoFooter } from './components/PromoFooter'
import { PromoHeader } from './components/PromoHeader'
import { PromoHero } from './components/PromoHero'

/**
 * One Command Center promotion page. The Business and Agency pages are this
 * component with their own copy; everything that depends on the offer state
 * (buttons, prices, notes) resolves here once and flows down.
 */
export default function PromoApp({ copyFor, planId }: { copyFor: (showOffer: boolean) => PromoPageCopy; planId: 'business_dashboard' | 'agency_dashboard' }) {
  const status = useOfferStatus(CHECKOUT_READY[planId])
  const showOffer = showsOfferTerms(status)
  const copy = useMemo(() => copyFor(showOffer), [copyFor, showOffer])
  const attribution = useMemo(loadAttribution, [])
  const route = promoRoute(copy, status, attribution)

  useEffect(() => {
    document.title = copy.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', copy.meta.description)
  }, [copy])

  useEffect(() => {
    track('promo_view', { page: copy.page, status, campaign: attribution.campaign, ...attribution.utm })
    // One view event per page load; the status is the state the page first rendered in.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cta = { page: copy.page, plan: route.plan, billing: route.billing, status, campaign: attribution.campaign, href: route.href, label: route.headerLabel }

  return (
    <div id="top" className="promo min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-legiit-charcoal">
        Skip to content
      </a>
      <PromoHeader current={copy.page} cta={cta} attribution={attribution} />
      <main id="main">
        <PromoHero copy={copy} status={status} route={route} attribution={attribution} />
        <DemoSection copy={copy.demo} />
        <ProblemSolution copy={copy.problem} />
        <FeatureSections section={copy.featuresSection} features={copy.features} />
        {showOffer && <CreditsSchedule />}
        <OfferPricing copy={copy} status={status} route={route} attribution={attribution} />
        <PromoFaq title={copy.faq.title} lead={copy.faq.lead} items={copy.faq.items} />
        <PromoFinal copy={copy} status={status} route={route} attribution={attribution} />
      </main>
      <PromoFooter />
    </div>
  )
}
