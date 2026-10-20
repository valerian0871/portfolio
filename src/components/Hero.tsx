import { useSite } from '../lib/SiteContext'
import { FadeIn, MaskLines } from './site/Reveal'
import { RecordPlayer } from './site/RecordPlayer'
import { TextLink } from './site/TextLink'

interface HeroProps {
  /** Turns true when the loader hands off (or immediately when it is skipped) */
  ready?: boolean
}

export function Hero({ ready = true }: HeroProps) {
  const site = useSite()

  return (
    <section id="top" className="relative flex min-h-svh items-center py-28 md:py-32">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-12 items-start gap-y-12 px-5 sm:px-6 md:px-10 lg:gap-x-10">
        <div className="col-span-12">
          <MaskLines
            as="h1"
            trigger="play"
            play={ready}
            lines={['Code, design,', 'words, workflows.']}
            className="hero-title font-heading text-text"
          />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <FadeIn play={ready} delay={0.25}>
            <p className="max-w-[34rem] text-[15px] leading-[1.65] text-muted sm:text-[17px]">
              Frontend developer in Nigeria. I also design brand systems, typeset books and automate
              business workflows.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-6 sm:mt-9">
              <TextLink href="#work" onClick={(e) => { e.preventDefault(); site.scrollToSection('work') }}>
                View work
              </TextLink>
              <TextLink href="#contact" onClick={(e) => { e.preventDefault(); site.scrollToSection('contact') }}>
                Get in touch
              </TextLink>
            </div>
          </FadeIn>
        </div>
        <FadeIn
          play={ready}
          delay={0.4}
          className="col-span-12 w-full max-w-[22rem] sm:max-w-[24rem] lg:col-span-4 lg:col-start-9 lg:max-w-none"
        >
          <RecordPlayer />
        </FadeIn>
      </div>
    </section>
  )
}
