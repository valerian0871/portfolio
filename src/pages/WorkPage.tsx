import { useState } from 'react'
import { Container } from '../components/Container'
import { HeadingReveal } from '../components/TextReveal'
import { content, type DisciplineId, type Project } from '../data/content'
import { Lightbox } from '../components/Lightbox'

interface WorkPageProps {
  onBack?: () => void
}

export function WorkPage({ onBack }: WorkPageProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineId | 'all'>('all')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const filteredProjects = selectedDiscipline === 'all'
    ? content.projects
    : content.projects.filter((p) => p.discipline === selectedDiscipline)

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
            className="inline-flex items-center gap-2 text-[14px] text-[#6B6A65] hover:text-[#111111] transition-colors"
          >
            <span>←</span>
            <span>Back to overview</span>
          </a>
        </div>

        {/* Heading */}
        <div className="mb-10 md:mb-14">
          <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65] block mb-3">
            Index of Work
          </span>
          <HeadingReveal
            text="All projects &amp; case studies"
            as="h1"
            className="text-[clamp(36px,5vw,72px)] font-heading font-medium tracking-[-0.035em] leading-[1.05] text-[#111111]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pb-8 border-b border-[#E2E1DB]">
          <button
            type="button"
            onClick={() => setSelectedDiscipline('all')}
            className={`btn-press rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
              selectedDiscipline === 'all'
                ? 'bg-[#111111] text-[#FAFAF8]'
                : 'bg-transparent text-[#6B6A65] border border-[#E2E1DB] hover:border-[#111111] hover:text-[#111111]'
            }`}
          >
            All Disciplines ({content.projects.length})
          </button>
          {content.services.map((service) => {
            const count = content.projects.filter((p) => p.discipline === service.id).length
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedDiscipline(service.id)}
                className={`btn-press rounded-full px-4 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
                  selectedDiscipline === service.id
                    ? 'bg-[#111111] text-[#FAFAF8]'
                    : 'bg-transparent text-[#6B6A65] border border-[#E2E1DB] hover:border-[#111111] hover:text-[#111111]'
                }`}
              >
                {service.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Projects List */}
        <div className="divide-y divide-[#E2E1DB]">
          {filteredProjects.map((project) => (
            <article key={project.slug} className="py-10 md:py-14 grid grid-cols-12 gap-6 lg:gap-10">
              {/* Left Column: Metadata & Details */}
              <div className="col-span-12 md:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#6B6A65]">
                      {project.disciplineLabel}
                    </span>
                    <span className="text-[12px] text-[#E2E1DB]">·</span>
                    <span className="text-[12px] text-[#6B6A65]">{project.kind}</span>
                  </div>

                  <h2 className="text-[24px] md:text-[32px] font-heading font-medium tracking-tight text-[#111111] mb-4">
                    {project.title}
                  </h2>

                  <p className="text-[15px] text-[#6B6A65] leading-[1.6] mb-6 max-w-[50ch]">
                    {project.detail}
                  </p>

                  {/* Architecture / Pipeline details if present */}
                  {project.pipeline && (
                    <div className="mb-6 p-4 rounded-[4px] bg-[#F0EFEA] border border-[#E2E1DB]/60">
                      <span className="text-[11px] uppercase font-medium tracking-[0.08em] text-[#111111] block mb-2">
                        Pipeline Architecture
                      </span>
                      <ul className="space-y-1.5 text-[13px] text-[#6B6A65]">
                        <li>
                          <strong className="text-[#111111] font-medium">Trigger:</strong> {project.pipeline.trigger}
                        </li>
                        <li>
                          <strong className="text-[#111111] font-medium">Steps:</strong> {project.pipeline.steps.join(' → ')}
                        </li>
                        <li>
                          <strong className="text-[#111111] font-medium">Output:</strong> {project.pipeline.output}
                        </li>
                      </ul>
                      {project.metrics && (
                        <p className="mt-2 text-[12px] font-mono text-[#111111]">
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
                        className="rounded-full px-2.5 py-1 text-[12px] font-mono text-[#6B6A65] bg-[#F0EFEA]"
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
                      className="btn-pill-secondary btn-press inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium text-[#111111]"
                    >
                      <span>{project.link.label}</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column: Imagery if available */}
              <div className="col-span-12 md:col-span-6">
                {project.images && project.images.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => handleOpenLightbox(project)}
                    className="group block w-full text-left overflow-hidden rounded-[4px] bg-[#F0EFEA] border border-[#E2E1DB] cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={project.images[0].src}
                        alt={project.images[0].alt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                    {project.images.length > 1 && (
                      <div className="px-4 py-2 bg-[#FAFAF8] border-t border-[#E2E1DB] text-[12px] text-[#6B6A65] flex items-center justify-between">
                        <span>Click to view {project.images.length} images</span>
                        <span>↗</span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="h-full min-h-[180px] flex items-center justify-center rounded-[4px] bg-[#F0EFEA] border border-[#E2E1DB] p-6 text-center text-[13px] text-[#6B6A65]">
                    Technical project · No visual assets attached
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
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
