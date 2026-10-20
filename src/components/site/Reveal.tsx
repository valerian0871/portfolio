import type { ElementType, ReactNode } from 'react'
import { motion } from 'motion/react'
import { springUI } from '../../lib/motion'

interface MaskLinesProps {
  lines: string[]
  as?: ElementType
  className?: string
  /** Animate when scrolled into view (sections) or when `play` turns true (hero) */
  trigger?: 'inView' | 'play'
  play?: boolean
  stagger?: number
  delay?: number
}

/**
 * Each line rises out of an overflow mask (spec #2, #5).
 * Transform only, inside a reserved line box, so nothing shifts.
 * Reduced motion: MotionConfig drops the transform and the text sits at rest.
 */
export function MaskLines({
  lines,
  as: Tag = 'h2',
  className = '',
  trigger = 'inView',
  play = true,
  stagger = 0.08,
  delay = 0,
}: MaskLinesProps) {
  return (
    <Tag className={className} aria-label={lines.join(' ')}>
      {lines.map((line, i) => {
        const transition = { ...springUI, delay: delay + i * stagger }
        const motionProps =
          trigger === 'inView'
            ? {
                initial: { y: '108%' },
                whileInView: { y: '0%' },
                viewport: { once: true, margin: '-12% 0px' },
                transition,
              }
            : { initial: { y: '108%' }, animate: { y: play ? '0%' : '108%' }, transition }
        return (
          <span key={i} aria-hidden="true" className="mask-line-box">
            <motion.span className="block" {...motionProps}>
              {line}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  play?: boolean
}

/** Opacity-only follow-up for supporting copy (spec #3) */
export function FadeIn({ children, className = '', delay = 0, play = true }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: play ? 1 : 0 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
