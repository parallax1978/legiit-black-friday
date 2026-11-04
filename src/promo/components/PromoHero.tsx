import type { Attribution } from '../attribution'
import { withAttribution } from '../attribution'
import { statusBanner, type PromoPageCopy } from '../content'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { track } from '../../lib/analytics'
import { PromoCta } from './PromoCta'

interface PromoHeroProps {
  copy: PromoPageCopy
  status: OfferStatus
  route: PromoRoute
  attribution: Attribution
}

/**
 * Off-white hero: the offer state as a meta line, a two-line H1, the
 * one-sentence intro, the primary button, the state-specific terms line, and
 * the link to the other plan's page.
 */
export function PromoHero({ copy, status, route, attribution }: PromoHeroProps) {
  const switchHref = withAttribution(copy.switchPlan.href, attribution)
  return (
    <section aria-labelledby="hero-heading" className="bg-legiit-offwhite">
      <div className="p-wrap p-section">
        <div className="p-text">
          <p role="status" data-offer-status={status} className="p-meta">
            {statusBanner(status, 'command-center')}
          </p>
          <h1 id="hero-heading" className="p-h1 mt-3">
            <span className="block">{copy.h1Line1}</span>
            <span className="block">{copy.h1Line2}</span>
          </h1>
          <p className="p-intro mt-5">{copy.subhead}</p>
          <div className="mt-7 flex flex-col gap-4 min-[734px]:flex-row min-[734px]:items-center">
            <PromoCta page={copy.page} placement="hero" plan={route.plan} billing={route.billing} status={status} campaign={attribution.campaign} href={route.href} label={route.label} className="w-full min-[734px]:w-auto" />
            <a
              href={switchHref}
              data-switch-plan
              className="p-link inline-flex min-h-[44px] items-center"
              onClick={() => track('promo_cta_click', { page: copy.page, placement: 'hero-switch', plan: copy.page === 'business' ? 'agency_dashboard' : 'business_dashboard', status, campaign: attribution.campaign, destination: switchHref })}
            >
              {copy.switchPlan.linkLabel}
            </a>
          </div>
          <p data-hero-note className="p-body mt-5">
            {copy.heroNote[status]}
          </p>
        </div>
      </div>
    </section>
  )
}
