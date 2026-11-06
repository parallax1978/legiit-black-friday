import { Container } from '../ui/Container'
import { Logo } from '../brand/Logo'
import { FOOTER } from '../../config/site'

/** Simple footer. Both legal destinations were checked and return 200. */
const LEGAL_LINKS = [
  { label: 'Privacy', href: 'https://legiit.com/privacy' },
  { label: 'Terms', href: 'https://legiit.com/terms' },
] as const

interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  links?: readonly FooterLink[]
  /** Accessible name of the link list. */
  navLabel?: string
  /** `dark`: the offer page's footer, ink background with the brand line left and `note` right. */
  tone?: 'light' | 'dark'
  note?: string
}

/** Defaults to the landing page's legal links; the pricing page adds support and log-in links. */
export function Footer({ links = LEGAL_LINKS, navLabel = 'Legal', tone = 'light', note }: FooterProps = {}) {
  const dark = tone === 'dark'
  return (
    <footer className={dark ? 'bg-ink py-5 text-white' : 'border-t border-line py-8'}>
      <Container className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {dark ? <p className="text-[13px] font-semibold text-white">{FOOTER.line}</p> : <Logo height={22} />}
        <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm ${dark ? 'text-white/85' : 'text-ink-muted'}`}>
          {!dark && <p>{FOOTER.line}</p>}
          <nav aria-label={navLabel}>
            <ul className="flex flex-wrap items-center gap-x-5">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={`-mx-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-2 underline-offset-4 hover:underline btn-focus ${dark ? 'text-[13px] text-white focus-visible:!outline-white' : 'text-ink-soft'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {dark && note && <p className="text-[13px] text-white/85">{note}</p>}
      </Container>
    </footer>
  )
}
