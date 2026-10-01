import { useState } from 'react'
import { Container } from '../components/Container'
import { HeadingReveal, FadeReveal } from '../components/TextReveal'
import { content } from '../data/content'

interface ContactPageProps {
  onBack?: () => void
}

export function ContactPage({ onBack }: ContactPageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(content.contact.whatsapp.formatted)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <article className="page-enter pt-[100px] md:pt-[128px] pb-24 md:pb-32">
      <Container>
        {/* Back Link */}
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
            Get In Touch
          </span>
          <HeadingReveal
            text="Let us discuss your next project."
            as="h1"
            className="text-[clamp(36px,5vw,72px)] font-heading font-medium tracking-[-0.035em] leading-[1.1] text-text"
          />
        </div>

        <div className="h-[1px] w-full bg-line mb-12 md:mb-16" />

        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct channels */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-8">
            <FadeReveal>
              <h2 className="text-[20px] font-heading font-medium text-text mb-2">
                Direct Communication
              </h2>
              <p className="text-[16px] text-muted leading-[1.6] max-w-[50ch] mb-6">
                I am currently open to freelance design engineering contracts, frontend development engagements, and full-time technical roles.
              </p>

              {/* Primary: WhatsApp CTA + secondary copy phone */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={content.contact.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pill"
                  aria-label={`Open WhatsApp chat with Prosper (${content.contact.whatsapp.formatted})`}
                >
                  {content.contact.whatsapp.label}
                </a>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="btn-pill-secondary btn-press rounded-full px-6 py-3 text-[14px] font-medium text-text cursor-pointer inline-flex items-center gap-2"
                  aria-label={`Copy phone number ${content.contact.whatsapp.formatted} to clipboard`}
                >
                  <span>{content.contact.whatsapp.formatted}</span>
                  {copied && (
                    <span className="font-mono text-[12px] text-text font-semibold">
                      ✓ Copied
                    </span>
                  )}
                </button>
              </div>
            </FadeReveal>

            <FadeReveal delay={0.2} className="pt-6 border-t border-line">
              <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted block mb-2">
                Availability
              </span>
              <p className="text-[15px] text-text">
                {content.profile.availability}
              </p>
            </FadeReveal>
          </div>

          {/* Right Column: Social Profiles */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
            <h2 className="text-[20px] font-heading font-medium text-text">
              Connected Networks
            </h2>
            <div className="flex flex-col divide-y divide-line border-y border-line">
              {content.profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 flex items-center justify-between text-[15px] text-text hover:text-muted transition-colors"
                >
                  <span>{social.label}</span>
                  <span>↗</span>
                </a>
              ))}
              <div className="py-4 flex items-center justify-between text-[15px] text-muted">
                <span>Location</span>
                <span className="text-text">Nigeria (UTC+1)</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}
