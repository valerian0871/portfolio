import { useCallback, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { Hero } from './components/Hero'
import { WorkSection } from './components/WorkSection'
import { ServicesSection } from './components/ServicesSection'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { CaseStudy } from './components/CaseStudy'
import { Footer } from './components/Footer'
import { LoadingScreen } from './components/LoadingScreen'
import { Island } from './components/site/Island'
import { Cursor } from './components/site/Cursor'
import { WorkPage } from './pages/WorkPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { useLenis } from './hooks/useLenis'
import { SiteProvider, useSite } from './lib/SiteContext'
import { MusicProvider } from './lib/MusicContext'
import { MusicControl } from './components/site/MusicControl'

function currentPath() {
  return window.location.pathname.replace(/\/$/, '') || '/'
}

export default function App() {
  const [route, setRoute] = useState<string>(() => (typeof window === 'undefined' ? '/' : currentPath()))
  const [heroReady, setHeroReady] = useState(false)
  const [wordmarkVisible, setWordmarkVisible] = useState(false)

  // Lenis smooth scroll on fine pointers (off under reduced motion)
  useLenis()

  useEffect(() => {
    const onPopState = () => setRoute(currentPath())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigateTo = useCallback(
    (pathOrHash: string) => {
      if (pathOrHash.startsWith('https://') || pathOrHash.startsWith('http://')) {
        window.open(pathOrHash, '_blank', 'noopener,noreferrer')
        return
      }

      if (pathOrHash.startsWith('#')) {
        const scroll = () => document.querySelector(pathOrHash)?.scrollIntoView({ behavior: 'smooth' })
        if (route !== '/') {
          window.history.pushState({}, '', `/${pathOrHash}`)
          setRoute('/')
          window.setTimeout(scroll, 100)
        } else {
          window.history.replaceState(null, '', pathOrHash)
          scroll()
        }
        return
      }

      const cleanPath = pathOrHash.replace(/\/$/, '') || '/'
      if (cleanPath === route) return
      window.history.pushState({}, '', cleanPath)
      setRoute(cleanPath)
      window.scrollTo({ top: 0, behavior: 'instant' })
    },
    [route],
  )

  return (
    <MotionConfig reducedMotion="user">
      <SiteProvider route={route} navigate={navigateTo}>
        <MusicProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10000] focus:rounded-full focus:bg-text focus:px-6 focus:py-3 focus:text-[14px] focus:font-medium focus:text-bg"
        >
          Skip to main content
        </a>

        <LoadingScreen onHeroReady={() => setHeroReady(true)} onDone={() => setWordmarkVisible(true)} />
        <Island wordmarkVisible={wordmarkVisible} />
        <Cursor />

        <div className="site-card relative z-10 bg-bg">
          <main id="main">
            <Routes route={route} heroReady={heroReady} />
          </main>
        </div>
        <Footer />
        <MusicControl />
        </MusicProvider>
      </SiteProvider>
    </MotionConfig>
  )
}

function Routes({ route, heroReady }: { route: string; heroReady: boolean }) {
  const site = useSite()

  if (site.caseSlug && (route === '/' || route === '/work')) {
    return <CaseStudy key={site.caseSlug} slug={site.caseSlug} />
  }
  if (route === '/work') return <WorkPage />
  if (route === '/about') return <AboutPage />
  if (route === '/contact') return <ContactPage />

  return (
    <>
      <Hero ready={heroReady} />
      <WorkSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}
