import { content } from '../data/content'
import { useSite } from '../lib/SiteContext'
import { MaskLines } from './site/Reveal'
import { ScrollWords } from './site/ScrollWords'
import { TextLink } from './site/TextLink'

export function AboutSection() {
  const site = useSite()

  return (
    <section id="about" className="py-28 md:py-40">
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-12 gap-y-10 px-6">
        <MaskLines lines={['About']} className="section-title col-span-12 md:col-span-4" />
        <div className="col-span-12 md:col-span-8">
          <ScrollWords text={content.about.previewParagraph} className="about-lead max-w-[42em] font-heading text-text" />
          <p className="mt-8 max-w-[46em] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55] text-muted">
            {content.about.fullStory[0]}
          </p>
          <div className="mt-8">
            <TextLink
              href="/about"
              arrow="→"
              onClick={(e) => {
                e.preventDefault()
                site.navigate('/about')
              }}
            >
              {content.about.linkText}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  )
}
