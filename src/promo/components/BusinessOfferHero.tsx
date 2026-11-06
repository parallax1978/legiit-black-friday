import { Container } from '../../components/ui/Container'
import { ProductOverviewVideo } from '../../components/media/ProductOverviewVideo'
import { Check, ChevronRight } from '../../components/ui/Icons'
import { COMPANY_LINE } from '../../config/site'
import type { Attribution } from '../attribution'
import { withAttribution } from '../attribution'
import type { PromoPageCopy } from '../content'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { track } from '../../lib/analytics'
import { PromoCta } from './PromoCta'

const PRICE_GRADIENT = 'linear-gradient(95deg, #6A13CF 12%, #C71E92 98%)'

interface BusinessOfferHeroProps {
  copy: PromoPageCopy
  hero: NonNullable<PromoPageCopy['offerHero']>
  status: OfferStatus
  route: PromoRoute
  attribution: Attribution
}

/**
 * The Business page's hero while the Black Friday offer shows, built to the
 * approved mockup: grey eyebrow, a one-line H1 with the price on the brand
 * gradient, the regular price struck through next to the saving, the monthly
 * equivalent, the benefit paragraph, a solid purple button, a link to the demo,
 * the deadline, the route to the Agency offer, then the product overview.
 */
export function BusinessOfferHero({ copy, hero, status, route, attribution }: BusinessOfferHeroProps) {
  const switchHref = withAttribution(copy.switchPlan.href, attribution)
  return (
    <section aria-labelledby="hero-heading" className="pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[15px] font-semibold tracking-[0.02em] text-ink-muted">{copy.eyebrow}</p>
          <h1 id="hero-heading" className="mt-3 text-[2.5rem] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[3rem] lg:text-[3.5rem]">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: PRICE_GRADIENT }}>
              {copy.h1Line1}
            </span>{' '}
            {copy.h1Line2}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink sm:text-lg">
            {hero.compare.label} <s className="text-ink-muted">{hero.compare.regular}</s> <span className="text-ink-muted">·</span>{' '}
            <span className="font-semibold text-brand-purple">{hero.compare.saving}</span>
          </p>
          <p className="mt-1 text-[15px] text-ink-muted">{hero.monthly}</p>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">{copy.subhead}</p>
          <div className="mt-7 flex justify-center">
            <PromoCta
              page={copy.page}
              placement="hero"
              plan={route.plan}
              billing={route.billing}
              status={status}
              campaign={attribution.campaign}
              href={route.href}
              label={route.label}
              size="lg"
              variant="solid"
              className="w-full !gap-2 !rounded-[10px] !text-[17px] !font-bold sm:w-auto"
            />
          </div>
          <p className="mt-3">
            <a href="#demo" data-demo-link className="inline-flex min-h-[44px] items-center gap-0.5 rounded-sm px-1 text-[16px] font-semibold text-brand-purple underline-offset-4 hover:underline btn-focus">
              {hero.demoLink}
              <ChevronRight size={16} />
            </a>
          </p>
          <p data-hero-note className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink-muted">
            <Check size={15} className="shrink-0" />
            {hero.deadline}
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
            {copy.switchPlan.before}
            <a
              href={switchHref}
              data-switch-plan
              className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm font-medium text-brand-purple underline-offset-4 hover:underline btn-focus"
              onClick={() => track('promo_cta_click', { page: copy.page, placement: 'hero-switch', plan: 'agency_dashboard', status, campaign: attribution.campaign, destination: switchHref })}
            >
              {copy.switchPlan.linkLabel}
              <ChevronRight size={14} />
            </a>
            {copy.switchPlan.after}
          </p>
        </div>

        <div id="demo" className="mx-auto mt-12 max-w-5xl scroll-mt-6 sm:mt-16">
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
