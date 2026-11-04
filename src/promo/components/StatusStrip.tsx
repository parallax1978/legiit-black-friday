import { Container } from '../../components/ui/Container'
import type { OfferStatus } from '../status'

/**
 * One line above the header stating the offer's state: when it opens, when it
 * ends, or that it has ended. A real date, never a countdown. Expired and
 * pending states use the neutral canvas so nothing reads as a live promotion.
 */
export function StatusStrip({ status, text }: { status: OfferStatus; text: string }) {
  const live = status === 'live'
  return (
    <div role="status" data-offer-status={status} className={`${live ? 'bg-ink text-white' : 'border-b border-line bg-canvas-sunken text-ink-soft'} text-[13px] font-medium sm:text-sm`}>
      <Container className="flex min-h-[40px] items-center justify-center py-2 text-center">
        <p>{text}</p>
      </Container>
    </div>
  )
}
