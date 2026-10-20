import { useSite } from '../lib/SiteContext'
import { FadeIn, MaskLines } from './site/Reveal'
import { RecordPlayer } from './site/RecordPlayer'
import { TextLink } from './site/TextLink'

interface HeroProps {
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
        <div className="col-span-12 flex items-start justify-between gap-5 sm:gap-8 lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 flex-1 lg:col-span-6">
          <FadeIn play={ready} delay={0.25}>
            <p className="max-w-[34rem] text-[15px] leading-[1.65] text-muted sm:text-[17px]">
              Frontend developer. I also design brand systems, typeset books and automate
              business workflows.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 sm:mt-9">
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
          className="hero-player shrink-0 lg:col-span-4 lg:col-start-9 lg:w-auto"
        >
          <RecordPlayer />
        </FadeIn>
        </div>
      </div>
    </section>
  )
}
