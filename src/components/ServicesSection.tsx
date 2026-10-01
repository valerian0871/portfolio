import { useState } from 'react'
import { Container } from './Container'
import { HeadingReveal } from './TextReveal'
import { content } from '../data/content'

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  const toggleRow = (index: number) => {
    setExpandedIndex((curr) => (curr === index ? null : index))
  }

  return (
    <section
      id="services"
      className="py-[64px] md:py-[96px] lg:py-[128px] border-b border-line"
    >
      <Container>
        {/* Section Header */}
        <div className="mb-12 md:mb-16 lg:mb-20">
          <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted block mb-3">
            Capabilities &amp; Services
          </span>
          <HeadingReveal
            text="Disciplines &amp; Architecture"
            as="h2"
            className="text-[clamp(32px,4.2vw,64px)] font-heading font-medium tracking-[-0.035em] leading-[1.15] text-text"
          />
        </div>

        {/* Four stacked rows */}
        <div className="flex flex-col border-t border-line">
          {content.services.map((service, index) => {
            const isHovered = hoveredIndex === index
            const isSibling = hoveredIndex !== null && !isHovered
            const isExpanded = expandedIndex === index

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transition: 'opacity 250ms cubic-bezier(0.23, 1, 0.32, 1)',
                  opacity: isSibling ? 0.35 : 1,
                }}
                className="border-b border-line py-8 md:py-12 transition-opacity"
              >
                {/* Desktop layout: Always expanded, full scanability */}
                <div className="hidden md:grid md:grid-cols-12 gap-6 items-baseline">
                  {/* Col 1-2: Index number in label style */}
                  <div className="col-span-2">
                    <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted font-mono">
                      {service.index}
                    </span>
                  </div>

                  {/* Col 3-7: Discipline name at h2 size */}
                  <div className="col-span-5">
                    <h3 className="text-[clamp(28px,3.2vw,48px)] font-heading font-medium tracking-[-0.035em] leading-[1.15] text-text">
                      {service.name}
                    </h3>
                    <p className="mt-3 text-[15px] text-muted leading-[1.55] max-w-[50ch]">
                      {service.description}
                    </p>
                  </div>

                  {/* Col 8-12: Sub-items in muted body text */}
                  <div className="col-span-5 pl-4">
                    <ul className="space-y-2.5">
                      {service.subItems.map((item) => (
                        <li
                          key={item}
                          className="text-[15px] text-muted flex items-center gap-3"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-text/30 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mobile layout: Tap row to expand sub-items */}
                <div className="md:hidden">
                  <button
                    type="button"
                    onClick={() => toggleRow(index)}
                    aria-expanded={isExpanded}
                    aria-controls={`service-panel-${service.id}`}
                    className="w-full text-left flex items-start justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-text"
                  >
                    <div>
                      <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-muted font-mono block mb-1">
                        {service.index}
                      </span>
                      <h3 className="text-[26px] sm:text-[30px] font-heading font-medium tracking-tight text-text">
                        {service.name}
                      </h3>
                    </div>
                    <span
                      style={{
                        transition: 'transform 300ms cubic-bezier(0.23, 1, 0.32, 1)',
                        transform: isExpanded ? 'rotate(45deg)' : 'none',
                      }}
                      className="text-[22px] font-light text-muted shrink-0 pt-1"
                    >
                      +
                    </span>
                  </button>

                  {/* Expandable sub-items container using grid-template-rows for smooth composite animation */}
                  <div
                    id={`service-panel-${service.id}`}
                    style={{
                      display: 'grid',
                      gridTemplateRows: isExpanded ? '1fr' : '0fr',
                      transition: 'grid-template-rows 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms ease',
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden min-h-0">
                      <p className="mt-3 text-[14px] text-muted leading-[1.5]">
                        {service.description}
                      </p>
                      <ul className="mt-4 space-y-2 pb-2">
                        {service.subItems.map((item) => (
                          <li
                            key={item}
                            className="text-[14px] text-muted flex items-center gap-2.5"
                          >
                            <span className="w-1 h-1 rounded-full bg-text/40 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
