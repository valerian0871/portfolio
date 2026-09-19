import { practices } from '../data/practices'
import { countByPractice } from '../data/projects'
import type { PracticeId } from '../types'

interface PracticeIndexProps {
  onSelect: (id: PracticeId) => void
}

/**
 * The one bold element on the page. Each row states a practice, shows how many
 * projects sit under it, and filters the work list when activated.
 */
export function PracticeIndex({ onSelect }: PracticeIndexProps) {
  return (
    <nav aria-label="Practices" className="mt-24 border-t border-rule-firm">
      {practices.map((practice) => {
        const count = countByPractice(practice.id)
        return (
          <div key={practice.id} className="border-b border-rule">
            <button
              type="button"
              onClick={() => onSelect(practice.id)}
              className="group flex w-full items-baseline justify-between gap-6 rounded-sm py-6 text-left transition-[color,padding] duration-200 ease-brand hover:ps-4 hover:text-accent focus-visible:ps-4 focus-visible:text-accent"
            >
              <span>
                <span className="block text-index leading-[1.18] font-medium tracking-[-0.03em]">
                  {practice.label}
                </span>
                <span className="mt-1 block max-w-[46ch] font-read text-[0.9375rem] leading-normal text-ink-3">
                  {practice.note}
                </span>
              </span>
              <span className="shrink-0 text-[0.9375rem] tabular-nums text-ink-3">
                {count === 1 ? '1 project' : `${count} projects`}
              </span>
            </button>
          </div>
        )
      })}
    </nav>
  )
}