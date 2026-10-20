import { useSite } from '../lib/SiteContext'
import { FadeIn, MaskLines } from './site/Reveal'
import { TextLink } from './site/TextLink'

interface HeroProps {
  /** Turns true when the loader hands off (or immediately when it is skipped) */
  ready?: boolean
}

export function Hero({ ready = true }: HeroProps) {
  const site = useSite()

  return (
    <section id="top" className="relative flex min-h-svh items-center py-24 sm:py-28 md:py-0">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-6 md:px-10">
        <MaskLines
          as="h1"
          trigger="play"
          play={ready}
          lines={['Code, design,', 'words, workflows.']}
          className="hero-title font-heading text-text"
        />
        <FadeIn play={ready} delay={0.25}>
          <p className="mt-7 max-w-[34rem] text-[15px] leading-[1.65] text-muted sm:mt-10 sm:text-[17px]">
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
    </section>
  )
}
