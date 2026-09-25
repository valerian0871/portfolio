import { useId, useState } from 'react'
import { Lightbox } from '../Lightbox'
import type { Project } from '../../types'

interface WritingEntryProps {
  project: Project
  index: number
}

export function WritingEntry({ project, index }: WritingEntryProps) {
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
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-12">
        {/* Editorial Text Lead */}
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
            <span className="font-medium text-accent">Content & Copywriting</span>
            <span>·</span>
            <span className="font-serif italic">{project.kind}</span>
            {images.length > 0 && (
              <>
                <span>·</span>
                <span className="text-accent font-medium">Includes cover & interior design</span>
              </>
            )}
          </div>

          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-ink">
            {project.title}
          </h3>

          <blockquote className="mt-4 border-l-2 border-accent/40 pl-4 font-read text-xl italic leading-[1.6] text-ink">
            “{project.summary}”
          </blockquote>

          {/* Visual Proof for Book Production (Cover & Chapter Ornament) */}
          {images.length > 0 && (
            <div className="mt-6 flex flex-wrap items-end gap-3.5">
              {images.map((img, imgIndex) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setLightboxAt(imgIndex)}
                  className="group relative overflow-hidden rounded-sm border border-rule-firm bg-paper transition-transform duration-150 ease-brand hover:-translate-y-0.5 focus-visible:outline-accent cursor-pointer shadow-xs"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                    className="max-h-36 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-1.5 right-1.5 inline-flex items-center gap-1 rounded-xs bg-paper/90 px-1.5 py-0.5 text-[0.625rem] font-medium text-ink backdrop-blur-xs border border-rule">
                    {imgIndex === 0 ? 'Cover' : 'Chapter'}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              id={headId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-accent"
            >
              <span>{open ? 'Hide methodology & editorial scope' : 'Read editorial scope & methodology'}</span>
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
                  <p className="font-read text-[1.0625rem] leading-[1.68] text-ink-2">
                    {project.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Production Specs & Tools */}
        <div className="flex flex-col justify-between rounded-sm border border-rule-firm bg-accent-soft/40 p-5">
          <div>
            <span className="text-[0.75rem] font-semibold uppercase tracking-wider text-ink-3">
              Production Specifications
            </span>
            <dl className="mt-3 space-y-2.5 text-[0.875rem]">
              <div className="flex justify-between border-b border-rule/60 pb-2">
                <dt className="text-ink-3">Discipline</dt>
                <dd className="font-medium text-ink">{project.kind}</dd>
              </div>
              <div className="flex justify-between border-b border-rule/60 pb-2">
                <dt className="text-ink-3">Typography & Engine</dt>
                <dd className="font-mono text-xs text-accent">
                  {project.tools.slice(0, 2).join(', ')}
                </dd>
              </div>
              <div className="flex justify-between pb-1">
                <dt className="text-ink-3">Delivery Medium</dt>
                <dd className="font-medium text-ink">Print & Digital Copy</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 pt-3 border-t border-rule/60">
            <span className="block text-[0.75rem] font-semibold uppercase tracking-wider text-ink-3">
              Editorial Toolchain
            </span>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {project.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-sm bg-paper px-2 py-0.5 text-[0.75rem] text-ink-2 border border-rule"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
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
