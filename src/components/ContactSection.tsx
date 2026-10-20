import { useSite } from '../lib/SiteContext'
import { contactItems, isMac } from '../lib/site'
import { MaskLines } from './site/Reveal'

/**
 * Contact. On desktop the actions live in the bottom island (which doubles
 * as the command palette); on mobile they render inline.
 */
export function ContactSection() {
  const site = useSite()

  return (
    <section id="contact" className="min-h-[120svh] py-28 md:py-40">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <MaskLines lines={['Have a project', 'in mind?']} className="contact-title" />
        <p className="mt-8 max-w-[40ch] text-[17px] leading-[1.55] text-muted">
          WhatsApp is the fastest way to reach me. Email works too.
        </p>
        <p className="mt-3 hidden font-mono text-[12px] text-muted md:block">
          {isMac ? '⌘K' : 'Ctrl K'} opens the command palette from anywhere on the page.
        </p>

        <ul className="mt-10 border-b border-line md:hidden">
          {contactItems.map((item) => (
            <li key={item.id} className="border-t border-line">
              <button
                type="button"
                onClick={() => site.runItem(item)}
                className="flex h-14 w-full items-center justify-between gap-4 text-left text-[17px]"
              >
                <span>{item.label}</span>
                <span className="truncate font-mono text-[12px] text-muted">{item.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
