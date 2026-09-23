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
      className="group relative block w-full overflow-hidden rounded-sm border border-rule bg-accent-soft transition-transform duration-200 ease-brand hover:-translate-y-0.5"
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
        className={`block h-auto w-full object-contain transition-opacity duration-200 ease-brand ${
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
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src}>
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