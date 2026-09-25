import { useId, useState } from 'react'
import { Lightbox } from '../Lightbox'
import type { Project, ProjectImage } from '../../types'

interface GraphicsCardProps {
  project: Project
  index: number
}

function GraphicThumbnail({
  image,
  index,
  total,
  onOpen,
}: {
  image: ProjectImage
  index: number
  total: number
  onOpen: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-sm border border-rule bg-accent-soft p-4 text-center font-read text-xs text-ink-3">
        {image.alt}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-sm border border-rule bg-accent-soft text-left focus-visible:outline-accent"
    >
      {!loaded && <div className="shimmer absolute inset-0" />}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`block aspect-square w-full object-cover transition-[transform,opacity] duration-300 ease-brand group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[0.6875rem] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span className="truncate pr-2">{image.caption ?? 'View design'}</span>
        <span className="shrink-0 rounded-sm bg-black/40 px-1.5 py-0.5">{index + 1}/{total}</span>
      </div>
    </button>
  )
}

export function GraphicsCard({ project, index }: GraphicsCardProps) {
  const [open, setOpen] = useState(false)
  const [lightboxAt, setLightboxAt] = useState<number | null>(null)
  const panelId = useId()
  const headId = useId()

  const images = project.images ?? []

  return (
    <article
      className="enter border-b border-rule py-8"
      style={{ '--i': index } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
            <span className="font-medium text-accent">Graphics Design</span>
            <span>·</span>
            <span>{project.kind}</span>
            {images.length > 0 && (
              <>
                <span>·</span>
                <span className="tabular-nums">{images.length} creative assets</span>
              </>
            )}
          </div>
          <h3 className="mt-1.5 text-2xl font-semibold tracking-[-0.025em] text-ink">
            {project.title}
          </h3>
        </div>

        {project.link && (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-rule-firm px-4 py-2 text-[0.875rem] font-medium text-ink transition-transform duration-150 ease-brand hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline-accent"
          >
            <span>{project.link.label}</span>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 11 11 5M5 5h6v6" />
            </svg>
          </a>
        )}
      </div>

      <p className="mt-3 max-w-[68ch] font-read text-[1.0625rem] leading-[1.62] text-ink-2">
        {project.summary}
      </p>

      {/* Visual Proof: Assets Grid */}
      {images.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {images.map((img, imgIndex) => (
              <GraphicThumbnail
                key={img.src}
                image={img}
                index={imgIndex}
                total={images.length}
                onOpen={() => setLightboxAt(imgIndex)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Expandable Design System Detail */}
      <div className="mt-5">
        <button
          type="button"
          id={headId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-accent"
        >
          <span>{open ? 'Hide system and scope notes' : 'Read visual system and scope notes'}</span>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className={`size-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <path d="M2 4.5l4 4 4-4" />
          </svg>
        </button>

        <div className="panel" data-open={open} id={panelId} role="region" aria-labelledby={headId}>
          <div>
            <div className="pt-3 pb-1">
              <p className="font-read text-[0.9375rem] leading-[1.62] text-ink-2">
                {project.detail}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5 border-t border-rule pt-4">
        {project.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-sm border border-rule px-2.5 py-1 text-[0.75rem] font-medium text-ink-3"
          >
            {tool}
          </span>
        ))}
      </div>

      {lightboxAt !== null && images.length > 0 && (
        <Lightbox
          images={images}
          index={lightboxAt}
          onIndexChange={setLightboxAt}
          onClose={() => setLightboxAt(null)}
        />
      )}
    </article>
  )
}
