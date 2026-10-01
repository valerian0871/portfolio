import { useState } from 'react'
import { Container } from './Container'
import { HeadingReveal } from './TextReveal'
import { content, type DisciplineId, type Project } from '../data/content'
import { Lightbox } from './Lightbox'
import { LiveSitePreview } from './LiveSitePreview'
import { WorkArchive } from './WorkArchive'

interface WorkSectionProps {
  onSelectProject?: (project: Project) => void
}

type FilterCategory = DisciplineId | 'all'

export function WorkSection({ onSelectProject }: WorkSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Filter projects with images for the visual grid
  const allProjectsWithImages = content.projects.filter(
    (p) => p.images && p.images.length > 0
  )

  // Filter text-only projects for the archive below
  const archiveProjects = content.projects.filter(
    (p) => !p.images || p.images.length === 0
  )

  const filteredProjects =
    selectedCategory === 'all'
      ? allProjectsWithImages
      : allProjectsWithImages.filter((p) => p.discipline === selectedCategory)

  // Compute category counts
  const categoryCounts: Record<FilterCategory, number> = {
    all: allProjectsWithImages.length,
    frontend: allProjectsWithImages.filter((p) => p.discipline === 'frontend').length,
    graphics: allProjectsWithImages.filter((p) => p.discipline === 'graphics').length,
    writing: allProjectsWithImages.filter((p) => p.discipline === 'writing').length,
    automation: allProjectsWithImages.filter((p) => p.discipline === 'automation').length,
  }

  const filterTabs: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All Works' },
    { id: 'frontend', label: 'Frontend Development' },
    { id: 'graphics', label: 'Graphics Design' },
    { id: 'writing', label: 'Writing & Editorial' },
    { id: 'automation', label: 'AI Automation' },
  ]

  const handleOpenProject = (project: Project, imageIndex = 0) => {
    setActiveProject(project)
    setLightboxIndex(imageIndex)
    setLightboxOpen(true)
    if (onSelectProject) onSelectProject(project)
  }

  return (
    <section
      id="work"
      className="py-[64px] md:py-[96px] lg:py-[128px] border-b border-line"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted block mb-3">
              Selected Work
            </span>
            <HeadingReveal
              text="Case studies & visual systems"
              as="h2"
              className="text-[clamp(32px,4.2vw,64px)] font-heading font-medium tracking-[-0.035em] leading-[1.15] text-text"
            />
          </div>
          <div className="text-[14px] text-muted tabular-nums shrink-0">
            Showing {filteredProjects.length} of {allProjectsWithImages.length} projects
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter projects by discipline"
          className="flex flex-wrap items-center gap-2 mb-12 md:mb-16 pb-4 border-b border-line/70"
        >
          {filterTabs.map((tab) => {
            const count = categoryCounts[tab.id]
            if (count === 0 && tab.id !== 'all') return null
            const isActive = selectedCategory === tab.id

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`btn-press rounded-full px-4 py-2 text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-text text-bg shadow-xs'
                    : 'bg-transparent text-muted border border-line hover:border-text hover:text-text'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-bg/20 text-bg'
                      : 'bg-surface text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Two-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-12 md:gap-y-16">
          {filteredProjects.map((project, index) => {
            // Apply 96px offset stagger on right column in 'all' view per Pearl specification
            const isRightColumn = selectedCategory === 'all' && index % 2 === 1

            return (
              <div
                key={project.slug}
                className={`flex flex-col ${isRightColumn ? 'md:mt-[96px]' : ''}`}
              >
                <WorkCard
                  project={project}
                  onOpenLightbox={(imgIdx) => handleOpenProject(project, imgIdx)}
                />
              </div>
            )
          })}
        </div>

        {/* Item 3: Text-only archive for projects with no images */}
        <WorkArchive projects={archiveProjects} />
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
  onOpenLightbox: (imageIndex?: number) => void
}

function WorkCard({ project, onOpenLightbox }: WorkCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const currentImage = project.images[activeImageIndex] || project.images[0]
  const isFrontend = project.discipline === 'frontend'
  const isAutomation = project.discipline === 'automation'
  const isWriting = project.discipline === 'writing'
  const hasMultipleImages = project.images.length > 1

  return (
    <article className="group block select-none">
      {/* 
        Image Box (Uncropped Media Display):
        - Frontend sites: rendered via LiveSitePreview with animated screen simulation and browser chrome
        - Automation workflows: widescreen aspect-[16/10] with object-contain
        - Graphics & Writing: aspect-[4/5] with object-contain so all poster & book art is 100% visible
      */}
      {isFrontend ? (
        <LiveSitePreview
          src={currentImage.src}
          alt={currentImage.alt}
          url={project.link?.href}
          title={project.title}
          onOpenLightbox={() => onOpenLightbox(activeImageIndex)}
        />
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => onOpenLightbox(activeImageIndex)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpenLightbox(activeImageIndex)
            }
          }}
          className={`relative w-full rounded-[6px] overflow-hidden bg-surface border border-line cursor-pointer focus-visible:outline-2 focus-visible:outline-text transition-transform duration-300 ${
            isAutomation ? 'aspect-[16/10] p-2.5 sm:p-3' : isWriting ? 'aspect-[4/5] p-6' : 'aspect-[4/5] p-3'
          }`}
          aria-label={`View ${project.title} full image`}
        >
          {/* Subtle canvas background for workflows */}
          {isAutomation && (
            <div className="absolute top-2 left-3 z-10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-text/40" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                n8n Workflow Canvas
              </span>
            </div>
          )}

          {/* Uncropped Image Display using object-contain to prevent clipping */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              style={{
                transition: 'transform 500ms cubic-bezier(0.23, 1, 0.32, 1), opacity 500ms ease',
                opacity: imageLoaded ? 1 : 0,
              }}
              className={`max-w-full max-h-full object-contain will-change-transform group-hover:scale-[1.02] ${
                isWriting ? 'rounded-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.06)]' : 'rounded-[4px]'
              }`}
            />
          </div>

          {/* Multiple Image Carousel Pagination / Counter */}
          {hasMultipleImages && (
            <div
              className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Slide Counter Badge */}
              <span className="px-2.5 py-0.5 rounded-full bg-bg/90 backdrop-blur-sm text-[11px] font-mono text-text border border-line">
                {activeImageIndex + 1} / {project.images.length}
              </span>

              {/* Quick dot navigation for fine pointer */}
              <div className="flex items-center gap-1.5 bg-bg/90 backdrop-blur-sm px-2 py-1 rounded-full border border-line">
                {project.images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveImageIndex(idx)
                    }}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'w-4 bg-text'
                        : 'w-1.5 bg-muted/40 hover:bg-text'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Caption below: Title left, Discipline right */}
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3
          style={{
            transition: 'transform 250ms cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          onClick={() => onOpenLightbox(activeImageIndex)}
          className="text-[16px] md:text-[18px] font-heading font-medium tracking-tight text-text group-hover:translate-x-[4px] cursor-pointer"
        >
          {project.title}
        </h3>
        <span className="text-[12px] text-muted uppercase tracking-[0.06em] shrink-0 font-medium">
          {project.disciplineLabel}
        </span>
      </div>

      {/* Short summary and tools */}
      <p className="mt-1 text-[14px] text-muted line-clamp-2 leading-[1.5]">
        {project.summary}
      </p>

      {/* Tools / Tags */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {project.tools.slice(0, 4).map((tool) => (
          <span
            key={tool}
            className="text-[11px] font-mono text-muted bg-surface px-2 py-0.5 rounded-[3px]"
          >
            {tool}
          </span>
        ))}
        {project.link && (
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-text hover:underline ml-auto inline-flex items-center gap-1"
          >
            <span>{project.link.label}</span>
            <span>↗</span>
          </a>
        )}
      </div>
    </article>
  )
}