import { useRef, useState, type SyntheticEvent } from 'react'
import { PRODUCT_OVERVIEW } from '../../config/media'
import { HERO } from '../../config/copy'
import { track, type Milestone } from '../../lib/analytics'
import { Walkthrough } from './Walkthrough'

const MILESTONES: Milestone[] = [25, 50, 75]

/**
 * The playable product demo under the hero offer line: the actual 42-second
 * silent overview with native controls, poster, and the supplied English
 * caption track served same-origin. Started only from its own controls; never
 * autoplays. If the media fails to load, the poster stays visible with an
 * honest message and the walkthrough becomes the fallback.
 */
/** `caption` replaces the visible line under the player; `null` leaves only the walkthrough link. `flat` is the promotion pages' 12px-radius frame without a shadow. */
export function ProductOverviewVideo({ className = '', caption = PRODUCT_OVERVIEW.caption, flat = false }: { className?: string; caption?: string | null; flat?: boolean }) {
  const [failed, setFailed] = useState(false)
  const played = useRef(false)
  const reached = useRef<Set<Milestone>>(new Set())

  const onPlay = () => {
    if (played.current) return
    played.current = true
    track('video_play', {})
  }

  const onTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget
    if (!Number.isFinite(video.duration) || video.duration <= 0) return
    const percent = (video.currentTime / video.duration) * 100
    for (const milestone of MILESTONES) {
      if (percent >= milestone && !reached.current.has(milestone)) {
        reached.current.add(milestone)
        track('video_progress', { milestone })
      }
    }
  }

  return (
    <figure className={className} id="product-overview">
      <div className={`overflow-hidden bg-ink focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 ${flat ? 'rounded-xl border border-legiit-border focus-within:outline-legiit-purple' : 'rounded-2xl border border-line shadow-frame focus-within:outline-brand-purple'}`}>
        {failed ? (
          <div className="relative" style={{ aspectRatio: `${PRODUCT_OVERVIEW.width} / ${PRODUCT_OVERVIEW.height}` }}>
            <img src={PRODUCT_OVERVIEW.poster} alt={PRODUCT_OVERVIEW.posterAlt} width={PRODUCT_OVERVIEW.width} height={PRODUCT_OVERVIEW.height} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-4 py-3 text-sm text-white">The product overview video could not be loaded. Use the walkthrough below to see the same screens.</div>
          </div>
        ) : (
          <video
            className="block aspect-video w-full bg-ink focus-visible:outline-none"
            controls
            playsInline
            preload="metadata"
            poster={PRODUCT_OVERVIEW.poster}
            width={PRODUCT_OVERVIEW.width}
            height={PRODUCT_OVERVIEW.height}
            aria-label={PRODUCT_OVERVIEW.title}
            crossOrigin="anonymous"
            onPlay={onPlay}
            onTimeUpdate={onTimeUpdate}
            onEnded={() => track('video_complete', {})}
            onError={(event) => {
              // React re-dispatches a child <source> error here too. Only the element's own
              // MediaError means every source failed; a single source failing is not a failure.
              if (event.currentTarget.error) setFailed(true)
            }}
          >
            {PRODUCT_OVERVIEW.sources.map((s, i, all) => (
              // With <source> children the browser reports total failure on the last source only.
              <source key={s.src} src={s.src} type={s.type} onError={i === all.length - 1 ? () => setFailed(true) : undefined} />
            ))}
            {PRODUCT_OVERVIEW.captions.map((t) => (
              <track key={t.src} kind="captions" src={t.src} srcLang={t.srcLang} label={t.label} default={t.default} />
            ))}
          </video>
        )}
      </div>
      <figcaption className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted ${caption ? 'justify-between' : 'justify-end'}`}>
        {caption && <span className="max-w-[36rem] py-1.5">{caption}</span>}
        <Walkthrough label={HERO.walkthroughAction} placement={failed ? 'video-fallback' : 'hero'} />
      </figcaption>
    </figure>
  )
}
