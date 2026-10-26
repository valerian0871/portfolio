import { useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { easeOutStrong, springUI } from '../../lib/motion'

type Kind = 'keep' | 'del' | 'ins'
type Stage = 'draft' | 'marked' | 'clean'

const SEGMENTS: [Kind, string][] = [
  ['del', 'We are dedicated to providing high-quality cakes that are freshly'],
  ['ins', 'Cakes'],
  ['keep', 'baked'],
  ['ins', 'fresh'],
  ['keep', 'for'],
  ['del', 'each and'],
  ['keep', 'every'],
  ['del', 'one of our valued customers.'],
  ['ins', 'order.'],
]

const TOKENS = SEGMENTS.flatMap(([kind, text], s) => text.split(' ').map((word, w) => ({ kind, word, id: `${s}-${w}` })))
const count = (stage: Stage) =>
  TOKENS.filter((t) => (stage === 'draft' ? t.kind !== 'ins' : stage === 'clean' ? t.kind !== 'del' : true)).length

const STAGES: { id: Stage; label: string }[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'marked', label: 'Marked up' },
  { id: 'clean', label: 'Clean' },
]

// One sentence through an edit pass. Words reflow as cuts and insertions land,
// so the reader sees where the length went.
export function EditDemo() {
  const [stage, setStage] = useState<Stage>('draft')

  return (
    <div>
      <div className="demo-paper rounded-[10px] border border-line bg-bg p-5 sm:p-7">
        <LayoutGroup>
          <p className="edit-copy font-heading text-text" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              {TOKENS.filter((t) => (stage === 'draft' ? t.kind !== 'ins' : stage === 'clean' ? t.kind !== 'del' : true)).map(
                (t, i) => (
                  <motion.span
                    key={t.id}
                    layout="position"
                    className={`edit-word relative mr-[0.26em] inline-block ${stage === 'marked' ? `is-${t.kind}` : ''}`}
                    initial={{ opacity: 0, y: '-0.4em' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                    transition={{ ...springUI, delay: stage === 'marked' ? Math.min(i, 20) * 0.012 : 0 }}
                  >
                    {t.word}
                    {stage === 'marked' && t.kind === 'del' && (
                      <motion.span
                        aria-hidden="true"
                        className="edit-strike absolute left-0 right-0 top-[55%] h-[2px] origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.02, ease: easeOutStrong }}
                      />
                    )}
                  </motion.span>
                ),
              )}
            </AnimatePresence>
          </p>
        </LayoutGroup>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="demo-steps flex rounded-full border border-line p-0.5" role="group" aria-label="Edit stage">
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={stage === s.id}
              onClick={() => setStage(s.id)}
              className="demo-step relative rounded-full px-3 py-1.5 text-[13px]"
            >
              {stage === s.id && (
                <motion.span layoutId="edit-stage" className="absolute inset-0 rounded-full bg-text" transition={springUI} />
              )}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] tabular-nums text-muted">
          <span className="text-text">{count(stage)}</span> words · example edit, not client copy
        </span>
      </div>
    </div>
  )
}
