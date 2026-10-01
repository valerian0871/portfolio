import { useEffect, useRef, useState, useCallback } from 'react'
import { Container } from './Container'
import { content } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'

interface HeaderProps {
  currentRoute?: string
  onNavigate?: (route: string) => void
}

// Section IDs in order, matching the homepage sections
const SECTION_IDS = ['work', 'services', 'about', 'contact']

export function Header({ currentRoute = '/', onNavigate }: HeaderProps) {
  const [scrolledPast8px, setScrolledPast8px] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Sliding underline indicator state
  const [indicator, setIndicator] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  })

  const lastScrollY = useRef(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  // Item 6: IntersectionObserver-based active section tracking
  const { activeSection, scrollToSection } = useActiveSection(SECTION_IDS, currentRoute)

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

  const openMobile = () => {
    setMobileOpen(true)
  }

  const closeMobile = () => {
    setMobileOpen(false)
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

    // External URLs open in new tab
    if (href.startsWith('https://') || href.startsWith('http://')) {
      window.open(href, '_blank', 'noopener,noreferrer')
      return
    }

    if (onNavigate) {
      if (href.startsWith('/#')) {
        const hash = href.replace('/', '')
        onNavigate(hash)
        const sectionId = hash.replace('#', '')
        if (SECTION_IDS.includes(sectionId)) {
          scrollToSection(sectionId)
        }
      } else {
        onNavigate(href)
      }
    }
  }

  // Derive isActive for a given nav link
  const getLinkIsActive = useCallback(
    (href: string): boolean => {
      if (currentRoute === '/') {
        const sectionId = href.replace('/#', '').replace('#', '')
        return activeSection === sectionId
      }
      return currentRoute === href
    },
    [activeSection, currentRoute]
  )

  // Recompute sliding underline position per Item 6, Req 6
  const updateIndicator = useCallback(() => {
    if (!navRef.current) return
    let activeEl: HTMLAnchorElement | null = null

    content.navigation.links.forEach((link) => {
      if (getLinkIsActive(link.href)) {
        activeEl = linkRefs.current.get(link.href) || null
      }
    })

    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect()
      const linkRect = (activeEl as HTMLAnchorElement).getBoundingClientRect()
      setIndicator({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        visible: true,
      })
    } else {
      setIndicator((prev) => ({ ...prev, visible: false }))
    }
  }, [getLinkIsActive])

  useEffect(() => {
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateIndicator)
    }
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

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
            ? 'bg-bg/80 backdrop-blur-[12px] border-b border-line'
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
            className="text-[13px] md:text-[14px] uppercase font-medium tracking-[0.08em] text-text hover:opacity-70 transition-opacity"
          >
            {content.profile.name}
          </a>

          {/* Desktop Navigation links centre / right with sliding 1px underline indicator */}
          <nav
            ref={navRef}
            aria-label="Primary"
            className="relative hidden md:flex items-center gap-8 lg:gap-10 py-1"
          >
            {content.navigation.links.map((link) => {
              const isActive = getLinkIsActive(link.href)
              return (
                <a
                  key={link.label}
                  ref={(el) => {
                    if (el) linkRefs.current.set(link.href, el)
                    else linkRefs.current.delete(link.href)
                  }}
                  href={link.href}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              )
            })}

            {/* Sliding 1px underline indicator: transform translate + scaleX, 350ms, cubic-bezier(0.23, 1, 0.32, 1) */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                bottom: '2px',
                left: 0,
                width: '1px',
                height: '1px',
                backgroundColor: 'var(--color-text)',
                transform: `translateX(${indicator.left}px) scaleX(${indicator.width})`,
                transformOrigin: 'left center',
                opacity: indicator.visible ? 1 : 0,
                transition: 'transform 350ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms ease',
                pointerEvents: 'none',
              }}
            />
          </nav>

          {/* Desktop Pill CTA far right — WhatsApp external link */}
          <div className="hidden md:flex items-center">
            <a
              href={content.navigation.cta.href}
              target="_blank"
              rel="noopener noreferrer"
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
            className="md:hidden relative flex items-center justify-center w-[44px] h-[44px] -mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-text"
          >
            <div className="relative w-[22px] h-[10px] flex flex-col justify-between">
              <span
                style={{
                  transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                  transform: mobileOpen ? 'translateY(4px) rotate(45deg)' : 'none',
                }}
                className="block w-full h-[1.5px] bg-text origin-center"
              />
              <span
                style={{
                  transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                  transform: mobileOpen ? 'translateY(-4.5px) rotate(-45deg)' : 'none',
                }}
                className="block w-full h-[1.5px] bg-text origin-center"
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
        className={`fixed inset-0 z-40 bg-bg flex flex-col justify-between pt-[88px] pb-10 px-6 sm:px-10 md:hidden ${
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Navigation links at h2 size, left-aligned, line mask with 60ms stagger */}
        <nav aria-label="Mobile Primary" className="flex flex-col gap-6 pt-4">
          {content.navigation.links.map((link, i) => {
            const isActive = getLinkIsActive(link.href)
            return (
              <div key={link.label} className="mask-line">
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  aria-current={isActive ? 'location' : undefined}
                  style={{
                    transition: `transform 500ms cubic-bezier(0.16, 1, 0.3, 1) ${mobileOpen ? `${i * 60 + 120}ms` : '0ms'}`,
                    transform: mobileOpen ? 'translateY(0)' : 'translateY(120%)',
                  }}
                  className={`block text-[32px] sm:text-[36px] font-heading font-medium tracking-tight leading-[1.15] ${
                    isActive ? 'text-text' : 'text-muted hover:text-text'
                  } transition-colors`}
                >
                  {link.label}
                </a>
              </div>
            )
          })}
        </nav>

        {/* Bottom CTA and Social links */}
        <div className="flex flex-col gap-6 pt-8 border-t border-line">
          <a
            href={content.navigation.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill w-full justify-center text-center"
          >
            {content.navigation.cta.label}
          </a>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted">
              Connect
            </span>
            <div className="flex gap-4">
              {content.profile.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-text underline-offset-4 hover:underline"
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