import { Check } from 'lucide-react'
import { SCREENS } from '../../config/media'
import type { ProductSectionCopy } from '../../config/copy'
import type { PromoPageCopy } from '../content'
import { SectionHead } from './SectionHead'

/** A product screen, flat with a 12px radius and alt text, with its caption as real text below. */
function Screen({ screen, caption }: { screen: ProductSectionCopy['media'][number]['screen']; caption: string }) {
  const asset = SCREENS[screen]
  const frame = asset.frame
  return (
    <figure>
      {frame ? (
        <div className="overflow-hidden rounded-xl border border-legiit-border" style={{ aspectRatio: `${Math.round(asset.width * frame.widthFraction)} / ${asset.height}` }}>
          <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading="lazy" decoding="async" className="block h-auto max-w-none" style={{ width: `${100 / frame.widthFraction}%` }} />
        </div>
      ) : (
        <img src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} loading="lazy" decoding="async" className="p-img" />
      )}
      <figcaption className="p-meta mt-2">{caption}</figcaption>
    </figure>
  )
}

/** One H2 for the section, then each feature as an H3 block: text and bullets beside its screens, alternating sides from 734px. */
export function FeatureSections({ section, features }: { section: PromoPageCopy['featuresSection']; features: ProductSectionCopy[] }) {
  return (
    <section aria-labelledby="features-heading" className="p-wrap p-section">
      <SectionHead id="features-heading" title={section.title} lead={section.lead} />
      <div className="mt-12 flex flex-col gap-16 min-[734px]:gap-20">
        {features.map((f, i) => {
          const mediaLeft = i % 2 === 1
          return (
            <article key={f.id} aria-labelledby={`${f.id}-heading`} className="grid items-start gap-6 min-[734px]:grid-cols-2 min-[734px]:gap-10">
              <div className={`p-body ${mediaLeft ? 'min-[734px]:col-start-2' : ''} min-[734px]:row-start-1`}>
                <p className="p-meta">{f.label}</p>
                <h3 id={`${f.id}-heading`} className="p-h3 mt-2">
                  {f.title}
                </h3>
                {f.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4">
                    {paragraph}
                  </p>
                ))}
                <ul className="mt-5 flex flex-col gap-2">
                  {f.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check size={20} aria-hidden="true" className="mt-1 shrink-0 text-legiit-purple" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {f.note && <p className="p-meta mt-4">{f.note}</p>}
              </div>
              <div className={`flex flex-col gap-6 ${mediaLeft ? 'min-[734px]:col-start-1' : ''} min-[734px]:row-start-1`}>
                {f.media.map((m) => (
                  <Screen key={m.screen} screen={m.screen} caption={m.caption} />
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
