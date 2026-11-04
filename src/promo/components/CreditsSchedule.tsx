import { Container } from '../../components/ui/Container'
import { formatCount } from '../../pricing/price'
import { CREDITS } from '../offer'
import { CREDITS_SCHEDULE } from '../content'

/**
 * The monthly allocation drawn as twelve equal bars at the offer amount and
 * one at the standard amount, so "allocated monthly, not all at once" is
 * visible as well as stated. Pure CSS, labelled for screen readers.
 */
export function CreditsSchedule() {
  const months = Array.from({ length: CREDITS.offerMonths }, (_, i) => i + 1)
  const ratio = CREDITS.standardMonthly / CREDITS.offerMonthly
  return (
    <section aria-labelledby="credits-heading" className="border-t border-line bg-brand-tint/50 py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div className="max-w-xl">
            <p className="eyebrow">{CREDITS_SCHEDULE.eyebrow}</p>
            <h2 id="credits-heading" className="h2 mt-3 text-balance">
              {CREDITS_SCHEDULE.title}
            </h2>
            <p className="lead mt-4 text-pretty">{CREDITS_SCHEDULE.body}</p>
          </div>
          <figure>
            <div className="rounded-2xl border border-line bg-canvas p-5 shadow-frame sm:p-6">
              <div role="img" aria-label={`${formatCount(CREDITS.offerMonthly)} AI credits in each of months 1 to ${CREDITS.offerMonths}, then ${formatCount(CREDITS.standardMonthly)} a month from month ${CREDITS.offerMonths + 1}.`} className="flex items-end gap-1 sm:gap-1.5" style={{ height: 150 }}>
                {months.map((m) => (
                  <div key={m} className="flex min-w-0 flex-1 flex-col items-center justify-end self-stretch">
                    <div className="w-full rounded-t-md" style={{ height: '100%', background: 'linear-gradient(180deg, #6A13CF 0%, #C71E92 100%)' }} />
                  </div>
                ))}
                <div aria-hidden="true" className="mx-1 h-full w-px bg-line-strong sm:mx-2" />
                <div className="flex min-w-0 flex-1 flex-col items-center justify-end self-stretch">
                  <div className="w-full rounded-t-md bg-line-strong" style={{ height: `${ratio * 100}%` }} />
                </div>
              </div>
              <div aria-hidden="true" className="mt-3 flex gap-1 text-[12px] font-medium text-ink-muted sm:gap-1.5 sm:text-[13px]">
                <div className="flex-[12] rounded-md bg-brand-tint px-2 py-1.5 text-center text-brand-purple">
                  {CREDITS_SCHEDULE.offerLabel}: {formatCount(CREDITS.offerMonthly)} each
                </div>
                <div className="mx-1 w-px sm:mx-2" />
                <div className="flex-1 whitespace-nowrap px-1 py-1.5 text-center">{formatCount(CREDITS.standardMonthly)}</div>
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-ink-muted">
              {CREDITS_SCHEDULE.offerLabel}: {formatCount(CREDITS.offerMonthly)} AI credits a month. {CREDITS_SCHEDULE.afterLabel}: the standard {formatCount(CREDITS.standardMonthly)}.
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  )
}
