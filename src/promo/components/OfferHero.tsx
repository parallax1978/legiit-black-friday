import { Container } from '../../components/ui/Container'
import { ProductOverviewVideo } from '../../components/media/ProductOverviewVideo'
import { ChevronRight, Star } from '../../components/ui/Icons'
import { COMPANY_LINE } from '../../config/site'
import type { Attribution } from '../attribution'
import { trialStartUrl, withAttribution } from '../attribution'
import type { OfferPageCopy, PromoPageCopy } from '../content'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { track } from '../../lib/analytics'
import { PromoCta } from './PromoCta'

const PRICE_GRADIENT = 'linear-gradient(95deg, var(--brand-purple, #6A13CF) 12%, #C71E92 98%)'

/** Joins the last two words with a non-breaking space so the headline never ends on a one-word line. */
export const keepLastTwoWords = (text: string) => text.replace(/ (?=\S+$)/, '\u00A0')

interface OfferHeroProps {
  copy: PromoPageCopy
  page: OfferPageCopy
  status: OfferStatus
  route: PromoRoute
  attribution: Attribution
}

/**
 * A promotion page's hero while its Black Friday offer shows, built to the
 * approved design: grey eyebrow, a one-line H1 with the price on the brand
 * gradient, the regular price struck through beside the saving, the monthly
 * equivalent, the bonus pill, the benefit paragraph, a solid purple button, a
 * link to the demo, the billing line (with the trial link where the page has
 * one), the route to the other plan, the company line, then the product
 * overview with its chapters.
 */
export function OfferHero({ copy, page, status, route, attribution }: OfferHeroProps) {
  const switchHref = withAttribution(copy.switchPlan.href, attribution)
  const trialHref = trialStartUrl(attribution)
  const linkClass = 'whitespace-nowrap rounded-sm font-medium text-brand-purple underline-offset-4 hover:underline btn-focus'
  return (
    <section aria-labelledby="hero-heading" className="pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[15px] font-semibold tracking-[0.02em] text-ink-muted">{copy.eyebrow}</p>
          <h1 id="hero-heading" className="mt-3 text-[2.5rem] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[3rem] lg:text-[4rem]">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: PRICE_GRADIENT }}>
              {copy.h1Line1}
            </span>{' '}
            {keepLastTwoWords(copy.h1Line2)}
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-ink sm:text-lg">
            {page.compare.label} <s className="text-ink-muted">{page.compare.regular}</s> <span className="text-ink-muted">·</span>{' '}
            <span className="font-semibold text-brand-purple">{page.compare.saving}</span>
          </p>
          <p className="mt-1 text-[15px] text-ink-muted">{page.monthly}</p>
          <p className="mt-3 flex justify-center">
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-[13px] font-semibold leading-snug text-brand-purple">
              <Star size={14} className="shrink-0" />
              {page.bonus}
            </span>
          </p>
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
              size="offer"
              variant="solid"
              className="w-full sm:w-auto"
            />
          </div>
          <p className="mt-3">
            <a href="#demo" data-demo-link className="inline-flex min-h-[44px] items-center gap-0.5 rounded-sm px-1 text-[17px] font-semibold text-brand-purple underline-offset-4 hover:underline btn-focus">
              {page.demoLink}
              <ChevronRight size={16} />
            </a>
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
            {page.terms.before}
            {page.terms.trialLabel && (
              <a
                href={trialHref}
                data-trial-link
                className={linkClass}
                onClick={() => track('promo_cta_click', { page: copy.page, placement: 'hero-trial', plan: 'business_dashboard', billing: 'monthly', status, campaign: attribution.campaign, destination: trialHref })}
              >
                {page.terms.trialLabel}
                <ChevronRight size={14} className="inline-block align-[-2px]" />
              </a>
            )}
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-relaxed text-ink-muted">
            {copy.switchPlan.before}
            <a
              href={switchHref}
              data-switch-plan
              className={linkClass}
              onClick={() => track('promo_cta_click', { page: copy.page, placement: 'hero-switch', plan: 'agency_dashboard', status, campaign: attribution.campaign, destination: switchHref })}
            >
              {copy.switchPlan.linkLabel}
              <ChevronRight size={14} className="inline-block align-[-2px]" />
            </a>
            {copy.switchPlan.after}
          </p>
          <p className="mt-6 text-sm text-ink-muted">{COMPANY_LINE}</p>
        </div>

        <div id="demo" className="mx-auto mt-14 max-w-5xl scroll-mt-6 sm:mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{copy.demo.eyebrow}</p>
            <h2 className="h2 mt-3">{copy.demo.title}</h2>
            <p className="lead mt-3">{copy.demo.body}</p>
          </div>
          <ProductOverviewVideo className="mt-8" caption={null} chapters />
        </div>
      </Container>
    </section>
  )
}
