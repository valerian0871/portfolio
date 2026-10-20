import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { springCursor, springUI } from '../../lib/motion'
import { useFinePointer } from '../../hooks/useMediaQuery'

const INTERACTIVE = 'a, button, input, [role="button"], [role="tab"], [role="option"], [data-cursor]'

/** 10px blend-mode dot that grows over interactive targets (spec #24). Fine pointers only. */
export function Cursor() {
  const finePointer = useFinePointer()
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, springCursor)
  const springY = useSpring(y, springCursor)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!finePointer) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
      setActive(Boolean((event.target as Element | null)?.closest?.(INTERACTIVE)))
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [finePointer, x, y])

  if (!finePointer) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] -ml-[5px] -mt-[5px] h-[10px] w-[10px] mix-blend-difference"
      style={{ x: reduceMotion ? x : springX, y: reduceMotion ? y : springY, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="h-full w-full rounded-full bg-white"
        animate={{ scale: active && !reduceMotion ? 3.4 : 1 }}
        transition={springUI}
      />
    </motion.div>
  )
}
