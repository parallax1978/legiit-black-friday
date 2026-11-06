import { Container } from '../../components/ui/Container'
import { formatCount } from '../../pricing/price'
import { CREDITS } from '../offer'
import type { OfferPageCopy } from '../content'

/**
 * The Business offer page's bonus section: the offer and standard monthly
 * figures side by side, the yearly difference, and twelve solid bars at the
 * offer amount beside one at the standard amount.
 */
export function BonusCredits({ copy }: { copy: OfferPageCopy['credits'] }) {
  const months = Array.from({ length: CREDITS.offerMonths }, (_, i) => i + 1)
  const ratio = CREDITS.standardMonthly / CREDITS.offerMonthly
  return (
    <section aria-labelledby="credits-heading" className="bg-canvas-sunken py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 id="credits-heading" className="h2 mt-3 text-balance">
              {copy.title}
            </h2>
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <p className="text-[2rem] font-bold leading-none tracking-[-0.02em] text-brand-purple">{copy.offerValue}</p>
                <p className="mt-1.5 text-[13px] text-ink-muted">{copy.offerLabel}</p>
              </div>
              <div>
                <p className="text-[2rem] font-bold leading-none tracking-[-0.02em] text-ink">{copy.standardValue}</p>
                <p className="mt-1.5 text-[13px] text-ink-muted">{copy.standardLabel}</p>
              </div>
            </div>
            <p className="lead mt-6 text-pretty">{copy.body}</p>
          </div>
          <figure>
            <div className="rounded-2xl border border-line bg-canvas p-5 sm:p-6">
              <div role="img" aria-label={`${formatCount(CREDITS.offerMonthly)} AI credits in each of months 1 to ${CREDITS.offerMonths}, then ${formatCount(CREDITS.standardMonthly)} a month from month ${CREDITS.offerMonths + 1}.`} className="flex items-end gap-1.5 sm:gap-2" style={{ height: 120 }}>
                {months.map((m) => (
                  <div key={m} className="h-full min-w-0 flex-1 rounded-[3px] bg-brand-purple" />
                ))}
                <div aria-hidden="true" className="mx-1 h-full w-px bg-line-strong sm:mx-2" />
                <div className="flex min-w-0 flex-1 items-end self-stretch">
                  <div className="w-full rounded-[3px] bg-line-strong" style={{ height: `${ratio * 100}%` }} />
                </div>
              </div>
              <div aria-hidden="true" className="mt-3 flex items-center justify-between gap-4 text-[13px] text-ink-muted">
                <span>{copy.barsOffer}</span>
                <span className="whitespace-nowrap">{copy.barsAfter}</span>
              </div>
            </div>
            <figcaption className="sr-only">
              {copy.barsOffer}. {copy.barsAfter}.
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  )
}
