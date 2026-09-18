---
version: 1
slug: "src-components-about-section-tsx"
primary_target: "src/components/about-section.tsx"
related_targets: []
---

Scope: the About section of the single-page site (`src/components/about-section.tsx`). Visitor mode: **Persuade**.

Audience: a training coordinator or cyber-cell lead deciding whether this person can stand in front of serving officers, and a learner who arrived from a news feature. Job: this is the one section where the *person* appears — every other section is proof (mastheads, auditoriums, figures, stages). Action: keep reading toward the booking block. Proof on hand: the four-paragraph origin story (fixed, verbatim) and one photograph of the room he records in.

Constraints: the four paragraphs are verbatim and unsplittable. Heading wording and the signature sign-off are open. The site's visual world is settled and inherited — this is an extension, not a new identity.

## Direction contract

THESIS: The section the page slows down for. It refuses the arrangement it had — a column of body copy with a portrait parked beside it — because that is the arrangement every personal site ships and it buries the one photograph of the room the work happens in. The story is staged as movements, and the room arrives at full measure between them.

OWN-WORLD: Inherited, not invented. `INK` ground, Archivo on its width axis for display, hairline rules as the only structure, one `SIGNAL` blue lead on the opening rule, body at white/80. The one thing this section adds to the system is scale: a full-measure photographic plate, which no other section on the page uses.

STORY: He was not given this. The visitor reads the origin in display type, meets the room at full width, then takes the rest — the casework, the interior life, the reach — as three descending beats, and leaves with a person rather than a CV.

FIRST VIEWPORT: Opening rule with the blue lead, full measure. Below it the section splits into two columns that do different jobs. Left, the person: the studio photograph at the frame's own 3:4, rounded, hairline ring, roughly 490px wide, with the handwritten signature directly under it on the plate's right edge — it signs the picture, not the section. Right, the story: the heading "An 8km walk to 21 countries." at `clamp(2.2rem,4.4vw,3.4rem)`, then all four movements in the order they were written, the first and last at lead size and the two in the middle at body size, so a single column still reads loud-dense-dense-quiet. The closing rule takes it out. Below `lg` the columns stack and the picture leads, which is the same reading order. No primary action here — the page's CTA lives in the booking block; this section's job is belief, and its exit is the scroll.

Superseded along the way, and worth keeping on the record: a full-measure 16:9 plate between the movements (too much picture — the plate became the subject rather than the centre), then the same plate at 72% (better, but it still cut the prose in half and made the reader step over the photograph to finish a thought).

FORM: Extension of an established surface, so no direction roll and no seed key: section 3 of new-work routes a section inside a settled world to inherit that world and resolve only composition. Ordered alternatives considered and rejected: portrait plate as a tall asymmetric column (keeps the source ratio but re-runs the two-column arrangement the thesis refuses); photograph as section background under the type (drowns the copy and fails contrast against a bright green plate).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
