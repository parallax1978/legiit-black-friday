import { Container } from '../../components/ui/Container'
import { ArrowRight } from '../../components/ui/Icons'
import type { PromoPageCopy } from '../content'

/** Three problem-and-solution pairs, each as a card: the problem in the owner's words, then what changes. */
export function ProblemSolution({ copy }: { copy: PromoPageCopy['problem'] }) {
  return (
    <section aria-labelledby="problem-heading" className="border-t border-line py-16 sm:py-20">
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
            <li key={item.problem} className="flex flex-col rounded-2xl border border-line bg-canvas p-6 shadow-frame">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">Problem {i + 1}</p>
              <p className="mt-2 text-[17px] font-medium leading-snug text-ink">{item.problem}</p>
              <p className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-purple">
                <ArrowRight size={14} />
                What changes
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.solution}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
