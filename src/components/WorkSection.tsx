import { useState } from 'react'
import { Container } from './Container'
import { HeadingReveal } from './TextReveal'
import { content, type Project } from '../data/content'
import { Lightbox } from './Lightbox'

interface WorkSectionProps {
  onSelectProject?: (project: Project) => void
}

export function WorkSection({ onSelectProject }: WorkSectionProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Filter only projects that have valid images for the image-led grid
  const displayProjects = content.projects.filter((p) => p.images && p.images.length > 0)

  const handleOpenProject = (project: Project) => {
    setActiveProject(project)
    setLightboxIndex(0)
    setLightboxOpen(true)
    if (onSelectProject) onSelectProject(project)
  }

  return (
    <section
      id="work"
      className="py-[64px] md:py-[96px] lg:py-[128px] border-b border-[#E2E1DB]"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-12 md:mb-16 lg:mb-24 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] block mb-3">
              Selected Work
            </span>
            <HeadingReveal
              text="Case studies & visual systems"
              as="h2"
              className="text-[clamp(32px,4.2vw,64px)] font-heading font-medium tracking-[-0.035em] leading-[1.08] text-[#111111]"
            />
          </div>
          <span className="text-[14px] text-[#6B6A65] tabular-nums">
            {displayProjects.length} Projects
          </span>
        </div>

        {/* Two-column card grid, right column offset 96px downward on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-12 md:gap-y-16">
          {displayProjects.map((project, index) => {
            const isRightColumn = index % 2 === 1
            const coverImage = project.images[0]

            return (
              <div
                key={project.slug}
                className={`flex flex-col ${isRightColumn ? 'md:mt-[96px]' : ''}`}
              >
                <WorkCard
                  project={project}
                  coverImage={coverImage}
                  onClick={() => handleOpenProject(project)}
                />
              </div>
            )
          })}
        </div>
      </Container>

      {/* Lightbox / detail inspection */}
      {lightboxOpen && activeProject && activeProject.images.length > 0 && (
        <Lightbox
          images={activeProject.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  )
}

interface WorkCardProps {
  project: Project
  coverImage: { src: string; alt: string; caption: string }
  onClick: () => void
}

function WorkCard({ project, coverImage, onClick }: WorkCardProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <article className="group cursor-pointer block select-none">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus-visible:outline-2 focus-visible:outline-[#111111] cursor-pointer"
        aria-label={`View project details for ${project.title}`}
      >
        {/* Image Container: Aspect 4 by 5, 4px radius, flat #F0EFEA placeholder */}
        <div className="relative w-full aspect-[4/5] rounded-[4px] overflow-hidden bg-[#F0EFEA]">
          {/* Main Image with hover scale to 1.03 over 500ms on fine pointer devices */}
          <img
            src={coverImage.src}
            alt={coverImage.alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            style={{
              transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1), opacity 500ms ease',
              opacity: loaded ? 1 : 0,
            }}
            className="w-full h-full object-cover rounded-[4px] will-change-transform group-hover:scale-[1.03]"
          />
        </div>

        {/* Caption below: Title left, Discipline right */}
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3
            style={{
              transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            className="text-[16px] md:text-[18px] font-heading font-medium tracking-tight text-[#111111] group-hover:translate-x-[4px]"
          >
            {project.title}
          </h3>
          <span className="text-[13px] text-[#6B6A65] uppercase tracking-[0.05em] shrink-0 font-medium">
            {project.disciplineLabel}
          </span>
        </div>

        {/* Short summary line */}
        <p className="mt-1 text-[14px] text-[#6B6A65] line-clamp-2 leading-[1.5]">
          {project.summary}
        </p>
      </button>
    </article>
  )
}