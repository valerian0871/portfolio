import { AnimatePresence, motion } from 'motion/react'
import { TRACK, useMusic } from '../../lib/MusicContext'
import { easeOutStrong } from '../../lib/motion'
import { PauseIcon, PlayIcon } from './MusicIcons'

/**
 * Floating pause / resume button. Appears once the needle is down and the
 * record player has scrolled out of view, so it follows the visitor through
 * the site. Resuming continues from the same position.
 */
export function MusicControl() {
  const music = useMusic()
  const visible = music.needleDown && !music.playerInView
  const paused = music.status === 'paused'

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="music-control"
          type="button"
          onClick={music.togglePause}
          aria-label={paused ? `Resume ${TRACK.title}` : `Pause ${TRACK.title}`}
          className="music-control on-ink fixed z-[55] grid place-items-center rounded-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.2, ease: easeOutStrong } }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15, ease: 'easeOut' } }}
          whileTap={{ scale: 0.95 }}
        >
          {/* A tiny record that spins while the song plays: status at a glance */}
          <span
            aria-hidden="true"
            className="vinyl music-control-disc absolute inset-[5px] rounded-full"
            data-spinning={music.status === 'playing' || undefined}
          />
          <span className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-inverse-bg">
            {paused ? <PlayIcon /> : <PauseIcon />}
          </span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
