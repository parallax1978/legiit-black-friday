import { Container } from '../../components/ui/Container'
import type { Attribution } from '../attribution'
import type { PromoPageCopy } from '../content'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { PromoCta } from './PromoCta'

/**
 * Closing call to action on the tinted band, with the state-specific offer line under the button.
 * `look="plain"` is the Business offer page's version: grey band, solid button, the copy's own note.
 */
export function PromoFinal({ copy, status, route, attribution, look = 'brand' }: { copy: PromoPageCopy; status: OfferStatus; route: PromoRoute; attribution: Attribution; look?: 'brand' | 'plain' }) {
  const plain = look === 'plain'
  return (
    <section aria-labelledby="final-heading" className={`${plain ? 'bg-canvas-sunken' : 'border-t border-line bg-brand-tint/50'} py-16 sm:py-20`}>
      <Container className="text-center">
        <h2 id="final-heading" className="h2 mx-auto max-w-2xl text-balance">
          {copy.final.title}
        </h2>
        <p className="lead mx-auto mt-4 max-w-xl text-pretty">{copy.final.body}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <PromoCta page={copy.page} placement="final" plan={route.plan} billing={route.billing} status={status} campaign={attribution.campaign} href={route.href} label={route.label} size="lg" variant={plain ? 'solid' : 'primary'} className={plain ? 'w-full !gap-2 !rounded-[10px] sm:w-auto' : 'w-full sm:w-auto'} />
          <p className={plain ? 'max-w-xl text-[13px] text-ink-muted' : 'max-w-xl text-[15px] font-medium text-ink'}>{(plain && copy.final.note) || copy.heroNote[status]}</p>
        </div>
      </Container>
    </section>
  )
}
