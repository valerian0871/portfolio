import type { ReactNode } from 'react'
import { Container } from './Container'
import { profile } from '../data/profile'

interface ContactItem {
  href: string
  label: string
  isExternal: boolean
  icon: ReactNode
}

export function Contact() {
  const rawContacts: (ContactItem | null)[] = [
    profile.email
      ? {
          href: `mailto:${profile.email}`,
          label: 'Send email',
          isExternal: false,
          icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          ),
        }
      : null,
    profile.linkedin
      ? {
          href: profile.linkedin,
          label: 'LinkedIn profile',
          isExternal: true,
          icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          ),
        }
      : null,
    profile.github
      ? {
          href: profile.github,
          label: 'GitHub profile',
          isExternal: true,
          icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          ),
        }
      : null,
    {
      href: 'https://wa.me/2347011757204',
      label: 'WhatsApp message',
      isExternal: true,
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.18-.47-.3z" />
        </svg>
      ),
    },
  ]

  const contacts = rawContacts.filter((item): item is ContactItem => item !== null)

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-24 border-t border-rule py-24">
      <Container>
        <h2 className="scroll-reveal mb-12 text-[2rem] leading-[1.18] font-semibold tracking-[-0.03em]" id="contact-title">
          Contact
        </h2>

        <p className="scroll-reveal max-w-[54ch] font-read text-xl leading-[1.68] text-ink-2">
          Available for frontend builds, brand and social design, document production,
          and automation work. Tell me what the problem is and I will tell you honestly
          whether I am the right person for it.
        </p>

        {contacts.length > 0 ? (
          <div className="mt-8 flex items-center gap-4">
            {contacts.map((item) => (
              <a
                key={item.href}
                href={item.href}
                {...(item.isExternal ? { target: '_blank', rel: 'me noopener noreferrer' } : {})}
                aria-label={item.label}
                title={item.label}
                className="inline-flex size-11 items-center justify-center rounded-sm border border-rule-firm text-ink transition-transform duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent hover:text-accent focus-visible:outline-accent"
              >
                {item.icon}
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-[0.9375rem] text-ink-3">
            Contact channels are not published on this version of the page.
          </p>
        )}
      </Container>
    </section>
  )
}