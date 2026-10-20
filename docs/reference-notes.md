# Reference notes: akshatsingh.site

Observed 2026-10-20 with Playwright driving desktop Chrome (headless), at 1440×900, 768×1024 and 375×812 (touch), plus `reducedMotion: 'reduce'` and `colorScheme: 'dark'` runs.

Method:
- Recorded the first load as video and screenshots at 50 to 3500 ms.
- Sampled `document.getAnimations()` during load.
- Wrapped `Element.prototype.animate` to log every Web Animations API call (keyframes, duration, delay, easing).
- Scrolled in 300 px wheel steps (slow pass) and one full-height wheel (fast pass).
- Hovered, pressed, clicked and keyboard-drove every control.
- Read computed styles and inline transforms, captured network requests, and downloaded the JS chunks to read spring constants from source.

This file records **patterns only**. No wording, names, handles, project names or assets from the reference are used in the build.

**Confidence:**
- **confirmed**: measured in the browser or read from the shipped source.
- **unverified**: inferred, or a single observation that could vary.

## Stack and globals

| Item | Finding | Evidence | Confidence |
|---|---|---|---|
| Framework | Next.js (App Router, Turbopack chunks, `self.__next_f`) | `/_next/static/immutable/chunks/*`, RSC payload | confirmed |
| Animation library | **Motion (Framer Motion)**: `motion.div`, `useSpring`, `useScroll`, `useTransform`, `AnimatePresence`, `layout`, `whileInView`, `whileTap`. Motion converts its springs to CSS `linear()` easings, which is why the WAAPI log shows `linear(0, 0.0141, …)` | chunk source; WAAPI log | confirmed |
| Smooth scroll | **Lenis**, `lerp: 0.09`. Not started when `useReducedMotion()` is true (`<html>` loses the `lenis` class) | source `new d({lerp:.09})`; reduced-motion run | confirmed |
| Styling | Tailwind v4 utilities | class names, `--tw-*` vars | confirmed |
| Fonts | Public Sans Variable (UI, weight 500 body / 600 headings), Instrument Serif italic (one glyph in the footer wordmark), Geist Mono Variable (metadata) | `--font-sans/serif/mono`, font requests | confirmed |
| Palette | `#FFFFFF` page, ink `#0A0A0A`, muted `#737373`, surface `#F5F5F4`, hairlines `black/8%`. One accent blue `#2F6BFF`, used only for the hero's "guest" cursor | `rootVars`, computed styles | confirmed |
| Theme | **No dark mode and no toggle.** Under `prefers-color-scheme: dark` the page stays white | dark run: `bg rgb(255,255,255)` | confirmed |
| Loader | **None.** Content is server-rendered, so the first paint is the page | load screenshots at 862 ms show the page | confirmed |
| 3D, marquee, video | **None** on the home page. A case-study demo loads an iframe (`/demos/*.html`) only on open | network log | confirmed |
| Custom cursor | **Present.** A 10 px white dot with `mix-blend-difference`, following the pointer on spring `{stiffness 700, damping 45, mass .35}`. It scales to 3.4 over `a, button, input, [role=button], [data-cursor]` (spring 350/32). `body { cursor: none }` via `html.has-cursor`. Under reduced motion it follows raw pointer values (no spring) | source `Cursor` component; computed `cursor: none` | confirmed |
| Grid | Content column `max-w-[1100px] px-6`; hero `max-w-[1280px] px-5 sm:px-6 md:px-10`; 12-column grid for About and Stack (heading in 4 columns, body in 8) | section markup | confirmed |
| Section rhythm | `py-28` (112 px) mobile / `md:py-40` (160 px) desktop. Hero is `min-h-svh`; contact is `min-h-[160svh]` so the footer reveal has room | computed styles | confirmed |
| Type scale | Hero `clamp(2.1rem, 10.4vw, 8.2rem)`, weight 500, leading .98, tracking −.045em. h2 `clamp(2.25rem,5vw,3.5rem)` 600, leading 1, −.04em. Contact h2 `clamp(2.75rem,8vw,5.5rem)` 600, leading .95. Row h3 `clamp(1.25rem,3vw,1.75rem)` 600, −.03em. About lead `clamp(1.75rem,3.2vw,2.25rem)` leading 1.25. Body 15/17 px weight 500. Meta 10–13 px mono | computed styles | confirmed |
| Icons | Text glyphs `↗` `→` `⌘`, plus one inline SVG (back-to-top arrow) | markup | confirmed |

## The morph island (central interaction)

A single `data-morph-overlay` layer (`fixed inset-0 z-50 pointer-events-none flex flex-col`) holds one ink pill (`bg-ink text-white overflow-hidden`). Its **position, size, radius and content change with the active section**:

| Context | Position | Size / radius | Content | Confidence |
|---|---|---|---|---|
| Hero | top, beside the wordmark (`self-start mt-5`) | 176×36, r18 | pulsing dot + availability label | confirmed |
| Work, About | top centre (`self-center mt-4`); **bottom, full width minus 32 px on mobile** | 264×44, r22 | section tablist: 3 tabs with a sliding white indicator | confirmed |
| Stack | bottom centre (`mt-auto mb-5`) | 340×44, r22 | category tablist (the stack switcher) | confirmed |
| Contact | bottom centre | 440×225, r24 | filter input with ⌘K hint, then 4 contact actions (this **is** the command palette, opened in place) | confirmed |
| Footer | bottom left | 169×35, r18 | availability label | confirmed |
| Case study open | top centre | ≈340×44 | project title, "Close", and a 2 px reading-progress bar (`scaleX` = scroll progress) | confirmed |

| Element | Trigger | Behaviour | Duration | Easing | Library | Evidence | Confidence |
|---|---|---|---|---|---|---|---|
| Island shape | active-section change | Motion `layout` animation: one transform (translate + scale) with border-radius correction, so the pill flies between positions and resizes | settles ≈400 ms | `layout: spring {stiffness 360, damping 34, mass .8}`; `borderRadius: 280 ms cubic-bezier(.22,1,.36,1)` | Motion | per-frame transforms `translate3d(0,-572px,0) scale(.84)` → `none` over about 10 frames; source | confirmed |
| Island content | same | outgoing content fades out, incoming fades in (both rendered under `AnimatePresence`) | out 140 ms, in 220 ms | out `ease-out`; in `cubic-bezier(.22,1,.36,1)` | Motion | WAAPI log `opacity [1,0] 140` / `[0,1] 220` | confirmed |
| Overlay | first appearance or palette state | whole overlay layer fades | 380 ms | `cubic-bezier(.22,1,.36,1)` | Motion | WAAPI log | confirmed |
| Tab indicator | tab change or scroll-spy | white pill animates `width` and `translateX` under the active tab. Tab text colour 150 ms, tab background 300 ms | spring | `{stiffness 480, damping 36}` (second spring `{210, 30}` also present) | Motion | inline `width: 85px; transform: translateX(89px)`; source | confirmed |
| Section tab click | click Work / About / Contact | Lenis smooth-scrolls to the section (y 2407 → 900 in about 1.3 s, exponential approach) | ≈1.3 s | Lenis lerp | Lenis | scroll sampling | confirmed |

> Animated property note: the indicator animates `width` (a layout property). The island itself animates only transform and opacity, because Motion's layout projection turns the size change into a transform.

## Entrance sequence (first load)

| Element | Trigger | Behaviour | Duration | Easing | Evidence | Confidence |
|---|---|---|---|---|---|---|
| Whole page | hydration | `opacity 0→1` plus `filter: blur(6px)→0` on the main wrapper | 500 ms | Motion spring as `linear()` (≈1.004 overshoot) | WAAPI log | confirmed |
| Hero headline | after mount | **Live collaborative-editing demo**: two labelled cursors appear (opacity 200 ms ease-out, cursors move on spring 420/38/.7). One word is deleted and retyped character by character, then a second word. Selection highlight `scaleX 0→1` 300 ms `(.22,1,.36,1)`. Per-character colour tint. Total ≈6 s. The headline is then editable by the visitor | ≈6 s | mixed | typing timeline, source | confirmed |
| Ops log (hero side) | each edit | list items fade in (350 ms `(.22,1,.36,1)`); older items dim to .675 | 350 ms | `cubic-bezier(.22,1,.36,1)` | WAAPI log | confirmed |
| Hint line | end of demo | fade in | 600 ms, delay 300 | ease-out | WAAPI log | confirmed |
| Status dot | always | `status-pulse` opacity 1→.35→1, wrapped in `motion-safe` | 2400 ms loop | linear | CSS animation | confirmed |
| Text caret | always | `hero-blink` step blink | 1100 ms loop | `steps(1)` | CSS animation | confirmed |

There is no staged hero choreography beyond this: no loader, no headline line-mask on load.

## Scroll-triggered changes

| Element | Trigger | Behaviour | Duration | Easing | Evidence | Confidence |
|---|---|---|---|---|---|---|
| Section h2 lines | `whileInView`, once, margin −12% | each line `translateY(108%) → 0` inside an `overflow-hidden` mask | ≈500 ms | spring (shared `{350, 32, 1}`) | inline transform 108% → 65% → −0.38% (overshoot) → none | confirmed |
| Work rows | `whileInView`, once, margin −5% | `opacity 0→1` only, stagger 60 ms per row | 500 ms (+60/120/180 delays) | spring `{350, 32, 1}` | WAAPI log; source | confirmed |
| About lead paragraph | scroll position | **scroll-linked word-by-word opacity** (each word is a span; dim → 1 across `useScroll` offset `["start 0.9", "end 0.35"]`) | scrubbed | linear map | source; screenshot shows a dimmed tail | confirmed |
| Stack list | category change (see switcher) | — | — | — | — | — |
| Footer | scroll into the last viewport | **reveal footer**: footer is `h-svh` with `clip-path: inset(0)` and an inner `position: fixed` layer. The main content card above it has `rounded-b-[28px]` and a large soft shadow, so it appears to lift off. Inner content parallaxes `y: -15% → 0%` via `useScroll(["start end","end end"])` | scrubbed | linear | markup, source | confirmed |
| Footer wordmark | in view | per-letter mask-up reveal (`overflow-hidden` letter boxes; letters at `transform: none` once revealed). Responds to pointer (spring `{200, 20, .6}`, `-3.5%` shift) | spring | spring | markup, source | confirmed (pointer response unverified visually) |
| Header wordmark | hover or focus | per-letter `y: -2px` wave, spring `{500, 26}`, 12 ms stagger; press `scale .98` | spring | spring | source | confirmed |
| Fast scroll | full-height wheel | Lenis interpolates; no scroll-jacking or pinning; reveals are `once` so nothing replays | — | — | fast-scroll sample | confirmed |

## Interaction states

| Element | Trigger | Behaviour | Duration | Easing | Evidence | Confidence |
|---|---|---|---|---|---|---|
| Hero text links | hover | bottom border `black/20 → black`; arrow `↗` translates `+2px, −2px` | border 150 ms, arrow 300 ms | `cubic-bezier(.4,0,.2,1)` | computed `translate: 2px -2px` | confirmed |
| Hero text links | focus-visible | `outline: 2px solid ink; outline-offset: 3px` | — | — | computed | confirmed |
| Work row | hover | row background `transparent → black/3%`; title `translate-x 4px`; tag borders `8% → 14%`; trailing `→` opacity 0→1 and `translate-x 2px` | 300 ms | `cubic-bezier(.4,0,.2,1)` | `rowHover80` transition list | confirmed |
| Work row | press | **no press scale**; only the hover background remains | — | — | computed `scale: none` while mouse down | confirmed |
| Work row | focus | `outline 2px solid ink`, plus hover background | — | — | computed | confirmed |
| Work row | click / Enter / Space | `article role=button tabindex=0`. Opens a **case-study view**: the island morphs to a top title bar with Close and a progress bar, and the page is replaced by a project page (h1, summary, Year / Stack meta, demo iframe). Escape closes. **Focus moves to `<body>` on open and is not restored on close** (a reference a11y gap) | island 220 ms in; content 500 ms spring + blur 6 px | see island | case screenshots, focus log | confirmed |
| Command palette button (footer) | press | `whileTap scale .96`, spring `{500, 30}` | spring | spring | source | confirmed |
| Back-to-top button | hover | bg → ink, icon → white, icon `−translate-y 2px` | 300 ms | standard | markup | confirmed |
| Hover gating | — | cursor and hover effects check `(hover: hover) and (pointer: fine)` in JS | — | — | source `matchMedia` | confirmed |

## Stack switcher

| Item | Finding | Confidence |
|---|---|---|
| Location | **Desktop: in the bottom island** while the Stack section is active. Section copy says to use the control at the bottom. **Mobile: an inline copy of the same tablist** (`md:hidden`) | confirmed |
| Semantics | `role=tablist`, `role=tab`, `aria-selected`. No `aria-controls` or `tabpanel` observed | confirmed |
| Keyboard | Arrow keys **do not** move between tabs (ArrowRight left focus and selection on the same tab). Tabs are reached with Tab and activated with click or Enter | confirmed: a reference gap; the brief asks us to add arrow keys |
| Transition | indicator spring (above). The tagline and list block fades **out** 150 ms (`opacity 1→0`, `blur 0→6px`, ease-out), then the new block fades **in** 150 ms with a 50 ms delay (`blur 6→0`) | confirmed |
| Content | one-line tagline plus a 4–5 item list of large-type rows (`text ≈ 28px`, hairline separators) | confirmed |

## Copy email

| Item | Finding | Confidence |
|---|---|---|
| Where | contact island row on desktop; inline list row on mobile; also inside the palette | confirmed |
| Action | `navigator.clipboard.writeText(email)` | confirmed (clipboard read back) |
| Feedback | a **toast pill** at top centre (`fixed top-4`, 120×36, ink) reading "Copied …". In: opacity 0→1 plus `blur(4px)→0`, 500 ms spring. Holds ≈1.8 s. Out: reverse, 500 ms | confirmed |
| Screen readers | toast text exists in the DOM, but **no `aria-live` region was found** | confirmed: a reference gap; we add `role=status` |

## Command palette

| Item | Finding | Confidence |
|---|---|---|
| Open | ⌘K on macOS, Ctrl+K elsewhere (both handled; footer label switches by `navigator.platform`); footer button; contact island | confirmed |
| Form | **not a modal sheet**: the island expands in place at the bottom (440 px wide) with input "Type to filter" and an ⌘K hint | confirmed |
| Contents | **contact actions only** (copy email, GitHub, X, résumé), each with a mono hint on the right. Filtering matches label and keywords | confirmed |
| Keyboard | ArrowUp/Down cycle the highlighted row (wraps), Enter runs it, Escape closes | confirmed |
| Focus | input auto-focused on open. **No focus trap** (Tab leaves to page content). **Focus not restored** after Escape (goes to `<body>`) | confirmed: reference gaps; the brief requires a trap and restore |
| Motion | overlay opacity 380 ms `(.22,1,.36,1)`; island layout spring as above | confirmed |

## View counter

| Item | Finding | Confidence |
|---|---|---|
| Mechanism | `POST /api/site-views` with `keepalive`, **fired once when the footer first enters view** (`amount: 'some', once`). Response `{"views": n}`, displayed with `toLocaleString`. Placeholder "— views" before load. The site's own API route, not a third-party tracker | confirmed |
| Also present | a separate first-party analytics script (`/<hash>/script.js`) | confirmed (purpose unverified) |

## Other observations

- Top bar has no header element: a wordmark button (back to top) top-left, a live local clock (mono, tabular) top-right on `md+`, and the island. No nav links outside the island.
- Contact heading is two lines; a one-line note sits under it; a mono hint explains ⌘K / Ctrl K.
- At 375 px there is no clock. The island sits at the bottom; contact rows and the stack switcher render inline.
- Reduced motion (`reducedMotion: 'reduce'`): Lenis off, hero typing demo skipped (final text shown immediately), cursor without spring. **Opacity fades still run** (rows, page fade with blur): fades are kept and movement is dropped.
- No skip link observed. Headings are in order (h1 → h2 → h3).

## Absent from the reference (recorded per ground rule 5; nothing added)

Loader or intro screen · 3D or WebGL · marquee · background video · dark mode or theme toggle · page-transition curtain · parallax imagery · scroll-pinned sections · sound.
