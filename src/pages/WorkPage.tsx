import { useState } from 'react'
import { Container } from '../components/Container'
import { HeadingReveal } from '../components/TextReveal'
import { content, type DisciplineId, type Project } from '../data/content'
import { Lightbox } from '../components/Lightbox'
import { LiveSitePreview } from '../components/LiveSitePreview'
import { WorkArchive } from '../components/WorkArchive'

interface WorkPageProps {
  onBack?: () => void
}

export function WorkPage({ onBack }: WorkPageProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineId | 'all'>('all')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Visual projects with images
  const visualProjects = content.projects.filter((p) => p.images && p.images.length > 0)
  // Text-only projects for archive
  const archiveProjects = content.projects.filter((p) => !p.images || p.images.length === 0)

  const filteredProjects = selectedDiscipline === 'all'
    ? visualProjects
    : visualProjects.filter((p) => p.discipline === selectedDiscipline)

  const handleOpenLightbox = (project: Project) => {
    setActiveProject(project)
    setLightboxOpen(true)
  }

  return (
    <div className="page-enter pt-[100px] md:pt-[128px] pb-24 md:pb-32">
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <a
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault()
                onBack()
              }
            }}
            className="inline-flex items-center gap-2 text-[14px] text-muted hover:text-text transition-colors"
          >
            <span>←</span>
            <span>Back to overview</span>
          </a>
        </div>

        {/* Heading */}
        <div className="mb-10 md:mb-14">
          <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted block mb-3">
            Index of Work
          </span>
          <HeadingReveal
            text="All projects &amp; case studies"
            as="h1"
            className="text-[clamp(36px,5vw,72px)] font-heading font-medium tracking-[-0.035em] leading-[1.1] text-text"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-8 border-b border-line">
          <button
            type="button"
            onClick={() => setSelectedDiscipline('all')}
            className={`btn-press rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
              selectedDiscipline === 'all'
                ? 'bg-text text-bg'
                : 'bg-transparent text-muted border border-line hover:border-text hover:text-text'
            }`}
          >
            All Disciplines ({visualProjects.length})
          </button>
          {content.services.map((service) => {
            const count = visualProjects.filter((p) => p.discipline === service.id).length
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedDiscipline(service.id)}
                className={`btn-press rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                  selectedDiscipline === service.id
                    ? 'bg-text text-bg'
                    : 'bg-transparent text-muted border border-line hover:border-text hover:text-text'
                }`}
              >
                {service.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Visual Projects List */}
        <div className="divide-y divide-line">
          {filteredProjects.map((project) => (
            <article key={project.slug} className="py-10 md:py-14 grid grid-cols-12 gap-6 lg:gap-10">
              {/* Left Column: Metadata & Details */}
              <div className="col-span-12 md:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted">
                      {project.disciplineLabel}
                    </span>
                    <span className="text-[12px] text-line">·</span>
                    <span className="text-[12px] text-muted">{project.kind}</span>
                  </div>

                  <h2 className="text-[24px] md:text-[32px] font-heading font-medium tracking-tight text-text mb-4">
                    {project.title}
                  </h2>

                  <p className="text-[15px] text-muted leading-[1.6] mb-6 max-w-[50ch]">
                    {project.detail}
                  </p>

                  {/* Architecture / Pipeline details if present */}
                  {project.pipeline && (
                    <div className="mb-6 p-4 rounded-[4px] bg-surface border border-line/60">
                      <span className="text-[11px] uppercase font-medium tracking-[0.08em] text-text block mb-2">
                        Pipeline Architecture
                      </span>
                      <ul className="space-y-1.5 text-[13px] text-muted">
                        <li>
                          <strong className="text-text font-medium">Trigger:</strong> {project.pipeline.trigger}
                        </li>
                        <li>
                          <strong className="text-text font-medium">Steps:</strong> {project.pipeline.steps.join(' → ')}
                        </li>
                        <li>
                          <strong className="text-text font-medium">Output:</strong> {project.pipeline.output}
                        </li>
                      </ul>
                      {project.metrics && (
                        <p className="mt-2 text-[12px] font-mono text-text">
                          {project.metrics}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tools list */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2.5 py-1 text-[12px] font-mono text-muted bg-surface"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External link if available */}
                {project.link && (
                  <div>
                    <a
                      href={project.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill-secondary btn-press inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium text-text"
                    >
                      <span>{project.link.label}</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Imagery */}
              <div className="col-span-12 md:col-span-6">
                {project.images && project.images.length > 0 && (
                  project.discipline === 'frontend' ? (
                    <LiveSitePreview
                      src={project.images[0].src}
                      alt={project.images[0].alt}
                      url={project.link?.href}
                      title={project.title}
                      onOpenLightbox={() => handleOpenLightbox(project)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenLightbox(project)}
                      className="group block w-full text-left overflow-hidden rounded-[6px] bg-surface border border-line cursor-pointer"
                    >
                      <div className={`relative w-full overflow-hidden flex items-center justify-center p-3 ${
                        project.discipline === 'automation' ? 'aspect-[16/10]' : 'aspect-[4/5] sm:aspect-[16/11]'
                      }`}>
                        <img
                          src={project.images[0].src}
                          alt={project.images[0].alt}
                          loading="lazy"
                          className="max-w-full max-h-full object-contain transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.02]"
                        />
                      </div>
                      {project.images.length > 1 && (
                        <div className="px-4 py-2.5 bg-bg border-t border-line text-[12px] text-muted flex items-center justify-between">
                          <span className="font-mono">Collection of {project.images.length} visual assets</span>
                          <span className="text-[13px]">↗</span>
                        </div>
                      )}
                    </button>
                  )
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Text-only Archive */}
        <WorkArchive projects={archiveProjects} />
      </Container>

      {lightboxOpen && activeProject && activeProject.images.length > 0 && (
        <Lightbox
          images={activeProject.images}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
