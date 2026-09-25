import type { Project } from '../types'

export const projects: Project[] = [
  {
    slug: 'cakes-n-pastries',
    title: "Cakes 'N' Pastries",
    practice: 'frontend',
    kind: 'Figma-to-code build',
    summary: 'Homepage for a restaurant ordering platform, built from a Figma design.',
    detail:
      'Converted the homepage from Figma to code by hand rather than through a plugin export, working alongside a senior developer. Scope was markup and styling; interactivity and state logic were handled by the senior developer.',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    link: { href: 'https://www.cakesnpastries.com.ng/', label: 'Visit live site' },
    images: [
      {
        src: '/work/cakes-n-pastries/homepage.jpg',
        alt: "Cakes 'N' Pastries homepage showing the meal category bar and a hero banner for ordering freshly prepared meals",
        caption: "Cakes 'N' Pastries — homepage",
        width: 1366,
        height: 635,
      },
    ],
  },
  {
    slug: 'smartcbt',
    title: 'SmartCBT',
    practice: 'frontend',
    kind: 'Figma-to-code build',
    summary: 'Homepage for a JAMB, WAEC and NECO exam-prep platform with a companion app.',
    detail:
      'Converted the homepage from Figma to code by hand, working alongside a senior developer. Scope was markup and styling; interactivity and state logic were handled by the senior developer.',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    link: { href: 'https://www.smartcbt.com.ng/', label: 'Visit live site' },
    images: [
      {
        src: '/work/smartcbt/homepage.jpg',
        alt: 'SmartCBT homepage for the JAMB, WAEC and NECO past-questions exam preparation platform',
        caption: 'SmartCBT — homepage',
        width: 1353,
        height: 632,
      },
    ],
  },
  {
    slug: 'facons',
    title: 'FACONS',
    practice: 'frontend',
    kind: 'Figma-to-code build',
    summary: 'Institutional homepage for a nursing college in Osun State, Nigeria.',
    detail:
      'Converted the homepage for Felix Adejumo College of Nursing Sciences from Figma to code by hand, working alongside a senior developer. Scope was markup and styling; interactivity and state logic were handled by the senior developer.',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    link: { href: 'https://www.facons.edu.ng/', label: 'Visit live site' },
    images: [
      {
        src: '/work/facons/homepage.jpg',
        alt: 'FACONS homepage for the Felix Adejumo College of Nursing Sciences admissions website',
        caption: 'FACONS — homepage',
        width: 1350,
        height: 633,
      },
    ],
  },
  {
    slug: 'topvision',
    title: 'TopVision',
    practice: 'frontend',
    kind: 'Ongoing maintenance',
    summary: 'A security hardware and smart-home e-commerce store, under continued upkeep.',
    detail:
      'Ongoing independent maintenance on a live production site: updates, bug fixes and content changes, distinct from a one-off build and carried as a continued responsibility.',
    tools: ['Site maintenance', 'Bug fixes', 'Content updates'],
    link: { href: 'https://www.topvision.ng/', label: 'Visit live site' },
    images: [
      {
        src: '/work/topvision/homepage.jpg',
        alt: 'TopVision homepage for the security hardware and smart-home e-commerce store',
        caption: 'TopVision — homepage',
        width: 1355,
        height: 632,
      },
    ],
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
    slug: 'cliques',
    title: 'Cliques',
    practice: 'graphics',
    kind: 'Ongoing client',
    summary: 'Editorial visual system and artist news graphics for a Nigerian entertainment and music blog.',
    detail:
      'Designed the template independently: a purple and dark editorial colour system, typography hierarchy and consistent logo placement, built as a reusable base rather than a one-off layout. Applied that system to artist news and milestone posts, including a streaming-milestone portrait treatment, a duotone stat callout, a swipeable New Music Friday round-up grid, and an event-announcement layout. Headline and caption copy was written independently rather than supplied by the client. Artist imagery was curated from Pinterest, so it is presented here as curated imagery rather than original photography.',
    tools: ['Canva', 'Visual system', 'Social carousels', 'Image curation', 'Copywriting'],
    images: [
      {
        src: '/work/cliques-graphics/post-1.jpg',
        alt: 'Cliques Instagram post marking an Asake streaming milestone, dark editorial portrait layout with a milestone tag',
        caption: 'Asake streaming milestone',
        width: 557,
        height: 553,
      },
      {
        src: '/work/cliques-graphics/post-2.jpg',
        alt: 'Cliques Instagram post marking a Tems 6 billion streams milestone with a duotone ghost-repeat effect and stat callout',
        caption: 'Tems 6 billion streams milestone',
        width: 445,
        height: 550,
      },
      {
        src: '/work/cliques-graphics/post-3.jpg',
        alt: 'Cliques New Music Friday round-up, a multi-artist grid layout designed as a swipeable carousel',
        caption: 'New Music Friday round-up',
        width: 441,
        height: 543,
      },
      {
        src: '/work/cliques-graphics/post-4.jpg',
        alt: 'Cliques Instagram post for Ayra Starr at the NFL London Games, full-bleed portrait with event details as a subhead',
        caption: 'Ayra Starr, NFL London Games',
        width: 443,
        height: 547,
      },
    ],
  },
  {
    slug: 'stemedurobotics',
    title: 'StemEduRobotics',
    practice: 'graphics',
    kind: 'Client work',
    summary: "Social media graphics for a children's robotics education brand.",
    detail:
      'An existing branded template (logo badge, headline typography, handle and website footer bar) applied and populated per post. Imagery mixed photography, stock images and AI-generated composites, with supporting icon graphics generated via AI prompt. Headline and caption copy was written independently rather than supplied by the client.',
    tools: ['Canva', 'AI image generation', 'Copywriting'],
    link: { href: 'https://www.instagram.com/stemedurobotics/', label: 'View on Instagram' },
    images: [
      {
        src: '/work/stemedurobotics/post-1.jpg',
        alt: 'StemEduRobotics Instagram post reading "While your students are studying, others are competing globally", photography-led layout with a supporting text panel',
        caption: 'While your students are studying, others are competing globally',
        width: 441,
        height: 550,
      },
      {
        src: '/work/stemedurobotics/post-2.jpg',
        alt: 'StemEduRobotics Instagram post asking "Are schools preparing students, or just training them to pass exams?", sticky-note style callout over a classroom photograph',
        caption: 'Are schools preparing students, or just training them to pass exams?',
        width: 441,
        height: 551,
      },
      {
        src: '/work/stemedurobotics/post-3.jpg',
        alt: 'StemEduRobotics Instagram post reading "A robot just beat a professional athlete", AI-generated composite with bold headline treatment',
        caption: 'A robot just beat a professional athlete',
        width: 442,
        height: 550,
      },
      {
        src: '/work/stemedurobotics/post-4.jpg',
        alt: 'StemEduRobotics Instagram post reading "AI can now train itself to beat humans", AI-generated composite in a dark moody colour treatment',
        caption: 'AI can now train itself to beat humans',
        width: 441,
        height: 548,
      },
    ],
  },
  {
    slug: 'ops-wash',
    title: 'OPS-WASH',
    practice: 'graphics',
    kind: 'Client work',
    summary: 'Awareness graphics for a private-sector water, sanitation and hygiene coordination body.',
    detail:
      'An existing branded template (logo, blue colour system, footer bar with social handles) applied and populated per post. Icon graphics were generated via AI prompt, with halftone photo effects applied in Canva. Headline and caption copy was written independently rather than supplied by the client.',
    tools: ['Canva', 'AI image generation', 'Copywriting'],
    link: { href: 'https://www.instagram.com/opswashofficial/', label: 'View on Instagram' },
    images: [
      {
        src: '/work/ops-wash/post-1.jpg',
        alt: 'OPS-WASH Instagram post reading "Did you know? 1 in 4 people worldwide don\u2019t have access to safe drinking water", icon-based infographic with a directional-arrow layout',
        caption: 'Did you know? 1 in 4 people worldwide don\u2019t have access to safe drinking water',
        width: 445,
        height: 553,
      },
      {
        src: '/work/ops-wash/post-2.jpg',
        alt: 'OPS-WASH Instagram post reading "Our communities need clean water", halftone-effect treatment on plastic-waste imagery with supporting callouts on disposal',
        caption: 'Our communities need clean water',
        width: 440,
        height: 551,
      },
      {
        src: '/work/ops-wash/post-3.jpg',
        alt: 'OPS-WASH Instagram post reading "Why money alone isn\u2019t solving the water crises", photograph-led design with a currency image and bold headline typography',
        caption: 'Why money alone isn\u2019t solving the water crises',
        width: 443,
        height: 550,
      },
    ],
  },
  {
    slug: 'coja-foods',
    title: 'Coja Foods',
    practice: 'graphics',
    kind: 'Client work',
    summary: 'Menu and promotional graphics for a home-cooked Nigerian food delivery service in Akure.',
    detail:
      'Designed the template independently and reused it across all four pieces: logo placement, colour system and footer bar style. Food photography was curated from Pinterest, so it is presented here as curated imagery rather than original photography. Headline and caption copy was written independently rather than supplied by the client.',
    tools: ['Canva', 'Visual system', 'Image curation', 'Copywriting'],
    images: [
      {
        src: '/work/coja-foods/post-1.jpg',
        alt: 'Coja Foods weekly food menu, a structured pricing table with colour-coded day headers',
        caption: 'Weekly food menu',
        width: 851,
        height: 1280,
      },
      {
        src: '/work/coja-foods/post-2.jpg',
        alt: 'Coja Foods "Wednesday Special" promotional flyer, a tiered pricing layout with circular price badges',
        caption: 'Wednesday Special promotional flyer',
        width: 1122,
        height: 1402,
      },
      {
        src: '/work/coja-foods/post-3.jpg',
        alt: 'Coja Foods Instagram post reading "Craving delicious, homemade Nigerian food?", asymmetric photo-grid layout with an order call-to-action',
        caption: 'Craving delicious, homemade Nigerian food?',
        width: 1024,
        height: 1280,
      },
      {
        src: '/work/coja-foods/post-4.jpg',
        alt: 'Coja Foods "Coming soon" teaser flyer, bold display typography with pill-shaped call-to-action tags',
        caption: 'Coming soon teaser flyer',
        width: 1026,
        height: 1280,
      },
    ],
  },
  {
    slug: 'nazirite',
    title: 'Birthing a Nazirite',
    practice: 'writing',
    kind: 'Book production',
    summary: 'A Christian parenting memoir typeset as a 6 by 9 trade paperback.',
    detail:
      'Designed the interior of this book, working on the typography, page layout, chapter headings, spacing, pagination, and overall structure. I also designed the cover for the second book, developing its visual direction and layout to fit the book’s subject and overall presentation.',
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
      "Ongoing caption work for education and WASH sector organisations, matched to each account's established voice.",
    tools: ['Copywriting', 'Social content'],
  },
  {
    slug: 'instagram-workflow',
    title: 'Instagram content automation',
    practice: 'automation',
    kind: 'Personal project',
    summary: 'A personal build against a mock organisation, demonstrating workflow automation capability rather than a client deliverable.',
    detail:
      'Automates weekly Instagram content creation and publishing, from data gathering through to human-approved posting. The chain runs on a schedule trigger, pulls organisation data from Google Sheets, processes it in a custom JavaScript node, fetches and parses Google Trends data via an HTTP request and an XML-to-JSON conversion, merges the two data sources, generates post content through an AI model with a JavaScript tool-calling node, generates an accompanying image, then routes the result to a human for an approval message and waits for a response before branching on the outcome. Built entirely on free-tier services, including Google Gemini’s free API for text generation and a free image generation model, to avoid paid API costs. Multiple successful executions were recorded during testing, including one completed run of 1 minute 5.6 seconds.',
    tools: ['n8n', 'Google Gemini', 'Google Sheets', 'Google Trends', 'AI image generation'],
    pipeline: {
      trigger: 'Schedule trigger (weekly cron)',
      steps: [
        'Ingest org data & Google Trends XML-to-JSON',
        'Gemini text model + tool-calling node',
        'AI image generation synthesis',
        'Human approval routing & review gate',
      ],
      output: 'Published Instagram post & status record',
    },
    metrics: 'Completed execution benchmark: 1m 5.6s with 0 API cost',
    images: [
      {
        src: '/work/instagram-automation/workflow.jpg',
        alt: 'n8n workflow canvas for the Instagram content automation project, showing the schedule trigger, data-gathering, AI generation and human-approval node chain',
        caption: 'Instagram content automation — n8n workflow canvas',
        width: 1280,
        height: 572,
      },
    ],
  },
  {
    slug: 'orchestyle-automation',
    title: 'Orchestyle order and invoice automation',
    practice: 'automation',
    kind: 'Client project',
    summary: 'A published, live automation that turns a customer order into an emailed invoice with no manual retyping.',
    detail:
      'Built for Orchestyle, a bead-making company. A customer submits an order through a form; the workflow copies an invoice template, populates it with the order details and generates a PDF, emails that invoice to the customer automatically, and logs the order as a new row in a spreadsheet so the vendor keeps a running record. The node chain runs from the form trigger through field mapping, a Google Drive file copy, a Google Docs update, a Google Drive download, a Gmail send, and a Google Sheets append. Execution history shows a small number of early errors during initial testing, resolved in later runs, followed by consistent successful executions. Currently published and in active, live use.',
    tools: ['n8n', 'Google Drive', 'Google Docs', 'Gmail', 'Google Sheets'],
    pipeline: {
      trigger: 'Customer order submission form',
      steps: [
        'Payload validation & field normalization',
        'Google Drive invoice template clone',
        'Google Docs dynamic PDF compilation',
        'Automated Gmail delivery to buyer',
      ],
      output: 'Delivered invoice PDF & Google Sheets audit log',
    },
    metrics: 'In active production use with zero manual invoicing overhead',
    images: [
      {
        src: '/work/orchestyle-automation/workflow.jpg',
        alt: 'n8n workflow canvas for the Orchestyle order and invoice automation, showing the form trigger through to the Gmail send and Sheets append nodes',
        caption: 'Orchestyle order and invoice automation — n8n workflow canvas',
        width: 1280,
        height: 604,
      },
    ],
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
    pipeline: {
      trigger: 'Real-world workplace simulation scenario',
      steps: [
        'Context synthesis (threads, files, data)',
        'Agent task execution & boundary testing',
        'State-based deterministic grading',
      ],
      output: 'Failure analysis & model benchmark report',
    },
    metrics: 'Deterministic end-state grading across edge failure modes',
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
    pipeline: {
      trigger: 'Disparate raw contact spreadsheets',
      steps: [
        'Deduplication & schema reconciliation',
        'Data model & relationship definition',
        'Automated Power BI dashboard refresh',
      ],
      output: 'Self-serve interactive reporting suite',
    },
    metrics: 'Eliminated manual export requests across team leadership',
  },
]

export function countByPractice(practiceId: string): number {
  return projects.filter((project) => project.practice === practiceId).length
}