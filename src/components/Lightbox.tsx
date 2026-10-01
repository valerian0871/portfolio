import { useCallback, useEffect, useRef, useState } from 'react'

export interface LightboxImage {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

interface LightboxProps {
  images: LightboxImage[]
  index?: number
  initialIndex?: number
  onIndexChange?: (index: number) => void
  onClose: () => void
}

export function Lightbox({
  images,
  index: controlledIndex,
  initialIndex = 0,
  onIndexChange,
  onClose,
}: LightboxProps) {
  const [internalIndex, setInternalIndex] = useState(initialIndex)
  const isControlled = controlledIndex !== undefined
  const index = isControlled ? controlledIndex : internalIndex
  const dialogRef = useRef<HTMLDialogElement>(null)
  const image = images[index]

  const step = useCallback(
    (delta: number) => {
      const nextIndex = (index + delta + images.length) % images.length
      if (onIndexChange) {
        onIndexChange(nextIndex)
      }
      if (!isControlled) {
        setInternalIndex(nextIndex)
      }
    },
    [index, images.length, onIndexChange, isControlled],
  )

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleClose = () => {
      onClose()
    }

    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
      document.body.style.overflow = originalOverflow
    }
  }, [onClose])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, onClose])

  if (!image) return null

  return (
    <dialog
      ref={dialogRef}
      aria-label={`${image.alt}. Image ${index + 1} of ${images.length}`}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      className="fixed inset-0 z-[100] m-auto max-h-[92dvh] w-[min(1200px,94vw)] rounded-[12px] border border-[#E2E1DB] bg-[#FAFAF8] p-0 text-[#111111] backdrop:bg-[#111111]/70 backdrop:backdrop-blur-[4px]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#E2E1DB] px-5 py-4">
        <p className="text-[14px] text-[#6B6A65] truncate pr-4">
          {image.caption || image.alt}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn-press rounded-full border border-[#E2E1DB] px-4 py-1.5 text-[13px] font-medium text-[#111111] hover:border-[#111111] cursor-pointer"
        >
          Close
        </button>
      </div>

      {/* Main Image */}
      <div className="flex items-center justify-center p-4 sm:p-8 bg-[#F0EFEA] min-h-[300px]">
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="max-h-[65dvh] max-w-full rounded-[4px] object-contain"
        />
      </div>

      {/* Footer bar */}
      {images.length > 1 && (
        <div className="flex items-center justify-between border-t border-[#E2E1DB] px-5 py-4">
          <button
            type="button"
            onClick={() => step(-1)}
            className="btn-press rounded-full border border-[#E2E1DB] px-4 py-1.5 text-[13px] font-medium text-[#111111] hover:border-[#111111] cursor-pointer"
          >
            Previous
          </button>
          <span className="text-[13px] font-mono tabular-nums text-[#6B6A65]">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => step(1)}
            className="btn-press rounded-full border border-[#E2E1DB] px-4 py-1.5 text-[13px] font-medium text-[#111111] hover:border-[#111111] cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </dialog>
  )
}