import { forwardRef } from 'react'
import { Container } from './Container'
import { FilterBar } from './FilterBar'
import { EntrySkeleton } from './EntrySkeleton'
import { ProjectEntry } from './ProjectEntry'
import { projects } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'
import type { FilterId } from '../types'

interface WorkSectionProps {
  filter: FilterId
  onFilterChange: (value: FilterId) => void
  ready: boolean
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
            <h2 id="work-title" className="text-[2rem] leading-[1.18] font-semibold tracking-[-0.03em]">
              Work
            </h2>
            <p role="status" className="text-[0.9375rem] tabular-nums text-ink-3">
              {ready ? label : 'Loading projects'}
            </p>
          </div>

          <FilterBar value={filter} onChange={onFilterChange} />

          {!ready && <EntrySkeleton />}

          {ready && visible.length === 0 && (
            <p className="py-16 font-read text-ink-2">Nothing under this practice yet.</p>
          )}

          {ready && visible.length > 0 && (
            <div className="border-t border-rule-firm">
              {visible.map((project, index) => (
                <ProjectEntry
                  key={project.slug}
                  project={project}
                  index={reduced ? 0 : index}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    )
  },
)