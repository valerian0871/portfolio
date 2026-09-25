import { useId, useState } from 'react'
import { Lightbox } from '../Lightbox'
import type { Project } from '../../types'

interface AutomationPipelineProps {
  project: Project
  index: number
}

export function AutomationPipeline({ project, index }: AutomationPipelineProps) {
  const [open, setOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const panelId = useId()
  const headId = useId()

  const workflowImage = project.images?.[0]
  const pipeline = project.pipeline

  return (
    <article
      className="enter border-b border-rule py-8"
      style={{ '--i': index } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
            <span className="font-medium text-accent">AI Automation</span>
            <span>·</span>
            <span>{project.kind}</span>
          </div>
          <h3 className="mt-1.5 text-2xl font-semibold tracking-[-0.025em] text-ink">
            {project.title}
          </h3>
        </div>

        {project.metrics && (
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-accent-soft px-3 py-1 text-xs font-medium text-accent border border-accent/20">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            {project.metrics}
          </span>
        )}
      </div>

      <p className="mt-3 max-w-[68ch] font-read text-[1.0625rem] leading-[1.62] text-ink-2">
        {project.summary}
      </p>

      {/* The Process/Pipeline Schema */}
      {pipeline && (
        <div className="mt-6 rounded-sm border border-rule-firm bg-accent-soft/30 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-[0.75rem] font-semibold uppercase tracking-wider text-ink-3">
            <span>Execution Pipeline Architecture</span>
            <span className="font-mono text-[0.6875rem] text-accent">End-to-End Workflow</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Stage 1: Trigger / Input */}
            <div className="flex flex-col justify-between rounded-sm border border-rule bg-paper p-3.5 shadow-xs">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <span className="size-2 rounded-xs bg-ink-3" />
                  1. Trigger / Input
                </span>
                <p className="mt-2 text-[0.875rem] font-medium text-ink">
                  {pipeline.trigger}
                </p>
              </div>
              <span className="mt-3 text-[0.6875rem] text-ink-3">Inbound Event</span>
            </div>

            {/* Stage 2: Processing & Nodes */}
            <div className="flex flex-col justify-between rounded-sm border border-accent/30 bg-paper p-3.5 shadow-xs">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                  <span className="size-2 rounded-xs bg-accent" />
                  2. Automation & AI Steps
                </span>
                <ul className="mt-2 space-y-1 text-xs text-ink-2">
                  {pipeline.steps.map((step, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-accent/60 font-mono text-[0.6875rem]">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <span className="mt-3 text-[0.6875rem] text-accent">Multi-node Logic</span>
            </div>

            {/* Stage 3: Output / Action */}
            <div className="flex flex-col justify-between rounded-sm border border-rule bg-paper p-3.5 shadow-xs">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">
                  <span className="size-2 rounded-xs bg-ink-2" />
                  3. Output & State
                </span>
                <p className="mt-2 text-[0.875rem] font-medium text-ink">
                  {pipeline.output}
                </p>
              </div>
              <span className="mt-3 text-[0.6875rem] text-ink-3">Confirmed Deliverable</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Workflow Canvas Preview (if exists) */}
      {workflowImage && (
        <div className="mt-5">
          <div className="group relative overflow-hidden rounded-sm border border-rule bg-accent-soft">
            {!loaded && <div className="shimmer absolute inset-0" />}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="block w-full text-left focus-visible:outline-accent"
            >
              <img
                src={workflowImage.src}
                alt={workflowImage.alt}
                width={workflowImage.width}
                height={workflowImage.height}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className={`block aspect-[21/9] w-full object-cover transition-[transform,opacity] duration-300 ease-brand group-hover:scale-[1.01] ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-sm bg-paper/90 px-2 py-1 text-[0.75rem] font-medium text-ink backdrop-blur-sm border border-rule">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M10 2h4v4m-4 10h4v-4M2 6V2h4M2 10v4h4" />
                </svg>
                Inspect workflow diagram
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Expandable Engineering Implementation Detail */}
      <div className="mt-5">
        <button
          type="button"
          id={headId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-accent"
        >
          <span>{open ? 'Hide automation architecture details' : 'Read automation architecture & error handling'}</span>
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

      {lightboxOpen && workflowImage && (
        <Lightbox
          images={[workflowImage]}
          index={0}
          onIndexChange={() => {}}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </article>
  )
}
