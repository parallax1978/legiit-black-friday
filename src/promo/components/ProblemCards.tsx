import { Container } from '../../components/ui/Container'
import type { PromoPageCopy } from '../content'

/** The Business offer page's problem section: three grey cards, the problem in the owner's words, then what changes. */
export function ProblemCards({ copy }: { copy: PromoPageCopy['problem'] }) {
  return (
    <section aria-labelledby="problem-heading" className="py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="problem-heading" className="h2 mt-3 text-balance">
            {copy.title}
          </h2>
          <p className="lead mt-4 text-pretty">{copy.lead}</p>
        </div>
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {copy.items.map((item, i) => (
            <li key={item.problem} className="flex flex-col rounded-2xl bg-canvas-sunken p-6">
              <p className="text-[13px] text-ink-muted">Problem {i + 1}</p>
              <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">{item.problem}</p>
              <p className="mt-5 text-[13px] font-semibold text-brand-purple">What changes</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.solution}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
