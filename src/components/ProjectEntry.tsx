import { useId, useState } from 'react'
import { ProjectGallery } from './ProjectGallery'
import { practices } from '../data/practices'
import type { Project } from '../types'

interface ProjectEntryProps {
  project: Project
  index: number
}

export function ProjectEntry({ project, index }: ProjectEntryProps) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const headId = useId()

  const practice = practices.find((item) => item.id === project.practice)

  return (
    <article
      className="enter border-b border-rule"
      style={{ '--i': index } as React.CSSProperties}
    >
      <button
        type="button"
        id={headId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="grid w-full grid-cols-[1fr_auto] items-start gap-x-6 gap-y-4 rounded-sm px-2 py-6 text-left transition-colors duration-200 ease-brand hover:bg-accent-soft"
      >
        <span>
          <span className="block text-2xl leading-[1.18] font-medium tracking-[-0.02em]">
            {project.title}
          </span>
          <span className="mt-2 block max-w-[62ch] font-read leading-[1.68] text-ink-2">
            {project.summary}
          </span>
          <span className="mt-4 flex flex-wrap items-center gap-2 text-[0.8125rem] text-ink-3">
            <span className="font-medium text-accent">{practice?.label}</span>
            <span>{project.kind}</span>
          </span>
        </span>

        <span
          aria-hidden="true"
          className={`grid size-7 shrink-0 place-items-center rounded-sm border border-rule-firm text-ink-3 transition-transform duration-200 ease-brand ${
            open ? 'rotate-45' : ''
          }`}
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3">
            <path d="M6 1v10M1 6h10" />
          </svg>
        </span>
      </button>

      <div className="panel" data-open={open} id={panelId} role="region" aria-labelledby={headId}>
        <div>
          <div className="max-w-[64ch] px-2 pb-8">
            <p className="font-read leading-[1.68] text-ink-2">{project.detail}</p>

            {project.images && <ProjectGallery images={project.images} />}

            <ul className="mt-6 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-sm border border-rule px-2 py-1 text-[0.8125rem] text-ink-3"
                >
                  {tool}
                </li>
              ))}
            </ul>

            {project.link && (
              <p className="mt-6">
                <a
                  href={project.link.href}
                  target="_blank"
                  rel="noopener"
                  className="rounded-sm font-medium text-accent underline underline-offset-4"
                >
                  {project.link.label}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}