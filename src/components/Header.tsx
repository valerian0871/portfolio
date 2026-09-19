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
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <a href="#top" className="font-semibold tracking-tight hover:text-accent">
          {profile.name}
        </a>
        <nav aria-label="Sections" className="flex gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-sm px-4 py-2 text-[0.9375rem] font-medium text-ink-2 transition-colors duration-150 ease-brand hover:bg-accent-soft hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  )
}