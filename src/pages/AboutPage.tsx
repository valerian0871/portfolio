import { Container } from '../components/Container'
import { HeadingReveal, FadeReveal } from '../components/TextReveal'
import { content } from '../data/content'

interface AboutPageProps {
  onBack?: () => void
}

export function AboutPage({ onBack }: AboutPageProps) {
  return (
    <article className="page-enter pt-[100px] md:pt-[128px] pb-24 md:pb-32">
      <Container>
        {/* Breadcrumb / Back */}
        <div className="mb-8">
          <a
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault()
                onBack()
              }
            }}
            className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-text transition-colors"
          >
            <span>←</span>
            <span>Back to overview</span>
          </a>
        </div>

        {/* Heading */}
        <div className="mb-12 md:mb-16">
          <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted block mb-3">
            Biography &amp; Philosophy
          </span>
          <HeadingReveal
            text="Bridging engineering rigor with editorial craft."
            as="h1"
            className="text-[clamp(36px,5vw,72px)] font-heading font-medium tracking-[-0.035em] leading-[1.1] text-text max-w-[18ch]"
          />
        </div>

        <div className="h-[1px] w-full bg-line mb-12 md:mb-16" />

        {/* Full Story Grid */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 md:col-span-4">
            <h2 className="text-[20px] font-heading font-medium text-text mb-2">
              Background
            </h2>
            <p className="text-[14px] text-muted leading-[1.6]">
              Based in Nigeria, working remotely with teams globally across engineering and design systems.
            </p>
          </div>

          <div className="col-span-12 md:col-span-8 space-y-6">
            {content.about.fullStory.map((paragraph, i) => (
              <FadeReveal key={i} delay={i * 0.1}>
                <p className="text-[18px] md:text-[20px] text-text leading-[1.6] max-w-[60ch]">
                  {paragraph}
                </p>
              </FadeReveal>
            ))}
          </div>
        </div>

        <div className="h-[1px] w-full bg-line my-16 md:my-24" />

        {/* Core Principles */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 md:col-span-4">
            <h2 className="text-[20px] font-heading font-medium text-text mb-2">
              Operating Principles
            </h2>
            <p className="text-[14px] text-muted leading-[1.6]">
              The core standards that shape every architectural, typographic, and workflow decision.
            </p>
          </div>

          <div className="col-span-12 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {content.about.principles.map((principle, i) => (
              <FadeReveal key={principle.title} delay={i * 0.1} className="flex flex-col gap-2">
                <h3 className="text-[17px] font-heading font-medium text-text">
                  {principle.title}
                </h3>
                <p className="text-[15px] text-muted leading-[1.55]">
                  {principle.body}
                </p>
              </FadeReveal>
            ))}
          </div>
        </div>
      </Container>
    </article>
  )
}
