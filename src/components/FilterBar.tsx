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
    <div role="group" aria-label="Filter work by practice" className="mb-6 sm:mb-10 flex flex-wrap gap-2 sm:gap-2.5">
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 rounded-sm border px-3 sm:px-3.5 py-1.5 sm:py-2 text-[0.8125rem] sm:text-[0.875rem] font-medium transition-all duration-150 ease-brand focus-visible:outline-accent ${
              active
                ? 'border-accent bg-accent text-accent-ink shadow-xs -translate-y-0.5'
                : 'border-rule-firm bg-paper/60 text-ink-2 hover:border-accent hover:text-ink hover:bg-accent-soft/30'
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[0.6875rem] tabular-nums font-mono font-medium ${
                active ? 'bg-white/20 text-accent-ink' : 'bg-accent-soft text-ink-3 border border-rule/60'
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