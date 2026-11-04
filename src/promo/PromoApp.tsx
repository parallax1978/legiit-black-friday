import { useEffect, useMemo } from 'react'
import { Container } from '../components/ui/Container'
import { Footer } from '../components/sections/Footer'
import { Faq } from '../components/sections/Faq'
import { ProductSection } from '../components/sections/ProductSection'
import { track } from '../lib/analytics'
import { loadAttribution } from './attribution'
import { PROMO_FOOTER_LINKS, statusBanner, type PromoPageCopy } from './content'
import { promoRoute } from './routes'
import { showsOfferTerms, useOfferStatus } from './status'
import { CreditsSchedule } from './components/CreditsSchedule'
import { OfferPricing } from './components/OfferPricing'
import { ProblemSolution } from './components/ProblemSolution'
import { PromoFinal } from './components/PromoFinal'
import { PromoHeader } from './components/PromoHeader'
import { PromoHero } from './components/PromoHero'
import { StatusStrip } from './components/StatusStrip'

/**
 * One Command Center promotion page. The Business and Agency pages are this
 * component with their own copy; everything that depends on the offer state
 * (buttons, prices, notes) resolves here once and flows down.
 */
export default function PromoApp({ copyFor }: { copyFor: (showOffer: boolean) => PromoPageCopy }) {
  const status = useOfferStatus()
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
    <div id="top" className="promo min-h-dvh bg-canvas text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-canvas focus:px-4 focus:py-3 focus:text-ink focus:shadow-frame btn-focus">
        Skip To Content
      </a>
      <StatusStrip status={status} text={statusBanner(status, 'command-center')} />
      <PromoHeader cta={cta} />
      <main id="main">
        <PromoHero copy={copy} status={status} route={route} attribution={attribution} />
        <ProblemSolution copy={copy.problem} />
        {copy.features.map((section) => (
          <ProductSection key={section.id} section={section} />
        ))}
        {showOffer && <CreditsSchedule />}
        <OfferPricing copy={copy} status={status} route={route} attribution={attribution} />
        <Faq eyebrow={copy.faq.eyebrow} title={copy.faq.title} items={copy.faq.items} headingId="promo-faq-heading" />
        <PromoFinal copy={copy} status={status} route={route} attribution={attribution} />
      </main>
      <Footer links={PROMO_FOOTER_LINKS} navLabel="Footer" />
      <Container>
        <p className="sr-only">Prices in US dollars.</p>
      </Container>
    </div>
  )
}
