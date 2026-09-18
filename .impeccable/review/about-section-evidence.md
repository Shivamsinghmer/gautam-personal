# About section — inspection evidence

Screenshots are not obtainable in this environment. The desktop app's browser
pane reports `document.visibilityState === "hidden"` and IntersectionObserver
never fires a callback there, so captures come back as flat black frames and
every viewport-driven animation (`Reveal`, `whileInView`, `InView`) is inert.
Evidence below is live DOM geometry instead. Motion is unverified here.

## Composition

Two columns. Left: the studio plate at the frame's own 3:4, signature directly
beneath it on the plate's right edge. Right: the heading and all four movements
in written order. Rules top and bottom at the full measure.

## Desktop — 1440x900

| Thing | Measured |
|---|---|
| Section height | 1115px (was 1696 under the stacked-plate arrangement) |
| Left column | 487 x 673 |
| Right column | 593 x 726 |
| Plate | 487 x 649, ratio 0.750 |
| Plate source | `studio.webp`, natural 1000x1334 — 2.05x at render width |
| h2 | 54.4px, 584px wide, two lines |
| Lead paragraphs (1, 4) | 20px |
| Body paragraphs (2, 3) | 17px |
| Horizontal overflow | none |

Columns land within 53px of each other in height, which is what the 0.82fr/1fr
track split is tuned for.

## Mobile — 390x844

| Thing | Measured |
|---|---|
| Section height | 1621px |
| Stack order | image, then text — same reading order as desktop |
| Plate | 342 x 456, ratio 0.750 |
| h2 | 35.2px |
| Lead / body | 17px / 16px |
| Horizontal overflow | none |

## Checks

- `impeccable detect --json` -> `[]` on both about and testimonials
- `vite build` passes, no TS errors introduced
- Biome clean
- One pre-existing `tsc` error in `background-audio.tsx:123`, unrelated

## Not verified here

- The signature renders behind `ClientOnly` + `InView`, and `InView` depends on
  IntersectionObserver, so it does not mount in this pane. Its geometry is
  unmeasured; the left column's 673px excludes it.
- The plate's entrance (scale 1.06 -> 1 over 1.1s) cannot be observed.
