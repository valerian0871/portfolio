import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import { content } from '../data/content'
import { useSite } from '../lib/SiteContext'
import { springPress, springUI } from '../lib/motion'
import { isMac } from '../lib/site'

const WORDMARK = content.profile.name.split(' ')[0]

export function Footer() {
  const site = useSite()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.35 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '0%'])
  const { setFooterInView } = site
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setFooterInView(inView)
    if (inView) setRevealed(true)
  }, [inView, setFooterInView])

  return (
    <footer ref={ref} id="footer" aria-label="Footer" className="site-footer relative h-svh min-h-[560px]">
      <div className="fixed bottom-0 left-0 h-svh min-h-[560px] w-full overflow-hidden bg-surface text-text">
        <motion.div style={{ y }} className="flex h-full flex-col justify-between px-5 pt-6 md:px-10 md:pt-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line pb-5 font-mono text-[12px] text-muted">
            <span>
              © {new Date().getFullYear()}<span className="hidden sm:inline"> {content.profile.name}</span>
            </span>
            <motion.button
              type="button"
              aria-label="Open command palette"
              onClick={() => site.openPalette()}
              whileTap={{ scale: 0.96 }}
              transition={springPress}
              className="footer-kbd rounded-xl border bg-bg px-4 py-2 font-mono text-[12px] text-text"
            >
              {isMac ? '⌘K' : 'Ctrl K'}
            </motion.button>
            <div className="flex items-center justify-end">
              <button
                type="button"
                aria-label="Back to top"
                onClick={() => site.scrollToSection('top')}
                className="footer-top group grid h-11 w-11 place-items-center rounded-full border text-[15px] text-text"
              >
                <span aria-hidden="true" className="footer-top-arrow inline-block">↑</span>
              </button>
            </div>
          </div>

          <div className="footer-wordmark translate-y-[8%] font-heading text-text" aria-hidden="true">
            {Array.from(WORDMARK).map((letter, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '100%' }}
                  animate={{ y: revealed ? '0%' : '100%' }}
                  transition={{ ...springUI, delay: i * 0.04 }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
