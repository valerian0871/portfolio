import { useCallback, useEffect, useRef } from 'react'
import type { ProjectImage } from '../types'

interface LightboxProps {
  images: ProjectImage[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

export function Lightbox({ images, index, onIndexChange, onClose }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const image = images[index]

  const step = useCallback(
    (delta: number) => {
      onIndexChange((index + delta + images.length) % images.length)
    },
    [index, images.length, onIndexChange],
  )

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    dialog.addEventListener('close', onClose)
    return () => {
      dialog.removeEventListener('close', onClose)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  if (!image) return null

  return (
    <dialog
      ref={ref}
      aria-label={`${image.alt}. Image ${index + 1} of ${images.length}`}
      className="m-auto max-h-[90dvh] w-[min(1120px,94vw)] rounded-sm border border-rule-firm bg-paper p-0 text-ink shadow-2xl"
    >
      <div className="flex items-center justify-between gap-6 border-b border-rule px-6 py-4">
        <p className="font-read text-[0.9375rem] text-ink-2">
          {image.caption ?? image.alt}
        </p>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="shrink-0 rounded-sm border border-rule-firm px-4 py-1.5 text-[0.875rem] font-medium text-ink-2 transition-colors duration-150 ease-brand hover:border-accent hover:text-ink focus-visible:outline-accent"
        >
          Close
        </button>
      </div>

      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="max-h-[70dvh] w-full bg-accent-soft object-contain"
      />

      {images.length > 1 && (
        <div className="flex items-center justify-between gap-6 border-t border-rule px-6 py-4">
          <button
            type="button"
            onClick={() => step(-1)}
            className="rounded-sm border border-rule-firm px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-150 ease-brand hover:border-accent"
          >
            Previous
          </button>
          <p aria-live="polite" className="text-[0.8125rem] tabular-nums text-ink-3">
            {index + 1} of {images.length}
          </p>
          <button
            type="button"
            onClick={() => step(1)}
            className="rounded-sm border border-rule-firm px-4 py-2 text-[0.9375rem] font-medium transition-colors duration-150 ease-brand hover:border-accent"
          >
            Next
          </button>
        </div>
      )}
    </dialog>
  )
}