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
 * - **One photograph instead of eight.** Being the only picture in the section
 *   is what lets it be the thing you look at. It was a cut-out for a long time,
 *   standing on the closing rule with no frame around it; it is a framed
 *   photograph of the room he records in now, and the treatment changed with
 *   the asset rather than being imposed on it - see the note at the figure.
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
	 * The picture drifts inside its frame as the section passes - one slow move
	 * across the whole section, not an ambient wiggle, and nothing at all under
	 * reduced motion.
	 *
	 * Never below 1. This ran 1.04 -> 0.98 when the subject was a cut-out on
	 * transparency, where scaling under 1 simply made him smaller. He sits in a
	 * clipped frame now, and anything under 1 shrinks the picture inside its own
	 * box - which does not read as a drift, it reads as the ground showing
	 * through at the edges. Staying above 1 means the frame is always
	 * over-filled and only the crop moves.
	 */
	const figureScale = useTransform(
		scrollYProgress,
		[0, 1],
		reduceMotion ? [1, 1] : [1.06, 1],
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

					{/* The photograph. `items-end` still bottom-aligns the cell so the
					    frame lands flush on the section's closing rule, but what lands
					    there is now an edge rather than a pair of shoes - see below. */}
					<div className="flex items-end justify-center lg:col-start-1 lg:row-start-2 lg:justify-start lg:pt-14">
						{/* A frame, where this used to be a bare cut-out.

						    The old asset was a silhouette on transparency, so the element's
						    box and his outline were the same thing and the section could
						    stand him on a line. It also carried a radial pool of light
						    underneath, because a cut-out on flat ink reads as pasted on
						    without one. The replacement is an ordinary rectangular
						    photograph of the room he records in: there is no silhouette to
						    stand on anything, and a floor glow under a rectangle is light
						    pooling beneath a picture frame. Both went with it.

						    What replaces them is the treatment the page already gives a
						    photograph on ink - rounded corners and a white/10 hairline, the
						    same as the gallery and collage frames.

						    The width caps are raised because the reason for them is gone:
						    they existed because the cut-out was 396px across and there was
						    no more resolution anywhere in public/. This source is 1400px. */}
						<div className="w-[min(62vw,280px)] sm:w-[min(46vw,340px)] lg:w-[min(32vw,400px)]">
							<Reveal direction="none" delay={0.1}>
								<figure className="m-0 overflow-hidden rounded-2xl ring-1 ring-white/10">
									{/* The slow drift the cut-out had, moved inside the frame.
									    On the cut-out it scaled him from his feet so the
									    contact point with the rule could not move; there is no
									    contact point now, so it is a push within a fixed frame
									    instead - the frame holds still and the picture moves
									    inside it, which is the only version of this that does
									    not wobble the layout. */}
									<motion.img
										src="/about/studio.webp"
										alt="Gautam Kumawat at his studio desk, hands steepled, a boom microphone and a green-lit wall behind him"
										width={1000}
										height={1334}
										loading="lazy"
										decoding="async"
										draggable={false}
										className="block h-auto w-full select-none"
										style={{ scale: figureScale }}
									/>
								</figure>
							</Reveal>
						</div>
					</div>
				</div>

				{/* The closing rule. It was kept originally because a trimmed cut-out
				    ended in mid-air on bare ink without it; the framed photograph above
				    does not need catching in the same way, but the rule still closes the
				    section and the figure column still lands on it. */}
				<div aria-hidden="true" className="border-t border-white/15" />
			</div>
		</section>
	);
}
