import { Container } from '../../components/ui/Container'
import { Check } from '../../components/ui/Icons'
import { formatCount, formatUsd } from '../../pricing/price'
import type { Attribution } from '../attribution'
import type { OfferPageCopy, PromoPageCopy } from '../content'
import { CREDITS } from '../offer'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { PromoCta } from './PromoCta'

interface PlanPricingProps {
  copy: PromoPageCopy
  plan: OfferPageCopy['plan']
  status: OfferStatus
  route: PromoRoute
  attribution: Attribution
}

/**
 * The offer page's pricing: one card with what the plan includes on
 * the left and the first-year price, the saving, the button, and the renewal
 * terms on the right, then the regular-against-Black-Friday table. Shown only
 * while the offer is live; the expired state uses OfferPricing.
 */
export function PlanPricing({ copy, plan, status, route, attribution }: PlanPricingProps) {
  const { offer } = copy
  const afterYearOne = `${formatUsd(offer.regularAnnualPrice)} a year, ${formatCount(CREDITS.standardMonthly)} credits a month`
  return (
    <section aria-labelledby="offer-heading" className="py-16 sm:py-20 lg:py-24" id="offer">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{plan.eyebrow}</p>
          <h2 id="offer-heading" className="h2 mt-3 text-balance">
            {plan.title}
          </h2>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-2xl border border-line lg:grid-cols-[1.05fr_1fr]" data-offer-pricing="offer">
          <div className="p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-ink">{plan.name}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{plan.tagline}</p>
            <ul className="mt-5 space-y-2.5">
              {plan.included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-purple" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line bg-canvas-sunken p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="inline-flex rounded-full bg-brand-tintStrong px-3 py-1 text-[12px] font-semibold text-brand-purple">{plan.pill}</p>
            <p className="mt-4 text-[15px] text-ink-muted">
              Regular <s>{formatUsd(offer.regularAnnualPrice)}</s> a year
            </p>
            <p className="mt-1 text-[2.75rem] font-bold leading-none tracking-[-0.03em] text-ink">{formatUsd(offer.firstYearPrice)}</p>
            <p className="mt-2 text-[15px] text-ink">{plan.priceLine}</p>
            <p className="mt-1 text-[15px] font-semibold text-brand-purple">{plan.saving}</p>
            <PromoCta page={copy.page} placement="offer" plan={route.plan} billing={route.billing} status={status} campaign={attribution.campaign} href={route.href} label={route.label} size="lg" variant="solid" className="mt-5 w-full !min-h-[60px] !gap-2 !rounded-[14px]" />
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink-muted">{plan.note}</p>
          </div>
        </div>

        <table className="mt-8 w-full table-fixed border-collapse text-left text-[15px]" data-offer-compare>
          <caption className="sr-only">Regular price against the Black Friday special</caption>
          <colgroup>
            <col className="w-[34%] sm:w-[30%]" />
            <col className="w-[33%] sm:w-[35%]" />
            <col className="w-[33%] sm:w-[35%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-ink">
              <td className="px-3 py-3" />
              <th scope="col" className="px-3 py-3 text-[14px] font-medium text-ink-muted">
                Regular
              </th>
              <th scope="col" className="px-3 py-3 text-[14px] font-semibold text-brand-purple">
                Black Friday
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line align-top">
              <th scope="row" className="px-3 py-3 font-medium text-ink">
                First year
              </th>
              <td className="px-3 py-3 text-ink-soft">{formatUsd(offer.regularAnnualPrice)}</td>
              <td className="px-3 py-3 font-semibold text-ink">{formatUsd(offer.firstYearPrice)}</td>
            </tr>
            <tr className="border-b border-line align-top">
              <th scope="row" className="px-3 py-3 font-medium text-ink">
                AI credits each month
              </th>
              <td className="px-3 py-3 text-ink-soft">{formatCount(CREDITS.standardMonthly)}</td>
              <td className="px-3 py-3 font-semibold text-ink">
                {formatCount(CREDITS.offerMonthly)} for {CREDITS.offerMonths} months
              </td>
            </tr>
            <tr className="border-b border-line align-top">
              <th scope="row" className="px-3 py-3 font-medium text-ink">
                After year one
              </th>
              <td className="px-3 py-3 text-ink-soft">{afterYearOne}</td>
              <td className="px-3 py-3 text-ink">{afterYearOne}</td>
            </tr>
          </tbody>
        </table>
      </Container>
    </section>
  )
}
