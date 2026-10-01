import { useState } from 'react'
import { Container } from '../components/Container'
import { HeadingReveal, FadeReveal } from '../components/TextReveal'
import { content } from '../data/content'

interface ContactPageProps {
  onBack?: () => void
}

export function ContactPage({ onBack }: ContactPageProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content.contact.email)
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
            className="inline-flex items-center gap-2 text-[14px] text-[#6B6A65] hover:text-[#111111] transition-colors"
          >
            <span>←</span>
            <span>Back to overview</span>
          </a>
        </div>

        {/* Heading */}
        <div className="mb-12 md:mb-16">
          <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] block mb-3">
            Get In Touch
          </span>
          <HeadingReveal
            text="Let us discuss your next project."
            as="h1"
            className="text-[clamp(36px,5vw,72px)] font-heading font-medium tracking-[-0.035em] leading-[1.05] text-[#111111]"
          />
        </div>

        <div className="h-[1px] w-full bg-[#E2E1DB] mb-12 md:mb-16" />

        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct channels */}
          <div className="col-span-12 md:col-span-7 flex flex-col gap-8">
            <FadeReveal>
              <h2 className="text-[20px] font-heading font-medium text-[#111111] mb-2">
                Direct Communication
              </h2>
              <p className="text-[16px] text-[#6B6A65] leading-[1.6] max-w-[50ch] mb-6">
                I am currently open to freelance design engineering contracts, frontend development engagements, and full-time technical roles.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${content.contact.email}`}
                  className="btn-pill"
                >
                  Open in email client
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-pill-secondary btn-press rounded-full px-6 py-3 text-[14px] font-medium text-[#111111] cursor-pointer"
                >
                  <span>{content.contact.email}</span>
                  {copied && (
                    <span className="ml-2 font-mono text-[12px] text-[#111111] font-semibold">
                      ✓ Copied
                    </span>
                  )}
                </button>
              </div>
            </FadeReveal>

            <FadeReveal delay={0.2} className="pt-6 border-t border-[#E2E1DB]">
              <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] block mb-2">
                Availability
              </span>
              <p className="text-[15px] text-[#111111]">
                {content.profile.availability}
              </p>
            </FadeReveal>
          </div>

          {/* Right Column: Social Profiles */}
          <div className="col-span-12 md:col-span-5 flex flex-col gap-6">
            <h2 className="text-[20px] font-heading font-medium text-[#111111]">
              Connected Networks
            </h2>
            <div className="flex flex-col divide-y divide-[#E2E1DB] border-y border-[#E2E1DB]">
              {content.profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 flex items-center justify-between text-[15px] text-[#111111] hover:text-[#6B6A65] transition-colors"
                >
                  <span>{social.label}</span>
                  <span>↗</span>
                </a>
              ))}
              <div className="py-4 flex items-center justify-between text-[15px] text-[#6B6A65]">
                <span>Location</span>
                <span className="text-[#111111]">Nigeria (UTC+1)</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}
