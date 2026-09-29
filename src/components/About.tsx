import { Container } from './Container'
import { TextReveal } from './TextReveal'

const facts: { key: string; value: string }[] = [
  { key: 'Location', value: 'Nigeria' },
  { key: 'Frontend', value: 'React, TypeScript, Tailwind CSS, Next.js' },
  { key: 'Backend', value: 'Node.js, Express, FastAPI, Python' },
  { key: 'Documents', value: 'docx, ReportLab, PyMuPDF, raw OOXML' },
  { key: 'Automation', value: 'n8n, Google Workspace APIs' },
  { key: 'Also', value: 'Manual QA, technical documentation' },
]

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-24 border-t border-rule py-14 sm:py-20 lg:py-24">
      <Container>
        <h2 className="scroll-reveal mb-8 sm:mb-12 text-2xl sm:text-[2rem] leading-[1.18] font-semibold tracking-[-0.03em]" id="about-title">
          About
        </h2>

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-24">
          <div className="max-w-[62ch] space-y-5 sm:space-y-6 font-read text-lg sm:text-xl leading-[1.62] sm:leading-[1.68] text-ink-2">
            <TextReveal
              text="I’m a frontend developer who also works across graphic design, automation, and content. I build responsive websites and interfaces, create graphics with Canva for brands and social media, and use automation tools to make repetitive tasks easier and more efficient."
            />
            <TextReveal
              text="I also write content and copy for websites, social media, campaigns, and other digital platforms. I enjoy working on projects where I can combine technical skills with creativity, whether that means building a website, creating a visual, writing copy, or finding a better way to get things done."
            />
          </div>

          <dl className="scroll-reveal border-t border-rule-firm">
            {facts.map((fact) => (
              <div
                key={fact.key}
                className="grid grid-cols-[minmax(0,6rem)_minmax(0,1fr)] sm:grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] gap-3 sm:gap-4 border-b border-rule py-3 sm:py-3.5 text-[0.875rem] sm:text-[0.9375rem] transition-colors hover:bg-accent-soft/20 px-1.5 sm:px-2 rounded-xs"
              >
                <dt className="font-medium text-ink-3">{fact.key}</dt>
                <dd className="text-ink font-mono text-[0.8125rem] sm:text-[0.9375rem]">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}