import type { Attribution } from '../attribution'
import type { PromoPageCopy } from '../content'
import type { PromoRoute } from '../routes'
import type { OfferStatus } from '../status'
import { PromoCta } from './PromoCta'

/** Closing call to action in a card container, left-aligned, with the state-specific terms line under the button. */
export function PromoFinal({ copy, status, route, attribution }: { copy: PromoPageCopy; status: OfferStatus; route: PromoRoute; attribution: Attribution }) {
  return (
    <section aria-labelledby="final-heading" className="p-wrap p-section">
      <div className="p-card p-6 min-[734px]:p-10">
        <div className="p-text">
          <h2 id="final-heading" className="p-h2">
            {copy.final.title}
          </h2>
          <p className="p-intro mt-3">{copy.final.body}</p>
          <div className="mt-7">
            <PromoCta page={copy.page} placement="final" plan={route.plan} billing={route.billing} status={status} campaign={attribution.campaign} href={route.href} label={route.label} className="w-full min-[734px]:w-auto" />
          </div>
          <p className="p-meta mt-4">{copy.heroNote[status]}</p>
        </div>
      </div>
    </section>
  )
}
