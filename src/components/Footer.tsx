import { Container } from './Container'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-rule py-12 text-[0.9375rem] text-ink-3">
      <Container className="flex flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Prosper Kayode. Frontend development, visual design, content, and AI automation.</p>
        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 font-medium text-ink-2 hover:text-accent transition-colors cursor-pointer"
        >
          <span>Back to top</span>
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 13V3M4 7l4-4 4 4" />
          </svg>
        </button>
      </Container>
    </footer>
  )
}