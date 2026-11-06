import { useEffect, useMemo, type CSSProperties } from 'react'
import { Container } from '../components/ui/Container'
import { Footer } from '../components/sections/Footer'
import { Faq } from '../components/sections/Faq'
import { ProductSection } from '../components/sections/ProductSection'
import { track } from '../lib/analytics'
import { loadAttribution } from './attribution'
import { PROMO_FOOTER_LINKS, statusBanner, type PromoPageCopy } from './content'
import { promoRoute } from './routes'
import { showsOfferTerms, useOfferStatus } from './status'
import { BonusCredits } from './components/BonusCredits'
import { BusinessOfferHero } from './components/BusinessOfferHero'
import { CreditsSchedule } from './components/CreditsSchedule'
import { OfferPricing } from './components/OfferPricing'
import { PlanPricing } from './components/PlanPricing'
import { ProblemCards } from './components/ProblemCards'
import { ProblemSolution } from './components/ProblemSolution'
import { PromoFinal } from './components/PromoFinal'
import { PromoHeader } from './components/PromoHeader'
import { PromoHero } from './components/PromoHero'
import { StatusStrip } from './components/StatusStrip'
import { StepSection } from './components/StepSection'

/** The Business offer page sets its section eyebrows in grey (see .eyebrow in index.css). */
const OFFER_PAGE_STYLE = { '--eyebrow-color': '#5C5C6B' } as CSSProperties

/**
 * One Command Center promotion page. The Business and Agency pages are this
 * component with their own copy; everything that depends on the offer state
 * (buttons, prices, notes) resolves here once and flows down. While the
 * Business offer is live the page uses its own sections (`copy.offerPage`);
 * the Agency page and the expired state use the shared ones.
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
  const offerPage = showOffer ? copy.offerPage : undefined
  const bannerLink = offerPage && {
    label: offerPage.bannerLink,
    href: route.href,
    onClick: () => track('promo_cta_click', { page: copy.page, placement: 'banner', plan: route.plan, billing: route.billing, status, campaign: attribution.campaign, destination: route.href }),
  }

  return (
    <div id="top" className="promo min-h-dvh bg-canvas text-ink" style={offerPage ? OFFER_PAGE_STYLE : undefined}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-canvas focus:px-4 focus:py-3 focus:text-ink focus:shadow-frame btn-focus">
        Skip To Content
      </a>
      <StatusStrip status={status} text={offerPage ? offerPage.banner : statusBanner(status, 'command-center')} link={bannerLink || undefined} />
      <PromoHeader cta={cta} look={offerPage ? 'solid' : 'gradient'} />
      <main id="main">
        {offerPage ? (
          <>
            <BusinessOfferHero copy={copy} page={offerPage} status={status} route={route} attribution={attribution} />
            <ProblemCards copy={copy.problem} />
            {offerPage.steps.map((step) => (
              <StepSection key={step.id} step={step} />
            ))}
            <BonusCredits copy={offerPage.credits} />
            <PlanPricing copy={copy} plan={offerPage.plan} status={status} route={route} attribution={attribution} />
          </>
        ) : (
          <>
            <PromoHero copy={copy} status={status} route={route} attribution={attribution} />
            <ProblemSolution copy={copy.problem} />
            {copy.features.map((section) => (
              <ProductSection key={section.id} section={section} />
            ))}
            {showOffer && <CreditsSchedule />}
            <OfferPricing copy={copy} status={status} route={route} attribution={attribution} />
          </>
        )}
        <Faq eyebrow={copy.faq.eyebrow} title={copy.faq.title} items={copy.faq.items} headingId="promo-faq-heading" help={copy.faq.help} initiallyOpen={copy.faq.openFirst ? copy.faq.items[0]?.id : undefined} />
        <PromoFinal copy={copy} status={status} route={route} attribution={attribution} look={offerPage ? 'plain' : 'brand'} />
      </main>
      {offerPage ? (
        <Footer links={offerPage.footerLinks} navLabel="Footer" tone="dark" note="Prices in US dollars." />
      ) : (
        <>
          <Footer links={PROMO_FOOTER_LINKS} navLabel="Footer" />
          <Container>
            <p className="sr-only">Prices in US dollars.</p>
          </Container>
        </>
      )}
    </div>
  )
}
