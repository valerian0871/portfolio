import { Container } from './Container'
import { PracticeIndex } from './PracticeIndex'
import type { PracticeId } from '../types'

interface HeroProps {
  onSelectPractice: (id: PracticeId) => void
}

export function Hero({ onSelectPractice }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="pt-24 pb-16">
      <Container>
        <h1
          id="hero-title"
          className="enter max-w-[16ch] text-display leading-[1.06] font-semibold tracking-[-0.035em]"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          Frontend developer working across five practices.
        </h1>

        <p
          className="enter mt-8 max-w-[58ch] font-read text-xl leading-[1.68] text-ink-2"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          I build interfaces in React and Node, then handle the design, writing and
          automation those projects usually turn out to need. Most clients arrive with
          one problem and leave having solved three.
        </p>

        <p
          className="enter mt-6 text-[0.9375rem] text-ink-3"
          style={{ '--i': 5 } as React.CSSProperties}
        >
          Based in Nigeria. Currently on the product team at Orchestyle.
        </p>

        <PracticeIndex onSelect={onSelectPractice} />
      </Container>
    </section>
  )
}