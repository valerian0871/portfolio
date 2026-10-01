import { Container } from './Container'
import { HeadingReveal, FadeReveal } from './TextReveal'
import { content } from '../data/content'

interface AboutSectionProps {
  onReadMore?: () => void
}

export function AboutSection({ onReadMore }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="py-[64px] md:py-[96px] lg:py-[128px] border-b border-[#E2E1DB]"
    >
      <Container>
        <div className="grid grid-cols-12 gap-6">
          {/* Label left column on desktop */}
          <div className="col-span-12 md:col-span-3 lg:col-span-3">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] block mb-4">
              About
            </span>
          </div>

          {/* Paragraph and link right columns */}
          <div className="col-span-12 md:col-span-9 lg:col-span-8 flex flex-col items-start gap-8">
            <HeadingReveal
              text="Engineering with graphic sensibility & operational rigor."
              as="h2"
              className="text-[clamp(28px,3.5vw,48px)] font-heading font-medium tracking-[-0.035em] leading-[1.1] text-[#111111]"
            />

            <FadeReveal delay={0.1}>
              <p className="text-[18px] md:text-[20px] text-[#6B6A65] leading-[1.55] max-w-[58ch]">
                {content.about.previewParagraph}
              </p>
            </FadeReveal>

            <FadeReveal delay={0.2}>
              <a
                href="/about"
                onClick={(e) => {
                  if (onReadMore) {
                    e.preventDefault()
                    onReadMore()
                  }
                }}
                className="group inline-flex items-center gap-2 text-[15px] font-medium text-[#111111] underline-offset-8 hover:underline cursor-pointer"
              >
                <span>{content.about.linkText}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </FadeReveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
