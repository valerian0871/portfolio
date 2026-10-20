import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { content } from '../../data/content'
import { useSite } from '../../lib/SiteContext'
import { springPress, springWave } from '../../lib/motion'

const NAME = content.profile.name

interface TopBarProps {
  visible: boolean
  wordmarkVisible: boolean
}

/** Wordmark (back to top) and local time. Lives in the fixed morph overlay. */
export function TopBar({ visible, wordmarkVisible }: TopBarProps) {
  const site = useSite()
  const reduceMotion = useReducedMotion()
  // Fixed text would collide with content scrolling under it, so the top bar
  // only shows near the top of each page
  const [scrolledAway, setScrolledAway] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolledAway(window.scrollY > window.innerHeight * 0.5)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const hidden = site.footerInView || scrolledAway

  return (
    <div
      className="absolute inset-x-0 top-0"
      style={{
        opacity: hidden ? 0 : 1,
        visibility: hidden ? 'hidden' : 'visible',
        transition: hidden ? 'opacity 200ms, visibility 0s 200ms' : 'opacity 200ms',
      }}
    >
      <motion.button
        type="button"
        data-wordmark
        aria-label={`${NAME}, back to top`}
        onClick={() => (site.route === '/' ? site.scrollToSection('top') : site.navigate('/'))}
        initial="rest"
        animate="rest"
        whileHover={reduceMotion ? undefined : 'hover'}
        whileTap={reduceMotion ? undefined : { scale: 0.98, transition: springPress }}
        className="topbar-wordmark pointer-events-auto absolute top-5 flex h-9 items-center whitespace-nowrap font-heading text-[17px] tracking-[-0.03em] text-text"
        style={{
          opacity: visible && wordmarkVisible ? 1 : 0,
          visibility: visible ? 'visible' : 'hidden',
        }}
      >
        {Array.from(NAME).map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            aria-hidden="true"
            className="inline-block whitespace-pre"
            variants={{ rest: { y: 0 }, hover: { y: -2, transition: { ...springWave, delay: 0.012 * i } } }}
          >
            {char}
          </motion.span>
        ))}
      </motion.button>
      {visible ? <Clock /> : null}
    </div>
  )
}

function formatLagos(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const time = formatLagos(now)
  return (
    <span
      className="topbar-clock pointer-events-none absolute top-5 hidden h-9 items-center font-mono text-[12px] tabular-nums text-muted md:flex"
    >
      <span aria-hidden="true">{time} WAT</span>
      <span className="sr-only">Local time in Nigeria: {time.slice(0, 5)}</span>
    </span>
  )
}
