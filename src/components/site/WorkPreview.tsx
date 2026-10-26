import { AnimatePresence, motion, useReducedMotion, useSpring, useTransform, useVelocity, type MotionValue } from 'motion/react'
import type { Project } from '../../data/content'
import { easeOutStrong } from '../../lib/motion'

interface WorkPreviewProps {
  project: Project | null
  x: MotionValue<number>
  y: MotionValue<number>
}

const W = 300
const H = 210

// A print that trails the cursor over the work list. It leans into the
// direction of travel, so fast sweeps feel like dragging a card across a desk.
export function WorkPreview({ project, x, y }: WorkPreviewProps) {
  const reduceMotion = useReducedMotion()
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })
  const velocity = useVelocity(springX)
  const rotate = useTransform(velocity, [-2400, 0, 2400], [-9, 0, 9], { clamp: true })
  const image = project?.images[0]

  return (
    <motion.div
      aria-hidden="true"
      className="work-preview pointer-events-none fixed left-0 top-0 z-[40]"
      style={{
        x: reduceMotion ? x : springX,
        y: reduceMotion ? y : springY,
        rotate: reduceMotion ? 0 : rotate,
        width: W,
        height: H,
        marginLeft: 28,
        marginTop: -H / 2,
      }}
      initial={false}
      animate={{ opacity: image ? 1 : 0, scale: image ? 1 : 0.85 }}
      transition={{ duration: 0.25, ease: easeOutStrong }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-surface">
        <AnimatePresence initial={false}>
          {image && (
            <motion.img
              key={project.slug}
              src={image.src}
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
              initial={{ clipPath: 'inset(100% 0 0 0)', scale: 1.15 }}
              animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.2 } }}
              transition={{ duration: 0.45, ease: easeOutStrong }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
