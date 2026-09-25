import { Icon } from '@iconify/react'
import { Container } from './Container'
import { profile } from '../data/profile'

const contacts = [
  profile.email
    ? { href: `mailto:${profile.email}`, label: 'Email', icon: 'mdi:email-outline' }
    : null,
  profile.linkedin
    ? { href: profile.linkedin, label: 'LinkedIn', icon: 'mdi:linkedin' }
    : null,
  profile.github
    ? { href: profile.github, label: 'GitHub', icon: 'mdi:github' }
    : null,
  { href: 'https://wa.me/2347011757204', label: 'WhatsApp', icon: 'mdi:whatsapp' },
].filter(
  (item): item is { href: string; label: string; icon: string } => item !== null,
)

export function Contact() {
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
          <div className="mt-8 flex items-center gap-5">
            {contacts.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="me noopener"
                aria-label={item.label}
                className="inline-flex size-11 items-center justify-center rounded-full border border-rule-firm text-ink transition-all duration-200 ease-brand hover:-translate-y-0.5 hover:border-accent hover:text-accent"
              >
                <Icon icon={item.icon} width={22} height={22} />
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