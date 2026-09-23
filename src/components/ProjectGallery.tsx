import { useState } from 'react'
import { Lightbox } from './Lightbox'
import type { ProjectImage } from '../types'

interface ProjectGalleryProps {
  images: ProjectImage[]
}

function Thumbnail({
  image,
  onOpen,
}: {
  image: ProjectImage
  onOpen: () => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-sm border border-rule bg-accent-soft p-4 text-center font-read text-[0.8125rem] text-ink-3">
        {image.alt}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-auto overflow-hidden rounded-sm bg-accent-soft transition-opacity duration-200 ease-brand hover:opacity-95"
    >
      {!loaded && <div className="shimmer absolute inset-0" />}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`block h-auto w-auto max-h-[72vh] transition-opacity duration-200 ease-brand ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span className="sr-only">Open larger image</span>
    </button>
  )
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  const [openAt, setOpenAt] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <ul className="gallery-scroll mt-6 flex snap-x snap-mandatory items-center gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
        {images.map((image, index) => (
          <li key={image.src} className="w-auto shrink-0 snap-start">
            <Thumbnail image={image} onOpen={() => setOpenAt(index)} />
          </li>
        ))}
      </ul>

      {openAt !== null && (
        <Lightbox
          images={images}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  )
}