import { formatCount } from '../../pricing/price'
import { CREDITS } from '../offer'
import { CREDITS_SCHEDULE, creditsNote } from '../content'
import { NoteBox } from './NoteBox'
import { SectionHead } from './SectionHead'

/**
 * The monthly allocation drawn as twelve equal bars at the offer amount and
 * one at the standard amount, so "allocated monthly, not all at once" is
 * visible as well as stated. Labelled for screen readers.
 */
export function CreditsSchedule() {
  const months = Array.from({ length: CREDITS.offerMonths }, (_, i) => i + 1)
  const ratio = CREDITS.standardMonthly / CREDITS.offerMonthly
  const label = `${formatCount(CREDITS.offerMonthly)} AI credits in each of months 1 to ${CREDITS.offerMonths}, then ${formatCount(CREDITS.standardMonthly)} a month from month ${CREDITS.offerMonths + 1}.`
  return (
    <section aria-labelledby="credits-heading" className="p-wrap p-section">
      <SectionHead id="credits-heading" title={CREDITS_SCHEDULE.title} lead={CREDITS_SCHEDULE.body} />
      <figure className="p-card mt-10 p-6 min-[734px]:p-8">
        <div role="img" aria-label={label} className="flex items-end gap-1 min-[734px]:gap-2" style={{ height: 160 }}>
          {months.map((m) => (
            <div key={m} className="h-full min-w-0 flex-1 rounded-t-md bg-legiit-purple" />
          ))}
          <div aria-hidden="true" className="mx-1 h-full w-px bg-legiit-border min-[734px]:mx-3" />
          <div className="flex h-full min-w-0 flex-1 items-end">
            <div className="w-full rounded-t-md bg-legiit-border" style={{ height: `${ratio * 100}%` }} />
          </div>
        </div>
        <figcaption className="p-meta mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1">
          <span>
            {CREDITS_SCHEDULE.offerLabel}: {formatCount(CREDITS.offerMonthly)} AI credits a month
          </span>
          <span>
            {CREDITS_SCHEDULE.afterLabel}: the standard {formatCount(CREDITS.standardMonthly)}
          </span>
        </figcaption>
      </figure>
      <NoteBox className="mt-6">{creditsNote()}</NoteBox>
    </section>
  )
}
