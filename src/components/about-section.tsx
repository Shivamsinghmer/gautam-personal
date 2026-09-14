import {
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import { ClientOnly, InView } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
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
 * About.
 *
 * A ruled sheet on ink, one figure standing in it. Nothing is layered over
 * anything else.
 *
 * What that fixed, and why:
 *
 * - **The rotating cylinder is gone.** Eight photographs turned behind the body
 *   copy, so a masthead board or a face was forever crossing a paragraph, and
 *   the defence against that - a near-opaque radial pool - then flattened the
 *   photographs it was protecting the text from. Both jobs were being lost at
 *   once. Off the veil, the same body copy now measures 11:1 on bare ink, and
 *   the page's photographs are carried by the three sections built to carry
 *   them (journey, collage, press) rather than by a fourth doing it badly.
 * - **One figure instead of eight.** The cut-out has a real alpha channel, so
 *   he stands on the section's closing rule rather than sitting inside another
 *   bordered rectangle - the composition holds him instead of framing him. It
 *   is also the only photograph in the section, which is what lets it be the
 *   thing you look at.
 * - **The hover cards are gone.** Three phrases in the prose opened floating
 *   previews on hover: no keyboard path, no touch path, and the previews were
 *   generic stock on a site whose rule is to show the real asset. The phrases
 *   they marked are now simply emphasised.
 * - **The composition closes.** The statement column used to stop at the fact
 *   rows and leave a hole under them while the prose ran on past. The figure
 *   now carries that column down to a single hairline that runs the full width
 *   beneath both, so neither column ends in mid-air. A three-row dossier of
 *   facts sat on that rule until the client cut it: field, institutions and
 *   formats are all stated elsewhere on the page, and restating them here was
 *   the section explaining itself twice.
 *
 * The one accent: a short signal lead on the opening rule. `.nameplate` is the
 * same move, so this is the site's own grammar rather than a new one.
 */

/** Key terms in the prose. White against the body's /80, and nothing to hover. */
const TERM = "font-semibold text-white";

export function AboutSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduceMotion = useReducedMotion() ?? false;
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});
	/**
	 * The figure drifts against the sheet as the section passes - one slow move
	 * across the whole section, not an ambient wiggle, and nothing at all under
	 * reduced motion.
	 *
	 * It is a scale from his feet rather than a translation. Translating him
	 * broke the one idea the composition is built on: a +-4% drift is +-18px at
	 * this size, so he spent most of the scroll hovering above the closing rule
	 * or sunk through it. Scaled from `50% 100%`, the contact point cannot move,
	 * and the depth cue survives.
	 */
	const figureScale = useTransform(
		scrollYProgress,
		[0, 1],
		reduceMotion ? [1, 1] : [1.04, 0.98],
	);

	return (
		<section
			id="about"
			ref={sectionRef}
			className="band relative scroll-mt-24 overflow-hidden px-6 sm:px-10"
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

				{/*
				 * Statement, prose, figure - in that order in the DOM, which is the
				 * order a phone reads them in. On `lg` the prose spans both rows of
				 * the right-hand column so the figure can have the left one, and the
				 * grid ends flush with the dossier's first rule.
				 */}
				<div className="grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-10 pt-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-y-0 lg:pt-14">
					<div className="lg:col-start-1 lg:row-start-1">
						<Reveal>
							<h2 className="display text-[clamp(2.2rem,4.4vw,3.4rem)] text-white">
								The credential
								<br />
								is the casework.
							</h2>
						</Reveal>
					</div>

					<div className="flex flex-col lg:col-start-2 lg:row-span-2 lg:row-start-1">
						<Reveal delay={0.06}>
							<div className="prose-measure space-y-6 text-base leading-[1.75] text-white/80 sm:text-[1.0625rem]">
								<p>
									Gautam Kumawat grew up walking 8km to school, studying by the
									light of a homemade oil lamp. Privilege wasn't part of the
									story — <strong className={TERM}>determination</strong> was.
								</p>

								<p>
									At 12, curiosity about how phones worked led him into hacking,
									self-taught and relentless. By 16, he was working with{" "}
									<strong className={TERM}>global law enforcement</strong> on
									cybercrime investigations — a path that's since grown into{" "}
									<strong className={TERM}>3,000+ cases solved</strong>. His
									work drew national and global media attention, with features
									in Times of India, Economic Times, India Today, Hindustan
									Times, The Hindu, and Thrive Global.
								</p>

								<p>
									But the numbers are only half the story. Gautam meditates 2
									hours a day (Vipassana, for over a decade), draws inspiration
									from Vivekananda and Bhagat Singh, and finds balance through
									MMA, golf, and horseback riding — with a bit of mind-reading
									magic thrown in to keep wonder alive.
								</p>

								<p>
									He's flown planes, built companies, left comfort behind for
									harder problems, and traveled to 21 countries in search of
									truth, not just business. His life is proof that anyone, from
									anywhere, can build a life without limits.
								</p>
							</div>
						</Reveal>

						{/* Signs the statement off with the same hand the preloader
						    writes. `duration={0}` puts the component in its drawn mode,
						    so the mark is simply there - tracing it on scroll would
						    replay the preloader's animation halfway down the page.

						    It follows the prose rather than being pinned to the foot of
						    the column: pinned, it floated ~260px below the paragraph it
						    signs, which reads as a hole rather than as space. The figure
						    opposite is what fills the bottom of this row. */}
						<div className="mt-12 flex justify-end">
							<ClientOnly>
								<InView rootMargin="400px" once>
									<Suspense fallback={null}>
										<Signature
											text="Gautam Kumawat"
											color="#f4fbf8"
											fontSize={40}
											duration={0}
											className="ml-auto h-auto w-[min(72%,300px)] opacity-90"
										/>
									</Suspense>
								</InView>
							</ClientOnly>
						</div>
					</div>

					{/* The figure. `items-end` on the cell with no bottom margin is the
					    whole trick: the asset is trimmed to his silhouette, so the box
					    ending on the closing rule means he is standing on it. */}
					<div className="flex items-end justify-center lg:col-start-1 lg:row-start-2 lg:justify-start lg:pt-14">
						{/* Sized to the figure, not to the cell. The glow below is
						    positioned against this box: hung on the cell instead, its
						    bright centre landed in the empty half of the column and read
						    as a smudge on the ground rather than as light under him. */}
						<div className="relative w-[min(56vw,240px)] sm:w-[min(44vw,320px)] lg:w-[min(28vw,300px)]">
							{/* A floor light. A cut-out on flat ink reads as pasted on
							    without one; this is a pool under him, not a glow around
							    him. */}
							<div
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-[-30%] bottom-0 h-2/3"
								style={{
									background:
										"radial-gradient(50% 100% at 50% 100%, rgb(255 255 255 / 0.09) 0%, rgb(255 255 255 / 0.03) 45%, transparent 78%)",
								}}
							/>
							<Reveal direction="none" delay={0.1} className="relative">
								<motion.img
									src="/about/figure.webp"
									alt="Gautam Kumawat, reading from the tablet in his hand"
									width={396}
									height={593}
									loading="lazy"
									decoding="async"
									draggable={false}
									// The caps come from the source: figure.webp is 396px
									// across and there is no more of it anywhere in public/,
									// so a width past that is the browser inventing detail.
									// Between sm and lg he is the only thing in a full-width
									// row, so he takes the larger cap and stands in the
									// middle of it - right-aligned at 768 he left a 380px
									// void beside him.
									className="block h-auto w-full origin-bottom select-none"
									style={{ scale: figureScale }}
								/>
							</Reveal>
						</div>
					</div>
				</div>

				{/* The rule the figure stands on. Kept rather than dropped because the
				    figure above is a trimmed cut-out landing on this line - without it
				    he ends in mid-air on bare ink. */}
				<div aria-hidden="true" className="border-t border-white/15" />
			</div>
		</section>
	);
}
