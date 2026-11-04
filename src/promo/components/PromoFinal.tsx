import { Container } from '../../components/ui/Container'
import type { Attribution } from '../attribution'
import type { PromoPageCopy } from '../content'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { PromoCta } from './PromoCta'

/** Closing call to action on the tinted band, with the state-specific offer line under the button. */
export function PromoFinal({ copy, status, route, attribution }: { copy: PromoPageCopy; status: OfferStatus; route: PromoRoute; attribution: Attribution }) {
  return (
    <section aria-labelledby="final-heading" className="border-t border-line bg-brand-tint/50 py-16 sm:py-20">
      <Container className="text-center">
        <h2 id="final-heading" className="h2 mx-auto max-w-2xl text-balance">
          {copy.final.title}
        </h2>
        <p className="lead mx-auto mt-4 max-w-xl text-pretty">{copy.final.body}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <PromoCta page={copy.page} placement="final" plan={route.plan} billing={route.billing} status={status} campaign={attribution.campaign} href={route.href} label={route.label} size="lg" className="w-full sm:w-auto" />
          <p className="max-w-xl text-[15px] font-medium text-ink">{copy.heroNote[status]}</p>
        </div>
      </Container>
    </section>
  )
}
