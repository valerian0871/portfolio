import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t border-rule pt-12 pb-16 text-[0.9375rem] text-ink-3">
      <Container className="flex flex-wrap justify-between gap-4">
        <p>Prosper. Frontend development, design, writing and automation.</p>
        <p>Set in Archivo and Newsreader.</p>
      </Container>
    </footer>
  )
}