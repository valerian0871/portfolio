import type { Transition } from 'motion/react'

/**
 * Motion tokens. Values and their purpose are specified in
 * docs/section-mapping-and-motion-spec.md (section 3).
 */

export const easeOutStrong = [0.22, 1, 0.36, 1] as const
export const easeInOutStrong = [0.77, 0, 0.175, 1] as const

/** Entrances, row reveals, heading masks */
export const springUI: Transition = { type: 'spring', stiffness: 350, damping: 32, mass: 1 }
/** The morph island's position and size */
export const springIsland: Transition = { type: 'spring', stiffness: 360, damping: 34, mass: 0.8 }
/** Sliding tab indicator */
export const springIndicator: Transition = { type: 'spring', stiffness: 480, damping: 36 }
/** Custom cursor follow */
export const springCursor = { stiffness: 700, damping: 45, mass: 0.35 }
/** Press feedback */
export const springPress: Transition = { type: 'spring', stiffness: 500, damping: 30 }
/** Wordmark letter wave */
export const springWave: Transition = { type: 'spring', stiffness: 500, damping: 26 }
