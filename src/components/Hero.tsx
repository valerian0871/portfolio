import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useSite } from '../lib/SiteContext'
import { Magnetic } from './site/Magnetic'
import { FadeIn, MaskLines } from './site/Reveal'
import { RecordPlayer } from './site/RecordPlayer'
import { TextLink } from './site/TextLink'

interface HeroProps {
  ready?: boolean
}

export function Hero({ ready = true }: HeroProps) {
  const site = useSite()
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // On the way out the two lines pull apart, like a spread opening.
  const lineX = [
    useTransform(scrollYProgress, [0, 1], ['0vw', '-14vw']),
    useTransform(scrollYProgress, [0, 1], ['0vw', '14vw']),
  ]
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.85], [1, 0])
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const playerY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%'])
  const playerRotate = useTransform(scrollYProgress, [0, 1], [0, -6])

  return (
    <section ref={ref} id="top" className="relative flex min-h-svh items-center overflow-x-clip py-28 md:py-32">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 items-start gap-y-12 px-5 sm:px-6 md:px-10 lg:gap-x-10">
        <motion.div
          className="col-span-12 origin-left"
          style={reduceMotion ? undefined : { opacity: titleOpacity, scale: titleScale }}
        >
          <MaskLines
            as="h1"
            trigger="play"
            play={ready}
            lines={['Code, design,', 'words, workflows.']}
            className="hero-title font-heading text-text"
            lineStyle={reduceMotion ? undefined : (i) => ({ x: lineX[i] })}
          />
        </motion.div>
        <div className="col-span-12 flex items-start justify-between gap-5 sm:gap-8 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 flex-1 lg:col-span-6">
          <FadeIn play={ready} delay={0.25}>
            <p className="max-w-[34rem] text-[15px] leading-[1.65] text-muted sm:text-[17px]">
              Frontend developer. I also design brand systems, typeset books and automate
              business workflows.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 sm:mt-9">
              <Magnetic>
                <TextLink href="#work" onClick={(e) => { e.preventDefault(); site.scrollToSection('work') }}>
                  View work
                </TextLink>
              </Magnetic>
              <Magnetic>
                <TextLink href="#contact" onClick={(e) => { e.preventDefault(); site.scrollToSection('contact') }}>
                  Get in touch
                </TextLink>
              </Magnetic>
            </div>
          </FadeIn>
        </div>
        <FadeIn
          play={ready}
          delay={0.4}
          className="hero-player shrink-0 lg:col-span-4 lg:col-start-9 lg:w-auto"
        >
          <motion.div style={reduceMotion ? undefined : { y: playerY, rotate: playerRotate }}>
            <RecordPlayer />
          </motion.div>
        </FadeIn>
        </div>
      </div>
    </section>
  )
}
