import type { Project } from '../types'

/**
 * One object per project. Order here is the order on the page.
 *
 * To add pictures to a project, drop the files into public/work/<slug>/ and
 * add an `images` array. See the "Adding pictures" part of the guide.
 */
export const projects: Project[] = [
  {
    slug: 'writeai',
    title: 'WriteAI',
    practice: 'frontend',
    kind: 'Independent product',
    summary: 'An AI writing tool built as a full product rather than a demo.',
    detail:
      'Next.js front end with authentication, subscription billing and a shared component library. Built specifically to find where an AI product gets difficult: session state, usage limits and the payment edge cases that never appear in a tutorial.',
    tools: ['Next.js', 'React', 'Supabase', 'Clerk', 'Stripe', 'shadcn/ui'],
  },
  {
    slug: 'orchestyle',
    title: 'Orchestyle',
    practice: 'frontend',
    kind: 'Ongoing role',
    summary: 'Frontend work on a live product, inside an existing team.',
    detail:
      'Iterative interface improvements shipped against an established codebase and design direction, working to the team review process rather than around it.',
    tools: ['React', 'JavaScript', 'Tailwind CSS'],
  },
  {
    slug: 'gitcast-ocr',
    title: 'Gitcast OCR confidence',
    practice: 'frontend',
    kind: 'Open source',
    summary: 'First open source contribution. OCR was failing on dark editor themes.',
    detail:
      'Tesseract loses confidence reading light text on a dark background, which broke transcription for anyone using a dark theme. The contribution samples pixel brightness and inverts the image before OCR runs, recovering accuracy without changing anything for light-theme users.',
    tools: ['Python', 'Tesseract'],
  },
  {
    slug: 'resume-analyser',
    title: 'Resume analyser',
    practice: 'frontend',
    kind: 'Independent build',
    summary: 'A tool that reads a CV against a target role and reports the gaps.',
    detail:
      'Built while moving from tutorial work into full-stack projects, with attention to how model output is parsed and displayed when it returns in an unexpected shape.',
    tools: ['React', 'Python', 'FastAPI'],
  },
  {
    slug: 'cbt-platform',
    title: 'CBT platform',
    practice: 'frontend',
    kind: 'Independent build',
    summary: 'A computer-based testing interface for practice examinations.',
    detail:
      'Covers question delivery and the state handling that timed assessments require.',
    tools: ['React', 'Node.js', 'Express'],
  },
  {
    slug: 'ecommerce-interface',
    title: 'E-commerce interface',
    practice: 'frontend',
    kind: 'Independent build',
    summary: 'A storefront interface built to production layout patterns.',
    detail:
      'Catalogue, product detail and cart views, built to practise the layout problems that only appear at real content volumes.',
    tools: ['React', 'Tailwind CSS'],
  },
  {
    slug: 'cliques',
    title: 'Cliques',
    practice: 'graphics',
    kind: 'Ongoing client',
    summary: 'Carousel design for a Nigerian entertainment and music blog.',
    detail:
      'Worked to a defined visual system: void charcoal and warm lavender, Clash Display for headlines and Satoshi for body. Image briefs were written alongside the layouts so every post lands on-system rather than being corrected afterwards.',
    tools: ['Visual system', 'Social carousels', 'Image direction'],
  },
  {
    slug: 'jesus-house',
    title: 'Jesus House Intercessory Mission',
    practice: 'graphics',
    kind: 'Recurring deliverable',
    summary: 'A monthly welcome flier, rebuilt to be repeatable.',
    detail:
      'Recreated an existing flier design as a process rather than a one-off file, so the photo, text, logo and contact block can be swapped each month without the layout drifting.',
    tools: ['Layout design', 'Image generation'],
  },
  {
    slug: 'the-amplified',
    title: 'The Amplified',
    practice: 'graphics',
    kind: 'Brand application',
    summary: 'A minimalist identity applied across a ministry administrative set.',
    detail:
      'Black and orange identity carried through a 31-branch pastoral visit schedule, official correspondence, a services log and the 2026 services calendar, so documents produced by different people still read as one organisation.',
    tools: ['Brand system', 'Document design'],
  },
  {
    slug: 'nazirite',
    title: 'Birthing a Nazirite',
    practice: 'writing',
    kind: 'Book production',
    summary: 'A Christian parenting memoir typeset as a 6 by 9 trade paperback.',
    detail:
      'Garamond body with Monotype Corsiva headings, gold ornamental dividers and designed chapter openers. The harder half was holding pagination steady across a full manuscript while the text was still being edited.',
    tools: ['Node.js', 'docx', 'Python', 'SVG ornaments'],
  },
  {
    slug: 'order-of-service',
    title: 'Commemorative order of service',
    practice: 'writing',
    kind: 'Commissioned',
    summary: 'A funeral order of service, typeset and generated programmatically.',
    detail:
      'Built in Node with the docx library, with ornaments generated as SVG in Python so the layout held across every page. Produced to a short deadline, which is the reason the whole thing was generated rather than hand-set.',
    tools: ['Node.js', 'docx', 'Python'],
  },
  {
    slug: 'postgraduate-editing',
    title: 'Postgraduate editing',
    practice: 'writing',
    kind: 'Academic',
    summary: 'Editing and formatting for doctoral research.',
    detail:
      'Applied supervisor corrections to a research proposal and reduced it from 77 pages to 59 without cutting content, added literature to a thesis chapter, and ran similarity review with citation markers written directly into the document XML where the editor would not hold them.',
    tools: ['OOXML', 'Turnitin', 'Substantive editing'],
  },
  {
    slug: 'career-materials',
    title: 'Career materials',
    practice: 'writing',
    kind: 'Client work',
    summary: 'CVs, cover letters and LinkedIn profiles written to a named target role.',
    detail:
      'Materials tailored for roles across customer success, social media management, AI automation and annotation work, written from the posting rather than from a template.',
    tools: ['CV writing', 'Cover letters', 'LinkedIn'],
  },
  {
    slug: 'social-captions',
    title: 'Social captions',
    practice: 'writing',
    kind: 'Ongoing',
    summary: 'Caption and content writing for organisational accounts.',
    detail:
      'Ongoing caption work for education and WASH sector organisations, matched to each account established voice.',
    tools: ['Copywriting', 'Social content'],
  },
  {
    slug: 'instagram-workflow',
    title: 'Instagram content workflow',
    practice: 'automation',
    kind: 'Client build',
    summary: 'An n8n workflow that ends manual weekly posting.',
    detail:
      'Pulls from the organisation own information alongside current trending topics, drafts the post, routes it to a person for approval, then publishes on schedule. Nothing goes out without a human seeing it first, which was the condition for the client agreeing to it at all.',
    tools: ['n8n', 'AI generation', 'Instagram Graph API'],
  },
  {
    slug: 'order-to-invoice',
    title: 'Order to invoice',
    practice: 'automation',
    kind: 'Client build',
    summary: 'Order form to delivered invoice, with nobody retyping anything.',
    detail:
      'An n8n pipeline for a jewellery business: form submission through to a generated document, PDF conversion, email delivery and a logged row in Sheets. Replaced a process that previously ran across three separate tools by hand.',
    tools: ['n8n', 'Google Workspace', 'Gmail', 'Sheets'],
  },
  {
    slug: 'agent-world-building',
    title: 'World building for AI agents',
    practice: 'automation',
    kind: 'Contract',
    summary: 'Building simulated work environments to find where AI agents fail.',
    detail:
      'Recreating real work situations, with their emails, spreadsheets and message history, inside a simulation platform, then setting a task an agent ought to complete. A task only counts if the agent fails it and the failure can be graded from the end state alone.',
    tools: ['Task design', 'Evaluation', 'Simulated environments'],
  },
  {
    slug: 'membership-data',
    title: 'Membership data and reporting',
    practice: 'automation',
    kind: 'Data work',
    summary: 'Contact data cleaning and Power BI onboarding for a foundation.',
    detail:
      'Cleaned and reconciled a membership contact list, then set up reporting so the team could read their own numbers without requesting an export each time.',
    tools: ['Data cleaning', 'Power BI'],
  },
  {
    slug: 'email-marketing',
    title: 'Email marketing practice',
    practice: 'email',
    kind: 'In development',
    summary: 'Being built now. No shipped client campaign yet.',
    detail:
      'Working through list segmentation, automation flows, subject line and body copy, and measurement that goes past open rates. This entry exists so the list is accurate, and it will be replaced by a real campaign with real numbers when there is one.',
    tools: ['Segmentation', 'Automation flows', 'Copywriting'],
  },
]

export function countByPractice(practiceId: string): number {
  return projects.filter((project) => project.practice === practiceId).length
}