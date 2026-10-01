import { Container } from './Container'
import { HeadingReveal, FadeReveal } from './TextReveal'
import { content } from '../data/content'

interface HeroProps {
  onCtaClick?: () => void
}

export function Hero({ onCtaClick }: HeroProps) {
  return (
    <section
      id="top"
      className="relative flex flex-col justify-between min-h-[100svh] pt-[128px] md:pt-[140px] pb-16 md:pb-24 border-b border-line"
    >
      <Container className="flex-1 flex flex-col justify-between">
        {/* Top category label */}
        <div className="pt-2">
          <FadeReveal delay={0.1}>
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted">
              {content.hero.label}
            </span>
          </FadeReveal>
        </div>

        {/* Statement headline spanning columns 1 to 10 on desktop */}
        <div className="my-auto py-12 md:py-20 lg:py-24 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-10">
            <HeadingReveal
              text={content.hero.headline}
              as="h1"
              trigger="mount"
              className="text-[clamp(44px,7.2vw,112px)] font-heading font-medium tracking-[-0.035em] leading-[1.1] text-text"
            />
          </div>
        </div>

        {/* One single pill CTA, nothing else */}
        <div className="pt-4 pb-2">
          <FadeReveal delay={0.4}>
            <a
              href={content.hero.cta.href}
              onClick={onCtaClick}
              className="btn-pill"
            >
              {content.hero.cta.label}
            </a>
          </FadeReveal>
        </div>
      </Container>
    </section>
  )
}