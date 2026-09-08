import { ArrowUpRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { LiquidMetalButtonFallback } from "#/components/liquid-metal-button";
import { ClientOnly, InView } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { INK, INK_DEEP, SIGNAL } from "#/lib/palette";

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

/**
 * three.js plus the GLTF loader is the heaviest import on the page, so it is
 * fetched only when the section is approaching and released again once it is
 * well behind - a WebGL context spinning for a book nobody is looking at is
 * what made this page feel like it was dragging.
 */
const ModelViewer = lazy(() =>
	import("#/components/ui/model-viewer").then((m) => ({
		default: m.ModelViewer,
	})),
);

/**
 * The book, on a lit stage.
 *
 * ## The two versions before this one
 *
 * **The original** put the model in a 4:3 box in the right column beside a
 * 26rem block of copy. The object was too small to be the point and too big to
 * be a garnish, and it sat unlit on a dark field - which is most of why it read
 * as not showing at all. A dark model on a dark ground with nothing behind it
 * has no edge to catch.
 *
 * **My first redesign** removed the model and set the section as a quiet
 * typographic half-title page. That was the wrong read of "premium". This
 * brand's personality is Bold, Energetic, Cinematic - "the moment the house
 * lights drop before a keynote" - and a near-empty band of small grey type on
 * near-black is a library at closing time. On a page carrying a shader hero, a
 * wall of mastheads and a drenched blue ledger, restraint that quiet does not
 * read as confidence. It reads as the section that failed to load.
 *
 * ## What it is now
 *
 * The house lights drop and one object is lit. The section is a dark room with
 * a single overhead source - a shaft, a pool on the floor, a contact shadow -
 * and the book stands in it at roughly three times the size it used to be. The
 * copy waits in the dark at the edge of the pool.
 *
 * The light is not decoration bolted on to make the section look designed. It
 * is the one material this brand is actually about, it is the reason the model
 * is legible against ink at all, and it is doing real structural work: the
 * shaft, pool and shadow are CSS, so the stage is fully composed on the server
 * render, before three.js has loaded, and anywhere WebGL is unavailable. The
 * old layout's failure mode was half an empty section. This one's is a lit
 * empty stage, which is a fair picture of what the copy is describing.
 *
 * ## Copy
 *
 * Still no title, no date, nothing to pre-order, and still nothing invented to
 * fill them - a cover line or a ship date for a book that does not exist is the
 * exact guru move this brand rules out. The three blanks are set as a colophon,
 * the way a copyright page states what is not yet settled.
 *
 * ## Attribution
 *
 * The model is "Stylized Book" by Kevin, licensed CC BY 4.0:
 * https://sketchfab.com/3d-models/stylized-book-dfe34d6fe2404c67a70c3703bff3ba69
 * The visible credit line was removed at the client's request. CC BY asks for
 * attribution in a manner reasonable to the medium, so if this ships publicly
 * that line belongs somewhere real - a /credits page, or the about copy -
 * rather than only in this comment.
 */

/**
 * The colophon. Three facts, all of them absences, stated flatly.
 *
 * Deliberately shaped unlike the about section's dossier (label left, detail
 * right, one row each) and unlike `StatIndex` (figure first, label under). This
 * is a single strip on one rule, which is the furniture of a title page.
 */
const COLOPHON: { term: string; value: string }[] = [
	{ term: "Working title", value: "Not chosen" },
	{ term: "Publication", value: "No date" },
	{ term: "Availability", value: "Nothing to pre-order" },
];

/**
 * The address is already published by the site - `__root.tsx` puts it in the
 * menu under Connect - so pointing here is not a new disclosure.
 *
 * It is a mailto rather than the `#book` anchor the original button used. That
 * button said "Hear when it lands" and scrolled to the availability block for
 * booking a keynote, which is a promise the page did not keep. This does what
 * it says. Swap it for a real list when there is one.
 */
const NOTIFY = "mailto:gautam.kumawat.kkb@gmail.com?subject=The%20book";

/**
 * The stage: shaft, pool, contact shadow.
 *
 * All three are CSS on `aria-hidden` layers, which is the point - they compose
 * the section on the server, before the loader runs, and if WebGL never
 * arrives. The model drops into a stage that is already lit.
 */
function Stage() {
	return (
		<>
			{/* The shaft. A cone narrow at the top and wide at the floor, clipped out
			    of a soft vertical wash, so the light has a visible path instead of
			    appearing as a glow with no source. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					clipPath: "polygon(37% 0%, 63% 0%, 97% 90%, 3% 90%)",
					background:
						"linear-gradient(to bottom, rgb(255 255 255 / 0.12) 0%, rgb(255 255 255 / 0.055) 48%, rgb(255 255 255 / 0) 92%)",
				}}
			/>

			{/* The pool where the shaft lands. Warm-neutral rather than tinted: a
			    coloured spotlight reads as a nightclub, and this section's one
			    colour is the accent on the button. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 46% 15% at 50% 85%, rgb(255 255 255 / 0.18) 0%, rgb(255 255 255 / 0.06) 46%, rgb(255 255 255 / 0) 78%)",
				}}
			/>

			{/* The contact shadow, tight under the object, so it stands on the floor
			    rather than floating above it. This is what sells the pool as ground. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(ellipse 19% 4.5% at 50% 83%, rgb(0 0 0 / 0.72) 0%, rgb(0 0 0 / 0.32) 55%, rgb(0 0 0 / 0) 100%)",
				}}
			/>
		</>
	);
}

export function BookSection() {
	return (
		<section
			id="the-book"
			className="band relative isolate scroll-mt-24 overflow-hidden px-6 sm:px-10"
			style={{ backgroundColor: INK_DEEP }}
		>
			{/* A dip, not a cut. The sections either side are on INK, so both edges
			    ramp back to it and the darker room reads as the lights going down
			    rather than as another hard boundary. Alpha-zero INK rather than
			    `transparent`: `transparent` is rgba(0,0,0,0), and interpolating from
			    it drags the middle of the ramp toward black. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 z-20 h-40"
				style={{
					background: `linear-gradient(to bottom, ${INK} 0%, ${INK}00 100%)`,
				}}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40"
				style={{
					background: `linear-gradient(to top, ${INK} 0%, ${INK}00 100%)`,
				}}
			/>

			<div className="relative mx-auto max-w-6xl">
				{/* The slug line. Two items on one rule - a status at the left, the
				    section's own name at the right - so it reads as a running head
				    across the top of the band rather than as a kicker sitting on the
				    heading's shoulder. */}
				<Reveal>
					<div
						className="flex items-center justify-between gap-6 border-t pt-5"
						style={{ borderColor: "rgb(255 255 255 / 0.2)" }}
					>
						<p
							className="flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase text-white/60"
							style={{ letterSpacing: "0.18em" }}
						>
							{/* A lit dot, not a pulsing one. "Momentum, never fidget" - a
							    perpetual ping beside a status line is exactly the ambient
							    wiggle the brand rules out. */}
							<span
								aria-hidden="true"
								className="h-1.5 w-1.5 shrink-0 rounded-full"
								style={{
									backgroundColor: SIGNAL,
									boxShadow: `0 0 10px 1px ${SIGNAL}80`,
								}}
							/>
							In progress
						</p>

						<p
							className="text-[0.7rem] font-semibold uppercase text-white/35"
							style={{ letterSpacing: "0.18em" }}
						>
							The book
						</p>
					</div>
				</Reveal>

				{/* Copy at the edge of the pool, object in it. The stage takes the
				    larger share of the row - it is the thing the section is about, and
				    the original had that ratio the wrong way round. */}
				<div className="mt-10 grid items-center gap-10 lg:mt-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
					<div className="relative z-10 order-2 lg:order-1">
						<Reveal>
							<h2 className="display max-w-[11ch] text-[clamp(2.4rem,5.4vw,4.2rem)] text-white">
								The work, written down
							</h2>
						</Reveal>

						<Reveal delay={0.08}>
							<p className="mt-7 max-w-[38ch] text-pretty text-base leading-[1.75] text-white/70 sm:text-lg">
								Case notes, method, and the parts that never make it into a
								syllabus.
							</p>
						</Reveal>

						<Reveal delay={0.12}>
							<p className="mt-4 max-w-[38ch] text-pretty text-base leading-[1.75] text-white/45 sm:text-lg">
								It is being written. That is the whole announcement.
							</p>
						</Reveal>

						{/* The same shader button every other primary action on the page
						    now uses, so this is not one more pill in a different fill and
						    radius. It is a real `mailto:` anchor - the fallback and the
						    shader version both are - so right-click and "copy link
						    address" keep working. */}
						<Reveal delay={0.18} className="mt-10">
							<ClientOnly
								fallback={
									<LiquidMetalButtonFallback
										label="Tell me when it lands"
										href={NOTIFY}
										icon={ArrowUpRight}
									/>
								}
							>
								<Suspense
									fallback={
										<LiquidMetalButtonFallback
											label="Tell me when it lands"
											href={NOTIFY}
											icon={ArrowUpRight}
										/>
									}
								>
									<LiquidMetalButton
										label="Tell me when it lands"
										href={NOTIFY}
										icon={ArrowUpRight}
									/>
								</Suspense>
							</ClientOnly>
						</Reveal>
					</div>

					{/* The stage, allowed past the container's right edge from lg so the
					    object is slightly too big for its frame - which is the reason it
					    reads as a reveal rather than as an illustration parked in a
					    column. */}
					{/* Top right, sized to the copy beside it. As an aspect-square at
					    the full width of a 1.2fr column it came out 788px tall against
					    386px of copy - so it stopped reading as an object on a stage and
					    became the section, sitting low and running past the type. Capped
					    and pushed to the column's right edge, it sits level with the
					    heading where it belongs. */}
					<div className="relative order-1 lg:order-2 lg:-mr-[2vw]">
						<div className="relative aspect-square w-full max-w-[24rem] lg:ml-auto xl:max-w-[27rem]">
							<Stage />

							{/* The model stands in the pool: the bottom inset lifts it off
							    the floor line the pool draws at 85%. */}
							<div className="absolute inset-x-[5%] top-[1%] bottom-[17%]">
								<ClientOnly fallback={<div className="size-full" />}>
									<InView rootMargin="400px" className="size-full">
										<Suspense fallback={<div className="size-full" />}>
											<ModelViewer
												src="/stylized_book.glb"
												alt="A stylised 3D book, slowly turning under a spotlight"
												zoom={0.92}
												className="size-full"
											/>
										</Suspense>
									</InView>
								</ClientOnly>
							</div>
						</div>
					</div>
				</div>

				{/* The colophon, closing the band on a single rule. */}
				<Reveal delay={0.1}>
					<div
						className="mt-14 border-t pt-8 sm:mt-16"
						style={{ borderColor: "rgb(255 255 255 / 0.2)" }}
					>
						<dl className="grid grid-cols-1 gap-x-12 gap-y-7 sm:grid-cols-3 lg:gap-x-16">
							{COLOPHON.map(({ term, value }) => (
								<div key={term}>
									<dt
										className="text-[0.68rem] font-semibold uppercase text-white/40"
										style={{ letterSpacing: "0.14em" }}
									>
										{term}
									</dt>
									<dd className="display-tight mt-2.5 text-[1.15rem] text-white/85 sm:text-[1.3rem]">
										{value}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
