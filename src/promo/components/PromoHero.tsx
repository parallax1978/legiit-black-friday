import { Container } from '../../components/ui/Container'
import { ProductOverviewVideo } from '../../components/media/ProductOverviewVideo'
import { COMPANY_LINE } from '../../config/site'
import type { Attribution } from '../attribution'
import { withAttribution } from '../attribution'
import type { PromoPageCopy } from '../content'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { track } from '../../lib/analytics'
import { PromoCta } from './PromoCta'

const H1_GRADIENT = 'linear-gradient(95deg, #6A13CF 12%, #C71E92 98%)'

interface PromoHeroProps {
  copy: PromoPageCopy
  status: OfferStatus
  route: PromoRoute
  attribution: Attribution
}

/**
 * The landing page's centered hero: eyebrow, two-line H1 (line 2 on the brand
 * gradient), subhead, one hero-size button, the state-specific offer line, the
 * route to the other plan, then the playable product overview.
 */
export function PromoHero({ copy, status, route, attribution }: PromoHeroProps) {
  const switchHref = withAttribution(copy.switchPlan.href, attribution)
  const business = copy.page === 'business'
  return (
    <section aria-labelledby="hero-heading" className="pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <p className={business ? 'eyebrow text-[15.6px]' : 'eyebrow'}>{copy.eyebrow}</p>
          <h1 id="hero-heading" className="mt-4 text-[2.375rem] font-semibold leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.75rem] lg:text-[3rem] xl:text-[3.25rem]">
            <span className={business ? 'block bg-clip-text text-[1.33em] text-transparent' : 'block'} style={business ? { backgroundImage: H1_GRADIENT } : undefined}>
              {copy.h1Line1}
            </span>
            <span className={business ? 'mt-3 block text-[0.5em]' : 'block bg-clip-text text-transparent'} style={business ? undefined : { backgroundImage: H1_GRADIENT }}>
              {copy.h1Line2}
            </span>
          </h1>
          {copy.offerLine && <p className="mx-auto mt-4 max-w-2xl text-[17px] font-semibold leading-relaxed text-brand-purple">{copy.offerLine}</p>}
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed">{copy.subhead}</p>
          <div className="mt-8 flex justify-center">
            <PromoCta
              page={copy.page}
              placement="hero"
              plan={route.plan}
              billing={route.billing}
              status={status}
              campaign={attribution.campaign}
              href={route.href}
              label={route.label}
              size="hero"
              className="w-full sm:w-auto"
            />
          </div>
          <p data-hero-note className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-ink">
            {copy.heroNote[status]}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {copy.switchPlan.before}
            <a
              href={switchHref}
              data-switch-plan
              className={`whitespace-nowrap rounded-sm ${business ? 'font-normal' : 'font-medium'} text-brand-purple underline decoration-brand-purple/40 underline-offset-4 hover:decoration-brand-purple btn-focus`}
              onClick={() => track('promo_cta_click', { page: copy.page, placement: 'hero-switch', plan: copy.page === 'business' ? 'agency_dashboard' : 'business_dashboard', status, campaign: attribution.campaign, destination: switchHref })}
            >
              {copy.switchPlan.linkLabel}
            </a>
            {copy.switchPlan.after}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl sm:mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{copy.demo.eyebrow}</p>
            <h2 className="h2 mt-3">{copy.demo.title}</h2>
            <p className="lead mt-3">{copy.demo.body}</p>
          </div>
          <ProductOverviewVideo className="mt-8" caption={null} />
        </div>

        <p className="mx-auto mt-10 max-w-5xl border-t border-line pt-5 text-center text-sm text-ink-muted sm:mt-12">{COMPANY_LINE}</p>
      </Container>
    </section>
  )
}
