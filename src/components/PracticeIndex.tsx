import { practices } from '../data/practices'
import { countByPractice } from '../data/projects'
import type { PracticeId } from '../types'

interface PracticeIndexProps {
  onSelect: (id: PracticeId) => void
}

export function PracticeIndex({ onSelect }: PracticeIndexProps) {
  return (
    <nav aria-label="Practices" className="index-track relative mt-10 sm:mt-16 border-t border-rule-firm">
      <svg
        aria-hidden="true"
        preserveAspectRatio="none"
        viewBox="0 0 2 100"
        className="pointer-events-none absolute top-0 bottom-0 -left-6 hidden w-[2px] lg:block"
      >
        <path
          className="index-spine-path"
          d="M1 0 L1 100"
          pathLength={100}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {practices.map((practice) => {
        const count = countByPractice(practice.id)
        return (
          <div key={practice.id} className="border-b border-rule">
            <button
              type="button"
              onClick={() => onSelect(practice.id)}
              className="btn-press group flex w-full flex-col sm:flex-row sm:items-baseline justify-between gap-2.5 sm:gap-6 rounded-sm py-4 sm:py-6 text-left hover:ps-2.5 hover:text-accent focus-visible:ps-2.5 focus-visible:text-accent cursor-pointer"
            >
              <span>
                <span className="block text-index leading-[1.18] font-medium tracking-[-0.03em] group-hover:text-accent transition-colors">
                  {practice.label}
                </span>
                <span className="mt-1 block max-w-[46ch] font-read text-[0.875rem] sm:text-[0.9375rem] leading-normal text-ink-3">
                  {practice.note}
                </span>
              </span>
              <span className="inline-flex items-center gap-2.5 shrink-0 self-start sm:self-auto text-[0.9375rem] tabular-nums text-ink-3">
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-ink-2 group-hover:text-accent border border-rule/80">
                  {count === 1 ? '1 project' : `${count} projects`}
                </span>
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 -translate-x-2 transition-all duration-200 ease-brand group-hover:opacity-100 group-hover:translate-x-0 text-accent hidden sm:block"
                  aria-hidden="true"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </button>
          </div>
        )
      })}
    </nav>
  )
}