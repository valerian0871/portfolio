import { Container } from './Container'
import { useScrolled } from '../hooks/useScrolled'
import { profile } from '../data/profile'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const scrolled = useScrolled()

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/90 backdrop-blur-md transition-colors duration-200 ease-brand ${
        scrolled ? 'border-rule' : 'border-transparent'
      }`}
    >
      <Container className="flex min-h-14 sm:min-h-16 items-center justify-between gap-2 sm:gap-6">
        <a href="#top" className="group inline-flex items-center gap-2 sm:gap-2.5 font-semibold tracking-tight text-sm sm:text-base text-ink transition-colors hover:text-accent shrink-0">
        <a href="#top" className="btn-press group inline-flex items-center gap-2 sm:gap-2.5 font-semibold tracking-tight text-sm sm:text-base text-ink hover:text-accent shrink-0">
          <span className="size-2 rounded-full bg-emerald-500 shadow-xs group-hover:scale-110 transition-transform" />
          <span>{profile.name}</span>
        </a>
        <nav aria-label="Sections" className="flex gap-0.5 sm:gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm px-2.5 sm:px-4 py-1.5 sm:py-2 text-[0.8125rem] sm:text-[0.9375rem] font-medium text-ink-2 transition-colors duration-150 ease-brand hover:bg-accent-soft hover:text-ink"
              className="btn-press rounded-sm px-2.5 sm:px-4 py-1.5 sm:py-2 text-[0.8125rem] sm:text-[0.9375rem] font-medium text-ink-2 hover:bg-accent-soft hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  )
}