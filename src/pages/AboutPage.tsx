import { motion } from 'motion/react'
import { content } from '../data/content'
import { useSite } from '../lib/SiteContext'
import { springUI } from '../lib/motion'
import { MaskLines } from '../components/site/Reveal'
import { ScrollWords } from '../components/site/ScrollWords'
import { TextLink } from '../components/site/TextLink'

export function AboutPage() {
  const site = useSite()
  const [lead, ...rest] = content.about.fullStory

  return (
    <article className="pb-28 pt-32 md:pb-40 md:pt-40">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <MaskLines
          as="h1"
          trigger="play"
          lines={['Bridging engineering rigor', 'with editorial craft.']}
          className="case-title font-heading text-text"
        />

        <section className="mt-24 grid grid-cols-12 gap-y-8 md:mt-32" aria-labelledby="about-background">
          <div className="col-span-12 md:col-span-4">
            <h2 id="about-background" className="section-title font-heading text-text">
              Background
            </h2>
            <p className="mt-5 max-w-[26ch] text-[14px] leading-[1.55] text-muted">
              Working remotely with teams globally across engineering and design systems.
            </p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <ScrollWords text={lead} className="about-lead max-w-[42em] font-heading text-text" />
            {rest.map((paragraph, i) => (
              <p key={i} className="mt-8 max-w-[46em] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.6] text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-28 grid grid-cols-12 gap-y-8 md:mt-40" aria-labelledby="about-principles">
          <div className="col-span-12 md:col-span-4">
            <h2 id="about-principles" className="section-title font-heading text-text">
              Principles
            </h2>
            <p className="mt-5 max-w-[26ch] text-[14px] leading-[1.55] text-muted">
              The core standards that shape every architectural, typographic, and workflow decision.
            </p>
          </div>
          <ul className="col-span-12 border-b border-line md:col-span-8">
            {content.about.principles.map((principle, i) => (
              <motion.li
                key={principle.title}
                className="service-row grid gap-3 border-t border-line py-7 md:grid-cols-[minmax(0,15rem)_1fr] md:gap-8"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5% 0px' }}
                transition={{ ...springUI, delay: i * 0.06 }}
              >
                <h3 className="service-row-text font-heading text-text">{principle.title}</h3>
                <p className="text-[15px] leading-[1.6] text-muted">{principle.body}</p>
              </motion.li>
            ))}
          </ul>
        </section>

        <div className="mt-28 border-t border-line pt-10 md:mt-40">
          <p className="contact-title font-heading text-text">Have a project in mind?</p>
          <div className="mt-8">
            <TextLink
              href="/contact"
              arrow="→"
              onClick={(e) => {
                e.preventDefault()
                site.navigate('/contact')
              }}
            >
              Get in touch
            </TextLink>
          </div>
        </div>
      </div>
    </article>
  )
}
