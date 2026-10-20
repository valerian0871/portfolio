import type { Transition } from 'motion/react'


export const easeOutStrong = [0.22, 1, 0.36, 1] as const
export const easeInOutStrong = [0.77, 0, 0.175, 1] as const

export const springUI: Transition = { type: 'spring', stiffness: 350, damping: 32, mass: 1 }
export const springIsland: Transition = { type: 'spring', stiffness: 360, damping: 34, mass: 0.8 }
export const springIndicator: Transition = { type: 'spring', stiffness: 480, damping: 36 }
export const springCursor = { stiffness: 700, damping: 45, mass: 0.35 }
export const springPress: Transition = { type: 'spring', stiffness: 500, damping: 30 }
export const springWave: Transition = { type: 'spring', stiffness: 500, damping: 26 }
