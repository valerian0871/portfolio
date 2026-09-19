export type PracticeId =
  | 'frontend'
  | 'graphics'
  | 'writing'
  | 'automation'
  | 'email'

export type FilterId = PracticeId | 'all'

export interface Practice {
  id: PracticeId
  label: string
  note: string
}

export interface ProjectImage {
  /** Path from the site root, e.g. "/work/writeai/editor.jpg" */
  src: string
  /** Describe what the image shows. Never leave this empty. */
  alt: string
  /** Optional line shown under the image in the lightbox. */
  caption?: string
  /** Real pixel dimensions. Required, so the browser reserves space and the page does not jump. */
  width: number
  height: number
}

export interface ProjectLink {
  href: string
  label: string
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
}

export interface Profile {
  name: string
  role: string
  location: string
  email?: string
  linkedin?: string
  github?: string
}