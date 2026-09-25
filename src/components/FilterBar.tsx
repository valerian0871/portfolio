import { practices } from '../data/practices'
import { countByPractice, projects } from '../data/projects'
import type { FilterId } from '../types'

interface FilterBarProps {
  value: FilterId
  onChange: (value: FilterId) => void
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  const options: { id: FilterId; label: string; count: number }[] = [
    { id: 'all', label: 'All work', count: projects.length },
    ...practices.map((practice) => ({
      id: practice.id as FilterId,
      label: practice.label,
      count: countByPractice(practice.id),
    })),
  ]

  return (
    <div role="group" aria-label="Filter work by practice" className="mb-10 flex flex-wrap gap-2.5">
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-[0.875rem] font-medium transition-all duration-150 ease-brand focus-visible:outline-accent ${
              active
                ? 'border-accent bg-accent text-accent-ink shadow-xs'
                : 'border-rule-firm text-ink-2 hover:border-accent hover:text-ink'
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`rounded-xs px-1.5 py-0.2 text-[0.75rem] tabular-nums font-mono ${
                active ? 'bg-white/20 text-accent-ink' : 'bg-accent-soft text-ink-3'
              }`}
            >
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}