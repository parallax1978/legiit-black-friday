import { Container } from '../../components/ui/Container'
import { ChevronRight } from '../../components/ui/Icons'
import type { OfferStatus } from '../status'

export interface StripLink {
  label: string
  href: string
  onClick?: () => void
}

/**
 * One line above the header stating the offer's state: when it opens, when it
 * ends, or that it has ended. A real date, never a countdown. The expired
 * state uses the neutral canvas so nothing reads as a live promotion.
 */
export function StatusStrip({ status, text, link }: { status: OfferStatus; text: string; link?: StripLink }) {
  const live = status === 'live'
  return (
    <div role="status" data-offer-status={status} className={`${live ? 'bg-ink text-white' : 'border-b border-line bg-canvas-sunken text-ink-soft'} text-[13px] font-medium sm:text-sm`}>
      <Container className="flex min-h-[40px] items-center justify-center py-2 text-center">
        <p>
          {text}
          {link && (
            <>
              {' '}
              <a href={link.href} data-promo-cta="banner" data-offer-status={status} className="whitespace-nowrap rounded-sm font-semibold text-[#F27BC9] underline-offset-4 hover:underline btn-focus focus-visible:!outline-white" onClick={link.onClick}>
                {link.label}
                <ChevronRight size={14} className="inline-block align-[-2px]" />
              </a>
            </>
          )}
        </p>
      </Container>
    </div>
  )
}
