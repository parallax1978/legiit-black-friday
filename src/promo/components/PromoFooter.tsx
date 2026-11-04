import { Logo } from '../../components/brand/Logo'
import { PROMO_FOOTER_LINKS } from '../content'

/** Off-white footer with the dark logo and the same links as the pricing page. */
export function PromoFooter() {
  return (
    <footer className="bg-legiit-offwhite py-10">
      <div className="p-wrap flex flex-col gap-6 min-[734px]:flex-row min-[734px]:items-center min-[734px]:justify-between">
        <Logo height={22} />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {PROMO_FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="p-link inline-flex min-h-[44px] min-w-[44px] items-center justify-center">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
