import { track, type EventMap } from '../../lib/analytics'
import type { OfferStatus } from '../status'

interface PromoCtaProps {
  page: EventMap['promo_cta_click']['page']
  placement: string
  plan: EventMap['promo_cta_click']['plan']
  billing?: 'monthly' | 'yearly'
  status: OfferStatus
  campaign: string
  href: string
  label: string
  /** `pill` is the header shape; `secondary` the white bordered button. */
  variant?: 'primary' | 'pill' | 'secondary'
  className?: string
}

/**
 * Every button on the promotion pages: the primary purple button (44px, 12px
 * radius, 17px semibold) or its header pill. The destination already carries
 * the attribution; the click event records where the visitor was sent and
 * which offer state the page was in.
 */
export function PromoCta({ page, placement, plan, billing, status, campaign, href, label, variant = 'primary', className = '' }: PromoCtaProps) {
  const cls = variant === 'secondary' ? 'p-btn-secondary' : variant === 'pill' ? 'p-btn p-pill' : 'p-btn'
  return (
    <a
      href={href}
      className={`${cls} ${className}`}
      data-promo-cta={placement}
      data-plan={plan}
      data-billing={billing}
      data-offer-status={status}
      onClick={() => track('promo_cta_click', { page, placement, plan, billing, status, campaign, destination: href })}
    >
      {label}
    </a>
  )
}
