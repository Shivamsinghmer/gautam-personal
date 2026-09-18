---
name: Gautam Kumawat
description: A near-black broadcast field, ruled not carded, cut to daylight where the evidence is printed.
colors:
  ink: "#0a0a0a"
  ink-raise: "#1c1c1c"
  ink-deep: "#050505"
  signal: "#1447e6"
  paper: "#fafafa"
  paper-ink: "#0a0a0a"
  paper-ink-soft: "#737373"
  type-primary: "#ffffff"
  type-secondary: "rgb(255 255 255 / 0.80)"
  type-tertiary: "rgb(255 255 255 / 0.60)"
  rule: "rgb(255 255 255 / 0.14)"
  rule-strong: "rgb(255 255 255 / 0.32)"
  rule-paper: "rgb(10 10 10 / 0.16)"
typography:
  display:
    fontFamily: "Archivo, DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.2vw, 5.2rem)"
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 108, 'wght' 780"
  display-wide:
    fontFamily: "Archivo, DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 3vw, 2.1rem)"
    lineHeight: 0.94
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 125, 'wght' 720"
  display-tight:
    fontFamily: "Archivo, DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 3.2vw, 2.4rem)"
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 74, 'wght' 760"
  headline:
    fontFamily: "Archivo, DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5.2vw, 4.2rem)"
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 108, 'wght' 780"
  figure:
    fontFamily: "Archivo, DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3.1vw, 2.6rem)"
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontFeature: "'tnum' 1, 'lnum' 1"
    fontVariation: "'wdth' 108, 'wght' 780"
  lead:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  tile: "3px"
  plate: "1rem"
  card: "1.5rem"
  pill: "100px"
spacing:
  gutter: "1.5rem"
  gutter-wide: "2.5rem"
  measure: "72rem"
  band-tight: "clamp(2.25rem, 5.5vw, 5rem)"
  band: "clamp(3.25rem, 9vw, 8.5rem)"
  band-wide: "clamp(4rem, 13vw, 12rem)"
components:
  button-primary:
    backgroundColor: "{colors.ink-raise}"
    textColor: "{colors.type-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-fallback:
    backgroundColor: "#171717"
    textColor: "{colors.type-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  plate:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    width: "72%"
  daylight-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
  stat-cell:
    textColor: "{colors.type-primary}"
    typography: "{typography.figure}"
    rounded: "0px"
    padding: "1rem 0 0"
  press-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink-soft}"
    rounded: "0px"
    padding: "2.75rem 1.75rem"
  section-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.type-primary}"
    padding: "{spacing.band} {spacing.gutter}"
  section-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    padding: "{spacing.band-tight} {spacing.gutter}"
---

# Design System: Gautam Kumawat

## Overview

**Creative North Star: "The House Lights Drop"**

The page is a darkened auditorium with a lit stage in it. Near-black is the default room and almost everything lives there: the hero, the origin story, the journey, the collage, the book, the ask. Structure never comes from a panel or a card — it comes from hairline rules drawn across the full measure, the way broadcast graphics are ruled rather than boxed. Type is the loud element: one variable family, Archivo, driven on its width axis so a title card and a scoreboard come out of the same file. Colour is spent once. A single blue points, and it points at rules and at actions, not at everything.

Twice the lights come up. The press wall and the travel gallery cut to a true off-white, because mastheads and documentary photographs are printed on paper and knocking them back to silhouettes on black hides the evidence instead of presenting it. Inside the ink, the reach card is a third daylight moment of a different kind: the plate keeps its own white studio sweep, so nothing is layered over it — no wash, no ring, no sheen, because a white hairline on white is invisible and white on near-black draws its own edge.

Density is varied on purpose. Bands pick one of three rhythm steps rather than repeating one padding pair, and the pacing inside a section is written as a sequence: thin rule, loud type, loud image, dense text, quiet close. Motion is weight arriving and settling — two easing curves for the whole site, one entrance primitive, nothing that bounces and nothing that drifts forever.

**Key Characteristics:**
- Near-black ground with deliberate cuts to paper, and one photographic cut to daylight inside the ink
- One variable family (Archivo) across three width settings; DM Sans carries every non-display word
- Hairline rules as the only structure — no bordered cards, no tinted panels
- One blue, used as a pointer and a section accent, never as a highlight on every figure
- Photography at full measure, built to its final ratio rather than cropped into it
- Momentum motion: entrances play once, and reduced motion resolves to the finished state

## Colors

A three-tone stage — ink, paper, signal — with the rest of the palette being white at controlled alphas.

### Primary
- **Signal Blue** (`{colors.signal}`): the page's only accent. It is the lead segment of a section's opening hairline (a `clamp(3rem,7vw,6rem)` bar before the rule runs out in white/15), the fill of the primary action, the tab on the book card, and the `::selection` background. It is never used as a tint over a photograph and never applied to figure suffixes.

### Neutral
- **Ink** (`{colors.ink}`): the default room. Every section ground but the press wall and the gallery.
- **Ink Raise** (`{colors.ink-raise}`): one step up, for the rare panel that has to separate from ink — the book section's manuscript stage and the journey stack's card ground.
- **Ink Deep** (`{colors.ink-deep}`): below ink, used as the shade under type set over photography (the booking nameplate).
- **Paper** (`{colors.paper}`): the daylight ground. A true off-white at near-zero chroma tilted toward the signal's hue rather than toward warmth — the warm near-white band reads as cream, and cream is ruled out by the brand's anti-references.
- **Paper Ink** (`{colors.paper-ink}`) / **Paper Ink Soft** (`{colors.paper-ink-soft}`): headings and secondary copy on paper.
- **Hairline** (`{colors.rule}`), **Hairline Strong** (`{colors.rule-strong}`), **Hairline Paper** (`{colors.rule-paper}`): the structural material. `rule-strong` carries the nameplate; `rule-paper` draws the press grid.
- **Type on ink**: white at full strength for headings and figures, `{colors.type-secondary}` for lead copy, `{colors.type-tertiary}` for labels and captions, and `/50` only for a caption supporting something already stated.

### Named Rules
**The One Accent Rule.** The blue points; it does not decorate. A section gets one blue element — the opening rule's lead, or the primary action, not a scatter of both. No accent on figure suffixes, no accent as a hover state.

**The Cut To Daylight Rule.** Paper is a structural beat, not a theme. It is whole-section ground where the content is printed evidence or documentary photography (the press wall, the press strip's own band, the travel gallery), and nowhere else. A separate daylight moment lives inside the ink — the reach card's plate, which keeps its own white studio ground — and that one is a photograph keeping its background, not a section changing colour. Both are cuts; neither is an inconsistency to be smoothed.

**The 90% Floor Rule.** Where white type sits on `{colors.signal}`, secondary copy floors at 90% white (5.82:1), never the usual `/60` or `/70` — white at 70% composites to 4.11:1 and misses AA. The `signal` tone of the figure index encodes this.

## Typography

**Display Font:** Archivo (variable, `wdth` 62–125 / `wght` 100–900), falling back to DM Sans then system sans
**Body Font:** DM Sans (variable, `opsz` 9–40 / `wght` 400–800)
**Label Font:** DM Sans, uppercase and wide-tracked — no separate mono or label family

**Character:** One family doing two jobs. Set wide and heavy, Archivo has the presence of a title card; set condensed and heavy it stacks figures like a scoreboard. That beats pairing two sans-serifs that would only ever look like each other's near-miss. DM Sans under it is plain and gets out of the way.

### Hierarchy
- **Display** (`wdth` 108 / `wght` 780, `clamp(2.4rem,5.2vw,5.2rem)`, 0.95, −0.035em): the hero wordmark and the page's own voice.
- **Display Wide** (`wdth` 125 / `wght` 720, 0.94, −0.03em): the widest setting, reserved for the one or two lines per page that speak as the page rather than label a section — the pull quote.
- **Display Tight** (`wdth` 74 / `wght` 760, 0.9, −0.02em): condensed, for names on a nameplate and anything stacked in a narrow column.
- **Headline** (display at `clamp(2.4rem,5.2vw,4.2rem)`, max 14ch, balanced): section headings. The press wall runs smaller (`clamp(1.95rem,3.8vw,3.1rem)`); the journey runs larger (`clamp(2.6rem,6vw,4.6rem)`, max 9ch).
- **Figure** (display plus tabular lining numerals, `clamp(1.75rem,3.1vw,2.6rem)`, or `clamp(2.6rem,5.4vw,4.75rem)` at `lg`): every number on the page. Tabular so columns line up, lining so they sit on the cap line beside display type.
- **Lead** (DM Sans 400, `1.0625rem` → `1.25rem`, 1.6, max 46ch, white/80): the opening paragraph of a movement.
- **Body** (DM Sans 400, `0.9rem`–`0.95rem`, relaxed, max 38ch, white/70; long prose capped at 68ch with `text-wrap: pretty`).
- **Label** (DM Sans 500–600, `0.68rem`–`0.72rem`, uppercase, 0.16em — 0.18em on running heads, 0.12em under figures, white/60).

### Named Rules
**The Width-Axis Rule.** Weight and width are the hierarchy. Reach for a different `wdth` before reaching for a second typeface, a colour, or a decorative treatment.

**The Tight-But-Not-Touching Rule.** Display letter-spacing stays at or above −0.035em. Tighter than −0.04em the letters touch, which reads as cramped rather than as designed.

**The Running Head Rule.** A section opens with a rule, not with an eyebrow. Two forms exist and both are the page's grammar: the full-measure hairline with the blue lead segment (about, book), and the span-plus-count pair sitting on one rule across the measure (journey, gallery). A section says what it is in its heading; it does not label itself above it.

**The Tabular Figure Rule.** Every figure carries `tabular-nums lining-nums`. A figure without them is a defect, not a variant.

## Layout

One column, one measure. Every section sets its own ground colour on a full-bleed `<section>` with `1.5rem` gutters (`2.5rem` from `sm`), and holds its content to a `72rem` centred measure inside them. Full-bleed content is the exception and must earn it: the testimonial carousel breaks the measure because its cards are a fixed pixel width and need the room to slide, but its heading still opens on the site's own column.

Vertical rhythm runs on three steps rather than one repeated padding pair — `band-tight` for a wall of evidence, `band` for the default section, `band-wide` where a composition needs air. The clamp floors, not the ceilings, are what a phone gets: at 375px the `vw` term contributes only ~34px, so the small end is tuned by lowering the floor and the desktop values are untouched. A section that must hold a single screen (reach) opts out of the band scale entirely and uses flat padding, because the band steps scale off viewport *width* and a wide-but-short laptop would otherwise get a tall section's padding.

Grids are built from the measure, not from fixed columns: `lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]` for a heading-against-lead turn, `lg:grid-cols-[55%_minmax(0,1fr)]` where a plate's share of the measure is the composition. Two-column turns align on `items-end`, so a short heading sits on a shared baseline with the taller column rather than floating above it. Breakpoints are Tailwind's defaults; `sm` (640px) and `lg` (1024px) carry almost all of the work.

### Named Rules
**The Measure Rule.** `max-w-6xl` inside `px-6 sm:px-10`. Anything that leaves the measure needs a reason written next to it, and its heading stays inside regardless.

**The Hairline-Grid Rule.** A grid of cells is ruled container-top-left plus cell-right-bottom, so neighbours share one hairline instead of stacking two — and the cell count is padded to complete the grid at every column count rather than leaving a ragged last row.

## Elevation & Depth

Flat, with one exception. The system is tonal and ruled: depth comes from three ink values, from hairlines, and from photography at scale — not from shadows. Sections do not float; they butt against each other and the change of ground is the edge. The only real shadow vocabulary on the page belongs to the primary action, where a stacked ambient set under a chrome pill is the point of the object, and it is not available to anything else.

Texture stands in for elevation where a large flat field would band: a grey fractal-noise SVG at `opacity: 0.02`, plain alpha and no blend mode. The value is load-bearing — a blend mode forces a full-bleed section onto its own compositor layer and re-blends it every frame, and the same noise at 0.07 lifts a near-black field to a visibly lighter charcoal than the flat sections either side, so the seam reads as a bug rather than as texture.

### Shadow Vocabulary
- **Action rest** (`box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 36px 14px rgba(0,0,0,0.02), 0 20px 12px rgba(0,0,0,0.08), 0 9px 9px rgba(0,0,0,0.12), 0 2px 5px rgba(0,0,0,0.15)`): the primary action at rest.
- **Action hover** (`box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 12px 6px rgba(0,0,0,0.05), 0 8px 5px rgba(0,0,0,0.1), 0 4px 4px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.2)`): the stack tightens as the object comes toward the pointer.
- **Action pressed** (`box-shadow: 0 0 0 1px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)`, plus an inset on the core): the object sits down.

### Named Rules
**The Ruled, Not Carded Rule.** Structure is a 1px hairline across the full measure. When a block needs separation, give it a rule or a tonal step — not a rounded panel with a `white/10` border.

**The 0.02 Grain Rule.** Grain is `opacity-[0.02]`, plain alpha, `-z-10`, `aria-hidden`, on a 180px tile. It is not a dial to taste: anything heavier lifts the ground and breaks continuity with the sections either side.

## Shapes

Rectangles and hairlines, with radius reserved for things that behave like objects. Sections, rules, grids and the figure index have no radius at all. Photographic plates take `1rem` (the about plate, the gallery tiles); a card that behaves like a held object takes `1.5rem` (the reach card); anything that is pressed is a full pill at `100px`; a press logo that ships as a coloured tile rather than a wordmark takes `3px` so it stays a printed mark. The figure-index chip is the one circle on the page, and its border is a rotating conic chrome gradient (`.liquid-metal-ring`, a `1.5px` padding-box with an ink fill inset on top) rather than a tinted disc — the metal grammar the primary action already established, at no extra WebGL cost.

Frames are cut, not cropped. A plate's file and its frame are built to the same ratio, so `object-cover` crops nothing at rest and there is no `object-position` to tune; where a ratio cannot be cut out of a source without losing the subject, the studio sweep is extended to reach it instead.

### Named Rules
**The Built-To-Ratio Rule.** If a frame needs a ratio the source cannot give, rebuild the raster at that ratio. Do not crop twice — two crops deep there is no headroom left to bias with `object-position`.

**The Width Is A Cap Rule.** Raster widths are the largest the layout can ask for at a 2× DPR, and `width` is a cap, not a resize target: `withoutEnlargement` means a source smaller than the cap ships at its own size rather than being upscaled into softness.

**The Art-Direction Rule.** A plate that is a landscape composition on desktop changes ratio rather than shrinking on a phone — 16:9 at 390px is a 199px strip, which is not worth the scale a composition spends on it.

## Components

### Buttons
- **Shape:** full pill (`100px`).
- **Primary:** the liquid-metal shader pill — a dark chrome field (`linear-gradient(180deg, #202020, #000)` core) under a WebGL sheen, label in white, arrow trailing. It is lazy-loaded and always renders a real `<a>` or `<button>` first.
- **Fallback:** the same object flat — `#171717` ground, white label at `0.875rem` semibold, `12px 24px`, `hover:opacity-90`. This is what ships until the shader arrives and what a headless render sees, so it has to look deliberate on its own.
- **Hover / Pressed:** the shadow stack tightens on hover; on press the object translates 1px down, scales to 0.98 and takes an inset, with a white radial ripple from the pointer.

### Cards / Containers
- **Photographic plate:** `1rem` radius, `ring-1 ring-white/10`, held to a stated share of the measure (72%) and left-aligned to it, `overflow-hidden`. On ink a photograph needs an edge or it bleeds into the ground.
- **Daylight card:** `1.5rem` radius, no ring, no wash, nothing layered over it. Used where the plate carries its own white ground — the white draws its own edge against ink, and a `white/10` hairline on white is invisible.
- **Internal padding:** grid cells run `py-9 px-5` (`sm:py-11 px-7`); the page prefers rules and gaps to padded boxes.

### Navigation
- A floating pill menu over the page: the collapsed bar is translucent at `rgba(10,10,10,0.84)`, the expanded panel fully opaque `#0a0a0a`, because a panel of text at 84% lets the hero read straight through it. Links are DM Sans, uppercase, wide-tracked, `white/70` rising to full white, with a 2px underline wiping in from the left on hover and active.

### Figure Index (signature component)
Two forms of the same block. **Rule** is the broadcast form: each figure under its own hairline, condensed display type with tabular numerals, uppercase label beneath. The rule belongs to the cell rather than sitting between cells, so it survives any wrap without stranding a divider at the end of a row. **Chip** is the icon form: a `44–48px` chrome-ringed circle above the figure. Figures count up over 2.6s — slow enough to watch one climb rather than catch six flickering — and resolve instantly to the true value under reduced motion.

### Section Opening Rule (signature component)
A 1px full-measure row: a `clamp(3rem,7vw,6rem)` segment of signal blue, then `white/15` to the right margin. It is `aria-hidden`, it is how a section attaches to the page, and its closing twin is how a band lands rather than stops.

### Reveal (signature component)
The standard entrance for everything on the page: opacity 0 plus a 28px offset in one of four directions, 0.6s on `cubic-bezier(0.22,0.61,0.36,1)`, fired the first time 25% of the element is in view, and only once — content that re-animates on every pass reads as broken and makes a page tiring to scroll back up. `RevealGroup` / `RevealItem` stagger a grid at 0.045–0.08s per child. Under `prefers-reduced-motion` it renders a plain element with no wrapper, which is also the safe failure if the observer never fires.

### Named Rules
**The Never-Hidden Rule.** Reveals enhance content that is already visible. No entrance may be the only thing that makes content appear — a stalled observer, a reduced-motion setting or a headless render must degrade to plain, complete content with true figures.

**The Momentum Rule.** Two curves for the whole site: `--ease-out-expo` `cubic-bezier(0.16,1,0.3,1)` as the house curve, `--ease-out-quint` `cubic-bezier(0.22,1,0.36,1)` for short moves. Nothing bounces, and nothing moves forever — the one marquee pauses on hover and stops entirely under reduced motion.

## Do's and Don'ts

### Do:
- **Do** hold content to `max-w-6xl` inside `px-6 sm:px-10`, and open the section with a rule — the blue-lead hairline, or the span/count running head.
- **Do** set every heading and every figure in Archivo via `.display` / `.display-wide` / `.display-tight`, and every figure with `.tnum`.
- **Do** spend the blue once per section, on a rule lead or a primary action.
- **Do** cut to `{colors.paper}` when the content is printed evidence or documentary photography, and let the marks keep their own brand colour from first paint.
- **Do** give a photograph scale: full measure or a stated share of it (72%, 55%), with the file built to the frame's ratio.
- **Do** wrap entrances in `Reveal` at 0.6s with a 0.04–0.16s delay ladder, and make sure the content reads without it.
- **Do** floor secondary white type at 90% on the blue field.
- **Do** size rasters to the largest width the layout can ask for at 2× DPR, capped with `withoutEnlargement`.

### Don't:
- **Don't** put an eyebrow, kicker or all-caps label above a section heading. The heading says what the section is; a rule gives it something to hang from.
- **Don't** build structure from rounded panels with `white/10` borders. Rule it, or step the tone.
- **Don't** layer a wash, ring, sheen or blend over a plate that carries its own white ground — those are arguments with the photograph, not treatments of it.
- **Don't** raise the grain above `0.02`, or give it a blend mode.
- **Don't** tint a figure's suffix, highlight every number, or use the blue as a hover state.
- **Don't** crop a plate twice; rebuild the raster at the ratio the frame needs.
- **Don't** ship perpetual ambient motion — no always-on drift, no re-firing reveals, no animation that content depends on.
- **Don't** set display type tighter than −0.04em, and don't introduce a second sans-serif to do what a width axis already does.
