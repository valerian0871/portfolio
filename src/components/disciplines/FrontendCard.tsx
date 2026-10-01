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
  const [viewMode, setViewMode] = useState<'live' | 'screenshot'>('live')
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeLoading, setIframeLoading] = useState(true)

  const panelId = useId()
  const headId = useId()

  const mainImage = project.images?.[0]
  const hasLiveLink = Boolean(project.link?.href)

  // Extract clean domain for browser address bar
  const domain = project.link?.href
    ? project.link.href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    : ''

  const reloadIframe = () => {
    setIframeLoading(true)
    setIframeKey((prev) => prev + 1)
  }

  return (
    <article
      className="enter border-b border-rule py-8 sm:py-10 transition-colors duration-200"
      style={{ '--i': index } as React.CSSProperties}
    >
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:items-start">
        {/* Visual Proof / Live Display & Preview Container */}
        {hasLiveLink ? (
          <div className="flex flex-col overflow-hidden rounded-sm border border-rule-firm bg-paper shadow-sm">
            {/* Browser Window Chrome */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule bg-accent-soft/30 px-2.5 py-2 sm:px-4 sm:py-2.5">
              {/* Window Controls & URL bar */}
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="hidden sm:flex items-center gap-1.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-emerald-400/80" />
                </div>

                <div className="flex items-center gap-1.5 rounded-sm border border-rule bg-paper px-2 py-0.5 sm:px-2.5 sm:py-1 text-[0.6875rem] sm:text-[0.75rem] font-mono text-ink-2 shadow-xs">
                  <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent shrink-0" aria-hidden="true">
                    <rect x="3" y="6" width="10" height="8" rx="1.5" />
                    <path d="M5 6V4.5a3 3 0 0 1 6 0V6" />
                  </svg>
                  <span className="truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[190px]">{domain}</span>
                </div>
              </div>

              {/* View Switcher: Live Display vs Screenshot */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="inline-flex rounded-sm border border-rule bg-paper/80 p-0.5 text-[0.625rem] sm:text-[0.6875rem] font-medium text-ink-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('live')}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-xs px-2 sm:px-2.5 py-0.5 sm:py-1 transition-colors duration-150 cursor-pointer ${
                    className={`btn-press inline-flex items-center gap-1 sm:gap-1.5 rounded-xs px-2 sm:px-2.5 py-0.5 sm:py-1 cursor-pointer ${
                      viewMode === 'live'
                        ? 'bg-accent text-accent-ink font-semibold shadow-xs'
                        : 'hover:text-ink'
                    }`}
                    title="Interact with live site"
                  >
                    <span className={`size-1.5 rounded-full ${viewMode === 'live' ? 'bg-emerald-300 animate-pulse' : 'bg-ink-3'}`} />
                    <span>Live</span>
                  </button>

                  {mainImage && (
                    <button
                      type="button"
                      onClick={() => setViewMode('screenshot')}
                      className={`inline-flex items-center gap-1 rounded-xs px-2 sm:px-2.5 py-0.5 sm:py-1 transition-colors duration-150 cursor-pointer ${
                      className={`btn-press inline-flex items-center gap-1 rounded-xs px-2 sm:px-2.5 py-0.5 sm:py-1 cursor-pointer ${
                        viewMode === 'screenshot'
                          ? 'bg-accent text-accent-ink font-semibold shadow-xs'
                          : 'hover:text-ink'
                      }`}
                      title="View static screenshot"
                    >
                      <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <rect x="2" y="2" width="12" height="12" rx="1" />
                        <circle cx="5.5" cy="5.5" r="1.5" />
                        <path d="m14 11-4-4-6 6" />
                      </svg>
                      <span>Screenshot</span>
                    </button>
                  )}
                </div>

                {/* Actions: Refresh & New Tab */}
                {viewMode === 'live' && (
                  <button
                    type="button"
                    onClick={reloadIframe}
                    title="Reload live preview"
                    aria-label="Reload live preview"
                    className="flex size-6 sm:size-7 items-center justify-center rounded-sm border border-rule bg-paper text-ink-3 hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    className="btn-press flex size-6 sm:size-7 items-center justify-center rounded-sm border border-rule bg-paper text-ink-3 hover:border-accent hover:text-accent cursor-pointer"
                  >
                    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9L14 6m0-4v4h-4" />
                    </svg>
                  </button>
                )}

                <a
                  href={project.link?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open site in new tab"
                  aria-label="Open site in new tab"
                  className="flex size-6 sm:size-7 items-center justify-center rounded-sm border border-rule bg-paper text-ink-3 hover:border-accent hover:text-accent transition-colors"
                  className="btn-press flex size-6 sm:size-7 items-center justify-center rounded-sm border border-rule bg-paper text-ink-3 hover:border-accent hover:text-accent cursor-pointer"
                >
                  <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 3h7v7M13 3 7 9" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Viewport Content Area */}
            <div className="relative w-full bg-accent-soft/10">
              {viewMode === 'live' ? (
                <div className="relative h-[340px] xs:h-[390px] sm:h-[480px] md:h-[530px] w-full bg-white">
                  {iframeLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-paper/90 backdrop-blur-xs">
                      <div className="size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                      <p className="font-mono text-xs text-ink-3">Connecting to live site...</p>
                    </div>
                  )}

                  <iframe
                    key={iframeKey}
                    src={project.link?.href}
                    title={`${project.title} live preview`}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    onLoad={() => setIframeLoading(false)}
                    className="h-full w-full border-0 transition-opacity duration-300"
                  />

                  {/* Subtle Interactive Helper Indicator */}
                  <div className="pointer-events-none absolute bottom-2 left-2 z-10 hidden sm:inline-flex items-center gap-1.5 rounded-sm bg-ink/75 px-2 py-0.5 text-[0.6875rem] font-mono text-white backdrop-blur-sm opacity-60">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    Interactive live window
                  </div>
                </div>
              ) : (
                mainImage && (
                  <div className="group relative w-full overflow-hidden">
                    {!loaded && <div className="shimmer absolute inset-0" />}
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      className="block w-full focus-visible:outline-accent cursor-pointer"
                    >
                      <img
                        src={mainImage.src}
                        alt={mainImage.alt}
                        width={mainImage.width}
                        height={mainImage.height}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setLoaded(true)}
                        className={`block w-full h-auto aspect-[1350/633] object-cover object-top transition-[transform,opacity] duration-300 ease-brand group-hover:scale-[1.01] ${
                          loaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-sm bg-paper/90 px-2 py-1 text-[0.75rem] font-medium text-ink backdrop-blur-sm border border-rule shadow-xs">
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M10 2h4v4m-4 10h4v-4M2 6V2h4M2 10v4h4" />
                        </svg>
                        Zoom Screenshot
                      </span>
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        ) : mainImage ? (
          <div className="group relative w-full overflow-hidden rounded-sm border border-rule-firm bg-accent-soft shadow-xs">
            {!loaded && <div className="shimmer absolute inset-0" />}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block w-full focus-visible:outline-accent cursor-pointer"
            >
              <img
                src={mainImage.src}
                alt={mainImage.alt}
                width={mainImage.width}
                height={mainImage.height}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`block w-full h-auto aspect-[1350/633] object-cover object-top transition-[transform,opacity] duration-300 ease-brand group-hover:scale-[1.01] ${
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
          <div className="flex aspect-[1350/633] w-full flex-col justify-between rounded-sm border border-rule-firm bg-accent-soft/40 p-6">
            <div className="flex items-center justify-between text-xs text-ink-3">
              <span className="font-mono uppercase tracking-wider">Engineered Implementation</span>
              <span className="rounded-sm border border-rule bg-paper px-2 py-0.5">{project.kind}</span>
            </div>
            <div className="my-auto font-mono">
              <p className="text-accent text-base font-semibold">{project.title}</p>
              <p className="mt-1 text-xs text-ink-3">Architected with precision & clean code</p>
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
              {hasLiveLink && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Production Site
                  </span>
                </>
              )}
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
                className="btn-press inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-accent cursor-pointer"
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

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-rule pt-4">
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
                className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-rule-firm bg-paper px-4 py-2 text-[0.875rem] font-medium text-ink transition-all duration-150 ease-brand hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-xs focus-visible:outline-accent w-full sm:w-auto"
                className="btn-press inline-flex items-center justify-center gap-1.5 rounded-sm border border-rule-firm bg-paper px-4 py-2 text-[0.875rem] font-medium text-ink hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-xs focus-visible:outline-accent w-full sm:w-auto cursor-pointer"
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
