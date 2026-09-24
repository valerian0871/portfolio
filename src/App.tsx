import { useRef, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WorkSection } from './components/WorkSection'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { LoadingScreen } from './components/LoadingScreen'  // ← new
import { useContentReady } from './hooks/useContentReady'
import { useReducedMotion } from './hooks/useReducedMotion'
import type { FilterId, PracticeId } from './types'

export default function App() {
  const [filter, setFilter] = useState<FilterId>('all')
  const workRef = useRef<HTMLElement>(null)
  const ready = useContentReady()
  const reduced = useReducedMotion()

  const selectPractice = (id: PracticeId) => {
    setFilter(id)
    const node = workRef.current
    if (!node) return
    node.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    node.focus({ preventScroll: true })
  }

  return (
    <>
      <LoadingScreen ready={ready} />  {/* ← new */}

      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">
        Skip to content
      </a>

      <Header />
      <main id="main">
        <div id="top" />
        <Hero onSelectPractice={selectPractice} />
        <WorkSection ref={workRef} filter={filter} onFilterChange={setFilter} ready={ready} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}