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
const timestamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

/**
 * `caption` replaces the visible line under the player; `null` leaves only the walkthrough link.
 * `chapters` lists the six screens with their start times under the player; each one seeks the
 * video and plays it. The walkthrough link then appears only if the video fails to load.
 */
export function ProductOverviewVideo({ className = '', caption = PRODUCT_OVERVIEW.caption, chapters = false }: { className?: string; caption?: string | null; chapters?: boolean }) {
  const [failed, setFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
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

  const seek = (at: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = at
    void video.play().catch(() => {})
  }

  return (
    <figure className={className} id="product-overview">
      <div className="overflow-hidden rounded-2xl border border-line bg-ink shadow-frame focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-purple">
        {failed ? (
          <div className="relative" style={{ aspectRatio: `${PRODUCT_OVERVIEW.width} / ${PRODUCT_OVERVIEW.height}` }}>
            <img src={PRODUCT_OVERVIEW.poster} alt={PRODUCT_OVERVIEW.posterAlt} width={PRODUCT_OVERVIEW.width} height={PRODUCT_OVERVIEW.height} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-ink/85 px-4 py-3 text-sm text-white">The product overview video could not be loaded. Use the walkthrough below to see the same screens.</div>
          </div>
        ) : (
          <video
            ref={videoRef}
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
      {chapters && !failed && (
        <ol aria-label="Chapters" className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_OVERVIEW.chapters.map((chapter) => (
            <li key={chapter.at}>
              <button type="button" onClick={() => seek(chapter.at)} className="flex min-h-[44px] w-full items-center gap-3 rounded-md px-1 text-left text-[14px] text-ink hover:text-brand-purple btn-focus">
                <span className="w-8 shrink-0 tabular-nums text-ink-muted">{timestamp(chapter.at)}</span>
                <span>{chapter.title}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {(!chapters || failed || caption) && (
        <figcaption className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted ${caption ? 'justify-between' : 'justify-end'}`}>
          {caption && <span className="max-w-[36rem] py-1.5">{caption}</span>}
          {(!chapters || failed) && <Walkthrough label={HERO.walkthroughAction} placement={failed ? 'video-fallback' : 'hero'} />}
        </figcaption>
      )}
    </figure>
  )
}
