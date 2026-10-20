import { motion } from 'motion/react'
import { useSite } from '../lib/SiteContext'
import { springUI } from '../lib/motion'
import { selectedProjects } from '../lib/site'
import { MaskLines } from './site/Reveal'

/** Numbered work rows (spec #6, #7, #8). A row opens its case study in place. */
export function WorkSection() {
  const site = useSite()

  return (
    <section id="work" className="py-28 md:py-40">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <div className="mb-12 flex items-end justify-between gap-6">
          <MaskLines lines={['Selected work']} className="section-title" />
          <div className="flex items-center gap-5 pb-1">
            <span className="hidden font-mono text-[12px] text-muted sm:inline">
              {selectedProjects.length} projects
            </span>
            <a
              href="/work"
              onClick={(e) => {
                e.preventDefault()
                site.navigate('/work')
              }}
              className="text-link group inline-flex items-center gap-2 border-b py-1 text-[14px] font-medium"
            >
              All work <span aria-hidden="true" className="text-link-arrow inline-block">→</span>
            </a>
          </div>
        </div>

        <ol className="work-list border-b border-line">
          {selectedProjects.map((project, i) => (
            <motion.li
              key={project.slug}
              className="work-row group relative -mx-4 rounded-2xl px-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ ...springUI, delay: Math.min(i, 5) * 0.06 }}
            >
              <article className="flex items-center gap-4 border-t border-line py-5 md:py-6">
                <span className="w-8 shrink-0 font-mono text-[11px] text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="work-row-title min-w-0 flex-1 font-heading text-text">
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
                <span className="hidden shrink-0 items-center gap-1.5 md:flex">
                  {project.tools.slice(0, 3).map((tool) => (
                    <span key={tool} className="work-tag rounded-full border px-2.5 py-1 font-mono text-[11px] text-muted">
                      {tool}
                    </span>
                  ))}
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{project.year}</span>
                <span aria-hidden="true" className="work-row-arrow shrink-0 text-[14px] text-muted">
                  →
                </span>
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
