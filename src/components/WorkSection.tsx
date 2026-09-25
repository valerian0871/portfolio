import { forwardRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Container } from './Container'
import { FilterBar } from './FilterBar'
import { EntrySkeleton } from './EntrySkeleton'
import { FrontendCard } from './disciplines/FrontendCard'
import { GraphicsCard } from './disciplines/GraphicsCard'
import { WritingEntry } from './disciplines/WritingEntry'
import { AutomationPipeline } from './disciplines/AutomationPipeline'
import { projects } from '../data/projects'
import type { FilterId, Project } from '../types'

interface WorkSectionProps {
  filter: FilterId
  onFilterChange: (value: FilterId) => void
  ready: boolean
}

function renderDisciplineItem(project: Project, index: number) {
  switch (project.practice) {
    case 'frontend':
      return <FrontendCard key={project.slug} project={project} index={index} />
    case 'graphics':
      return <GraphicsCard key={project.slug} project={project} index={index} />
    case 'writing':
      return <WritingEntry key={project.slug} project={project} index={index} />
    case 'automation':
      return <AutomationPipeline key={project.slug} project={project} index={index} />
    default:
      return null
  }
}

export const WorkSection = forwardRef<HTMLElement, WorkSectionProps>(
  function WorkSection({ filter, onFilterChange, ready }, ref) {
    const reduced = useReducedMotion()

    const visible =
      filter === 'all'
        ? projects
        : projects.filter((project) => project.practice === filter)

    const label =
      filter === 'all'
        ? `Showing all ${projects.length} projects`
        : `Showing ${visible.length} of ${projects.length} projects`

    return (
      <section
        id="work"
        ref={ref}
        tabIndex={-1}
        aria-labelledby="work-title"
        className="scroll-mt-24 border-t border-rule py-24 outline-none"
      >
        <Container>
          <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <h2 id="work-title" className="text-[2rem] leading-[1.18] font-semibold tracking-[-0.03em]">
                Selected Work
              </h2>
              <p className="mt-2 text-[0.9375rem] text-ink-3">
                Tailored proof across frontend builds, visual systems, editorial writing, and workflow pipelines.
              </p>
            </div>
            <p role="status" className="text-[0.875rem] tabular-nums text-ink-3">
              {ready ? label : 'Loading projects'}
            </p>
          </div>

          <FilterBar value={filter} onChange={onFilterChange} />

          {!ready && <EntrySkeleton />}

          {ready && visible.length === 0 && (
            <p className="py-16 font-read text-ink-2">Nothing under this practice yet.</p>
          )}

          {ready && visible.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
                className="border-t border-rule-firm"
              >
                {visible.map((project, index) => renderDisciplineItem(project, index))}
              </motion.div>
            </AnimatePresence>
          )}
        </Container>
      </section>
    )
  },
)