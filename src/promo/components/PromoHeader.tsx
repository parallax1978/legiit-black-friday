import { Container } from '../../components/ui/Container'
import { Logo } from '../../components/brand/Logo'
import { PRODUCT_NAME } from '../../config/site'
import { PROMO_ROUTES } from '../offer'
import { PromoCta } from './PromoCta'
import type { ComponentProps } from 'react'

type CtaProps = Omit<ComponentProps<typeof PromoCta>, 'placement' | 'size' | 'variant' | 'className'>

/**
 * The pricing page's header: lockup, Log In from 640px up, and the page's button in its header size.
 * `look="solid"` is the offer page's version: "Log in" and a solid purple pill with no arrow.
 */
export function PromoHeader({ productName = PRODUCT_NAME, cta, look = 'gradient' }: { productName?: string; cta: CtaProps; look?: 'gradient' | 'solid' }) {
  const solid = look === 'solid'
  return (
    <header className="border-b border-line bg-canvas">
      <Container className="flex min-h-[64px] items-center justify-between gap-3 py-3">
        <a href="#top" className="-ml-2 inline-flex min-h-[44px] min-w-0 items-center gap-2 rounded-md px-2 btn-focus sm:gap-3" aria-label={`Legiit ${productName}, back to top`}>
          <Logo height={26} className="sm:!h-7" />
          <span aria-hidden="true" className={`h-5 w-px shrink-0 bg-line-strong ${solid ? 'max-[479px]:hidden' : 'max-[359px]:hidden'}`} />
          <span className={`min-w-0 truncate text-[13px] font-medium text-ink sm:text-[15px] ${solid ? 'max-[479px]:hidden' : 'max-[359px]:hidden'}`}>{productName}</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-3">
          <a href={PROMO_ROUTES.signIn} className="hidden min-h-[44px] items-center rounded-md px-3 text-[15px] font-medium text-ink-soft hover:text-ink btn-focus sm:inline-flex">
            {solid ? 'Log in' : 'Log In'}
          </a>
          {solid ? (
            <PromoCta {...cta} placement="header" size="md" variant="solid" arrow={false} className="shrink-0 !rounded-full !px-4 sm:!px-5" />
          ) : (
            <PromoCta {...cta} placement="header" size="md" className="shrink-0 !px-3 sm:!px-4" />
          )}
        </div>
      </Container>
    </header>
  )
}
