import { Container } from '../../components/ui/Container'
import { Logo } from '../../components/brand/Logo'
import { PRODUCT_NAME } from '../../config/site'
import { PROMO_ROUTES } from '../offer'
import { PromoCta } from './PromoCta'
import type { ComponentProps } from 'react'

type CtaProps = Omit<ComponentProps<typeof PromoCta>, 'placement' | 'size' | 'variant' | 'className'>

/** The pricing page's header: lockup, Log In from 640px up, and the page's button in its header size. */
export function PromoHeader({ productName = PRODUCT_NAME, cta }: { productName?: string; cta: CtaProps }) {
  return (
    <header className="border-b border-line bg-canvas">
      <Container className="flex min-h-[64px] items-center justify-between gap-3 py-3">
        <a href="#top" className="-ml-2 inline-flex min-h-[44px] min-w-0 items-center gap-2 rounded-md px-2 btn-focus sm:gap-3" aria-label={`Legiit ${productName}, back to top`}>
          <Logo height={26} className="sm:!h-7" />
          <span aria-hidden="true" className="h-5 w-px shrink-0 bg-line-strong max-[359px]:hidden" />
          <span className="min-w-0 truncate text-[13px] font-medium text-ink max-[359px]:hidden sm:text-[15px]">{productName}</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-3">
          <a href={PROMO_ROUTES.signIn} className="hidden min-h-[44px] items-center rounded-md px-3 text-[15px] font-medium text-ink-soft hover:text-ink btn-focus sm:inline-flex">
            Log In
          </a>
          <PromoCta {...cta} placement="header" size="md" className="shrink-0 !px-3 sm:!px-4" />
        </div>
      </Container>
    </header>
  )
}
