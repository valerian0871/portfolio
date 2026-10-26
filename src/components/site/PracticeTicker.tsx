import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react'
import { practiceTabs } from '../../lib/site'

const BASE_SPEED = 2.2 // percent of one copy per second

// The four practices on a running line. Scrolling pushes it faster and
// reversing the scroll reverses the line, so it reads as a gauge of the page.
export function PracticeTicker() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduceMotion = useReducedMotion()
  const offset = useMotionValue(0)
  const direction = useRef(1)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-2000, 0, 2000], [-5, 0, 5], { clamp: false })
  const x = useTransform(offset, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (!inView || reduceMotion) return
    const b = boost.get()
    if (b < -0.05) direction.current = -1
    else if (b > 0.05) direction.current = 1
    const step = direction.current * BASE_SPEED * (delta / 1000) * (1 + Math.abs(b))
    offset.set(offset.get() - step)
  })

  const run = practiceTabs.map((tab) => tab.name)

  return (
    <div ref={ref} className="ticker overflow-hidden border-y border-line py-5 md:py-7">
      <p className="sr-only">{run.join(', ')}</p>
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }} aria-hidden="true">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {[...run, ...run].map((name, i) => (
              <span key={i} className="ticker-text flex items-center font-heading text-text">
                <span>{name}</span>
                <Fleuron />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function Fleuron() {
  return (
    <svg viewBox="0 0 24 24" className="ticker-mark mx-[0.5em] h-[0.34em] w-[0.34em] shrink-0 text-muted">
      <path d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z" fill="currentColor" />
    </svg>
  )
}
