import type { PromoPageCopy } from '../content'
import { SectionHead } from './SectionHead'

/** Splits a paragraph after its first sentence, so the advice sentence can be bold. */
function splitFirstSentence(text: string): [string, string] {
  const m = text.match(/^(.*?[.!?])\s+(.*)$/)
  return m && m[1] && m[2] ? [m[1], m[2]] : [text, '']
}

/** Three tiles, one per problem: the problem in secondary text, then a guidance paragraph that leads with the bold advice. */
export function ProblemSolution({ copy }: { copy: PromoPageCopy['problem'] }) {
  return (
    <section aria-labelledby="problem-heading" className="p-wrap p-section">
      <SectionHead id="problem-heading" title={copy.title} lead={copy.lead} />
      <ol className="mt-10 grid gap-6 min-[734px]:grid-cols-3">
        {copy.items.map((item) => {
          const [advice, rest] = splitFirstSentence(item.solution)
          return (
            <li key={item.problem} className="p-card p-body flex flex-col p-6">
              <p className="p-meta">The problem</p>
              <p className="mt-1 text-legiit-secondary">{item.problem}</p>
              <p className="p-meta mt-5">What changes</p>
              <p className="mt-1">
                <strong className="font-semibold">{advice}</strong>
                {rest ? ` ${rest}` : ''}
              </p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
