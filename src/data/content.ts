export interface ProjectImage {
  src: string
  alt: string
  caption: string
  width?: number
  height?: number
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

export type DisciplineId =
  | 'frontend'
  | 'graphics'
  | 'writing'
  | 'automation'
  | 'email-marketing'

export interface Project {
  slug: string
  title: string
  discipline: DisciplineId
  disciplineLabel: string
  kind: string
  summary: string
  detail: string
  tools: string[]
  link?: ProjectLink
  images: ProjectImage[]
  pipeline?: ProjectPipeline
  metrics?: string
}

export interface DisciplineService {
  id: DisciplineId
  index: string
  name: string
  description: string
  subItems: string[]
}

export interface SocialLink {
  label: string
  href: string
}

export interface SiteContent {
  meta: {
    title: string
    description: string
    url: string
    ogImage: string
  }
  profile: {
    name: string
    role: string
    location: string
    email: string
    availability: string
    socials: SocialLink[]
  }
  navigation: {
    links: { label: string; href: string }[]
    cta: { label: string; href: string }
  }
  hero: {
    label: string
    headline: string
    cta: { label: string; href: string }
  }
  services: DisciplineService[]
  about: {
    previewParagraph: string
    fullStory: string[]
    principles: { title: string; body: string }[]
    linkText: string
  }
  contact: {
    displayStatement: string
    cta: { label: string; href: string }
    email: string
  }
  footer: {
    legal: string
  }
  projects: Project[]
}

export const content: SiteContent = {
  meta: {
    title: 'Prosper Kayode — Frontend Developer & Multi-Disciplinary Builder',
    description:
      'Minimalist, high-craft portfolio of Prosper Kayode covering frontend development, graphic design, content writing, AI automation, and email marketing.',
    url: 'https://prosperkayode.vercel.app',
    ogImage: 'https://prosperkayode.vercel.app/apple-touch-icon.png',
  },

  profile: {
    name: 'Prosper Kayode',
    role: 'Frontend Developer & Multi-Disciplinary Builder',
    location: 'Nigeria',
    email: 'kayodeprosper0987@gmail.com',
    availability: 'Available for freelance engagements and full-time engineering roles',
    socials: [
      { label: 'GitHub', href: 'https://github.com/valerian0871' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/prosper-kayode' },
    ],
  },

  navigation: {
    links: [
      { label: 'Work', href: '/#work' },
      { label: 'Services', href: '/#services' },
      { label: 'About', href: '/#about' },
      { label: 'Contact', href: '/#contact' },
    ],
    cta: {
      label: 'Get in touch',
      href: '#contact',
    },
  },

  hero: {
    label: 'Frontend Development · Graphics Design · Content Writing · AI Automation · Email Marketing',
    // 16 words stating what I do and for whom (within 12 to 18 words rule)
    headline: 'Building high-craft frontend interfaces, editorial systems, and automated workflows for ambitious digital products and teams.',
    cta: {
      label: 'Explore selected work',
      href: '#work',
    },
  },

  services: [
    {
      id: 'frontend',
      index: '01',
      name: 'Frontend Development',
      description:
        'Production web applications engineered with React, Next.js, and TypeScript, built with strict attention to performance, semantic markup, and fluid interaction physics.',
      subItems: [
        'Component architecture and scalable design systems',
        'Handcrafted Figma-to-code implementations',
        'Web performance and Core Web Vitals optimization',
        'Responsive layout engineering and fluid transitions',
      ],
    },
    {
      id: 'graphics',
      index: '02',
      name: 'Graphics Design',
      description:
        'Visual identity systems and editorial graphics built for clarity, brand cohesion, and lasting memorability across digital and print touchpoints.',
      subItems: [
        'Editorial templates and social media visual systems',
        'Promotional flyers, menus, and campaign collateral',
        'Visual art direction and typography hierarchy',
        'Brand asset kits and production-ready exports',
      ],
    },
    {
      id: 'writing',
      index: '03',
      name: 'Content Writing and Copywriting',
      description:
        'Grounded, articulate writing spanning publication typesetting, academic research editing, technical documentation, and conversion-focused copy.',
      subItems: [
        'Book production, interior formatting, and ornamental typesetting',
        'Academic proposals, literature reviews, and thesis editing',
        'Technical documentation, case studies, and essays',
        'Role-targeted career documentation and editorial messaging',
      ],
    },
    {
      id: 'automation',
      index: '04',
      name: 'AI Automation',
      description:
        'Deterministic workflow automation and intelligent agent pipelines that connect business software, eliminate manual overhead, and enforce reliable data operations.',
      subItems: [
        'n8n workflow architecture and custom webhook integrations',
        'LLM tool calling, structured generation, and evaluation harness',
        'Automated document, invoice, and media generation pipelines',
        'Data reconciliation, schema validation, and reporting syncs',
      ],
    },
    {
      id: 'email-marketing',
      index: '05',
      name: 'Email Marketing',
      description:
        'Strategic lifecycle email sequences, high-deliverability template development, and automated customer nurture workflows designed to drive engagement.',
      subItems: [
        'Automated onboarding, retention, and re-engagement flows',
        'Responsive cross-client HTML email template development',
        'Subscriber list hygiene, segmentation, and deliverability monitoring',
        'Campaign performance analytics and conversion tracking',
      ],
    },
  ],

  about: {
    previewParagraph:
      'I am an independent developer and designer based in Nigeria, operating across frontend engineering, graphic design, writing, and automation. I work directly with founders, teams, and organisations to ship durable software and cohesive visual systems.',
    fullStory: [
      'My work bridges technical engineering and graphic disciplines. Rather than treating code, typography, and automation as disconnected skills, I combine them into unified digital products where design precision and systems architecture reinforce each other.',
      'In frontend engineering, I focus on predictable state architecture, semantic accessibility, and motion that feels physical and intentional. In visual design and writing, I emphasize clarity and restraint, avoiding superfluous decoration in favor of strong typographic hierarchy and clean execution.',
      'Through AI automation, I construct deterministic pipelines that remove repetitive operational bottlenecks for businesses, ensuring that technology serves real human needs with speed and dependability.',
    ],
    principles: [
      {
        title: 'Minimalism with substance',
        body: 'Every line, margin, and interaction must justify its presence. Unnecessary ornament is removed to let the core content and function lead.',
      },
      {
        title: 'Craft in unseen details',
        body: 'Real quality lives in keyboard focus states, layout stability, tactile press response, and predictable performance under constrained conditions.',
      },
      {
        title: 'End-to-end ownership',
        body: 'From conceptual layout and copywriting to production deployment and workflow automation, I deliver fully realized solutions without handoff friction.',
      },
    ],
    linkText: 'Read full background',
  },

  contact: {
    displayStatement: 'Have a project in mind or looking to collaborate? Let us build something exceptional together.',
    cta: {
      label: 'Send an email',
      href: 'mailto:kayodeprosper0987@gmail.com',
    },
    email: 'kayodeprosper0987@gmail.com',
  },

  footer: {
    legal: '© 2026 Prosper Kayode. All rights reserved.',
  },

  projects: [
    {
      slug: 'cakes-n-pastries',
      title: "Cakes 'N' Pastries",
      discipline: 'frontend',
      disciplineLabel: 'Frontend Development',
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
      slug: 'cliques',
      title: 'Cliques',
      discipline: 'graphics',
      disciplineLabel: 'Graphics Design',
      kind: 'Ongoing client',
      summary: 'Editorial visual system and artist news graphics for a Nigerian entertainment and music blog.',
      detail:
        'Designed the template independently: an editorial colour system, typography hierarchy and consistent logo placement, built as a reusable base. Applied that system to artist news and milestone posts, including streaming-milestone treatments, duotone stat callouts, and carousel round-ups. Headline and caption copy was written independently.',
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
      slug: 'nazirite',
      title: 'Birthing a Nazirite',
      discipline: 'writing',
      disciplineLabel: 'Content Writing and Copywriting',
      kind: 'Book production',
      summary: 'A Christian parenting book typeset into a production-worthy volume with 2 alternate covers, custom chapter numerals, and complete interior layout.',
      detail:
        'Transformed a raw PDF into a formatted, production-worthy book. Designed the interior typography, custom ornamental chapter numbers, running heads, margins, and pagination. Also created alternate book covers exploring distinct visual directions.',
      tools: ['Book design', 'Typography', 'Cover design', 'Node.js', 'docx', 'Python', 'SVG ornaments'],
      images: [
        {
          src: '/work/nazirite/book-cover.png',
          alt: 'Birthing a Nazirite book cover design with line art illustration and custom serif display typography',
          caption: 'Birthing a Nazirite — Book cover design',
          width: 345,
          height: 480,
        },
        {
          src: '/work/nazirite/chapter-design.png',
          alt: 'Interior chapter heading design showing ornamental gold flourish framing chapter numeral 1',
          caption: 'Interior chapter layout and typographic ornaments',
          width: 329,
          height: 108,
        },
      ],
    },
    {
      slug: 'instagram-workflow',
      title: 'Instagram Content Automation',
      discipline: 'automation',
      disciplineLabel: 'AI Automation',
      kind: 'Personal project',
      summary: 'Automates weekly Instagram content creation and publishing, from data gathering through to human-approved posting.',
      detail:
        'The chain runs on a schedule trigger, pulls organisation data from Google Sheets, processes it in a custom JavaScript node, fetches and parses Google Trends data via an HTTP request and an XML-to-JSON conversion, merges data sources, generates post content through an AI model with tool-calling, creates an accompanying image, and routes the result to a human for an approval message before branching on outcome.',
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
      slug: 'smartcbt',
      title: 'SmartCBT',
      discipline: 'frontend',
      disciplineLabel: 'Frontend Development',
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
      slug: 'stemedurobotics',
      title: 'StemEduRobotics',
      discipline: 'graphics',
      disciplineLabel: 'Graphics Design',
      kind: 'Client work',
      summary: "Social media graphics for a children's robotics education brand.",
      detail:
        'A branded template applied and populated per post. Imagery mixed photography, stock images, and AI-generated composites, with supporting icon graphics generated via AI prompt. Headline and caption copy was written independently.',
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
      slug: 'orchestyle-automation',
      title: 'Orchestyle Order Automation',
      discipline: 'automation',
      disciplineLabel: 'AI Automation',
      kind: 'Client project',
      summary: 'A published, live automation that turns a customer order into an emailed invoice with no manual retyping.',
      detail:
        'Built for Orchestyle, a bead-making company. A customer submits an order through a form; the workflow copies an invoice template, populates it with order details, compiles a dynamic PDF, emails that invoice to the customer automatically, and logs the order in Google Sheets.',
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
      slug: 'facons',
      title: 'FACONS',
      discipline: 'frontend',
      disciplineLabel: 'Frontend Development',
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
      slug: 'coja-foods',
      title: 'Coja Foods',
      discipline: 'graphics',
      disciplineLabel: 'Graphics Design',
      kind: 'Client work',
      summary: 'Menu and promotional graphics for a home-cooked Nigerian food delivery service in Akure.',
      detail:
        'Designed the template independently and reused it across pieces: logo placement, colour system and footer bar style. Curated food photography and wrote all headline and caption copy independently.',
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
          alt: 'Coja Foods Wednesday Special promotional flyer, a tiered pricing layout with circular price badges',
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
          alt: 'Coja Foods Coming soon teaser flyer, bold display typography with pill-shaped call-to-action tags',
          caption: 'Coming soon teaser flyer',
          width: 1026,
          height: 1280,
        },
      ],
    },
    {
      slug: 'topvision',
      title: 'TopVision',
      discipline: 'frontend',
      disciplineLabel: 'Frontend Development',
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
      slug: 'ops-wash',
      title: 'OPS-WASH',
      discipline: 'graphics',
      disciplineLabel: 'Graphics Design',
      kind: 'Client work',
      summary: 'Awareness graphics for a private-sector water, sanitation and hygiene coordination body.',
      detail:
        'An existing branded template applied and populated per post. Icon graphics were generated via AI prompt, with halftone photo effects applied in Canva. Headline and caption copy was written independently.',
      tools: ['Canva', 'AI image generation', 'Copywriting'],
      link: { href: 'https://www.instagram.com/opswashofficial/', label: 'View on Instagram' },
      images: [
        {
          src: '/work/ops-wash/post-1.jpg',
          alt: 'OPS-WASH Instagram post reading "Did you know? 1 in 4 people worldwide do not have access to safe drinking water"',
          caption: 'Safe drinking water awareness infographic',
          width: 445,
          height: 553,
        },
        {
          src: '/work/ops-wash/post-2.jpg',
          alt: 'OPS-WASH Instagram post reading "Our communities need clean water"',
          caption: 'Clean water and sanitation campaign',
          width: 440,
          height: 551,
        },
        {
          src: '/work/ops-wash/post-3.jpg',
          alt: 'OPS-WASH Instagram post reading "Why money alone isn\u2019t solving the water crises"',
          caption: 'Economic considerations in global water crises',
          width: 443,
          height: 550,
        },
      ],
    },
  ],
}
