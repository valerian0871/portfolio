import { useState } from 'react'
import { Container } from './Container'
import { HeadingReveal } from './TextReveal'
import { content } from '../data/content'

export function ContactSection() {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(content.contact.email)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <section
      id="contact"
      className="py-[64px] md:py-[96px] lg:py-[128px] border-b border-[#E2E1DB]"
    >
      <Container>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] block mb-4">
              Contact
            </span>
          </div>

          {/* Closing statement at display size */}
          <div className="col-span-12 lg:col-span-11">
            <HeadingReveal
              text={content.contact.displayStatement}
              as="h2"
              className="text-[clamp(36px,5.8vw,88px)] font-heading font-medium tracking-[-0.035em] leading-[1.04] text-[#111111]"
            />
          </div>

          {/* CTA & Email Copy with inline confirmation */}
          <div className="col-span-12 mt-8 md:mt-12 flex flex-wrap items-center gap-6">
            <a
              href={content.contact.cta.href}
              className="btn-pill"
            >
              {content.contact.cta.label}
            </a>

            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn-pill-secondary btn-press rounded-full px-6 py-3 text-[14px] font-medium text-[#111111] cursor-pointer"
                aria-label="Copy email address to clipboard"
              >
                <span>{content.contact.email}</span>
                <span
                  style={{
                    transition: 'opacity 200ms ease, transform 200ms ease',
                    opacity: copied ? 1 : 0,
                    transform: copied ? 'translateY(0)' : 'translateY(4px)',
                  }}
                  className={`ml-2 text-[12px] font-mono uppercase tracking-[0.08em] text-[#111111] font-semibold ${
                    copied ? 'inline-block' : 'hidden'
                  }`}
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
