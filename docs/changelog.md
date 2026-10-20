# Changelog: home-page rebuild (2026-10-20)

Presentation layer only. Routes (`/`, `/work`, `/about`, `/contact`), content, data and routing logic are unchanged. The one data addition is the `year` field on the eight selected projects, using the years you supplied.

Reference behaviour: [reference-notes.md](./reference-notes.md). Approved plan: [section-mapping-and-motion-spec.md](./section-mapping-and-motion-spec.md).

## What changed

| Area | Before | After |
|---|---|---|
| Header | Logo, four links and a "Let's talk" pill | **Morph island** (`src/components/site/Island.tsx`): one ink pill that changes position, size and content by context (status, section nav, services switcher, contact list / ⌘K palette, case-study bar, footer status, "Back to home" on sub-pages). Spring layout animation; 140 ms out / 220 ms in content crossfade. Wordmark and live Lagos time sit beside it over the hero |
| Loader | About 4.4 s black screen; the name was invisible (`#111` on `#111`) | About 1–2 s. The name sets in letter by letter, an accelerating progress line tracks real font readiness (minimum 1 s, hard cap 2 s), then the name flies into the top-bar wordmark while the panel wipes away. Skippable with any key or a tap. Once per session, `?loader` forces it, skipped under reduced motion. Paints its colour before React mounts, so there's no light flash |
| Hero | 16-word headline, uppercase label, pill CTA | "Code, design, words, workflows.", a one-line intro, and two text links. Line-mask entrance on loader handoff |
| Work | 7,500 px image grid with five filter pills | Eight numbered rows (number, title, three tools, year, arrow) that stagger in. Hover tint, title nudge and arrow reveal, fine pointers only. "All work →" keeps the other 11 projects on `/work` |
| Case study | Lightbox-first | Opens in place at `#work/<slug>` (Back works): h1, summary, Year / Practice / Scope / Tools, the scope note, workflow steps for automation projects, images that open the existing Lightbox, and "Next →". The island becomes the title bar with Close and a reading-progress bar. Focus moves to the h1; Close or Escape returns you to the row and your scroll position |
| Live sites | Fake "LIVE" frames (static JPG, scripted cursor, pinging badge) on the home page | The real screenshot plus a **"Load the live site here"** button that loads a sandboxed iframe on demand, with an honest note if the site blocks embedding. `LiveSitePreview` still powers `/work` (not yet restyled) |
| Services | Four long rows with bullets | **Kept on the home page and made interactive** (your decision #7). A four-tab switcher (Frontend, Graphics, Writing, Automation) sits in the bottom island on desktop and inline on mobile. Each tab shows its tagline, the four service lines, the description and the tools used in your projects. Blur crossfade plus a 30 ms row stagger. Arrow keys, Home and End work |
| About | Heading and paragraph | The lead paragraph brightens word by word with scroll; the second paragraph is from your full story; "Read full background →" goes to `/about` |
| Contact | WhatsApp pill and copy-email pill | Two-line heading, note and ⌘K / Ctrl K hint. Desktop: the bottom island holds Copy email, WhatsApp, GitHub and LinkedIn. Mobile: an inline list |
| Copy feedback | Inline "✓ Copied", no failure path | A top toast plus a `role="status"` live region. If clipboard access fails, it says so and opens your mail app |
| Command palette | None | ⌘K on macOS, Ctrl+K elsewhere, the footer button, or the contact island. Filters sections and contact actions; Arrow Up/Down and Enter; Escape closes; focus is trapped and returned to where you were. Opens and closes **instantly from the keyboard** |
| Footer | Link columns and legal text | Reveal footer under the rounded page card: © · ⌘K button · back-to-top · giant "Prosper" wordmark rising letter by letter, with gentle parallax |
| Cursor | Native | A 10 px blend-mode dot that grows over links and buttons. Fine pointers only; no spring under reduced motion |
| Smooth scroll | Lenis lerp .1, duration 1.2 | Lenis lerp .09 (reference value); still off under reduced motion and on touch |
| Tokens | — | Mono metadata stack (system, no download); one accent (PRODUCT.md forest green) for the availability dot only; motion tokens in `src/lib/motion.ts`; type scale in `src/index.css` |
| Dead code | — | Removed `Header`, `canvas/Section3DBackground`, `disciplines/*`, `PracticeIndex`, `FilterBar`, `EntrySkeleton`, the unused `About`/`Contact` aliases, `useScrolled` and `useContentReady` |

## Libraries

**None added.** Motion and Lenis were already installed. axe-core and Playwright were used only for testing, from a scratch folder outside the repo.

## Deviations from the reference, and why

1. **Loader added** at your request. The research I based it on:
   - Keep intros under about 2–3 s.
   - Tie them to real loading with a hard cap, so a failed request can't strand the page.
   - Make them skippable, and play them once per session.
   - Use progress bars that accelerate toward the end: they read as faster than linear or stop-start ones (Harrison).

   Sources: [Webflow loading-animation guidance](https://webflow.com/blog/loading-animation), [Framer preloader components](https://www.framer.com/marketplace/components/introloader/), [perfplanet on progress-bar perception](https://calendar.perfplanet.com/2012/why-bother-with-performance-metrics-when-you-can-cheat/), [UX psychology of waiting](https://uxpsychology.substack.com/p/beyond-the-wait-enhancing-user-experience).
2. **The hero's live collaborative-editing demo was not reproduced.** It is the reference owner's personal signature, so the hero uses a line-mask entrance instead.
3. **Services is a four-tab switcher with full service copy**, not a three-tab stack list. It keeps your services content on the page, as you asked.
4. **The top-bar wordmark and clock show only over the hero and on sub-pages.** The reference keeps them fixed, but fixed text collides with content scrolling under it, especially on phones.
5. **The palette lists sections and contact links**, not just contact links. It also adds a focus trap, focus restore, Escape handling and `aria-activedescendant`, which the reference lacks.
6. **Keyboard-opened and keyboard-closed palette has no animation** (Emil: never animate high-frequency keyboard actions). Pointer-opened still morphs.
7. **Copy toast is 300 ms in / 200 ms out**, not 500 / 500. That keeps UI motion at or under 300 ms.
8. **The page-wide 6 px blur on load and on case-study open was dropped.** Full-viewport filters are costly on low-end GPUs, so it's opacity only.
9. **Work rows rise 10 px as they fade in**, instead of fading only. Emil flags pure-fade entrances as weak.
10. **Hover easing is `ease` at 250 ms**, not material standard at 300 ms (Emil's hover guidance).
11. **Footer: no view counter** (your decision #5) and no pointer-reactive wordmark (no clear purpose). On phones the footer status pill is hidden so the wordmark owns the bottom edge.
12. **Dark mode kept** (your decision #8). The island inverts to a light pill.
13. **Accessibility beyond the reference:**
    - arrow keys, Home and End on the tabs, plus `tabpanel`
    - case-study focus management
    - `role="status"` for copy results
    - skip link kept
    - a `<header>` landmark for the overlay
    - the native cursor is kept over text inputs
14. **Tag text is 11 px**, not 10 px: the legibility floor.

## Verification (production build, Chrome via Playwright)

- **Widths:** 375, 768 and 1440 px with no horizontal overflow; reduced motion; dark scheme. Screenshots are in `C:\Users\user\pw-scratch\v1`–`v3`.
- **Throttled run:** 4× CPU, 1.6 Mbps, 150 ms latency. The loader colour paints first with no flash, the loader mounts at about 2.8 s, the handoff completes at about 4.9 s, and the hero is in place.
- **Behaviour checks:**
  - Island geometry is correct in each section.
  - Services tabs respond to arrow keys.
  - The case study moves focus to its h1 and restores the row and scroll position on close.
  - The palette filters, traps focus, closes on Escape and restores focus.
  - The clipboard receives the email and the toast is announced.
  - Footer reveal works.
  - No console errors.
- **axe-core** (WCAG 2.0/2.1/2.2 A/AA plus best practice): clean in light, dark, palette-open, case-study and 375 px states, after fixing a contrast miss (4.43:1), nested interactive options and a missing landmark.
- **Impeccable detector:** the only finding is `overused-font` (Inter / Inter Tight). That is a deliberate keep under the approved spec; see open issues.
- **CLS:** 0. **Bundle:** 479 kB JS / 148 kB gzip, 66 kB CSS.

## Open issues needing your decision

1. **`PRODUCT.md` brand line.** It said the signature is a Runethia calligraphy loader. The new loader is set in Inter Tight because `Runethia.otf` is a personal-use demo font. I've updated `PRODUCT.md` to match. If you buy a commercial licence, the loader name could switch to Runethia. The font files are still in `public/` and the repo root, and anything in `public/` is deployed. Should I remove them?
2. **The loader delays the largest paint.** LCP is the hero headline, revealed after the handoff, so first-visit LCP lands about 1–2 s later than without a loader. Repeat visits in the same session skip it. It's a trade-off you chose; you can shorten `MIN_MS` / `CAP_MS` in `LoadingScreen.tsx`.
3. **Inter / Inter Tight are flagged as overused by the detector.** Swapping the display face would add character, but it's a brand decision and needs a new font file.
4. **`/work`, `/about`, `/contact` still use the old layout.** They pick up the new tokens, island and footer, but their bodies (including `LiveSitePreview`'s fake "LIVE" frames on `/work`) still need the same pass.
5. **Untracked file `public/Natalie Holt - Purpose Is Glorious.mp3`** appeared during the session. I didn't add it and I'm not using it. Background audio would break ground rule 5 and add 5–10 MB to the deploy. Remove it, or tell me what it's for.
6. **Island tabs are 36 px tall.** That passes WCAG 2.2 AA (24 px minimum) but is under Apple's 44 px guidance. The pill can grow to 48 px on phones if you prefer.
