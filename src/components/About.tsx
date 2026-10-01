import { Container } from './Container'
import { TextReveal } from './TextReveal'
import { Section3DBackground } from './canvas/Section3DBackground'

const facts: { key: string; value: string }[] = [
  { key: 'Location', value: 'Nigeria · Remote Global' },
  { key: 'Frontend', value: 'React, TypeScript, Tailwind CSS, Next.js' },
  { key: 'Backend', value: 'Node.js, Express, FastAPI, Python' },
  { key: 'Documents', value: 'docx, ReportLab, PyMuPDF, raw OOXML' },
  { key: 'Automation', value: 'n8n, Google Workspace APIs' },
  { key: 'Also', value: 'Manual QA, technical documentation' },
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden scroll-mt-24 border-t border-rule py-14 sm:py-20 lg:py-28">
      {/* 3D Floating Polyhedra Geometry Background */}
      <Section3DBackground variant="about-polyhedra" opacity={0.45} />
      <Section3DBackground variant="about-polyhedra" opacity={0.26} />

      <Container className="relative z-10">
        <h2 className="scroll-reveal mb-8 sm:mb-12 text-2xl sm:text-[2rem] leading-[1.18] font-semibold tracking-[-0.03em]" id="about-title">
          About
        </h2>

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
          <div className="max-w-[62ch] space-y-5 sm:space-y-6 font-read text-lg sm:text-xl leading-[1.62] sm:leading-[1.68] text-ink-2">
            <TextReveal
              text="I’m a frontend developer who also works across graphic design, automation, and content. I build responsive websites and interfaces, create graphics with Canva for brands and social media, and use automation tools to make repetitive tasks easier and more efficient."
            />
            <TextReveal
              text="I also write content and copy for websites, social media, campaigns, and other digital platforms. I enjoy working on projects where I can combine technical skills with creativity, whether that means building a website, creating a visual, writing copy, or finding a better way to get things done."
            />
          </div>

          {/* Minimalist Specifications Panel */}
          <div className="scroll-reveal rounded-sm border border-rule-firm bg-paper/85 p-5 sm:p-6 backdrop-blur-sm shadow-xs">
            <div className="mb-3 flex items-center justify-between border-b border-rule pb-3 font-mono text-[0.6875rem] uppercase tracking-wider text-ink-3">
              <span>Technical Specifications</span>
              <span className="flex items-center gap-1.5 text-accent font-semibold">
                <span className="size-1.5 rounded-full bg-accent" />
                Active Stack
              </span>
            </div>

            <dl className="divide-y divide-rule/70">
              {facts.map((fact) => (
                <div
                  key={fact.key}
                  className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-3 py-3 text-[0.875rem] sm:text-[0.9375rem] transition-colors hover:bg-accent-soft/20 px-1.5 rounded-xs"
                >
                  <dt className="font-medium text-ink-3">{fact.key}</dt>
                  <dd className="text-ink font-mono text-[0.8125rem] sm:text-[0.875rem]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  )
}