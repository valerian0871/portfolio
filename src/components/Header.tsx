import { useEffect, useRef, useState } from 'react'
import { Container } from './Container'
import { content } from '../data/content'

interface HeaderProps {
  currentRoute?: string
  onNavigate?: (route: string) => void
}

export function Header({ currentRoute = '/', onNavigate }: HeaderProps) {
  const [scrolledPast8px, setScrolledPast8px] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('#work')

  const lastScrollY = useRef(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Scroll detection for height, blur border, and hide-on-scroll-down
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolledPast8px(currentY > 8)

      if (currentY > 120) {
        if (currentY > lastScrollY.current + 5) {
          // Scrolling down
          setHidden(true)
        } else if (currentY < lastScrollY.current - 5) {
          // Scrolling up
          setHidden(false)
        }
      } else {
        setHidden(false)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for hash changes / active section tracking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash || '#work'
      setActiveHash(hash)
    }
    window.addEventListener('hashchange', handleHash)
    handleHash()
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const openMobile = () => {
    setMobileOpen(true)
  }

  const closeMobile = () => {
    setMobileOpen(false)
    // Restore focus to hamburger button
    setTimeout(() => {
      buttonRef.current?.focus()
    }, 50)
  }

  // Mobile menu scroll lock, Escape key, and resize listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        closeMobile()
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        closeMobile()
      }
    }

    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('resize', handleResize)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [mobileOpen])

  const handleLinkClick = (href: string) => {
    closeMobile()
    if (onNavigate) {
      if (href.startsWith('/#')) {
        onNavigate(href.replace('/#', '#'))
      } else {
        onNavigate(href)
      }
    }
  }

  return (
    <>
      <header
        role="banner"
        style={{
          transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1), background-color 250ms ease, border-color 250ms ease',
          transform: hidden && !mobileOpen ? 'translateY(-100%)' : 'translateY(0)',
        }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center h-[64px] md:h-[72px] ${
          scrolledPast8px
            ? 'bg-[#FAFAF8]/80 backdrop-blur-[12px] border-b border-[#E2E1DB]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Wordmark left */}
          <a
            href="/"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault()
                onNavigate('/')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="text-[13px] md:text-[14px] uppercase font-medium tracking-[0.08em] text-[#111111] hover:opacity-70 transition-opacity"
          >
            {content.profile.name}
          </a>

          {/* Desktop Navigation links centre / right */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-8 lg:gap-10">
            {content.navigation.links.map((link) => {
              const targetHash = link.href.replace('/', '')
              const isActive = (currentRoute === '/' && activeHash === targetHash) || currentRoute === link.href
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleLinkClick(link.href)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              )
            })}
          </nav>

          {/* Desktop Pill CTA far right */}
          <div className="hidden md:flex items-center">
            <a
              href={content.navigation.cta.href}
              onClick={() => handleLinkClick(content.navigation.cta.href)}
              className="btn-pill"
            >
              {content.navigation.cta.label}
            </a>
          </div>

          {/* Mobile Hamburger Button right (44x44px minimum touch target) */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => (mobileOpen ? closeMobile() : openMobile())}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden relative flex items-center justify-center w-[44px] h-[44px] -mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#111111]"
          >
            <div className="relative w-[22px] h-[10px] flex flex-col justify-between">
              <span
                style={{
                  transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                  transform: mobileOpen ? 'translateY(4px) rotate(45deg)' : 'none',
                }}
                className="block w-full h-[1.5px] bg-[#111111] origin-center"
              />
              <span
                style={{
                  transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                  transform: mobileOpen ? 'translateY(-4.5px) rotate(-45deg)' : 'none',
                }}
                className="block w-full h-[1.5px] bg-[#111111] origin-center"
              />
            </div>
          </button>
        </Container>
      </header>

      {/* Mobile Full-Screen Overlay */}
      <div
        id="mobile-navigation"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        style={{
          transition: mobileOpen
            ? 'clip-path 600ms cubic-bezier(0.76, 0, 0.24, 1)'
            : 'clip-path 400ms cubic-bezier(0.76, 0, 0.24, 1)',
          clipPath: mobileOpen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
        }}
        className={`fixed inset-0 z-40 bg-[#FAFAF8] flex flex-col justify-between pt-[88px] pb-10 px-6 sm:px-10 md:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Navigation links at h2 size, left-aligned, line mask with 60ms stagger */}
        <nav aria-label="Mobile Primary" className="flex flex-col gap-6 pt-4">
          {content.navigation.links.map((link, i) => (
            <div key={link.label} className="overflow-hidden">
              <a
                href={link.href}
                onClick={() => handleLinkClick(link.href)}
                style={{
                  transition: `transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${mobileOpen ? `${i * 60 + 120}ms` : '0ms'}`,
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(110%)',
                }}
                className="block text-[32px] sm:text-[36px] font-heading font-medium tracking-tight text-[#111111] hover:text-[#6B6A65]"
              >
                {link.label}
              </a>
            </div>
          ))}
        </nav>

        {/* Bottom CTA and Social links */}
        <div className="flex flex-col gap-6 pt-8 border-t border-[#E2E1DB]">
          <a
            href={content.navigation.cta.href}
            onClick={() => handleLinkClick(content.navigation.cta.href)}
            className="btn-pill w-full justify-center text-center"
          >
            {content.navigation.cta.label}
          </a>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65]">
              Connect
            </span>
            <div className="flex gap-4">
              {content.profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#111111] underline-offset-4 hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}