import { LinkButton, iconClass, iconSize } from '../../components/ui/Button'
import { ArrowRight } from '../../components/ui/Icons'
import { track, type EventMap } from '../../lib/analytics'
import type { OfferStatus } from '../status'

type Size = 'md' | 'lg' | 'hero' | 'xl'
type Variant = 'primary' | 'solid' | 'inverse' | 'outline' | 'outlineInverse' | 'secondary'

interface PromoCtaProps {
  page: EventMap['promo_cta_click']['page']
  placement: string
  plan: EventMap['promo_cta_click']['plan']
  billing?: 'monthly' | 'yearly'
  status: OfferStatus
  campaign: string
  href: string
  label: string
  size?: Size
  variant?: Variant
  className?: string
  arrow?: boolean
}

/**
 * Every button on the promotion pages. The destination already carries the
 * attribution (see ../attribution); the click event records where the visitor
 * was sent and which offer state the page was in.
 */
export function PromoCta({ page, placement, plan, billing, status, campaign, href, label, size = 'lg', variant = 'primary', className = '', arrow = true }: PromoCtaProps) {
  return (
    <LinkButton
      href={href}
      size={size}
      variant={variant}
      className={`whitespace-nowrap ${className}`}
      data-promo-cta={placement}
      data-plan={plan}
      data-billing={billing}
      data-offer-status={status}
      onClick={() => track('promo_cta_click', { page, placement, plan, billing, status, campaign, destination: href })}
    >
      {label}
      {arrow && <ArrowRight size={iconSize[size]} className={`shrink-0 ${placement === 'header' ? 'hidden sm:block' : iconClass[size]}`} />}
    </LinkButton>
  )
}
