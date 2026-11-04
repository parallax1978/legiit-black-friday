import type { FaqItem } from '../../config/faq'
import { track } from '../../lib/analytics'
import { SectionHead } from './SectionHead'

/** Splits a paragraph around each link text so those words render as links in the page's one link style. */
function withLinks(paragraph: string, links: FaqItem['links']) {
  if (!links?.length) return paragraph
  const pattern = new RegExp(`(${links.map((l) => l.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  return paragraph.split(pattern).map((part, i) => {
    const link = links.find((l) => l.text === part)
    return link ? (
      <a key={i} href={link.href} className="p-link">
        {part}
      </a>
    ) : (
      part
    )
  })
}

/** Questions as native disclosures: the question is an H3 in the summary, the answer opens beneath it. */
export function PromoFaq({ title, lead, items }: { title: string; lead: string; items: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-heading" className="p-wrap p-section">
      <SectionHead id="faq-heading" title={title} lead={lead} />
      <div className="p-text mt-8 border-t border-legiit-border">
        {items.map((item) => (
          <details key={item.id} className="group border-b border-legiit-border" onToggle={(e) => track('faq_toggle', { id: item.id, expanded: e.currentTarget.open })}>
            <summary className="flex min-h-[56px] items-center justify-between gap-4 rounded-md py-4">
              <h3 className="p-h3 !text-[21px]">{item.question}</h3>
              <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-legiit-purple group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="hidden shrink-0 text-2xl leading-none text-legiit-purple group-open:inline">
                −
              </span>
            </summary>
            <div className="p-body pb-5">
              {item.answer.map((paragraph) => (
                <p key={paragraph} className="mt-2 first:mt-0">
                  {withLinks(paragraph, item.links)}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
