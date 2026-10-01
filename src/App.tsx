import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { WorkSection } from './components/WorkSection'
import { ServicesSection } from './components/ServicesSection'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { Footer } from './components/Footer'
import { LoadingScreen } from './components/LoadingScreen'
import { WorkPage } from './pages/WorkPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { useLenis } from './hooks/useLenis'

export default function App() {
  const [route, setRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/\/$/, '') || '/'
      return path
    }
    return '/'
  })

  // Synchronize Hero headline reveal with LoadingScreen exit
  const [heroReady, setHeroReady] = useState(() => {
    if (typeof window === 'undefined') return true
    const forceLoader = window.location.search.includes('loader')
    const hasSeenLoader = !forceLoader && sessionStorage.getItem('portfolio_loader_seen') === 'true'
    return hasSeenLoader
  })

  // Initialize Lenis smooth scroll for desktop pointer devices
  useLenis()

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/'
      setRoute(path)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateTo = (pathOrHash: string) => {
    // External URLs: open in a new tab
    if (pathOrHash.startsWith('https://') || pathOrHash.startsWith('http://')) {
      window.open(pathOrHash, '_blank', 'noopener,noreferrer')
      return
    }

    if (pathOrHash.startsWith('#')) {
      // Internal section anchor
      if (route !== '/') {
        window.history.pushState({}, '', `/${pathOrHash}`)
        setRoute('/')
        setTimeout(() => {
          const el = document.querySelector(pathOrHash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        window.location.hash = pathOrHash
        const el = document.querySelector(pathOrHash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }

    const cleanPath = pathOrHash.replace(/\/$/, '') || '/'
    if (cleanPath === route) return

    window.history.pushState({}, '', cleanPath)
    setRoute(cleanPath)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <>
      {/* Accessible skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:rounded-full focus:bg-text focus:px-6 focus:py-3 focus:text-bg focus:text-[14px] focus:font-medium focus:outline-2 focus:outline-offset-2 focus:outline-text"
      >
        Skip to main content
      </a>

      {/* Screen Loader (runs once per session, skipped on reduced motion) */}
      <LoadingScreen onHeroReady={() => setHeroReady(true)} />

      {/* Fixed Header */}
      <Header currentRoute={route} onNavigate={navigateTo} />

      {/* Main Content Area */}
      <main id="main">
        {route === '/work' && (
          <WorkPage onBack={() => navigateTo('/')} />
        )}

        {route === '/about' && (
          <AboutPage onBack={() => navigateTo('/')} />
        )}

        {route === '/contact' && (
          <ContactPage onBack={() => navigateTo('/')} />
        )}

        {route === '/' && (
          <div
            style={{
              transition: 'transform 900ms cubic-bezier(0.76, 0, 0.24, 1)',
              transform: heroReady ? 'translateY(0) scale(1)' : 'translateY(48px) scale(1.02)',
            }}
            className="page-enter"
          >
            <Hero onCtaClick={() => navigateTo('#work')} ready={heroReady} />
            <WorkSection />
            <ServicesSection />
            <AboutSection onReadMore={() => navigateTo('/about')} />
            <ContactSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </>
  )
}