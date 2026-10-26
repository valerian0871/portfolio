import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { findProject } from '../../lib/site'
import { useSite } from '../../lib/SiteContext'
import { easeOutStrong, springUI } from '../../lib/motion'

const SLUG = 'instagram-workflow'
const STEP_MS = 650

type Phase = 'idle' | 'running' | 'waiting' | 'done'

// The real Instagram pipeline from Work, run step by step. It stops at the
// human approval gate, as the production workflow does, and waits for you.
export function WorkflowDemo() {
  const site = useSite()
  const pipeline = findProject(SLUG)?.pipeline
  const nodes = pipeline ? [pipeline.trigger, ...pipeline.steps, pipeline.output] : []
  const gate = nodes.findIndex((n) => /approval/i.test(n))
  const retryFrom = Math.max(1, gate - 2)
  const [phase, setPhase] = useState<Phase>('idle')
  const [at, setAt] = useState(-1)
  const [log, setLog] = useState<string[]>([])
  const timer = useRef<number | undefined>(undefined)
  const started = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const stamp = () => `${((performance.now() - started.current) / 1000).toFixed(1).padStart(4, '0')}s`
  const write = (line: string) => setLog((l) => [...l.slice(-3), `${stamp()}  ${line}`])

  const advance = (from: number, to: number) => {
    setAt(from)
    write(nodes[from])
    if (from === to) {
      if (from === gate) {
        setPhase('waiting')
        write('Waiting for approval')
      } else {
        setPhase('done')
        write('Run complete')
      }
      return
    }
    timer.current = window.setTimeout(() => advance(from + 1, to), STEP_MS)
  }

  const run = () => {
    window.clearTimeout(timer.current)
    started.current = performance.now()
    setLog([])
    setPhase('running')
    advance(0, gate)
  }
  const approve = () => {
    write('Approved')
    setPhase('running')
    timer.current = window.setTimeout(() => advance(gate + 1, nodes.length - 1), STEP_MS / 2)
  }
  const reject = () => {
    write('Rejected, regenerating')
    setPhase('running')
    timer.current = window.setTimeout(() => advance(retryFrom, gate), STEP_MS / 2)
  }

  if (!pipeline) return null

  return (
    <div>
      <div className="demo-paper rounded-[10px] border border-line bg-bg p-4 sm:p-6">
        <ol className="relative">
          <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line" />
          <motion.span
            aria-hidden="true"
            className="absolute left-[7px] top-3 w-px origin-top bg-text"
            style={{ bottom: 12 }}
            animate={{ scaleY: at < 0 ? 0 : at / (nodes.length - 1) }}
            transition={{ duration: STEP_MS / 1000, ease: easeOutStrong }}
          />
          {nodes.map((node, i) => {
            const state = i < at || (i === at && phase === 'done') ? 'done' : i === at ? 'live' : 'idle'
            return (
              <li key={node} className="relative flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2 py-1.5">
                <motion.span
                  aria-hidden="true"
                  className={`flow-node relative z-[1] h-[15px] w-[15px] shrink-0 rounded-full border ${state !== 'idle' ? 'is-on' : ''}`}
                  animate={{ scale: state === 'live' ? [1, 1.35, 1] : 1 }}
                  transition={state === 'live' ? { duration: 0.5, ease: easeOutStrong } : springUI}
                />
                <span className={`flow-label min-w-0 flex-1 text-[14px] leading-[1.35] sm:text-[15px] ${state === 'idle' ? 'text-muted' : 'text-text'}`}>
                  {node}
                </span>
                {i === gate && phase === 'waiting' && (
                  <motion.span
                    className="flex w-full shrink-0 gap-1.5 pl-[31px] sm:ml-auto sm:w-auto sm:pl-0"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={springUI}
                  >
                    <button type="button" onClick={approve} className="demo-pill is-solid">
                      Approve
                    </button>
                    <button type="button" onClick={reject} className="demo-pill">
                      Reject
                    </button>
                  </motion.span>
                )}
              </li>
            )
          })}
        </ol>
        <div className="mt-4 min-h-[4.5rem] border-t border-line pt-3 font-mono text-[11px] leading-[1.6] tabular-nums text-muted" aria-live="polite">
          {log.length === 0 ? <span>Log is empty. Press Run.</span> : log.map((line, i) => <div key={`${line}-${i}`}>{line}</div>)}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={run}
          disabled={phase === 'running' || phase === 'waiting'}
          className="demo-pill is-solid"
        >
          {phase === 'done' ? 'Run again' : 'Run'}
        </button>
        <a
          href={`#work/${SLUG}`}
          onClick={(e) => {
            e.preventDefault()
            site.openCase(SLUG)
          }}
          className="font-mono text-[11px] text-muted underline-offset-4 hover:text-text hover:underline"
        >
          Simulated from Instagram Content Automation →
        </a>
      </div>
    </div>
  )
}
