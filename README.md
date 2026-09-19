# Prosper Portfolio

A modern portfolio website for a frontend developer, built with React, TypeScript, Vite, and Tailwind CSS. The site presents a clean landing page, work history, selected projects, and contact information with a polished editorial aesthetic.

## Overview

This portfolio is designed to:

- showcase role, experience, and profile details,
- present selected work in a structured filterable gallery,
- keep the interface lightweight and fast,
- work well for deployment on Vercel and similar static hosts.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion library for interactions
- Oxlint for linting

## Project Structure

```bash
src/
  App.tsx
  index.css
  components/
    About.tsx
    Contact.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    Lightbox.tsx
    PracticeIndex.tsx
    ProjectEntry.tsx
    ProjectGallery.tsx
    TextReveal.tsx
    WorkSection.tsx
  data/
    practices.ts
    profile.ts
    projects.ts
  hooks/
    useContentReady.ts
    useCopyToClipboard.ts
    useReducedMotion.ts
    useScrolled.ts
    useSplitLines.ts
  types/
    index.ts
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev      # start the Vite dev server
npm run build    # type-check and create the production build
npm run preview  # preview the production build locally
npm run lint     # run linter checks
```

## Deployment

This project is configured for static hosting and is compatible with Vercel. Ensure the project is deployed with the standard Vite build flow:

- Build command: `npm run build`
- Output directory: `dist`

If the deployment fails with a missing dependency error, make sure the project has the required Tailwind packages installed:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

## Author

Prosper Kayode

## License

This project is for personal portfolio use and is not currently configured with a public license.
