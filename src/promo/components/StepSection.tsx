import { Container } from '../../components/ui/Container'
import { Check, Compass, Pencil, Users } from '../../components/ui/Icons'
import { ProductImage } from '../../components/media/ProductImage'
import type { OfferStep } from '../content'

const ICONS = { compass: Compass, pencil: Pencil, users: Users } as const

/** Sets the step's product name in bold where it appears in the paragraph. */
function withEmphasis(text: string, term?: string) {
  if (!term || !text.includes(term)) return text
  const [before, ...rest] = text.split(term)
  return (
    <>
      {before}
      <strong className="font-semibold text-ink">{term}</strong>
      {rest.join(term)}
    </>
  )
}

/**
 * One feature step on the offer page: an outline icon, the step
 * label, the title, one paragraph, the check list, and the product screens in
 * a grey card with one caption. Desktop alternates the card left or right;
 * mobile shows the text, then the card.
 */
export function StepSection({ step }: { step: OfferStep }) {
  const headingId = `${step.id}-heading`
  const mediaLeft = step.mediaSide === 'left'
  const Icon = ICONS[step.icon]
  return (
    <section aria-labelledby={headingId} className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={`max-w-[34rem] ${mediaLeft ? 'lg:col-start-2' : 'lg:col-start-1'} lg:row-start-1`}>
            <Icon size={48} strokeWidth={1.5} className="text-ink" />
            <p className="eyebrow mt-5">{step.label}</p>
            <h2 id={headingId} className="h2 mt-3">
              {step.title}
            </h2>
            <p className="lead mt-4">{withEmphasis(step.paragraph, step.emphasis)}</p>
            <ul className="mt-6 space-y-2.5">
              {step.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                  <Check size={16} className="mt-0.5 shrink-0 text-brand-purple" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {step.note && <p className="mt-4 text-sm text-ink-muted">{step.note}</p>}
          </div>

          <div className={`${mediaLeft ? 'lg:col-start-1' : 'lg:col-start-2'} lg:row-start-1`}>
            <div className="flex flex-col gap-4 rounded-2xl bg-canvas-sunken p-4 sm:p-5">
              {step.screens.map((screen) => (
                <ProductImage key={screen} screen={screen} enlarge={false} />
              ))}
            </div>
            <p className="mt-2.5 text-sm text-ink-muted">{step.caption}</p>
          </div>
        </div>
      </Container>
    </section>
  )
}
