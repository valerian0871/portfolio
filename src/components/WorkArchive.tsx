import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { type Project } from '../data/content'

interface WorkArchiveProps {
  projects: Project[]
}

export function WorkArchive({ projects }: WorkArchiveProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const reducedMotion = useReducedMotion()

  if (projects.length === 0) return null

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="mt-20 md:mt-28 pt-12 md:pt-16 border-t border-line">
      {/* Archive Header */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted block mb-2">
            Archive
          </span>
          <h3 className="text-[clamp(24px,3vw,36px)] font-heading font-medium tracking-tight text-text">
            More work &amp; technical contributions
          </h3>
        </div>
        <span className="text-[13px] text-muted font-mono tabular-nums">
          {projects.length} Selected Records
        </span>
      </div>

      {/* Hairline-separated list */}
      <div className="border-t border-line divide-y divide-line">
        {projects.map((project, index) => {
          const isHovered = hoveredIndex === index
          const isSibling = hoveredIndex !== null && !isHovered
          const isExpanded = expandedIndex === index
          const formattedIndex = String(index + 1).padStart(2, '0')

          return (
            <motion.div
              key={project.slug}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.04,
                ease: [0.23, 1, 0.32, 1],
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transition: 'opacity 250ms cubic-bezier(0.23, 1, 0.32, 1)',
                opacity: isSibling ? 0.35 : 1,
              }}
              className="py-5 sm:py-6"
            >
              {/* Row Button Header */}
              <button
                type="button"
                onClick={() => handleToggle(index)}
                aria-expanded={isExpanded}
                className="w-full text-left flex items-baseline justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-text select-none group"
              >
                {/* Left side: Index, Title, Discipline */}
                <div className="flex items-baseline gap-4 sm:gap-6 min-w-0 flex-1">
                  {/* Index in tabular figures */}
                  <span className="text-[13px] font-mono text-muted tabular-nums shrink-0">
                    {formattedIndex}
                  </span>

                  {/* Title at h3 size with 8px shift on fine hover */}
                  <h4
                    style={{
                      transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    className="text-[18px] sm:text-[22px] font-heading font-medium tracking-tight text-text truncate group-hover:translate-x-2"
                  >
                    {project.title}
                  </h4>

                  {/* Discipline in label style */}
                  <span className="hidden sm:inline-block text-[11px] uppercase font-medium tracking-[0.08em] text-muted shrink-0">
                    {project.disciplineLabel}
                  </span>
                </div>

                {/* Right side: Year (if available) + Arrow sliding in from left */}
                <div className="flex items-center gap-4 shrink-0 text-muted">
                  {project.year && (
                    <span className="text-[13px] font-mono text-muted tabular-nums hidden md:inline">
                      {project.year}
                    </span>
                  )}
                  <span
                    style={{
                      transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1), opacity 250ms ease, color 250ms ease',
                      transform: isExpanded
                        ? 'rotate(90deg)'
                        : isHovered
                        ? 'translateX(0)'
                        : 'translateX(-4px)',
                      opacity: isHovered || isExpanded ? 1 : 0.7,
                    }}
                    className="text-[18px] text-muted group-hover:text-text inline-block origin-center"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </div>
              </button>

              {/* Expandable Details Container: 300ms grid-template-rows height animation */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  transition: 'grid-template-rows 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                }}
              >
                <div className="overflow-hidden min-h-0">
                  <div
                    style={{
                      transition: 'opacity 150ms ease 150ms',
                      opacity: isExpanded ? 1 : 0,
                    }}
                    className="pt-4 pb-2 pl-7 sm:pl-10 max-w-[65ch]"
                  >
                    {/* One-sentence summary */}
                    <p className="text-[14px] sm:text-[15px] text-text leading-[1.6] mb-3">
                      {project.summary}
                    </p>

                    {/* Detailed scope if distinct */}
                    {project.detail && project.detail !== project.summary && (
                      <p className="text-[13px] text-muted leading-[1.6] mb-4">
                        {project.detail}
                      </p>
                    )}

                    {/* Pipeline breakdown if present */}
                    {project.pipeline && (
                      <div className="mb-4 p-3 rounded-[4px] bg-surface border border-line text-[12px] font-mono text-muted">
                        <span className="text-text font-medium block mb-1 uppercase tracking-wider text-[10px]">
                          Pipeline Trigger: {project.pipeline.trigger}
                        </span>
                        <span>{project.pipeline.steps.join(' → ')}</span>
                      </div>
                    )}

                    {/* Tags and project URL */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-[11px] font-mono text-muted bg-surface px-2.5 py-0.5 rounded-[3px] border border-line/60"
                        >
                          {tool}
                        </span>
                      ))}

                      {project.link && (
                        <a
                          href={project.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill-secondary btn-press text-[12px] font-medium text-text ml-auto inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full"
                        >
                          <span>{project.link.label || 'View project'}</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
