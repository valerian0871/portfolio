import type { ReactNode, Ref } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSplitLines } from '../hooks/useSplitLines'

interface HeadingRevealProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'
  className?: string
  trigger?: 'mount' | 'inView'
  delay?: number
}

// Easing: cubic-bezier(0.16, 1, 0.3, 1), duration 900ms, stagger 80ms
const EASE_REVEAL = [0.16, 1, 0.3, 1] as const

export const TextReveal = HeadingReveal

export interface LineMaskProps {
  children: ReactNode
  className?: string
}

export function LineMask({ children, className = '' }: LineMaskProps) {
  return (
    <span className={`mask-line ${className}`}>
      {children}
    </span>
  )
}

export function HeadingReveal({
  text,
  as = 'h2',
  className = '',
  trigger = 'inView',
  delay = 0,
}: HeadingRevealProps) {
  const { containerRef, lines } = useSplitLines(text)
  const reducedMotion = useReducedMotion()
  const Tag = as

  const words = text.split(' ')
  const ref = containerRef as Ref<HTMLHeadingElement | HTMLParagraphElement | HTMLDivElement>

  // Line animation variant: 120% ensure full descent clearance (Item 7)
  const lineVariants = {
    hidden: { y: '120%' },
    visible: (i: number) => ({
      y: '0%',
      transition: {
        duration: 0.9,
        delay: delay + i * 0.08,
        ease: EASE_REVEAL,
      },
    }),
  }

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={`relative ${className}`}
    >
      {/* Hidden measurer to calculate lines accurately without layout shifts */}
      <span aria-hidden="true" className="invisible absolute inset-0 pointer-events-none select-none">
        {words.map((word, i) => (
          <span key={i}>
            <span data-word className="inline-block">
              {word}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>

      {/* Fallback / Initial SSR state before measurement */}
      {lines === null && (
        <span className="block">{text}</span>
      )}

      {/* Reduced motion: simple opacity fade */}
      {lines !== null && reducedMotion && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="block"
        >
          {text}
        </motion.span>
      )}

      {/* Standard line mask reveal */}
      {lines !== null && !reducedMotion && (
        <motion.span
          aria-hidden="true"
          initial="hidden"
          {...(trigger === 'mount'
            ? { animate: 'visible' }
            : { whileInView: 'visible', viewport: { once: true, amount: 0.2 } })}
          className="block"
        >
          {lines.map((line, i) => (
            <span key={i} className="mask-line">
              <motion.span
                custom={i}
                variants={lineVariants}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.span>
      )}
    </Tag>
  )
}

// Body paragraphs and meta text: fade plus 8px upward translate, 600ms, stagger 40ms
interface FadeRevealProps {
  children: ReactNode
  as?: 'p' | 'div' | 'span'
  className?: string
  delay?: number
}

export function FadeReveal({
  children,
  as = 'div',
  className = '',
  delay = 0,
}: FadeRevealProps) {
  const reducedMotion = useReducedMotion()
  const Tag = as

  if (reducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}