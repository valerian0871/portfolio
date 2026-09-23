import { Container } from './Container'
import { profile } from '../data/profile'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

const buttonBase =
  'inline-flex min-h-11 items-center gap-2 rounded-sm border px-6 py-2 text-[0.9375rem] font-medium transition-transform duration-200 ease-brand'

function CopyEmailButton({ email }: { email: string }) {
  const { status, copy } = useCopyToClipboard()

  const labels: Record<typeof status, string> = {
    idle: 'Copy email address',
    copying: 'Copying',
    copied: 'Copied to clipboard',
    error: `Copy failed. Email is ${email}`,
  }

  return (
    <button
      type="button"
      onClick={() => void copy(email)}
      disabled={status === 'copying'}
      aria-live="polite"
      className={`${buttonBase} border-accent bg-accent text-accent-ink hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-75`}
    >
      <span>{labels[status]}</span>
      {status === 'copying' && <span className="spinner" aria-hidden="true" />}
    </button>
  )
}

export function Contact() {
  const externals = [
    profile.linkedin ? { href: profile.linkedin, label: 'LinkedIn' } : null,
    profile.github ? { href: profile.github, label: 'GitHub' } : null,
    { href: 'https://wa.me/2347011757204', label: 'WhatsApp' },
  ].filter((item): item is { href: string; label: string } => item !== null)

  const hasAnything = Boolean(profile.email) || externals.length > 0

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

        <div className="mt-8 flex flex-wrap gap-4">
          {profile.email && (
            <>
              <CopyEmailButton email={profile.email} />
              <a
                href={`mailto:${profile.email}`}
                className={`${buttonBase} border-rule-firm text-ink hover:-translate-y-0.5 hover:border-accent`}
              >
                Send an email
              </a>
            </>
          )}

          {externals.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="me noopener"
              className={`${buttonBase} border-rule-firm text-ink hover:-translate-y-0.5 hover:border-accent`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {!hasAnything && (
          <p className="mt-6 text-[0.9375rem] text-ink-3">
            Contact channels are not published on this version of the page.
          </p>
        )}
      </Container>
    </section>
  )
}