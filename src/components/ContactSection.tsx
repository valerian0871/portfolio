import { useState } from 'react'
import { Container } from './Container'
import { HeadingReveal } from './TextReveal'
import { content } from '../data/content'

export function ContactSection() {
  const [emailCopied, setEmailCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(content.contact.email)
    setEmailCopied(true)
    setTimeout(() => {
      setEmailCopied(false)
    }, 1500)
  }

  return (
    <section
      id="contact"
      className="py-[64px] md:py-[96px] lg:py-[128px] border-b border-line"
    >
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted block mb-4">
              Contact
            </span>
          </div>

          {/* Closing statement at display size */}
          <div className="col-span-12 lg:col-span-11">
            <HeadingReveal
              text={content.contact.displayStatement}
              as="h2"
              className="text-[clamp(36px,5.8vw,88px)] font-heading font-medium tracking-[-0.035em] leading-[1.1] text-text"
            />
          </div>

          {/* WhatsApp CTA (primary) + copy email (secondary) */}
          <div className="col-span-12 mt-8 md:mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Primary: WhatsApp pill — opens in new tab */}
            <a
              href={content.contact.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill"
              aria-label="Open WhatsApp chat with Prosper"
            >
              {content.contact.whatsapp.label}
            </a>

            {/* Secondary: copy email address with Copied confirmation */}
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn-pill-secondary btn-press rounded-full px-6 py-3 text-[14px] font-medium text-text cursor-pointer inline-flex items-center gap-2"
                aria-label={`Copy email address ${content.contact.email} to clipboard`}
              >
                <span>{content.contact.email}</span>
                <span
                  style={{
                    transition: 'opacity 200ms ease, transform 200ms ease',
                    opacity: emailCopied ? 1 : 0,
                    transform: emailCopied ? 'translateY(0)' : 'translateY(4px)',
                    display: emailCopied ? 'inline' : 'none',
                  }}
                  className="text-[12px] font-mono uppercase tracking-[0.08em] font-semibold text-text"
                >
                  ✓ Copied
                </span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
