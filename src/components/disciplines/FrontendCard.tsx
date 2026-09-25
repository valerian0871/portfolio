import { useId, useState } from 'react'
import { Lightbox } from '../Lightbox'
import type { Project } from '../../types'

interface FrontendCardProps {
  project: Project
  index: number
}

export function FrontendCard({ project, index }: FrontendCardProps) {
  const [open, setOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const panelId = useId()
  const headId = useId()

  const mainImage = project.images?.[0]

  return (
    <article
      className="enter border-b border-rule py-8 transition-colors duration-200"
      style={{ '--i': index } as React.CSSProperties}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-10 lg:items-start">
        {/* Visual Proof / Preview */}
        {mainImage ? (
          <div className="group relative overflow-hidden rounded-sm border border-rule bg-accent-soft">
            {!loaded && <div className="shimmer absolute inset-0" />}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block w-full focus-visible:outline-accent"
            >
              <img
                src={mainImage.src}
                alt={mainImage.alt}
                width={mainImage.width}
                height={mainImage.height}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`block aspect-[16/10] w-full object-cover transition-[transform,opacity] duration-300 ease-brand group-hover:scale-[1.02] ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-sm bg-paper/90 px-2 py-1 text-[0.75rem] font-medium text-ink backdrop-blur-sm border border-rule">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M10 2h4v4m-4 10h4v-4M2 6V2h4M2 10v4h4" />
                </svg>
                Preview
              </span>
            </button>
          </div>
        ) : (
          <div className="flex aspect-[16/10] flex-col justify-between rounded-sm border border-rule-firm bg-accent-soft p-6">
            <div className="flex items-center justify-between text-xs text-ink-3">
              <span className="font-mono">SOURCE & ARCHITECTURE</span>
              <span className="rounded-sm border border-rule px-2 py-0.5">{project.kind}</span>
            </div>
            <div className="font-mono text-sm text-ink-2">
              <p className="text-accent font-semibold">{project.title}</p>
              <p className="mt-1 text-xs text-ink-3">Engineered implementation</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.map((tool) => (
                <span key={tool} className="rounded-sm bg-paper px-2 py-0.5 font-mono text-[0.6875rem] text-ink-2 border border-rule">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Narrative & Case Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
              <span className="font-medium text-accent">Frontend Development</span>
              <span>·</span>
              <span>{project.kind}</span>
            </div>

            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-ink">
              {project.title}
            </h3>

            <p className="mt-3 font-read text-[1.0625rem] leading-[1.62] text-ink-2">
              {project.summary}
            </p>

            {/* Expandable Technical Detail */}
            <div className="mt-4">
              <button
                type="button"
                id={headId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-accent"
              >
                <span>{open ? 'Hide technical implementation' : 'Read technical implementation'}</span>
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
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-4">
            <ul className="flex flex-wrap gap-1.5" aria-label="Technologies used">
              {project.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-sm border border-rule px-2.5 py-1 text-[0.75rem] font-medium text-ink-3"
                >
                  {tool}
                </li>
              ))}
            </ul>

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
        </div>
      </div>

      {lightboxOpen && project.images && (
        <Lightbox
          images={project.images}
          index={0}
          onIndexChange={() => {}}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </article>
  )
}
