import type { DisciplineId } from '../../data/content'
import { EditDemo } from './EditDemo'
import { GridDemo } from './GridDemo'
import { ResizeDemo } from './ResizeDemo'
import { WorkflowDemo } from './WorkflowDemo'

const TITLES: Record<DisciplineId, string> = {
  frontend: 'Resize a layout',
  graphics: 'Set a post on the grid',
  writing: 'Run an edit pass',
  automation: 'Run the workflow',
}

export function PracticeDemo({ practice }: { practice: DisciplineId }) {
  return (
    <section aria-label={`Try it: ${TITLES[practice]}`} className="demo">
      <h3 className="mb-4 text-[15px] font-medium tracking-[-0.01em] text-text">Try it: {TITLES[practice]}</h3>
      {practice === 'frontend' && <ResizeDemo />}
      {practice === 'graphics' && <GridDemo />}
      {practice === 'writing' && <EditDemo />}
      {practice === 'automation' && <WorkflowDemo />}
    </section>
  )
}
