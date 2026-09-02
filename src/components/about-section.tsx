import { lazy, Suspense, useEffect, useState } from "react";
import { CursorCard } from "#/components/ui/cursor-card";
import {
	type CarouselImage,
	CylinderCarousel,
} from "#/components/ui/cylinder-carousel";
import { ClientOnly, InView } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { INK, INK_DEEP } from "#/lib/palette";

/**
 * opentype.js parses a font file to draw the mark, which is ~340kB - far too
 * much to put in the first chunk for a flourish at the foot of one panel. It
 * loads only as the panel comes near.
 */
const Signature = lazy(() =>
	import("#/components/signature").then((m) => ({ default: m.Signature })),
);

/**
 * About.
 *
 * What changed, and why:
 *
 * - **The copy.** It read "a PRO expert in the field of cybersecurity... then
 *   you met your dream right here", which is the guru voice PRODUCT.md rules
 *   out by name. The claim is strong enough to state flatly, so it is stated
 *   flatly: what he did, for whom, for how long, and what he does with it now.
 *   No adjectives doing work that facts should be doing.
 * - **The panel.** The copy used to float in a translucent rounded-3xl card
 *   over the carousel - the default AI surface. It now sits in a ruled
 *   composition: a hairline across the top, a display statement in the left
 *   column, the prose at a real measure in the right. Structure from rules,
 *   not from another bordered box.
 * - **The heading.** It was his name, set in a per-character scatter that
 *   reassembled on scroll. His name is already the largest thing in the footer
 *   and the whole site is his, so spending the section's one heading on it
 *   said nothing. The heading now carries the argument, and the animation is
 *   gone - glyphs flying into place is fidget, which this brand rules out.
 * - **The eyebrow.** Gone, with the two others on the page. A single kicker in
 *   the hero is voice; one above every section is scaffolding.
 * - **The inline press links.** Six outlet names as hover cards inside one
 *   paragraph, directly above a section showing the same eleven mastheads at
 *   full size, was the same evidence twice. The press wall keeps it; this
 *   paragraph just makes the point.
 *
 * The carousel stays. It is the only thing behind the copy, and turning it
 * down to a masked band of his own rooms gives the section depth without
 * competing with the type.
 */

const UNSPLASH = (id: string, w: number, h: number) =>
	`https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

/**
 * The cards on the cylinder - his own photographs, not stock. Decorative: the
 * copy in front carries the content, so every `alt` is empty rather than
 * describing a photograph nobody is being asked to read.
 */
const RING_IMAGES: CarouselImage[] = [
	"/journey/04-stage.webp",
	"/collage/t1.webp",
	"/journey/03-classroom.webp",
	"/collage/b2.webp",
	"/journey/02-agencies.webp",
	"/collage/t2.webp",
	"/journey/05-press.webp",
	"/journey/06-scale.webp",
].map((src) => ({ src, alt: "" }));

/** Previews for the three prose hover cards. */
const CARD = {
	darknet: UNSPLASH("1550751827-4bd374c3f58b", 480, 300),
	forensics: UNSPLASH("1526374965328-7f61d4dc18c5", 480, 300),
	agencies: UNSPLASH("1563986768609-322da13575f3", 480, 300),
};

/**
 * CursorCard ships with its own light-mode look - neutral-900 text on an
 * orange hover wash. Both are wrong on this field, and since the component
 * merges through `cn`, passing replacements here wins on the conflicting
 * utilities without touching the vendored file.
 *
 * `text-white!` carries the important flag on purpose. CursorCard renders an
 * <a>, and styles.css has an unlayered `a { color: var(--lagoon-deep) }`;
 * unlayered CSS beats Tailwind's layered utilities at any specificity, so a
 * plain `text-white` loses and the marks render teal.
 *
 * The rule under each mark is what says there is something to hover. It used
 * to be a background wash that appeared on hover only, which is invisible
 * until you have already found it by accident.
 */
const MARK =
	"font-semibold text-white! underline decoration-[rgb(9_83_255)] decoration-2 underline-offset-4 transition-colors hover:decoration-white";

/** The floating preview, restyled onto this page's field. */
const MARK_CARD = "border-white/10 bg-[#02171f] text-white shadow-black/50";

/**
 * Three facts the hero's figures cannot carry. Deliberately not a repeat of
 * the numbers: the shape of the work, the institutions behind it, and what he
 * is actually booked for.
 */
const DOSSIER: { term: string; detail: string }[] = [
	{
		term: "Field",
		detail: "Darknet investigation, digital forensics, cyber-enabled fraud",
	},
	{
		term: "Institutions",
		detail: "Law-enforcement agencies in India and the United States",
	},
	{
		term: "Formats",
		detail: "Academy training, keynotes, workshops, broadcast panels",
	},
];

/** The dossier rows, shared by the desktop and small-screen placements. */
function Dossier({ className }: { className?: string }) {
	return (
		<dl className={className}>
			{DOSSIER.map(({ term, detail }) => (
				<div
					key={term}
					className="border-t py-4 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-5"
					style={{ borderColor: "rgb(255 255 255 / 0.12)" }}
				>
					<dt
						className="text-[0.68rem] font-semibold uppercase text-white/45"
						style={{ letterSpacing: "0.14em" }}
					>
						{term}
					</dt>
					<dd className="mt-1.5 text-sm leading-relaxed text-white/75 sm:mt-0">
						{detail}
					</dd>
				</div>
			))}
		</dl>
	);
}

/**
 * The ring's geometry has to change with the viewport, not just its scale.
 *
 * `cardWidth` sets translateZ - a fixed pixel radius - while the stage itself
 * is fluid. On a phone that combination foreshortens brutally: the front card
 * measured 4,018px across while the ones behind it were 125px, so the ring
 * read as one blurred wall and a few specks. A shorter radius on a small
 * screen keeps the cards close to each other in size.
 */
function useRingGeometry() {
	const [small, setSmall] = useState(false);
	useEffect(() => {
		const q = window.matchMedia("(max-width: 767px)");
		const sync = () => setSmall(q.matches);
		sync();
		q.addEventListener("change", sync);
		return () => q.removeEventListener("change", sync);
	}, []);
	return small
		? { cardWidth: 140, imageWidth: "46%" }
		: { cardWidth: 420, imageWidth: "31%" };
}

export function AboutSection() {
	const ring = useRingGeometry();

	return (
		<section
			id="about"
			className="band relative isolate flex scroll-mt-24 items-center overflow-hidden px-6 sm:px-10"
			style={{ backgroundColor: INK }}
		>
			{/* Scenery. pointer-events-none so the ring never eats a click or a
			    text selection meant for the copy over it, and masked into a band
			    so it dissolves at the top and bottom edges rather than ending on a
			    line - depth behind the page instead of a widget sitting on it. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_74%,transparent)]"
			>
				<CylinderCarousel
					images={RING_IMAGES}
					// cardWidth is the ring radius only - it pushes the cards out from
					// the centre and does not touch the size of the picture. The
					// photographs themselves are sized by imageWidth.
					cardWidth={ring.cardWidth}
					imageWidth={ring.imageWidth}
					animationDuration={60}
					className="h-full"
					cardClassName="border border-white/15 brightness-110"
				/>
			</div>

			{/* Two layers, not one flat veil. A wide pool of shade under the copy
			    holds the prose at full contrast; a lighter overall wash sits the
			    photographs in the page's key without erasing them. The old veil
			    was a single flat 25% wash, which left white body text sitting
			    directly on whatever frame happened to be turning past. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					// The pool is doing one job: keeping body copy off whatever frame
					// is turning past. So it stays near-opaque directly behind the
					// prose and then gets out of the way fast - tighter radius, a
					// steeper falloff, and the flat wash behind it down to 5%. The
					// photographs outside the text block are now close to unveiled;
					// measured against the worst case (a near-white frame directly
					// behind the copy) the body text still clears AA with room over.
					background: `radial-gradient(62% 58% at 50% 52%, ${INK_DEEP}f2 0%, ${INK_DEEP}b3 40%, ${INK}1a 76%), ${INK}0d`,
				}}
			/>

			<div className="relative mx-auto w-full max-w-6xl">
				<Reveal>
					<div
						aria-hidden="true"
						className="h-px w-full"
						style={{ backgroundColor: "rgb(255 255 255 / 0.2)" }}
					/>
				</Reveal>

				<div className="grid gap-x-16 gap-y-12 pt-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:pt-14">
					<div>
						<Reveal>
							<h2 className="display text-[clamp(2.1rem,4.4vw,3.5rem)] text-white">
								The credential
								<br />
								is the casework.
							</h2>
						</Reveal>

						{/* On desktop the three facts sit under the statement, where
						    they read as its footnotes. Below lg they move to the foot
						    of the prose column so the argument is not held back by
						    them. */}
						<Reveal delay={0.1}>
							<Dossier className="mt-10 hidden lg:block" />
						</Reveal>
					</div>

					<div>
						<Reveal delay={0.06}>
							<div className="prose-measure space-y-6 text-base leading-[1.75] text-white/75 sm:text-[1.0625rem]">
								<p>
									Gautam Kumawat spent seven years inside law-enforcement
									institutions in India and the United States, training serving
									officials and working{" "}
									<CursorCard
										image={CARD.darknet}
										description="Marketplaces, forums, and the money moving between them - traced as case files, not covered as a lecture topic."
										className={MARK}
										cardClassName={MARK_CARD}
									>
										darknet investigations
									</CursorCard>{" "}
									and{" "}
									<CursorCard
										image={CARD.forensics}
										description="Devices, logs, chain of custody - the part that still has to hold up long after the arrest."
										className={MARK}
										cardClassName={MARK_CARD}
									>
										digital forensics
									</CursorCard>{" "}
									of a complexity that never reaches a syllabus.
								</p>

								<p>
									What he teaches now is that material, opened up. The same
									cases, rebuilt for whoever is in the room — a hall of
									first-years, a batch of new recruits, or a{" "}
									<CursorCard
										image={CARD.agencies}
										description="Serving officers, cyber cells, academy faculty - rooms that arrive already knowing the subject and want the parts they have not seen."
										className={MARK}
										cardClassName={MARK_CARD}
									>
										unit that has worked cyber for a decade
									</CursorCard>
									. Forty-one thousand students across 162 countries have taken
									it so far.
								</p>

								<p>
									He makes the same argument in public as often as in a
									classroom — on national news panels, on stages, and in print.
									Cybercrime scales faster than any unit investigating it. The
									only defence that scales with it is a population that already
									knows.
								</p>
							</div>
						</Reveal>

						<Reveal delay={0.12}>
							<Dossier className="mt-10 lg:hidden" />
						</Reveal>

						{/* Signs the statement off with the same hand the preloader
						    writes. `duration={0}` puts the component in its drawn mode,
						    so the mark is simply there - tracing it on scroll would
						    replay the preloader's animation halfway down the page. */}
						<div className="mt-12 flex justify-end">
							<ClientOnly>
								<InView rootMargin="400px" once>
									<Suspense fallback={null}>
										<Signature
											text="Gautam Kumawat"
											color="#f4fbf8"
											fontSize={40}
											duration={0}
											className="h-auto w-[min(72%,300px)] opacity-90"
										/>
									</Suspense>
								</InView>
							</ClientOnly>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
