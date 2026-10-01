import { Container } from './Container'
import { content } from '../data/content'

interface FooterProps {
  onNavigate?: (href: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="py-12 md:py-16 bg-[#FAFAF8] text-[#111111]">
      <Container className="flex flex-col gap-12">
        {/* Top row: Wordmark, navigation, socials, back to top */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Wordmark */}
          <div className="md:col-span-3">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#111111] block mb-2">
              {content.profile.name}
            </span>
            <p className="text-[13px] text-[#6B6A65] max-w-[28ch]">
              {content.profile.role}
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-4 flex flex-col gap-2.5">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] mb-1">
              Navigation
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {content.navigation.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault()
                      onNavigate(link.href)
                    }
                  }}
                  className="text-[14px] text-[#111111] underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="md:col-span-3 flex flex-col gap-2.5">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] mb-1">
              Social
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {content.profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-[#111111] underline-offset-4 hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Back to top */}
          <div className="md:col-span-2 md:text-right">
            <button
              type="button"
              onClick={scrollToTop}
              className="btn-press text-[13px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] hover:text-[#111111] cursor-pointer"
            >
              Back to top ↑
            </button>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="h-[1px] w-full bg-[#E2E1DB]" />

        {/* Bottom row: Small legal line */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 text-[13px] text-[#6B6A65]">
          <span>{content.footer.legal}</span>
          <span className="text-[12px] uppercase font-medium tracking-[0.08em]">
            Nigeria · UTC+1
          </span>
        </div>
      </Container>
    </footer>
  )
}