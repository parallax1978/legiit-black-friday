import { useEffect, useMemo } from 'react'
import { Check, LogIn, PiggyBank, ShoppingCart, Wallet } from 'lucide-react'
import { track } from '../lib/analytics'
import { depositUrl, loadAttribution, withAttribution } from './attribution'
import { BUCKS_PAGE, statusBanner } from './content'
import { CHECKOUT_READY, PROMO_ROUTES } from './offer'
import { useOfferStatus, type OfferStatus } from './status'
import { NoteBox } from './components/NoteBox'
import { PromoCta } from './components/PromoCta'
import { PromoFooter } from './components/PromoFooter'
import { PromoHeader } from './components/PromoHeader'
import { SectionHead } from './components/SectionHead'

/** Step markers: black outline icons, about 48px, no tile, above each step heading. */
const STEP_ICONS = [LogIn, Wallet, PiggyBank, ShoppingCart]

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
    <div id="top" className="promo min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-legiit-charcoal">
        Skip to content
      </a>
      <PromoHeader current="legiitBucks" cta={{ ...cta, label: route.headerLabel }} attribution={attribution} />
      <main id="main">
        <section aria-labelledby="hero-heading" className="bg-legiit-offwhite">
          <div className="p-wrap p-section">
            <div className="p-text">
              <p role="status" data-offer-status={status} className="p-meta">
                {statusBanner(status, 'legiit-bucks')}
              </p>
              <h1 id="hero-heading" className="p-h1 mt-3">
                <span className="block">{showOffer ? copy.h1Line1 : copy.expiredHero.h1Line1}</span>
                <span className="block">{showOffer ? copy.h1Line2 : copy.expiredHero.h1Line2}</span>
              </h1>
              <p className="p-intro mt-5">{showOffer ? copy.subhead : copy.heroNote.expired}</p>
              <div className="mt-7">
                <PromoCta {...cta} placement="hero" label={route.label} className="w-full min-[734px]:w-auto" />
              </div>
              <p data-hero-note className="p-body mt-5">
                {copy.heroNote[status]}
              </p>
            </div>

            {showOffer && (
              <div className="p-card mt-10 p-6 min-[734px]:p-8" data-bucks-math>
                <dl className="grid grid-cols-1 gap-4 min-[734px]:grid-cols-[1fr_auto_1fr_auto_1.2fr] min-[734px]:items-center">
                  <div>
                    <dt className="p-meta">{copy.math.deposit.label}</dt>
                    <dd className="p-h2 mt-1">{copy.math.deposit.amount}</dd>
                  </div>
                  <span aria-hidden="true" className="p-h2 font-normal text-legiit-secondary">
                    +
                  </span>
                  <div>
                    <dt className="p-meta">{copy.math.bonus.label}</dt>
                    <dd className="p-h2 mt-1">{copy.math.bonus.amount}</dd>
                  </div>
                  <span aria-hidden="true" className="p-h2 font-normal text-legiit-secondary">
                    =
                  </span>
                  <div>
                    <dt className="p-meta">{copy.math.total.label}</dt>
                    <dd className="p-h2 mt-1">{copy.math.total.amount}</dd>
                  </div>
                </dl>
              </div>
            )}
            {showOffer && <NoteBox className="mt-6 bg-white">{copy.math.clarification}</NoteBox>}
          </div>
        </section>

        <section aria-labelledby="how-heading" className="p-wrap p-section">
          <SectionHead id="how-heading" title={copy.how.title} lead={copy.how.lead} />
          <ol className="mt-10 grid gap-6 min-[734px]:grid-cols-2 min-[980px]:grid-cols-4">
            {copy.how.steps.map((step, i) => {
              const Icon = STEP_ICONS[i] ?? Check
              return (
                <li key={step.title} className="p-card p-body p-6">
                  <Icon size={48} strokeWidth={1.5} aria-hidden="true" className="text-legiit-charcoal" />
                  <p className="p-meta mt-4">Step {i + 1}</p>
                  <h3 className="p-card-title mt-1">{step.title}</h3>
                  <p className="mt-2">{step.body}</p>
                </li>
              )
            })}
          </ol>
        </section>

        <section aria-labelledby="rules-heading" className="p-wrap p-section">
          <SectionHead id="rules-heading" title={copy.rules.title} lead={copy.rules.lead} />
          <ul className="p-text p-body mt-8 border-t border-legiit-border">
            {copy.rules.items.map((item) => {
              const [before, after] = item.split(copy.rules.historyLink.text)
              return (
                <li key={item} className="flex items-start gap-3 border-b border-legiit-border py-4">
                  <Check size={20} aria-hidden="true" className="mt-1 shrink-0 text-legiit-purple" />
                  <span>
                    {after === undefined ? (
                      item
                    ) : (
                      <>
                        {before}
                        <a href={copy.rules.historyLink.href} className="p-link">
                          {copy.rules.historyLink.text}
                        </a>
                        {after}
                      </>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="final-heading" className="p-wrap p-section">
          <div className="p-card p-6 min-[734px]:p-10">
            <div className="p-text">
              <h2 id="final-heading" className="p-h2">
                {showOffer ? copy.final.title : 'Spend your Legiit Bucks on the work your business needs.'}
              </h2>
              <p className="p-intro mt-3">{showOffer ? copy.final.body : copy.heroNote.expired}</p>
              <div className="mt-7">
                <PromoCta {...cta} placement="final" label={route.label} className="w-full min-[734px]:w-auto" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <PromoFooter />
    </div>
  )
}
