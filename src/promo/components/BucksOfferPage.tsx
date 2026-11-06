import { Container } from '../../components/ui/Container'
import { Footer } from '../../components/sections/Footer'
import { Check, ChevronRight, CreditCard, Gift, ShoppingCart, Star, User } from '../../components/ui/Icons'
import { COMPANY_LINE } from '../../config/site'
import { track } from '../../lib/analytics'
import type { Attribution } from '../attribution'
import { withAttribution } from '../attribution'
import { BUCKS_OFFER_PAGE, BUCKS_PAGE } from '../content'
import { PROMO_ROUTES } from '../offer'
import type { OfferStatus } from '../status'
import { keepLastTwoWords } from './OfferHero'
import { OFFER_PAGE_STYLE } from './offerPageStyle'
import { PromoCta } from './PromoCta'
import { PromoHeader } from './PromoHeader'
import { StatusStrip } from './StatusStrip'

const PRICE_GRADIENT = 'linear-gradient(95deg, var(--brand-purple, #6A13CF) 12%, #C71E92 98%)'
const STEP_ICONS = {
  user: User,
  card: CreditCard,
  gift: Gift,
  cart: ShoppingCart,
} as const

interface BucksOfferPageProps {
  status: OfferStatus
  attribution: Attribution
  cta: {
    page: 'legiit-bucks'
    plan: 'legiit_bucks'
    status: OfferStatus
    campaign: string
    href: string
  }
  label: string
  headerLabel: string
}

/** Renders a rule with its link to the Legiit Bucks history page where the rule names it. */
function ruleText(item: string) {
  const { text, href } = BUCKS_PAGE.rules.historyLink
  if (!item.includes(text)) return item
  const [before, after] = item.split(text)
  return (
    <>
      {before}
      <a href={href} className="rounded-sm font-medium text-brand-purple underline-offset-4 hover:underline btn-focus">
        {text}
      </a>
      {after}
    </>
  )
}

/**
 * The Legiit Bucks page while the deposit bonus is live, in the approved
 * design: banner with a link, solid header pill, the total on the gradient,
 * the deposit beside the bonus, the bonus pill, a solid button, the deadline
 * line, the deposit math under it as on the plan pages, the four steps as grey cards,
 * the rules, the plain closing section and the dark footer.
 */
export function BucksOfferPage({ status, attribution, cta, label, headerLabel }: BucksOfferPageProps) {
  const copy = BUCKS_PAGE
  const offer = BUCKS_OFFER_PAGE
  const browseHref = withAttribution(PROMO_ROUTES.browseServices, attribution)
  return (
    <div id="top" className="promo min-h-dvh bg-canvas text-ink" style={OFFER_PAGE_STYLE}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-canvas focus:px-4 focus:py-3 focus:text-ink focus:shadow-frame btn-focus">
        Skip To Content
      </a>
      <StatusStrip
        status={status}
        text={offer.banner}
        link={{
          label: offer.bannerLink,
          href: cta.href,
          onClick: () =>
            track('promo_cta_click', {
              ...cta,
              placement: 'banner',
              destination: cta.href,
            }),
        }}
      />
      <PromoHeader productName="Legiit Bucks" cta={{ ...cta, label: headerLabel }} look="solid" />
      <main id="main">
        <section aria-labelledby="hero-heading" className="pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pt-16">
          <Container>
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-[15px] font-semibold tracking-[0.02em] text-ink-muted">{copy.eyebrow}</p>
              <h1 id="hero-heading" className="mt-3 text-[2.5rem] font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-[3rem] lg:text-[4rem]">
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: PRICE_GRADIENT }}>
                  {offer.h1Line1}
                </span>{' '}
                {keepLastTwoWords(offer.h1Line2)}
              </h1>
              <p className="mt-4 text-[17px] leading-relaxed text-ink sm:text-lg">
                {offer.compare.depositLabel} <span className="font-semibold">{offer.compare.deposit}</span> <span className="text-ink-muted">·</span>{' '}
                <span className="font-semibold text-brand-purple">
                  {offer.compare.bonusLabel} {offer.compare.bonus}
                </span>
              </p>
              <p className="mx-auto mt-1 max-w-2xl text-[15px] text-ink-muted">{offer.note}</p>
              <p className="mt-3 flex justify-center">
                <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-[13px] font-semibold leading-snug text-brand-purple">
                  <Star size={14} className="shrink-0" />
                  {offer.pill}
                </span>
              </p>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl sm:leading-relaxed">{copy.subhead}</p>
              <div className="mt-7 flex justify-center">
                <PromoCta {...cta} placement="hero" label={label} size="offer" variant="solid" className="w-full sm:w-auto" />
              </div>
              <p className="mt-3">
                <a href="#how" data-how-link className="inline-flex min-h-[44px] items-center gap-0.5 rounded-sm px-1 text-[17px] font-semibold text-brand-purple underline-offset-4 hover:underline btn-focus">
                  {offer.howLink}
                  <ChevronRight size={16} />
                </a>
              </p>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted">
                {offer.terms.before}
                <a
                  href={browseHref}
                  data-browse-link
                  className="whitespace-nowrap rounded-sm font-medium text-brand-purple underline-offset-4 hover:underline btn-focus"
                  onClick={() =>
                    track('promo_cta_click', {
                      page: 'legiit-bucks',
                      placement: 'hero-browse',
                      plan: 'marketplace',
                      status,
                      campaign: attribution.campaign,
                      destination: browseHref,
                    })
                  }
                >
                  {offer.terms.linkLabel}
                  <ChevronRight size={14} className="inline-block align-[-2px]" />
                </a>
              </p>
              <p className="mt-6 text-sm text-ink-muted">{COMPANY_LINE}</p>
            </div>

            <div className="mx-auto mt-14 max-w-4xl sm:mt-20">
              <div className="mx-auto max-w-2xl text-center">
                <p className="eyebrow">{offer.math.eyebrow}</p>
                <h2 id="math-heading" className="h2 mt-3">
                  {offer.math.title}
                </h2>
              </div>
              <div className="mt-8 rounded-2xl border border-line bg-canvas p-6 sm:p-8" data-bucks-math>
                <dl className="grid grid-cols-1 items-center gap-4 text-center sm:grid-cols-[1fr_auto_1fr_auto_1.2fr]">
                  <div>
                    <dt className="text-sm font-medium text-ink-muted">{copy.math.deposit.label}</dt>
                    <dd className="mt-1 text-4xl font-bold tracking-[-0.03em] text-ink sm:text-5xl">{copy.math.deposit.amount}</dd>
                  </div>
                  <span aria-hidden="true" className="text-3xl font-light text-ink-muted">
                    +
                  </span>
                  <div>
                    <dt className="text-sm font-medium text-ink-muted">{copy.math.bonus.label}</dt>
                    <dd className="mt-1 text-4xl font-bold tracking-[-0.03em] text-brand-purple sm:text-5xl">{copy.math.bonus.amount}</dd>
                  </div>
                  <span aria-hidden="true" className="text-3xl font-light text-ink-muted">
                    =
                  </span>
                  <div className="rounded-xl bg-brand-tint px-4 py-3">
                    <dt className="text-sm font-medium text-ink-soft">{copy.math.total.label}</dt>
                    <dd className="mt-1 text-4xl font-bold tracking-[-0.03em] text-brand-purple sm:text-5xl">{copy.math.total.amount}</dd>
                  </div>
                </dl>
                <p className="mt-6 text-center text-[15px] leading-relaxed text-ink-soft">{copy.math.clarification}</p>
              </div>
            </div>
          </Container>
        </section>

        <section id="how" aria-labelledby="how-heading" className="scroll-mt-6 py-16 sm:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="eyebrow">{copy.how.eyebrow}</p>
              <h2 id="how-heading" className="h2 mt-3">
                {copy.how.title}
              </h2>
            </div>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {copy.how.steps.map((step, i) => {
                const Icon = STEP_ICONS[step.icon]
                return (
                  <li key={step.title} className="rounded-2xl bg-canvas-sunken p-6">
                    <Icon size={48} strokeWidth={1.5} className="text-brand-purple" />
                    <p className="mt-4 text-[13px] text-ink-muted">Step {i + 1}</p>
                    <h3 className="mt-1 text-[17px] font-semibold text-ink">{step.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                  </li>
                )
              })}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="rules-heading" className="py-16 sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
              <div>
                <p className="eyebrow">{copy.rules.eyebrow}</p>
                <h2 id="rules-heading" className="h2 mt-3">
                  {copy.rules.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {copy.rules.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink">
                    <Check size={18} className="mt-1 shrink-0 text-brand-purple" />
                    <span>{ruleText(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section aria-labelledby="final-heading" className="bg-canvas-sunken py-16 sm:py-20">
          <Container className="text-center">
            <h2 id="final-heading" className="h2 mx-auto max-w-2xl text-balance">
              {copy.final.title}
            </h2>
            <p className="lead mx-auto mt-4 max-w-xl text-pretty">{copy.final.body}</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <PromoCta {...cta} placement="final" label={label} size="offer" variant="solid" className="w-full sm:w-auto" />
              <p className="max-w-xl text-[13px] text-ink-muted">{copy.final.note}</p>
            </div>
          </Container>
        </section>
      </main>
      <Footer links={copy.footerLinks} navLabel="Footer" tone="dark" note="Prices in US dollars." />
    </div>
  )
}
