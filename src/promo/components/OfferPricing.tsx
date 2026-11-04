import { Check } from 'lucide-react'
import { formatCount, formatUsd } from '../../pricing/price'
import type { Attribution } from '../attribution'
import { DEADLINE_SENTENCE, regularPriceLine, regularTermsLine, type PromoPageCopy } from '../content'
import { CREDITS, OFFER_WINDOW } from '../offer'
import type { PromoRoute } from '../routes'
import { showsOfferTerms, type OfferStatus } from '../status'
import { NoteBox } from './NoteBox'
import { PromoCta } from './PromoCta'
import { SectionHead } from './SectionHead'

interface OfferPricingProps {
  copy: PromoPageCopy
  status: OfferStatus
  route: PromoRoute
  attribution: Attribution
}

/**
 * Two description cards: what you pay and what is included, then a note on
 * what year two costs. Once the offer has expired the price card shows only
 * the regular prices from the verified plan data; no promotional figure
 * remains and the note is dropped.
 */
export function OfferPricing({ copy, status, route, attribution }: OfferPricingProps) {
  const { offer } = copy
  const showOffer = showsOfferTerms(status)
  const stateLine = status === 'live' ? `Ends ${OFFER_WINDOW.endsShortLabel}, 2026` : status === 'upcoming' ? `Opens ${OFFER_WINDOW.opensLabel}` : status === 'pending' ? 'Not yet available at checkout' : `Offer ended ${OFFER_WINDOW.endsShortLabel}, 2026`
  const included = showOffer ? [`${formatCount(CREDITS.offerMonthly)} AI credits a month for your first ${CREDITS.offerMonths} months`, ...copy.pricing.included] : [`${formatCount(CREDITS.standardMonthly)} AI credits each month`, ...copy.pricing.included]
  return (
    <section aria-labelledby="offer-heading" className="p-wrap p-section" id="offer">
      <SectionHead id="offer-heading" title={showOffer ? copy.pricing.title : copy.pricing.expiredTitle} lead={copy.pricing.lead} />
      <div className="mt-10 grid gap-6 min-[734px]:grid-cols-2">
        <div className="p-card p-body flex flex-col p-6 min-[734px]:p-8" data-offer-pricing={showOffer ? 'offer' : 'regular'}>
          <h3 className="p-card-title">What you pay</h3>
          <p className="p-meta mt-1">{stateLine}</p>
          {showOffer ? (
            <>
              <p className="mt-5">
                <span className="p-h2">{formatUsd(offer.firstYearPrice)}</span> <span>for your first year</span>
              </p>
              <p className="mt-2">Billed annually at purchase. {regularPriceLine(offer)}</p>
            </>
          ) : (
            <>
              <p className="mt-5">
                <span className="p-h2">{formatUsd(offer.regularMonthlyPrice)}</span> <span>/month billed monthly</span>
              </p>
              <p className="mt-2">Or {formatUsd(offer.regularAnnualPrice)} a year billed annually.</p>
            </>
          )}
          <div className="mt-6">
            <PromoCta page={copy.page} placement="offer" plan={route.plan} billing={route.billing} status={status} campaign={attribution.campaign} href={route.href} label={route.label} className="w-full min-[734px]:w-auto" />
          </div>
          <p className="p-meta mt-4">{status === 'live' ? DEADLINE_SENTENCE : status === 'expired' ? regularTermsLine(offer) : copy.heroNote[status]}</p>
          <p className="p-meta mt-2">Freelance services purchased separately.</p>
        </div>
        <div className="p-card p-body p-6 min-[734px]:p-8">
          <h3 className="p-card-title">What is included</h3>
          <ul className="mt-5 flex flex-col gap-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={20} aria-hidden="true" className="mt-1 shrink-0 text-legiit-purple" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showOffer && <NoteBox className="mt-6">{copy.pricing.afterYearOne}</NoteBox>}
    </section>
  )
}
