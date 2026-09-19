import type { Ref } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSplitLines } from '../hooks/useSplitLines'

interface TextRevealProps {
  text: string
  as?: 'p' | 'div'
  className?: string
  /** 'mount' plays as soon as lines are measured (for above-the-fold text,
   *  e.g. the hero). 'inView' waits until the block scrolls into view
   *  (for anything below the fold, e.g. About). */
  trigger?: 'mount' | 'inView'
}

const EASE = [0.33, 1, 0.68, 1] as const

const lineVariants = {
  hidden: { y: '100%' },
  visible: (i: number) => ({
    y: '0%',
        transition: { duration: 0.9, delay: i * 0.14, ease: EASE },
  }),
}

/**
 * A line-by-line masked reveal: each line sits fully below an
 * overflow-hidden mask and slides up into place, like a curtain lifting,
 * staggered line by line.
 *
 * This needs real DOM measurement to know where lines break (see
 * useSplitLines). The measuring spans render absolutely positioned and
 * `invisible`, permanently, so they take up zero visible height and are
 * always available to remeasure on resize with nothing to wait for. The
 * real, visible, animated lines render alongside them in normal flow
 * once measurement completes, and determine the paragraph's actual
 * height. `visibility: hidden` also removes the measuring pass from the
 * accessibility tree, so nothing is ever announced twice.
 */
export function TextReveal({ text, as = 'p', className = '', trigger = 'inView' }: TextRevealProps) {
  const { containerRef, lines } = useSplitLines(text)
  const reducedMotion = useReducedMotion()
  const Tag = as

  const words = text.split(' ')

  // React's polymorphic-`as` pattern has a known TypeScript limitation: a
  // ref typed for one element (HTMLDivElement, from the measurement hook)
  // cannot be assigned to a JSX tag that might render as a different one
  // ('p' or 'div') without a cast. This is that cast, narrowed to the two
  // element types this component can actually render, not `any` or
  // `never`, so a real type error elsewhere would still surface.
  const ref = containerRef as Ref<HTMLParagraphElement | HTMLDivElement>

  return (
    <Tag ref={ref} className={`relative ${className}`}>
      <span aria-hidden="true" className="invisible absolute inset-0">
        {words.map((word, i) => (
          <span key={i}>
            <span data-word className="inline-block">
              {word}
            </span>
            {i < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>

      {lines !== null && reducedMotion && (
        // Reduced motion: the real content, already in place, no animation.
        <>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </>
      )}

      {lines !== null && !reducedMotion && (
        <motion.span
          initial="hidden"
          {...(trigger === 'mount'
            ? { animate: 'visible' }
            : { whileInView: 'visible', viewport: { once: true, amount: 0.4 } })}
        >
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span className="block" custom={i} variants={lineVariants}>
                {line}
              </motion.span>
            </span>
          ))}
        </motion.span>
      )}
    </Tag>
  )
}