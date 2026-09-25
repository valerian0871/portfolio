export type PracticeId =
  | 'frontend'
  | 'graphics'
  | 'writing'
  | 'automation'

export type FilterId = PracticeId | 'all'

export interface Practice {
  id: PracticeId
  label: string
  note: string
}

export interface ProjectImage {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export interface ProjectLink {
  href: string
  label: string
}

export interface ProjectPipeline {
  trigger: string
  steps: string[]
  output: string
}

export interface Project {
  slug: string
  title: string
  practice: PracticeId
  kind: string
  summary: string
  detail: string
  tools: string[]
  link?: ProjectLink
  images?: ProjectImage[]
  pipeline?: ProjectPipeline
  metrics?: string
}

export interface Profile {
  name: string
  role: string
  location: string
  email?: string
  linkedin?: string
  github?: string
}