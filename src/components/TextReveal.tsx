import type { Ref } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSplitLines } from '../hooks/useSplitLines'

interface TextRevealProps {
  text: string
  as?: 'p' | 'div'
  className?: string
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

export function TextReveal({ text, as = 'p', className = '', trigger = 'inView' }: TextRevealProps) {
  const { containerRef, lines } = useSplitLines(text)
  const reducedMotion = useReducedMotion()
  const Tag = as

  const words = text.split(' ')

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