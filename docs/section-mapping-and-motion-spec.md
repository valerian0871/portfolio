# Section mapping and motion spec

Status: **approved 2026-10-20 and implemented.** Decisions and deviations made during the build are in [changelog.md](./changelog.md). Original draft text follows. Measured reference values come from [reference-notes.md](./reference-notes.md). Every piece of copy below comes from `src/data/content.ts`, `src/data/practices.ts` or `PRODUCT.md`. Items marked **NEEDS YOU** are missing from my material, or are decisions only you can make.

Scope: the home route `/`. The `/work`, `/about` and `/contact` routes, the data layer and the routing logic stay as they are. Those routes get the new tokens automatically and a layout pass later.

## 1. Section mapping

| Reference pattern | My section | Source material | What changes | Notes |
|---|---|---|---|---|
| Top bar: wordmark (back to top, letter-wave hover) · island · local clock | **Top bar**: "Prosper Kayode" wordmark · island · Lagos local time (`Africa/Lagos`, `md+` only) | `profile.name`, `profile.location` | replaces `Header.tsx` (logo, 4 links, "Let's talk" pill) | the nav links move into the island |
| Morph island, hero state: pulse dot + availability | **Island · hero**: "● Available for work" | short form of `profile.availability` | new `Island` component | NEEDS YOU: OK with the short label? |
| Hero: short h1 · one-line intro · two text links with `↗` | **Hero**: short h1 · one-line intro · "View work ↗" / "Get in touch ↗" | positioning in `PRODUCT.md` | rewrites `Hero.tsx`; drops the uppercase discipline label and the pill CTA | NEEDS YOU: headline (options in §4) |
| Hero live-collaboration demo (cursors, retyping, ops log) | **Not reproduced** | — | — | It is the reference owner's signature, tied to their own CRDT work. Copying it would copy identity, not structure. Replaced by a plain line-mask entrance (the reference's own h2 pattern). NEEDS YOU: confirm |
| Island · Work/About: section tablist with sliding indicator | **Island · Work / Practice / About / Contact** | section ids | new | 4 tabs, not 3 (Practice is a section). Width ≈ 344 px |
| Selected work: numbered rows (no., title, 3 tags, year, `→`) · stagger fade | **Selected work**: numbered rows | `content.projects` (`title`, `tools` → tags, `disciplineLabel`) | replaces the image grid in `WorkSection.tsx` plus the filter tabs | NEEDS YOU: which projects (proposal in §4) and **years** (no project has a `year`) |
| Row click → case-study view (island becomes title + Close + progress) | **Case study view** for each project: h1, summary, meta (practice, tools, link), then the existing proof (`LiveSitePreview`, image gallery with `Lightbox`, `AutomationPipeline`) | `summary`, `detail`, `images`, `pipeline`, `link`, `metrics` | replaces the lightbox-first flow; reuses the existing proof components | **Change**: `LiveSitePreview` currently fakes a live site (static JPG, scripted cursor, pinging "LIVE" badge). The case study shows the real screenshot plainly with the domain as a mono caption, and loads a real sandboxed iframe only on click | URL hash `#work/<slug>` so Back works; focus moves to the h1 and returns to the row (fixes a reference gap) |
| Stack: 3-tab switcher in the island (inline on mobile) · tagline · tool list | **Practice**: 4 tabs, Frontend / Graphics / Writing / Automation · tagline · tool list | tagline = `practices[].note`; list = unique `tools` from that practice's projects | replaces `ServicesSection.tsx` (4 long rows with bullets) | the long `services[].description` and `subItems` move to `/about` (nothing deleted). NEEDS YOU: OK? |
| About: h2 left (4 cols) · lead paragraph with scroll-linked word opacity · second paragraph | **About** | `about.previewParagraph` (lead) + `about.fullStory[0]` (second) + the existing "Read full background →" link | rewrites `AboutSection.tsx` | |
| Contact: 2-line h2 · one-line note · ⌘K hint · island = contact list (inline on mobile) | **Contact**: 2-line h2 · note · ⌘K / Ctrl K hint · island actions: **Copy email · WhatsApp · GitHub · LinkedIn** | `contact.email`, `contact.whatsapp`, `profile.socials` | rewrites `ContactSection.tsx`; WhatsApp stays as an action rather than a pill | NEEDS YOU: h2 wording; résumé PDF (none in the repo) |
| Copy feedback: top toast pill, blur-fade, about 1.8 s | **Copy toast** "Email copied", plus a `role="status"` live region | — | replaces the inline "✓ Copied" | |
| ⌘K palette = expanded island, contact actions only | **⌘K / Ctrl K palette** = expanded island with **sections** (Work, Practice, About, Contact, Back to top) **and links** (Copy email, WhatsApp, GitHub, LinkedIn) | above | new | adds the focus trap and focus restore the reference lacks |
| Reveal footer: fixed layer under a lifted, rounded content card · views · ⌘K button · © · back-to-top · giant per-letter wordmark | **Footer**: ⌘K button · © 2026 · back-to-top · giant "Prosper" wordmark · *(views)* | `footer.legal` | rewrites `Footer.tsx`; the link columns move into the palette | NEEDS YOU: view counter (§4) |
| Custom 10 px blend-mode cursor | **Included**, fine pointers only | — | new | Observed in the reference, so rule 5 allows it. NEEDS YOU: confirm |
| No loader | **Remove `LoadingScreen`** | — | delete from `App.tsx` | NEEDS YOU: `PRODUCT.md` calls the calligraphic loader a "signature" |
| No 3D | Nothing to remove from the page: `Section3DBackground.tsx` is already unused (dead code, along with `disciplines/*`, `PracticeIndex`, `FilterBar` and the empty `About.tsx`/`Contact.tsx`) | — | delete the dead files | confirmed by the critique: no `<canvas>` is mounted |
| No theme switching (light only) | **Keep my existing `prefers-color-scheme: dark` tokens**; island inverts (light pill on dark) | `tokens.css` | — | a deviation that keeps an existing user-preference feature; no toggle added |
| Skip link: absent in the reference | **Keep mine** | `App.tsx` | — | |

## 2. Tokens (step 1 of the build)

- **Type**:
  - Keep self-hosted **Inter Tight** for display and headings and **Inter** for body: no new font downloads.
  - Metadata (numbers, tags, years, hints, clock) uses a system mono stack `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. This honours `PRODUCT.md`'s "monospaced metadata" without adding a font.
  - Scale matches the reference ratios: hero `clamp(2.1rem, 10.4vw, 8.2rem)`/.98/−.045em · h2 `clamp(2.25rem, 5vw, 3.5rem)`/1/−.04em · contact h2 `clamp(2.75rem, 8vw, 5.5rem)`/.95 · row title `clamp(1.25rem, 3vw, 1.75rem)`/1.25/−.03em · about lead `clamp(1.75rem, 3.2vw, 2.25rem)`/1.25 · body 15→17 px · meta 11–13 px.
- **Colour**:
  - Keep my neutrals: bg `#FAFAF8`, ink `#111111`, muted `#6B6A65` (AA on bg), hairline `#E2E1DB`, plus the dark set.
  - The island uses ink. One accent: the forest green from `PRODUCT.md` (`#1F5245` / `#7FBFA8`), used **only** for the availability dot.
- **Spacing and layout**: content column `max-w-[1100px] px-6`; hero `max-w-[1280px] px-5 sm:px-6 md:px-10`; section rhythm `py-28 md:py-40`; 12-column grid for Practice and About (heading in 4 columns, body in 8).
- **Radii**: island 18 / 22 / 24; rows 16 (hover background); content card bottom 28.

## 3. Motion spec

Libraries: **Motion** and **Lenis**, both already installed. **No new libraries.**

Easing tokens:
- `--ease-out-strong: cubic-bezier(.22, 1, .36, 1)` (reference value; close to Emil's `.23, 1, .32, 1`)
- `--ease-standard: cubic-bezier(.4, 0, .2, 1)`

Springs:
- `spring.ui {350, 32, 1}`
- `spring.island {360, 34, .8}`
- `spring.indicator {480, 36}`
- `spring.cursor {700, 45, .35}`
- `spring.press {500, 30}`

Reduced motion follows Emil's rule: drop movement, keep short opacity and colour changes.

| # | Element | Purpose | Trigger | Property | Duration / spring | Easing | Reduced motion | Matches reference? |
|---|---|---|---|---|---|---|---|---|
| 1 | Page | soften the first paint | mount | `opacity` 0→1 | 400 ms | ease-out-strong | 150 ms opacity | **Deviation**: drops the 6 px page-wide blur (a full-viewport filter costs on low-end GPUs) |
| 2 | Hero h1 lines | state the headline with weight | mount | `transform: translateY(108%→0)` in an overflow mask, 80 ms per-line stagger | spring.ui (≈500 ms) | spring | shown at rest | pattern from the reference h2 (the reference hero is the typing demo) |
| 3 | Hero intro + links | follow the headline | mount | `opacity` | 300 ms, delay 250 ms | ease-out-strong | opacity only | ✓ |
| 4 | Status dot | signal "live / available" | always | `opacity` 1→.35 loop | 2400 ms | linear | **off** (static dot) | ✓ (`motion-safe`) |
| 5 | Section h2 lines | mark a new section | in view, once, −12% | `transform: translateY(108%→0)` mask | spring.ui | spring | shown at rest | ✓ |
| 6 | Work rows | reveal the list without movement noise | in view, once, −5% | `opacity` 0→1, 60 ms stagger (capped at 6 rows) | spring.ui | spring | 150 ms opacity, no stagger | ✓ (stagger cap is mine) |
| 7 | Row hover (fine pointer) | show the row is actionable | hover | bg `transparent→ink/3%`; title `translateX 4px`; tag border colour; `→` opacity + `translateX 2px` | 300 ms | standard | colour/opacity only | ✓ (bg and border colour are non-transform, justified: 1-layer paint, no layout) |
| 8 | Row press | acknowledge the click | `:active` | — | — | — | — | ✓ **no press scale**, matching the reference; the case-study morph is the feedback |
| 9 | Text links hover | affordance | hover | border colour; arrow `translate(2px, −2px)` | 150 ms / 300 ms | standard | colour only | ✓ |
| 10 | Island shape | carry context between sections without a nav jump | active section or palette | Motion `layout` (transform + radius correction) | spring.island; radius 280 ms | ease-out-strong | **instant** (no layout animation) | ✓ |
| 11 | Island content | swap content without a hard cut | same | `opacity` out / in | 140 ms out / 220 ms in | ease-out / ease-out-strong | 120 ms opacity | ✓ |
| 12 | Tab indicator | show selection moving | tab change | `transform: translateX` + **`width`** | spring.indicator | spring | instant | ✓ (`width` justified: a 44 px-tall pill, isolated layer, no reflow outside the tablist) |
| 13 | Practice panel swap | change content in place | tab change | out: `opacity` 1→0 + `blur(0→4px)` 150 ms; in: reverse 150 ms, +50 ms delay | 150 ms | ease-out | opacity only | ✓ (blur 4 px vs the reference's 6; `filter` justified: masks the crossfade on a small block, per Emil) |
| 14 | About lead | pace the reading, tie it to scroll | scroll position | per-word `opacity` .18→1, `useScroll ["start .9","end .35"]` | scrubbed | linear | **full opacity, no scrub** | ✓ |
| 15 | Case study open | keep place: the row becomes the page | row click / Enter | island morph (#10); content `opacity` 0→1 | 400 ms | ease-out-strong | opacity 150 ms | **Deviation**: no 6 px blur on the whole view |
| 16 | Case study progress bar | show reading position | scroll | `transform: scaleX` | scrubbed | linear | kept (it is information) | ✓ |
| 17 | Copy toast | confirm an invisible action | copy | in: `opacity` + `blur(4px→0)` + `translateY(−4px→0)`; out: reverse | 300 ms in, hold 1.8 s, 200 ms out | ease-out-strong | opacity only | **Deviation**: 300/200 ms instead of 500/500 (Emil: under 300 ms for UI) |
| 18 | Palette open, **keyboard** ⌘K / Ctrl K | — | key | none: island snaps open | 0 | — | — | **Deviation**: Emil's rule, never animate a keyboard-initiated, high-frequency toggle |
| 19 | Palette open, **pointer** | show where the palette comes from | footer or contact button | island morph (#10) | spring.island | spring | instant | ✓ |
| 20 | ⌘K footer button press | press feedback | `:active` | `transform: scale(.96)` | spring.press | spring | none | ✓ |
| 21 | Wordmark hover (top bar) | small delight on the one brand element | hover / focus | per-letter `translateY(−2px)`, 12 ms stagger | spring {500, 26} | spring | none | ✓ |
| 22 | Footer reveal | close the page | scroll | inner layer `translateY(−15%→0)` under a fixed, clipped footer | scrubbed | linear | no parallax (static) | ✓ |
| 23 | Footer wordmark letters | final beat | in view, once | per-letter `translateY(100%→0)` mask, 40 ms stagger | spring.ui | spring | shown at rest | ✓ (the pointer-reactive shift is **cut**: purpose unclear) |
| 24 | Cursor (fine pointer only) | make the pointer part of the typography | pointer move / interactive hover | `transform` x/y; `scale 1→3.4` | spring.cursor / spring.ui | spring | follows without spring; no scale | ✓ |
| 25 | Smooth scroll | consistent pacing for scrubbed effects | wheel | Lenis `lerp .09` | — | — | **off** | ✓ (mine is `lerp .1, duration 1.2`; align to .09) |

**Cut from the reference:** the hero typing demo and the ops log, the footer wordmark's pointer parallax, and the page-wide blur.

**Not added (absent in the reference):** loader, 3D, marquee, video, theme toggle.

**Layout-shift guard:** every entrance animates `transform` or `opacity` inside reserved boxes. Masks use `overflow: hidden` with fixed line boxes. The island lives in a fixed overlay, so it never moves content. The view counter reserves `ch` width with `tabular-nums`.

**Accessibility additions beyond the reference:**
- Arrow keys / Home / End on both tablists (roving `tabindex`), plus `aria-controls` and `role=tabpanel`.
- Palette focus trap, Escape to close, focus restored to the opener.
- Case study focus moved to the h1 and restored to the row.
- `role=status` for copy results.
- Visible focus: `outline: 2px solid currentColor; outline-offset: 3px`.
- Hover styles under `@media (hover: hover) and (pointer: fine)`.

## 4. Decisions I need from you

1. **Hero headline.** Options built from your positioning line (the reference uses 4–5 words):
   - a) "One problem in. Three solved."
   - b) "Code, design, words, workflows."
   - c) "Interfaces, brands, books and the automation behind them."
   - d) Your own wording.

   Intro line (draft): "Frontend developer in Nigeria. I also design brand systems, typeset books and automate the busywork."
2. **Selected work rows.** Proposal (8 rows, all four practices):
   - Cakes 'N' Pastries
   - SmartCBT
   - FACONS
   - TopVision
   - Birthing a Nazirite
   - Cliques
   - Instagram content automation
   - Orchestyle order automation

   The other 11 stay on `/work`. **I also need a year for each row**, or I drop the year column.
3. **Loader.** Remove (matches the reference, faster first paint) or keep? Note: `public/fonts/Runethia.otf` is a **personal-use-only demo font**, and this is a client-facing site, so keeping it needs a commercial licence.
4. **Custom cursor.** Include it (fine pointers only), or skip it?
5. **View counter.** Your site is static on Vercel, with no server or storage. The options:
   - a) A Vercel serverless function plus a store in your own account (Vercel KV / Upstash Redis). It stores one integer, no personal data, and adds one small dependency (`@upstash/redis`).
   - b) Omit it.

   Recommendation: (b) for now, then (a) once you confirm the store is acceptable as "your own storage".
6. **Contact.** The h2 wording (draft: "Have a project in mind?" plus note "WhatsApp is the fastest way to reach me. Email works too."). Do you want a **résumé PDF** link? None is in the repo.
7. **Services copy.** OK to move the long service descriptions and bullets from the home page to `/about`?
8. **Dark mode.** Keep your existing system-preference dark theme (my recommendation), or go light-only like the reference?
