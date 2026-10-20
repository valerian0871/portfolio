import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { content } from '../data/content'
import { useSite } from '../lib/SiteContext'
import { MaskLines } from './site/Reveal'
import { TextLink } from './site/TextLink'

/** About: the lead paragraph brightens word by word with scroll (spec #14) */
export function AboutSection() {
  const site = useSite()
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.35'] })
  const words = content.about.previewParagraph.split(' ')

  return (
    <section id="about" className="py-28 md:py-40">
      <div ref={ref} className="mx-auto grid w-full max-w-[1100px] grid-cols-12 gap-y-10 px-6">
        <MaskLines lines={['About']} className="section-title col-span-12 md:col-span-4" />
        <div className="col-span-12 md:col-span-8">
          <p className="about-lead max-w-[42em] font-heading text-text">
            {reduceMotion
              ? content.about.previewParagraph
              : words.map((word, i) => (
                  <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                    {word}
                  </Word>
                ))}
          </p>
          <p className="mt-8 max-w-[46em] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55] text-muted">
            {content.about.fullStory[0]}
          </p>
          <div className="mt-8">
            <TextLink
              href="/about"
              arrow="→"
              onClick={(e) => {
                e.preventDefault()
                site.navigate('/about')
              }}
            >
              {content.about.linkText}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  )
}
