import { useEffect, useMemo } from 'react'
import { Container } from '../components/ui/Container'
import { Footer } from '../components/sections/Footer'
import { Check } from '../components/ui/Icons'
import { track } from '../lib/analytics'
import { depositUrl, loadAttribution, withAttribution } from './attribution'
import { BUCKS_PAGE, statusBanner } from './content'
import { CHECKOUT_READY, PROMO_ROUTES } from './offer'
import { useOfferStatus, type OfferStatus } from './status'
import { PromoCta } from './components/PromoCta'
import { PromoHeader } from './components/PromoHeader'
import { StatusStrip } from './components/StatusStrip'

const H1_GRADIENT = 'linear-gradient(95deg, #6A13CF 12%, #C71E92 98%)'
const BOX_GRADIENT = 'linear-gradient(115deg, #6A13CF 0%, #C71E92 100%)'

function bucksRoute(status: OfferStatus, attribution: ReturnType<typeof loadAttribution>) {
  const { cta } = BUCKS_PAGE
  if (status === 'live') return { href: depositUrl(attribution), label: cta.live, headerLabel: cta.liveHeader, plan: 'legiit_bucks' as const }
  if (status === 'expired') return { href: withAttribution(PROMO_ROUTES.browseServices, attribution), label: cta.expired, headerLabel: cta.expiredHeader, plan: 'marketplace' as const }
  return { href: withAttribution(PROMO_ROUTES.register, attribution), label: cta.upcoming, headerLabel: cta.upcomingHeader, plan: 'marketplace' as const }
}

/** The Legiit Bucks deposit page: shorter than the plan pages and kept apart from Command Center pricing. */
export default function BucksApp() {
  const status = useOfferStatus(CHECKOUT_READY.legiitBucksDeposit)
  const attribution = useMemo(loadAttribution, [])
  const route = bucksRoute(status, attribution)
  const copy = BUCKS_PAGE
  const showOffer = status !== 'expired'

  useEffect(() => {
    track('promo_view', { page: 'legiit-bucks', status, campaign: attribution.campaign, ...attribution.utm })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cta = { page: 'legiit-bucks' as const, plan: route.plan, status, campaign: attribution.campaign, href: route.href }

  return (
    <div id="top" className="promo min-h-dvh bg-canvas text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-canvas focus:px-4 focus:py-3 focus:text-ink focus:shadow-frame btn-focus">
        Skip To Content
      </a>
      <StatusStrip status={status} text={statusBanner(status, 'legiit-bucks')} />
      <PromoHeader productName="Legiit Bucks" cta={{ ...cta, label: route.headerLabel }} />
      <main id="main">
        <section aria-labelledby="hero-heading" className="pb-12 pt-10 sm:pb-16 sm:pt-14 lg:pt-16">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 id="hero-heading" className="mt-4 text-[2.375rem] font-semibold leading-[1.08] tracking-[-0.025em] text-ink sm:text-[2.75rem] lg:text-[3rem] xl:text-[3.25rem]">
                <span className="block">{showOffer ? copy.h1Line1 : 'Legiit Bucks.'}</span>
                <span className="block bg-clip-text text-transparent" style={{ backgroundImage: H1_GRADIENT }}>
                  {showOffer ? copy.h1Line2 : 'Spend Them At Checkout.'}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl sm:leading-relaxed">{showOffer ? copy.subhead : copy.heroNote.expired}</p>
              <div className="mt-8 flex justify-center">
                <PromoCta {...cta} placement="hero" label={route.label} size="hero" className="w-full sm:w-auto" />
              </div>
              <p data-hero-note className="mx-auto mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-ink">
                {copy.heroNote[status]}
              </p>
            </div>

            {showOffer && (
              <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-line bg-canvas p-6 shadow-frame sm:p-8" data-bucks-math>
                <dl className="grid grid-cols-1 items-center gap-4 text-center sm:grid-cols-[1fr_auto_1fr_auto_1.2fr]">
                  <div>
                    <dt className="text-sm font-medium text-ink-muted">{copy.math.deposit.label}</dt>
                    <dd className="mt-1 text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">{copy.math.deposit.amount}</dd>
                  </div>
                  <span aria-hidden="true" className="text-3xl font-light text-ink-muted">
                    +
                  </span>
                  <div>
                    <dt className="text-sm font-medium text-ink-muted">{copy.math.bonus.label}</dt>
                    <dd className="mt-1 text-4xl font-semibold tracking-[-0.03em] text-brand-purple sm:text-5xl">{copy.math.bonus.amount}</dd>
                  </div>
                  <span aria-hidden="true" className="text-3xl font-light text-ink-muted">
                    =
                  </span>
                  <div className="rounded-xl bg-brand-tint px-4 py-3">
                    <dt className="text-sm font-medium text-ink-soft">{copy.math.total.label}</dt>
                    <dd className="mt-1 bg-clip-text text-4xl font-semibold tracking-[-0.03em] text-transparent sm:text-5xl" style={{ backgroundImage: H1_GRADIENT }}>
                      {copy.math.total.amount}
                    </dd>
                  </div>
                </dl>
                <p className="mt-6 border-t border-line pt-4 text-center text-[15px] font-medium text-ink">{copy.math.clarification}</p>
              </div>
            )}
          </Container>
        </section>

        <section aria-labelledby="how-heading" className="border-t border-line py-16 sm:py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="eyebrow">{copy.how.eyebrow}</p>
              <h2 id="how-heading" className="h2 mt-3">
                {copy.how.title}
              </h2>
            </div>
            <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {copy.how.steps.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-line bg-canvas p-6 shadow-frame">
                  <p className="inline-grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: BOX_GRADIENT }} aria-hidden="true">
                    {i + 1}
                  </p>
                  <h3 className="mt-4 text-[17px] font-semibold text-ink">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        <section aria-labelledby="rules-heading" className="border-t border-line bg-brand-tint/50 py-16 sm:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
              <div>
                <p className="eyebrow">{copy.rules.eyebrow}</p>
                <h2 id="rules-heading" className="h2 mt-3">
                  {copy.rules.title}
                </h2>
              </div>
              <ul className="divide-y divide-line border-y border-line">
                {copy.rules.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 py-3.5 text-[16px] leading-relaxed text-ink">
                    <Check size={18} className="mt-1 shrink-0 text-brand-purple" />
                    <span>
                      {item.includes(copy.rules.historyLink.text) ? (
                        <>
                          {item.split(copy.rules.historyLink.text)[0]}
                          <a href={copy.rules.historyLink.href} className="rounded-sm font-medium text-brand-purple underline decoration-brand-purple/40 underline-offset-4 hover:decoration-brand-purple btn-focus">
                            {copy.rules.historyLink.text}
                          </a>
                          {item.split(copy.rules.historyLink.text)[1]}
                        </>
                      ) : (
                        item
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        <section aria-labelledby="final-heading" className="border-t border-line py-16 sm:py-20">
          <Container>
            <div className="rounded-2xl px-6 py-12 text-center text-white sm:px-10 sm:py-16" style={{ background: BOX_GRADIENT }}>
              <h2 id="final-heading" className="mx-auto max-w-2xl text-balance text-[1.875rem] font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-[2.25rem] lg:text-[2.5rem]">
                {showOffer ? copy.final.title : 'Spend your Legiit Bucks on the work your business needs.'}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-[17px] leading-relaxed text-white/95 sm:text-lg">{showOffer ? copy.final.body : copy.heroNote.expired}</p>
              <div className="mt-8 flex justify-center">
                <PromoCta {...cta} placement="final" label={route.label} size="lg" variant="inverse" className="w-full sm:w-auto" />
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer links={copy.footerLinks} navLabel="Footer" />
    </div>
  )
}
