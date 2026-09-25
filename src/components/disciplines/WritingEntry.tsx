import { useId, useState } from 'react'
import type { Project } from '../../types'

interface WritingEntryProps {
  project: Project
  index: number
}

export function WritingEntry({ project, index }: WritingEntryProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const headId = useId()

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
          </div>

          <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-ink">
            {project.title}
          </h3>

          <blockquote className="mt-4 border-l-2 border-accent/40 pl-4 font-read text-xl italic leading-[1.6] text-ink">
            “{project.summary}”
          </blockquote>

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
    </article>
  )
}
