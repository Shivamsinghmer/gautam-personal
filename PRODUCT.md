# Product

## Register

brand

## Users

Two audiences arrive on the same page and want different proof.

**Institutional buyers** — training coordinators at police academies, cyber cell leads, faculty booking a guest session. They arrive skeptical, often on a desktop during working hours, and are deciding whether this person is credible enough to put in front of serving officers. They want evidence of real casework and real institutions, fast.

**Individual learners and parents** — people who found Gautam through a news feature, a talk, or social. Usually on a phone. They want to know what he teaches, whether it applies to them, and how to book something.

The job to be done for both: *decide, in under a minute of scrolling, whether this person is the real thing* — then find the way to contact him.

## Product Purpose

A personal site for Gautam Kumawat, a cybersecurity trainer and investigator. It exists to convert reputation into bookings: mentorship calls, training engagements, and speaking slots.

Success is a visitor who arrives cold, believes the credential, and reaches a booking CTA. The site is not a course catalogue and not a blog; it is a case for one person, built from the evidence available — seven years across law enforcement agencies in India and the US, 41,000+ students in 162 countries, national press coverage, and stage footage.

## Brand Personality

**Bold · Energetic · Cinematic.**

Stage presence rather than office presence. The voice is confident and plain — it states what happened and lets scale do the persuading. Big type, high contrast, real photography of real rooms. Motion has momentum: things arrive with intent, they do not drift in politely.

Emotionally the page should feel like the moment the house lights drop before a keynote — anticipation, authority, and a sense that the room is full.

What it must never sound like: hedging, or selling. The credential is strong enough to state flatly.

## Anti-references

- **Hacker cliché.** No matrix green-on-black, no terminal typefaces used as decoration, no glitch effects for their own sake, no padlock/skull/hoodie iconography. The subject is a professional investigator, not a stock image of "cyber".
- **Influencer / guru site.** No shouted money figures, no circle-and-arrow scribbles over photos, no countdown timers or manufactured scarcity, no wall of stock-photo testimonials. Numbers appear because they are true, at a size proportionate to their importance.
- Also avoid, by extension: generic SaaS gradient-blob landing pages and identical icon-card grids.

## Design Principles

1. **Evidence over adjectives.** Every claim on the page should be attached to something verifiable — a masthead, a stage, a named institution, a real figure. Where a real asset exists, show it instead of describing it.
2. **The room is the proof.** Photography of full auditoriums, panels and stages carries more credibility than any copy about credibility. Give real images scale and let them lead.
3. **Scale is the voice, not volume.** Boldness comes from size, contrast and confident spacing — not from louder colour, more effects, or urgency tricks.
4. **One accent, used with intent.** A single blue does the pointing. When everything is highlighted, nothing is.
5. **Momentum, never fidget.** Motion should feel like weight arriving and settling. No perpetual ambient wiggle competing with the content.

## Accessibility & Inclusion

- Target **WCAG 2.2 AA**. Body copy ≥ 4.5:1, large/display text ≥ 3:1, verified against the actual composited background rather than assumed — this site layers type over photography, video-like canvases and animated fields, so contrast must be checked against the brightest state the backdrop reaches.
- **Reduced motion is a first-class path, not a fallback.** The site leans on scroll reveals, count-ups, an ASCII canvas and a rotating carousel. Under `prefers-reduced-motion: reduce` every one of these must resolve to its finished state — visible content, true figures — never a hidden or zeroed one.
- Content must never be gated on an animation firing. Reveals enhance an already-visible default, so a stalled observer or a headless render degrades to plain content rather than a blank section.
- Interactive elements need visible focus states and real semantics (buttons that are buttons, links that are links), since the page is heavily image- and hover-driven.
- All imagery carries meaningful `alt`; decorative layers are `aria-hidden`.
