import { ProductOverviewVideo } from '../../components/media/ProductOverviewVideo'
import type { PromoPageCopy } from '../content'
import { SectionHead } from './SectionHead'

/** The product overview video, flat with a 12px radius, under its own H2. */
export function DemoSection({ copy }: { copy: PromoPageCopy['demo'] }) {
  return (
    <section aria-labelledby="demo-heading" className="p-wrap p-section">
      <SectionHead id="demo-heading" title={copy.title} lead={copy.body} />
      <ProductOverviewVideo className="mt-8" caption={null} flat />
    </section>
  )
}
