import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useSite } from '../lib/SiteContext'
import { easeOutStrong } from '../lib/motion'
import { findProject, selectedProjects, workOrder } from '../lib/site'
import { Lightbox } from './Lightbox'
import { TextLink } from './site/TextLink'

export function CaseStudy({ slug }: { slug: string }) {
  const site = useSite()
  const project = findProject(slug)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [frameLoaded, setFrameLoaded] = useState(false)

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
  }, [slug])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || site.palette.open) return
      if (document.querySelector('dialog[open]')) return
      site.closeCase()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [site])

  if (!project) return null

  const list = site.route === '/work' ? workOrder : selectedProjects
  const position = list.findIndex((p) => p.slug === slug)
  const next = list[(position + 1) % list.length]
  const isLiveSite = project.discipline === 'frontend' && project.link?.href && project.embeddable !== false

  return (
    <motion.article
      key={slug}
      className="mx-auto w-full max-w-[1100px] px-6 pb-28 pt-32 md:pb-40 md:pt-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: easeOutStrong }}
      aria-labelledby="case-title"
    >
      <h1
        id="case-title"
        ref={titleRef}
        tabIndex={-1}
        className="case-title font-heading text-text focus:outline-none"
      >
        {project.title}
      </h1>
      <p className="mt-6 max-w-[34ch] text-[clamp(1.125rem,2vw,1.5rem)] leading-[1.4] text-muted">
        {project.summary}
      </p>

      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 md:grid-cols-12">
        <div className="md:col-span-2">
          <dt className="font-mono text-[11px] text-muted">Year</dt>
          <dd className="mt-2 text-[15px] tabular-nums">{project.year ?? '—'}</dd>
        </div>
        <div className="md:col-span-3">
          <dt className="font-mono text-[11px] text-muted">Practice</dt>
          <dd className="mt-2 text-[15px]">{project.disciplineLabel}</dd>
        </div>
        <div className="md:col-span-3">
          <dt className="font-mono text-[11px] text-muted">Scope</dt>
          <dd className="mt-2 text-[15px]">{project.kind}</dd>
        </div>
        <div className="col-span-2 md:col-span-4">
          <dt className="font-mono text-[11px] text-muted">Tools</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <span key={tool} className="work-tag rounded-full border px-2.5 py-1 font-mono text-[11px] text-muted">
                {tool}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="mt-14 grid gap-10 md:grid-cols-12">
        <p className="text-[17px] leading-[1.65] md:col-span-7">{project.detail}</p>
        <div className="flex flex-col items-start gap-4 md:col-span-4 md:col-start-9">
          {project.metrics ? <p className="text-[15px] leading-[1.6] text-muted">{project.metrics}</p> : null}
          {project.link ? (
            <TextLink href={project.link.href} target="_blank" rel="noopener noreferrer">
              {project.link.label}
            </TextLink>
          ) : null}
        </div>
      </div>

      {project.pipeline ? (
        <section className="mt-20" aria-labelledby="case-pipeline">
          <h2 id="case-pipeline" className="text-[13px] font-medium text-muted">
            How the workflow runs
          </h2>
          <ol className="mt-5 border-b border-line">
            {[project.pipeline.trigger, ...project.pipeline.steps, project.pipeline.output].map((step, i, all) => (
              <li key={i} className="flex gap-4 border-t border-line py-4 text-[15px] leading-[1.55]">
                <span className="w-8 shrink-0 pt-[3px] font-mono text-[11px] text-muted">
                  {i === 0 ? 'In' : i === all.length - 1 ? 'Out' : String(i).padStart(2, '0')}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {isLiveSite ? (
        <section className="mt-20" aria-labelledby="case-live">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="case-live" className="text-[13px] font-medium text-muted">
              The live site
            </h2>
            <span className="font-mono text-[11px] text-muted">
              {project.link!.href.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </span>
          </div>
          <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface">
            {frameLoaded ? (
              <iframe
                src={project.link!.href}
                title={`${project.title}, live site`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
                className="h-full w-full"
              />
            ) : (
              <>
                {project.images[0] ? (
                  <img
                    src={project.images[0].src}
                    alt={project.images[0].alt}
                    className="h-full w-full object-cover object-top"
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => setFrameLoaded(true)}
                  className="on-ink absolute bottom-4 left-4 inline-flex h-10 items-center rounded-full px-4 text-[13px] font-medium"
                >
                  Load the live site here
                </button>
              </>
            )}
          </div>
          {frameLoaded ? (
            <p className="mt-3 text-[13px] text-muted">
              Blank frame? The site may block embedding. Use the link above to open it in a new tab.
            </p>
          ) : null}
        </section>
      ) : null}

      {project.images.length > 0 && !(isLiveSite && project.images.length === 1) ? (
        <section className="mt-20" aria-labelledby="case-images">
          <h2 id="case-images" className="text-[13px] font-medium text-muted">
            {project.images.length === 1 ? 'Image' : `Images (${project.images.length})`}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {project.images.map((image, i) => (
              <li key={image.src}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="case-image block w-full overflow-hidden rounded-2xl border border-line bg-surface"
                  aria-label={`Enlarge: ${image.caption ?? image.alt}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    className="h-auto w-full"
                  />
                </button>
                {image.caption ? <p className="mt-2 text-[13px] text-muted">{image.caption}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {next && next.slug !== slug ? (
        <div className="mt-28 border-t border-line pt-8">
          <p className="font-mono text-[11px] text-muted">Next</p>
          <button
            type="button"
            onClick={() => site.openCase(next.slug)}
            className="case-next group mt-3 inline-flex items-baseline gap-3 text-left font-heading text-text"
          >
            {next.title}
            <span aria-hidden="true" className="text-link-arrow inline-block text-muted">→</span>
          </button>
        </div>
      ) : null}

      {lightboxIndex !== null ? (
        <Lightbox
          images={project.images}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </motion.article>
  )
}
