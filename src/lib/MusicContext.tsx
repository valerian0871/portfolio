import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useMotionValue, type MotionValue } from 'motion/react'

export const TRACK = {
  src: '/audio/purpose-is-glorious.mp3',
  title: 'Purpose Is Glorious',
  artist: 'Natalie Holt',
}

export type MusicStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

interface MusicContextValue {
  status: MusicStatus
  needleDown: boolean
  progress: MotionValue<number>
  currentTime: number
  duration: number
  dropNeedle: () => void
  liftNeedle: () => void
  togglePause: () => void
  playerInView: boolean
  setPlayerInView: (inView: boolean) => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function useMusic() {
  const value = useContext(MusicContext)
  if (!value) throw new Error('useMusic must be used inside <MusicProvider>')
  return value
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [status, setStatus] = useState<MusicStatus>('idle')
  const [needleDown, setNeedleDown] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerInView, setPlayerInView] = useState(true)
  const progress = useMotionValue(0)

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio()
      audio.preload = 'none'
      audio.src = TRACK.src
      audioRef.current = audio
    }
    return audioRef.current
  }, [])

  const wired = useRef(false)
  const wire = useCallback(
    (audio: HTMLAudioElement) => {
      if (wired.current) return
      wired.current = true
      let raf = 0
      const tick = () => {
        if (audio.duration) progress.set(audio.currentTime / audio.duration)
        raf = requestAnimationFrame(tick)
      }
      audio.addEventListener('playing', () => {
        setStatus('playing')
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(tick)
      })
      audio.addEventListener('pause', () => {
        cancelAnimationFrame(raf)
        setStatus((s) => (s === 'idle' ? s : 'paused'))
      })
      audio.addEventListener('waiting', () => setStatus('loading'))
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime))
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration))
      audio.addEventListener('ended', () => {
        cancelAnimationFrame(raf)
        audio.currentTime = 0
        progress.set(0)
        setNeedleDown(false)
        setStatus('idle')
      })
      audio.addEventListener('error', () => {
        cancelAnimationFrame(raf)
        setNeedleDown(false)
        setStatus('error')
      })
    },
    [progress],
  )

  const dropNeedle = useCallback(() => {
    const audio = getAudio()
    wire(audio)
    audio.currentTime = 0
    progress.set(0)
    setCurrentTime(0)
    setNeedleDown(true)
    setStatus('loading')
    audio.play().catch(() => {
      setNeedleDown(false)
      setStatus('error')
    })
  }, [getAudio, wire, progress])

  const liftNeedle = useCallback(() => {
    const audio = audioRef.current
    setNeedleDown(false)
    setStatus('idle')
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    progress.set(0)
    setCurrentTime(0)
  }, [progress])

  const togglePause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !needleDown) return
    if (audio.paused) {
      audio.play().catch(() => setStatus('error'))
    } else {
      audio.pause()
    }
  }, [needleDown])

  useEffect(() => {
    if (!('mediaSession' in navigator) || !needleDown) return
    navigator.mediaSession.metadata = new MediaMetadata({ title: TRACK.title, artist: TRACK.artist })
    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play())
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause())
    navigator.mediaSession.setActionHandler('stop', liftNeedle)
    return () => {
      navigator.mediaSession.setActionHandler('play', null)
      navigator.mediaSession.setActionHandler('pause', null)
      navigator.mediaSession.setActionHandler('stop', null)
    }
  }, [needleDown, liftNeedle])

  useEffect(() => () => audioRef.current?.pause(), [])

  const value = useMemo<MusicContextValue>(
    () => ({
      status,
      needleDown,
      progress,
      currentTime,
      duration,
      dropNeedle,
      liftNeedle,
      togglePause,
      playerInView,
      setPlayerInView,
    }),
    [status, needleDown, progress, currentTime, duration, dropNeedle, liftNeedle, togglePause, playerInView],
  )

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
