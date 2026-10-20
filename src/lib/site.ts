import { content, type DisciplineId, type Project } from '../data/content'
import { practices } from '../data/practices'

/** Home-page sections, in page order. `null` active section means the hero. */
export const SECTION_IDS = ['work', 'services', 'about', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const SECTION_LABELS: Record<SectionId, string> = {
  work: 'Work',
  services: 'Services',
  about: 'About',
  contact: 'Contact',
}

/** Selected work rows, newest first, practices interleaved. The rest live on /work. */
const SELECTED_SLUGS = [
  'cakes-n-pastries',
  'nazirite',
  'instagram-workflow',
  'cliques',
  'facons',
  'orchestyle-automation',
  'smartcbt',
  'topvision',
]

export const selectedProjects: Project[] = SELECTED_SLUGS.map((slug) => {
  const project = content.projects.find((p) => p.slug === slug)
  if (!project) throw new Error(`Selected project "${slug}" is missing from content.ts`)
  return project
})

export function findProject(slug: string): Project | undefined {
  return content.projects.find((p) => p.slug === slug)
}

/** Services switcher: one tab per practice */
export interface PracticeTab {
  id: DisciplineId
  label: string
  note: string
  name: string
  description: string
  items: string[]
  tools: string[]
}

const SHORT_LABEL: Record<DisciplineId, string> = {
  frontend: 'Frontend',
  graphics: 'Graphics',
  writing: 'Writing',
  automation: 'Automation',
}

export const practiceTabs: PracticeTab[] = content.services.map((service) => {
  const practice = practices.find((p) => p.id === service.id)
  const tools = Array.from(
    new Set(content.projects.filter((p) => p.discipline === service.id).flatMap((p) => p.tools)),
  )
  return {
    id: service.id,
    label: SHORT_LABEL[service.id],
    note: practice?.note ?? '',
    name: service.name,
    description: service.description,
    items: service.subItems,
    tools,
  }
})

/** Contact actions, shared by the contact island, the mobile list and the palette */
export type PaletteAction =
  | { kind: 'copy'; value: string }
  | { kind: 'open'; href: string }
  | { kind: 'section'; id: SectionId | 'top' }

export interface PaletteItem {
  id: string
  label: string
  hint: string
  keywords: string
  group: 'contact' | 'section'
  action: PaletteAction
}

const github = content.profile.socials.find((s) => s.label === 'GitHub')
const linkedin = content.profile.socials.find((s) => s.label === 'LinkedIn')

export const contactItems: PaletteItem[] = [
  {
    id: 'email',
    label: 'Copy email',
    hint: content.contact.email,
    keywords: 'mail contact address',
    group: 'contact',
    action: { kind: 'copy', value: content.contact.email },
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    hint: content.contact.whatsapp.formatted,
    keywords: 'chat message phone call',
    group: 'contact',
    action: { kind: 'open', href: content.contact.whatsapp.href },
  },
  ...(github
    ? [{
        id: 'github',
        label: 'GitHub',
        hint: github.href.replace('https://github.com/', ''),
        keywords: 'code repositories source',
        group: 'contact' as const,
        action: { kind: 'open' as const, href: github.href },
      }]
    : []),
  ...(linkedin
    ? [{
        id: 'linkedin',
        label: 'LinkedIn',
        hint: linkedin.href.replace('https://linkedin.com/in/', ''),
        keywords: 'profile career cv',
        group: 'contact' as const,
        action: { kind: 'open' as const, href: linkedin.href },
      }]
    : []),
]

export const sectionItems: PaletteItem[] = [
  ...SECTION_IDS.map((id) => ({
    id: `go-${id}`,
    label: SECTION_LABELS[id],
    hint: 'Section',
    keywords: `go jump scroll ${id}`,
    group: 'section' as const,
    action: { kind: 'section' as const, id },
  })),
  {
    id: 'go-top',
    label: 'Back to top',
    hint: 'Section',
    keywords: 'home hero start',
    group: 'section',
    action: { kind: 'section', id: 'top' },
  },
]

export function filterItems(items: PaletteItem[], query: string): PaletteItem[] {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) =>
    `${item.label} ${item.hint} ${item.keywords}`.toLowerCase().includes(q),
  )
}

export const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)
