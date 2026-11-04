import { Container } from '../../components/ui/Container'
import { Check } from '../../components/ui/Icons'
import { formatCount, formatUsd } from '../../pricing/price'
import type { Attribution } from '../attribution'
import { DEADLINE_SENTENCE, firstYearLine, regularPriceLine, regularTermsLine, type PromoPageCopy } from '../content'
import { CREDITS, OFFER_WINDOW } from '../offer'
import type { PromoRoute } from '../routes'
import { showsOfferTerms, type OfferStatus } from '../status'
import { PromoCta } from './PromoCta'

const BOX_GRADIENT = 'linear-gradient(115deg, #6A13CF 0%, #C71E92 100%)'

interface OfferPricingProps {
  copy: PromoPageCopy
  status: OfferStatus
  route: PromoRoute
  attribution: Attribution
}

/**
 * The offer box on the landing page's gradient: the first-year price, how it
 * is billed, the regular price in dollars, the monthly credit allocation, and
 * what year two costs. Once the offer has expired the box shows only the
 * regular prices from the verified plan data; no promotional figure remains.
 */
export function OfferPricing({ copy, status, route, attribution }: OfferPricingProps) {
  const { offer } = copy
  const showOffer = showsOfferTerms(status)
  return (
    <section aria-labelledby="offer-heading" className="border-t border-line py-16 sm:py-20 lg:py-24" id="offer">
      <Container>
        <div className="grid gap-10 rounded-2xl p-6 text-white sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14" style={{ background: BOX_GRADIENT }}>
          <div>
            <p className="text-[13px] font-semibold tracking-[0.02em] text-white/95">{showOffer ? copy.pricing.eyebrow : 'Plan pricing'}</p>
            <h2 id="offer-heading" className="mt-3 text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-[2.25rem] lg:text-[2.5rem]">
              {showOffer ? copy.pricing.title : copy.pricing.expiredTitle}
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/95 sm:text-lg">{showOffer ? copy.pricing.creditsNote : regularTermsLine(offer)}</p>
            <ul className="mt-6 divide-y divide-white/[0.26] border-y border-white/[0.26]">
              {(showOffer ? [`${formatCount(CREDITS.offerMonthly)} AI credits a month for your first ${CREDITS.offerMonths} months`, ...copy.pricing.included] : [`${formatCount(CREDITS.standardMonthly)} AI credits each month`, ...copy.pricing.included]).map((item) => (
                <li key={item} className="flex items-start gap-3 py-3 text-[16px] text-white">
                  <Check size={18} className="mt-0.5 shrink-0 text-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:border-l lg:border-white/[0.26] lg:pl-14" data-offer-pricing={showOffer ? 'offer' : 'regular'}>
            {showOffer ? (
              <>
                <p className="inline-flex items-center rounded-full border border-white/[0.45] px-3.5 py-1.5 text-sm font-medium text-white">{status === 'live' ? `Ends ${OFFER_WINDOW.endsShortLabel}` : status === 'upcoming' ? `Opens ${OFFER_WINDOW.opensLabel}` : 'Not yet available at checkout'}</p>
                <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-5xl font-semibold tracking-[-0.03em] text-white">{formatUsd(offer.firstYearPrice)}</span>{' '}
                  <span className="text-lg text-white/95">for your first year</span>
                </p>
                <p className="mt-1 text-[15px] text-white/95">Billed annually at purchase. {regularPriceLine(offer)}</p>
              </>
            ) : (
              <>
                <p className="inline-flex items-center rounded-full border border-white/[0.45] px-3.5 py-1.5 text-sm font-medium text-white">Offer ended {OFFER_WINDOW.endsShortLabel}</p>
                <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-5xl font-semibold tracking-[-0.03em] text-white">{formatUsd(offer.regularMonthlyPrice)}</span>{' '}
                  <span className="text-lg text-white/95">/month billed monthly</span>
                </p>
                <p className="mt-1 text-[15px] text-white/95">Or {formatUsd(offer.regularAnnualPrice)} a year billed annually.</p>
              </>
            )}
            <PromoCta page={copy.page} placement="offer" plan={route.plan} billing={route.billing} status={status} campaign={attribution.campaign} href={route.href} label={route.label} size="lg" variant="inverse" className="mt-6 w-full sm:w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-white/95">{status === 'live' ? `${firstYearLine(offer)} ${DEADLINE_SENTENCE}` : copy.heroNote[status]}</p>
            {showOffer && <p className="mt-4 text-sm leading-relaxed text-white/95">{copy.pricing.afterYearOne}</p>}
            <p className="mt-4 text-sm leading-relaxed text-white/95">Freelance services purchased separately.</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
