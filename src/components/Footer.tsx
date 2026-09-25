import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t border-rule py-12 text-[0.9375rem] text-ink-3">
      <Container className="flex flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Prosper Kayode. Frontend development, visual design, content, and AI automation.</p>
        <p className="text-xs text-ink-3">Engineered for clarity and performance.</p>
      </Container>
    </footer>
  )
}