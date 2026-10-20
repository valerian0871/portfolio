import { AnimatePresence, motion } from 'motion/react'
import { useSite } from '../lib/SiteContext'
import { easeOutStrong } from '../lib/motion'
import { practiceTabs } from '../lib/site'
import { MaskLines } from './site/Reveal'
import { Segmented } from './site/Segmented'

const tabItems = practiceTabs.map((tab) => ({ id: tab.id, label: tab.label }))

/**
 * Services as a switcher (the reference's stack pattern, spec #12, #13).
 * Desktop: the tabs live in the bottom island while this section is active.
 * Mobile: the same tabs render inline.
 */
export function ServicesSection() {
  const site = useSite()
  const tab = practiceTabs.find((t) => t.id === site.practice) ?? practiceTabs[0]

  return (
    <section id="services" className="py-28 md:py-40">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-12 gap-y-10 px-6">
        <div className="col-span-12 md:col-span-4">
          <MaskLines lines={['Services']} className="section-title" />
          <p className="mt-6 hidden max-w-[22ch] text-[13px] leading-[1.5] text-muted md:block">
            Choose a practice from the bar at the bottom of the screen.
          </p>
          <div className="on-ink mt-8 max-w-[440px] rounded-full md:hidden" style={{ height: 'var(--island-h)' }}>
            <Segmented
              mode="tabs"
              label="Services"
              idPrefix="inline-practice"
              panelId="services-panel"
              items={tabItems}
              active={site.practice}
              onSelect={site.setPractice}
              compact
            />
          </div>
        </div>

        <div
          id="services-panel"
          role="tabpanel"
          aria-label={tab.name}
          tabIndex={0}
          className="col-span-12 min-h-[34rem] focus-visible:outline-offset-8 md:col-span-8"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
                transition: { duration: 0.15, delay: 0.03, ease: 'easeOut' },
              }}
              exit={{ opacity: 0, filter: 'blur(4px)', transition: { duration: 0.12, ease: 'easeOut' } }}
            >
              <p className="mb-6 text-[17px] text-muted">{tab.note}</p>
              <ul className="border-b border-line">
                {tab.items.map((item, i) => (
                  <motion.li
                    key={item}
                    className="service-row group flex items-baseline gap-4 border-t border-line py-4 md:py-5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.04 + i * 0.03, ease: easeOutStrong }}
                  >
                    <span className="service-row-text font-heading text-text">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-8 max-w-[60ch] text-[15px] leading-[1.6] text-muted">{tab.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-1.5">
                <span className="mr-2 font-mono text-[11px] text-muted">Tools in my work</span>
                {tab.tools.map((tool) => (
                  <span key={tool} className="work-tag rounded-full border px-2.5 py-1 font-mono text-[11px] text-muted">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
