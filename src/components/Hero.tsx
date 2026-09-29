import { Container } from './Container'
import { PracticeIndex } from './PracticeIndex'
import { TextReveal } from './TextReveal'
import { Section3DBackground } from './canvas/Section3DBackground'
import type { PracticeId } from '../types'

interface HeroProps {
  onSelectPractice: (id: PracticeId) => void
}

export function Hero({ onSelectPractice }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden py-14 sm:py-20 lg:py-28">
      {/* 3D Geometric Torus Lattice Background */}
      <Section3DBackground variant="hero-lattice" opacity={0.55} />

      <Container className="relative z-10">
        {/* Availability status badge */}
        <div
          className="enter mb-6 inline-flex items-center gap-2 rounded-full border border-rule-firm bg-paper/85 px-3.5 py-1 text-xs font-mono text-ink-2 shadow-xs backdrop-blur-sm"
          style={{ '--i': 0 } as React.CSSProperties}
        >
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available for frontend & engineering contracts</span>
        </div>

        <h1
          id="hero-title"
          className="enter max-w-[16ch] text-display leading-[1.06] font-semibold tracking-[-0.035em]"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          Frontend developer working across four practices.
        </h1>

        <TextReveal
          as="p"
          trigger="mount"
          className="mt-6 sm:mt-8 max-w-[58ch] font-read text-lg sm:text-xl leading-[1.62] sm:leading-[1.68] text-ink-2"
          text="I build interfaces in React and Node, then handle the design, writing and automation those projects usually turn out to need. Most clients arrive with one problem and leave having solved three."
        />

        <div
          className="enter mt-6 flex items-center gap-3 text-[0.875rem] font-mono text-ink-3"
          style={{ '--i': 5 } as React.CSSProperties}
        >
          <span>Based in Nigeria</span>
          <span>·</span>
          <span>Open to global remote roles</span>
        </div>

        <PracticeIndex onSelect={onSelectPractice} />
      </Container>
    </section>
  )
}