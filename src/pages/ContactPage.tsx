import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { content } from '../data/content'
import { useSite } from '../lib/SiteContext'
import { springUI } from '../lib/motion'
import { contactItems, isMac } from '../lib/site'
import { MaskLines } from '../components/site/Reveal'

function lagosTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

/** /contact: large action rows (copy, WhatsApp, profiles) and the practical details */
export function ContactPage() {
  const site = useSite()
  const [time, setTime] = useState(lagosTime)

  useEffect(() => {
    const id = window.setInterval(() => setTime(lagosTime()), 15000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <article className="pb-28 pt-32 md:pb-40 md:pt-40">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <MaskLines
          as="h1"
          trigger="play"
          lines={['Let us discuss', 'your next project.']}
          className="case-title font-heading text-text"
        />
        <p className="mt-8 max-w-[44ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55] text-muted">
          I am currently open to freelance design engineering contracts, frontend development engagements, and
          full-time technical roles.
        </p>

        <ul className="mt-16 border-b border-line md:mt-20">
          {contactItems.map((item, i) => (
            <motion.li
              key={item.id}
              className="work-row group relative -mx-4 rounded-2xl px-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ ...springUI, delay: i * 0.06 }}
            >
              <div className="flex items-center gap-4 border-t border-line py-6 md:py-8">
                <span className="contact-row-title work-row-title min-w-0 flex-1 font-heading text-text">
                  <button type="button" onClick={() => site.runItem(item)} className="stretched text-left">
                    {item.label}
                  </button>
                </span>
                <span className="hidden truncate font-mono text-[12px] text-muted sm:block">{item.hint}</span>
                <span aria-hidden="true" className="work-row-arrow shrink-0 text-[15px] text-muted">
                  {item.action.kind === 'copy' ? '→' : '↗'}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>

        <dl className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[11px] text-muted">Availability</dt>
            <dd className="mt-2 max-w-[30ch] text-[15px] leading-[1.55]">{content.profile.availability}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] text-muted">Location</dt>
            <dd className="mt-2 text-[15px] leading-[1.55]">
              Nigeria (UTC+1) <span className="text-muted">· {time} now</span>
            </dd>
          </div>
          <div className="hidden sm:block">
            <dt className="font-mono text-[11px] text-muted">Shortcut</dt>
            <dd className="mt-2 text-[15px] leading-[1.55]">
              {isMac ? '⌘K' : 'Ctrl K'} <span className="text-muted">opens the command palette</span>
            </dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
