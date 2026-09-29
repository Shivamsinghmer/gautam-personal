import { motion, useReducedMotion } from "framer-motion";
import { lazy, Suspense } from "react";
import { ClientOnly, InView } from "#/components/ui/deferred";
import { Reveal, ScrollFillBlock } from "#/components/ui/scroll-reveal";
import { INK, SIGNAL } from "#/lib/palette";

/**
 * opentype.js parses a font file to draw the mark, which is ~340kB - far too
 * much to put in the first chunk for a flourish at the foot of one panel. It
 * loads only as the panel comes near.
 */
const Signature = lazy(() =>
	import("#/components/signature").then((m) => ({ default: m.Signature })),
);

/**
 * About: the section the page slows down for.
 *
 * ## What it refuses
 *
 * Every other section here is proof - mastheads, auditoriums, figures, stages.
 * This is the only one where the person appears, and it used to be arranged as
 * a column of body copy with a portrait parked at the bottom of the column
 * beside it. That is the arrangement every personal site ships, and it did two
 * things badly at once: four paragraphs set identically gave a story with four
 * distinct movements no shape at all, and the only photograph of the room the
 * work actually happens in was a ~400px thumbnail. PRODUCT.md's second
 * principle asks for the opposite in as many words - give real images scale and
 * let them lead.
 *
 * ## What it is now
 *
 * Two columns that do different jobs. The left is the person: the studio
 * photograph, and the hand that signs it directly underneath. The right is the
 * story, all four movements in the order they were written.
 *
 * Splitting them that way is what the old arrangement could not do. Body copy
 * with a portrait parked in the middle of it made the reader step over the
 * picture to finish a sentence; here the picture is never in the way of the
 * prose, and it is no longer a thumbnail either - it holds a column of its own
 * at the frame's full 3:4.
 *
 * A single text column still needs a shape, so the sizes carry it: the heading
 * opens, the first and last movements are set at lead size, the two in the
 * middle at body size. Loud, dense, dense, quiet - a dense passage earns a
 * quiet one.
 *
 * ## The copy is fixed
 *
 * The four paragraphs are verbatim and are not re-split, re-ordered, or turned
 * into pull-quotes. Everything above is composition around copy that does not
 * move. The heading is the one line written for this layout: it states the arc
 * in the story's own two facts rather than labelling the section.
 *
 * ## Motion
 *
 * One authored moment, not an entrance on every element: the plate arrives
 * over-scaled and settles onto its crop the first time it comes into view.
 * Everything else uses the page's ordinary reveal or nothing at all.
 *
 * It was a scroll-linked scale first. That tied the settle to a progress value
 * running the whole length of the section, so the plate drifted the entire time
 * it was readable and only reached its authored crop on the way out -
 * continuous motion, which is the fidget PRODUCT.md rules out, rather than the
 * weight arriving that it asks for. An arrival is also what makes the two files
 * honest: each frame matches its file's ratio exactly, so at rest `object-cover`
 * crops nothing, which is only true if the scale actually lands on 1.
 *
 * Never below 1. The picture sits in a clipped frame, and anything under 1
 * shrinks it inside its own box - which does not read as a drift, it reads as
 * the ground showing through at the edges.
 */

/** Key terms in the prose. White against the body's /80, and nothing to hover. */
const TERM = "font-semibold text-white";

export function AboutSection() {
	const reduceMotion = useReducedMotion() ?? false;

	return (
		<section
			id="about"
			// Not `band`. That class sets `padding-block` from `--band` in
			// styles.css, and styles.css is unlayered, so it beats any Tailwind
			// padding utility no matter how specific - `lg:py-14` next to it did
			// nothing at all. The clamp here is `--band`'s own value, so every
			// width below `lg` is byte-for-byte what the token gave; `lg` is the
			// only place it changes.
			className="relative scroll-mt-24 overflow-hidden px-6 py-[clamp(3.25rem,9vw,8.5rem)] sm:px-10 lg:py-12"
			style={{ backgroundColor: INK }}
		>
			<div className="mx-auto w-full max-w-6xl">
				{/* The opening rule, with the page's one accent on it. */}
				<Reveal>
					<div aria-hidden="true" className="flex h-px w-full">
						<span
							className="w-[clamp(3rem,7vw,6rem)]"
							style={{ backgroundColor: SIGNAL }}
						/>
						<span className="flex-1 bg-white/15" />
					</div>
				</Reveal>

				{/* One screen at `lg`, and that is what set the numbers here. The
				    section ran 1126px against a 900px viewport; the padding token
				    was 259px of it, the story column 737px. The cuts, in order of
				    what they cost: the band's own padding capped at `lg` (-163),
				    the lead-in and close tightened (-64), the story's rhythm from
				    `gap-7` to `gap-5` (-32), and the plate column from 0.82fr to
				    0.65fr (-91 of plate height). 869px.

				    0.65fr rather than 0.68fr for the signature's sake. It does not
				    mount until it is scrolled near, so it is invisible while you
				    measure and then arrives and pushes: its box is `fontSize * 3`
				    tall, up to ~93px at this width, and at 0.68fr that tipped the
				    left column past the right and took the section to ~894. The
				    extra three points keep the two columns level whatever the mark
				    measures, so the section's height stops depending on a lazily
				    loaded SVG.

				    All of it is `lg`-only. A phone cannot hold this in a screen
				    and should not try - ten paragraphs' worth of compression to
				    fit 844px would be unreadable.

				    Two columns, and they do different jobs: the left one is the
				    person, the right one is the story. Everything written sits in
				    the right column in the order it was written, and the photograph
				    holds the left on its own, signed underneath.

				    `items-start` rather than stretch, so the picture keeps its own
				    height instead of being pulled down the length of a text column
				    it has no reason to match. Below `lg` the two stack and the
				    picture leads, which is the same reading order. */}
				<div className="grid gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-10 pt-12 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)] lg:items-start lg:pt-8">
					{/* The person. The plate and the hand that signs it, and nothing
					    else in the column. */}
					<div>
						{/* 3:4 at every size now. The column is roughly 460px wide, and
						    16:9 inside it is a 260px band - a letterbox, not a portrait.
						    The centered crop stands up in a narrow column the way the
						    wide cut stood up across a full measure, and it is the file's
						    own ratio, so `object-cover` crops nothing. The ring is the
						    page's own hairline, the same one the gallery and collage
						    frames carry; on ink a photograph needs an edge or it bleeds
						    into the ground. */}
						<Reveal direction="none">
							<figure className="m-0 aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/10">
								<motion.img
									src="/about/studio.webp"
									alt="Gautam Kumawat at his studio desk, hands steepled, a boom microphone, a CRT monitor and a green-lit wall behind him"
									width={1000}
									height={1333}
									loading="lazy"
									decoding="async"
									draggable={false}
									className="block h-full w-full select-none object-cover"
									initial={reduceMotion ? false : { scale: 1.06 }}
									whileInView={{ scale: 1 }}
									viewport={{ once: true, amount: 0.35 }}
									transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
								/>
							</figure>
						</Reveal>

						{/* Signs the picture, not the section - which is why it sits
						    under the plate and on the plate's own right edge rather than
						    at the foot of the text. `duration={0}` puts the component in
						    its drawn mode, so the mark is simply there; tracing it on
						    scroll would replay the preloader's animation halfway down the
						    page. */}
						<div aria-hidden="true" className="mt-6 flex justify-end">
							<ClientOnly>
								<InView rootMargin="400px" once>
									<Suspense fallback={null}>
										<Signature
											text="Gautam Kumawat"
											color="#f4fbf8"
											fontSize={40}
											duration={0}
											className="h-auto w-[min(76%,260px)] opacity-90"
										/>
									</Suspense>
								</InView>
							</ClientOnly>
						</div>
					</div>

					{/* The story, in one column and in order. The heading opens it, the
					    first and last movements are set at lead size and the two in the
					    middle at body size, so a single column still has a shape:
					    loud, dense, dense, quiet. */}
					<div className="flex flex-col gap-7 lg:gap-5">
						<Reveal>
							<h2 className="display max-w-[16ch] text-balance text-[clamp(2.2rem,4.4vw,3.4rem)] text-white">
								An 8km walk to 21 countries.
							</h2>
						</Reveal>

						{/* The four movements fill from dim to white as one edge moving
						    through them in reading order - see `ScrollFillBlock`. They were
						    four separate fills first, and with two paragraphs on screen the
						    two filled at once, each half-lit. One block, one progress. The
						    fill is the entrance, so there is no `Reveal` stacked on it, and
						    the bold terms keep their weight as the distinction now that
						    colour no longer separates them from the prose. */}
						<ScrollFillBlock
							className="flex flex-col gap-7 lg:gap-5"
							paragraphs={[
								{
									className:
										"max-w-[46ch] text-pretty text-[1.0625rem] leading-[1.6] text-white sm:text-[1.25rem]",
									strongClassName: TERM,
									segments: [
										"Gautam Kumawat grew up walking 8km to school, studying by the light of a homemade oil lamp. Privilege wasn't part of the story — ",
										{ strong: "determination" },
										" was.",
									],
								},
								{
									className:
										"max-w-[60ch] text-pretty text-base leading-[1.75] text-white sm:text-[1.0625rem]",
									strongClassName: TERM,
									segments: [
										"At 12, curiosity about how phones worked led him into hacking, self-taught and relentless. By 16, he was working with ",
										{ strong: "global law enforcement" },
										" on cybercrime investigations — a path that's since grown into ",
										{ strong: "3,000+ cases solved" },
										". His work drew national and global media attention, with features in Times of India, Economic Times, India Today, Hindustan Times, The Hindu, and Thrive Global.",
									],
								},
								{
									className:
										"max-w-[60ch] text-pretty text-base leading-[1.75] text-white sm:text-[1.0625rem]",
									segments: [
										"But the numbers are only half the story. Gautam meditates 2 hours a day (Vipassana, for over a decade), draws inspiration from Vivekananda and Bhagat Singh, and finds balance through MMA, golf, and horseback riding — with a bit of mind-reading magic thrown in to keep wonder alive.",
									],
								},
								{
									className:
										"max-w-[46ch] text-pretty text-[1.0625rem] leading-[1.6] text-white sm:text-[1.25rem]",
									segments: [
										"He's flown planes, built companies, left comfort behind for harder problems, and traveled to 21 countries in search of truth, not just business. His life is proof that anyone, from anywhere, can build a life without limits.",
									],
								},
							]}
						/>
					</div>
				</div>

				<div className="mt-12 lg:mt-8" />

				{/* The closing rule, which takes the section out the way the blue one
				    brought it in. */}
				<div
					aria-hidden="true"
					className="mt-12 border-t border-white/15 lg:mt-16"
				/>
			</div>
		</section>
	);
}
