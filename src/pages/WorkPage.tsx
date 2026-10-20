import { useState } from 'react'
import { motion } from 'motion/react'
import type { DisciplineId, Project } from '../data/content'
import { useSite } from '../lib/SiteContext'
import { springUI } from '../lib/motion'
import { practiceTabs, workGroups } from '../lib/site'
import { MaskLines } from '../components/site/Reveal'
import { Segmented } from '../components/site/Segmented'

type Filter = DisciplineId | 'all'

const filterItems: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  ...practiceTabs.map((tab) => ({ id: tab.id, label: tab.label })),
]

/** /work: every project as a numbered row, grouped by practice. Rows open the case study. */
export function WorkPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const groups = filter === 'all' ? workGroups : workGroups.filter((g) => g.id === filter)
  const count = groups.reduce((n, g) => n + g.projects.length, 0)

  return (
    <article className="mx-auto w-full max-w-[1100px] px-6 pb-28 pt-32 md:pb-40 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <MaskLines as="h1" trigger="play" lines={['All work']} className="case-title font-heading text-text" />
        <span className="pb-2 font-mono text-[12px] tabular-nums text-muted">
          {count} {count === 1 ? 'project' : 'projects'}
        </span>
      </div>
      <p className="mt-6 max-w-[40ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.5] text-muted">
        Frontend builds, brand graphics, books and automation. Each row opens its case study.
      </p>

      <div className="on-ink mt-10 max-w-[520px] rounded-full" style={{ height: 'var(--island-h)' }}>
        <Segmented
          mode="tabs"
          label="Filter by practice"
          idPrefix="work-filter"
          panelId="work-list"
          items={filterItems}
          active={filter}
          onSelect={setFilter}
          compact
        />
      </div>

      <div id="work-list" role="tabpanel" aria-label={`${count} projects`} className="mt-16">
        {groups.map((group) => (
          <section key={`${filter}-${group.id}`} className="mt-16 first:mt-0" aria-labelledby={`group-${group.id}`}>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id={`group-${group.id}`} className="font-heading text-[clamp(1.375rem,2.4vw,1.75rem)] tracking-[-0.03em] text-text">
                {group.label}
              </h2>
              <p className="text-[14px] text-muted">{group.note}</p>
            </div>
            <ol className="border-b border-line">
              {group.projects.map((project, i) => (
                <WorkRow key={project.slug} project={project} index={i} />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </article>
  )
}

function WorkRow({ project, index }: { project: Project; index: number }) {
  const site = useSite()
  const thumb = project.images[0]

  return (
    <motion.li
      className="work-row group relative -mx-4 rounded-2xl px-4"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ ...springUI, delay: Math.min(index, 5) * 0.05 }}
    >
      <article className="flex items-center gap-4 border-t border-line py-4 md:py-5">
        <span className="w-8 shrink-0 font-mono text-[11px] text-muted">{String(index + 1).padStart(2, '0')}</span>
        <div className="min-w-0 flex-1">
          <h3 className="work-row-title font-heading text-text">
            <button
              type="button"
              data-row={project.slug}
              onClick={() => site.openCase(project.slug)}
              className="stretched text-left"
            >
              {project.title}
              <span className="sr-only">, open case study</span>
            </button>
          </h3>
          <p className="mt-1 text-[13px] text-muted md:hidden">{project.kind}</p>
        </div>
        <span className="hidden w-[30%] shrink-0 truncate text-[13px] text-muted md:block">{project.kind}</span>
        <span className="hidden h-10 w-14 shrink-0 overflow-hidden rounded-md border border-line bg-surface md:block">
          {thumb ? (
            <img src={thumb.src} alt="" loading="lazy" className="work-thumb h-full w-full object-cover object-top" />
          ) : null}
        </span>
        <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted">{project.year ?? ''}</span>
        <span aria-hidden="true" className="work-row-arrow shrink-0 text-[14px] text-muted">
          →
        </span>
      </article>
    </motion.li>
  )
}

