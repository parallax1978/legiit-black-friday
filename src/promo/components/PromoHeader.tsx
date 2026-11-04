import type { ComponentProps } from 'react'
import { Logo } from '../../components/brand/Logo'
import type { Attribution } from '../attribution'
import { withAttribution } from '../attribution'
import { PROMO_PAGES, PROMO_ROUTES } from '../offer'
import { PromoCta } from './PromoCta'

type CtaProps = Omit<ComponentProps<typeof PromoCta>, 'placement' | 'variant' | 'className'>

/** Legiit's main navigation, as the blog header lists it. */
const MAIN_NAV = [
  { label: 'Command Center', href: 'https://legiit.com/pricing' },
  { label: 'Marketplace', href: 'https://legiit.com/marketplace' },
  { label: 'Courses', href: 'https://legiit.com/courses' },
  { label: 'Support', href: PROMO_ROUTES.support },
] as const

export type PromoTab = 'business' | 'agency' | 'legiitBucks'

const TABS: { id: PromoTab; label: string; href: string }[] = [
  { id: 'business', label: 'Business', href: PROMO_PAGES.business },
  { id: 'agency', label: 'Agency', href: PROMO_PAGES.agency },
  { id: 'legiitBucks', label: 'Legiit Bucks', href: PROMO_PAGES.legiitBucks },
]

/**
 * Two-level header. Level 1 is Legiit's main navigation with Log in and the
 * page's button as a pill. Level 2 is the section title and the three offer
 * tabs; the current tab carries a 2px purple underline. Tab links keep the
 * visit's attribution.
 */
export function PromoHeader({ current, cta, attribution }: { current: PromoTab; cta: CtaProps; attribution: Attribution }) {
  return (
    <header>
      <div className="border-b border-legiit-border bg-white">
        <nav aria-label="Legiit" className="p-wrap flex min-h-[52px] items-center gap-6">
          <a href="https://legiit.com" className="inline-flex min-h-[44px] items-center rounded-md" aria-label="Legiit home">
            <Logo height={22} />
          </a>
          <ul className="hidden items-center gap-5 min-[734px]:flex">
            {MAIN_NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="p-nav-link inline-flex">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-4">
            <a href={PROMO_ROUTES.signIn} className="p-nav-link hidden min-[734px]:inline-flex">
              Log in
            </a>
            <PromoCta {...cta} placement="header" variant="pill" />
          </div>
        </nav>
      </div>
      <div className="border-b border-legiit-border bg-white">
        <div className="p-wrap flex min-h-[52px] flex-wrap items-center justify-between gap-x-6 gap-y-0">
          <p className="text-[21px] font-semibold leading-[1.2] text-legiit-charcoal">Black Friday offers</p>
          <nav aria-label="Offers">
            <ul className="flex items-center gap-6">
              {TABS.map((tab) => (
                <li key={tab.id}>
                  <a href={withAttribution(tab.href, attribution)} className="p-tab" aria-current={tab.id === current ? 'page' : undefined} data-offer-tab={tab.id}>
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
