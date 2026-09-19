import { practices } from '../data/practices'
import type { FilterId } from '../types'

interface FilterBarProps {
  value: FilterId
  onChange: (value: FilterId) => void
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  const options: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All work' },
    ...practices.map((practice) => ({ id: practice.id as FilterId, label: practice.label })),
  ]

  return (
    <div role="group" aria-label="Filter work by practice" className="mb-8 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id)}
            className={`rounded-sm border px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-150 ease-brand ${
              active
                ? 'border-accent bg-accent text-accent-ink'
                : 'border-rule-firm text-ink-2 hover:border-accent hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}