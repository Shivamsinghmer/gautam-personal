import { ArrowRight, Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { lazy, Suspense } from "react";
import { LiquidMetalButtonFallback } from "#/components/liquid-metal-button";
import { ClientOnly } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { StatIndex } from "#/components/ui/stat-index";
import { HERO_DEEP } from "#/lib/palette";

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

/**
 * Reach.
 *
 * ## The ground
 *
 * This ran as the page's one "drenched" section - the brand blue as a full
 * field, the way `SIGNAL` is a garnish everywhere else (a button fill, a dot,
 * a suffix) and this was meant to be the one place it got to be a colour. In
 * practice it read as the odd section out: every other stop on the page - the
 * hero, about, journey, the room, the book, the ask - sits on the same near-
 * black ground, and a full-bleed saturated blue between two of those broke
 * that continuity rather than adding to it. The blue now lives where it lives
 * everywhere else: as one contained accent (the card's wash), not the field.
 *
 * ## The layout
 *
 * Built to a reference the client supplied: a line of type across the top, a
 * portrait card beneath it with the argument set small beside it, and a quiet
 * index along the bottom that in the reference held press logos. Here that
 * index holds the audience figures instead. Its own hairlines are the only
 * structure it needs.
 *
 * The whole section is deliberately tightened to a single screen - shorter
 * clamps on the quote, a leaner card, closer gaps - so it holds the fold
 * rather than running a scroll and a half past a viewport most laptops
 * actually have. See the sizing notes inline for what each cut bought back.
 *
 * ## The photograph
 *
 * `reach.jpg`, a 1444x1304 plate supplied for this card. It replaces
 * `02-agencies-wide.webp`, the journey set's studio headshot that used to sit
 * here - about keeps its cut-out to itself, and this section gets its own
 * photograph instead of borrowing the journey section's.
 *
 * It has been swapped once since: the first `reach.jpg` was a 3:2 studio
 * headshot on white, and the card was cut to match it exactly. This one is
 * near-square, full-length and shot on black, which changed both decisions -
 * the card's ratio and its edge. See the inline notes for each.
 *
 * ⚠️ PLACEHOLDER FIGURES. The four counts below are taken from the reference
 * design that inspired the original layout - they are NOT Gautam's real
 * audience numbers. They read as factual claims on a real person's site, so
 * replace every `value` with the true figure before this goes anywhere public.
 */
const CHANNELS = [
	{ value: 175, suffix: "K+", label: "Facebook", icon: Facebook },
	{ value: 90, suffix: "K+", label: "Instagram", icon: Instagram },
	{ value: 12, suffix: "K+", label: "LinkedIn", icon: Linkedin },
	{ value: 500, suffix: "K+", label: "Newsletter", icon: Mail },
];

export function ReachSection() {
	return (
		<section
			id="reach"
			// Fixed padding, not `band`/`band-tight` - both scale off viewport
			// *width*, so a wide-but-short laptop screen (1366×768 is the common
			// case) gets the same padding as a tall one and the section misses
			// the fold by exactly the amount the vw term added. A flat value
			// answers to the budget this layout actually has to fit.
			className="relative isolate scroll-mt-24 overflow-hidden px-6 py-12 sm:px-10 sm:py-14"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* Grain, to texture the field and break up banding. Plain alpha rather
			    than a blend mode: a blend over a full-bleed section forces the
			    whole thing onto its own compositor layer and re-blends it every
			    frame it is on screen, which is a real cost for a texture you only
			    notice if you look. 0.02, not 0.07: the noise is mid-grey on
			    average, so compositing it at 0.07 over a near-black field lifted
			    the whole section to a visibly lighter charcoal than the flat-black
			    sections either side of it - the seam read as a bug, not texture.
			    0.02 keeps the grain without the lift. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: "180px 180px",
				}}
			/>

			<div className="relative mx-auto max-w-6xl">
				{/* The line, across the top. Set as a quotation because it is one -
				    his, about what the job actually is - and because a claim in
				    quotation marks is read as a person talking rather than as a
				    headline written about him in the third person. Capped at a
				    smaller clamp than the section headings elsewhere on the page:
				    this is one line of voice, not a display heading, and the taller
				    size was most of what pushed the section past one screen. */}
				<Reveal>
					<figure className="m-0">
						<blockquote className="display max-w-[16ch] text-balance text-[clamp(1.6rem,3.2vw,2.5rem)] text-white">
							&ldquo;The room empties. What you taught them
							doesn&rsquo;t.&rdquo;
						</blockquote>
						<figcaption
							className="mt-4 text-[0.7rem] font-semibold uppercase text-white/60"
							style={{ letterSpacing: "0.16em" }}
						>
							Gautam Kumawat
						</figcaption>
					</figure>
				</Reveal>

				<div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[44%_minmax(0,1fr)] lg:items-center lg:gap-14">
					<Reveal direction="right">
						{/* 4:3 at 44% of the measure. The plate is 1444x1304 - near
						    square - and the figure inside it is full-length, head to
						    shoes, so the ratio is chosen by what a crop can afford to
						    lose rather than by matching the file.

						    3:2 was the old card, cut for a 1280x853 plate, and it
						    does technically hold this one: head at row 209 and shoes
						    at 1120 span 911px inside a 963px window. 52px of total
						    slack is the problem - centred, that is ~10px of air above
						    his hair at the rendered size, which is a tangent crop,
						    the frame edge resting on his head. 4:3 opens the window
						    to 1083 rows for 98px of air, keeps the smoke at his feet,
						    and costs about 45px of height. 5:4 buys more air than the
						    picture needs and spends 72px for it.

						    44%, down from 47%, and the reference's 55% before that. A
						    taller ratio on the same column width is height the section
						    does not have: at 47% this came to 406px and pushed the
						    whole section to 921px against a 900px viewport, breaking
						    the one-screen fit the rest of the block is tuned around.
						    Three points of width buys 26px of height back for 34px of
						    plate, which is the cheaper side of that trade. It also
						    keeps the plate sitting inside the section rather than
						    leading it. */}
						<figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
							{/* Nothing layered over the plate: no wash, no blend, no
							    sheen. The section gets its accent from the shader
							    button directly below.

							    The ring is new, and the ground is why. The plate that
							    used to sit here was shot on white and drew its own
							    edge against the section. This one is shot on black -
							    its four edges measure 9 to 27 against a field of 10 -
							    so without a hairline the frame has no boundary at all
							    and the 1.5rem radius rounds nothing visible. Same
							    white/10 the gallery, collage and about frames carry.
							    `object-cover` still has no `object-position` to tune:
							    the crop is centred on purpose, see above. */}
							<img
								src="/reach.jpg"
								alt="Gautam Kumawat seated in an office chair in a dark suit, lit against a black ground with smoke drifting across the floor"
								width={1444}
								height={1304}
								loading="lazy"
								decoding="async"
								className="absolute inset-0 h-full w-full object-cover"
							/>
						</figure>
					</Reveal>

					<div>
						<Reveal delay={0.08}>
							<p className="max-w-[38ch] text-[0.9rem] leading-relaxed text-pretty text-white/70 sm:text-[0.95rem]">
								Cybersecurity only protects the people who hear about it. The
								same material that runs in the training rooms goes out every
								week to a standing audience — most of whom will never sit in
								one.
							</p>
						</Reveal>

						{/* The same shader button every other primary action on the site
						    now carries. */}
						<Reveal delay={0.16} className="mt-6">
							<ClientOnly
								fallback={
									<LiquidMetalButtonFallback
										label="Book a session"
										href="#book"
										icon={ArrowRight}
									/>
								}
							>
								<Suspense
									fallback={
										<LiquidMetalButtonFallback
											label="Book a session"
											href="#book"
											icon={ArrowRight}
										/>
									}
								>
									<LiquidMetalButton
										label="Book a session"
										href="#book"
										icon={ArrowRight}
									/>
								</Suspense>
							</ClientOnly>
						</Reveal>
					</div>
				</div>

				{/* The index, along the foot of the section and across its full
				    measure - the position the reference gives its press logos. */}
				<Reveal delay={0.1}>
					<div className="mt-6 border-t border-white/15 pt-5 sm:mt-8">
						<div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
							<p
								className="text-[0.68rem] font-semibold uppercase text-white/60"
								style={{ letterSpacing: "0.16em" }}
							>
								Following
							</p>
							<p className="text-[0.82rem] leading-relaxed text-pretty text-white/50 sm:max-w-[60ch] sm:text-right">
								Followers and subscribers across the four channels he posts to.
							</p>
						</div>

						{/* `tone="ink"`, not `signal` - that tone exists for text set
						    directly on the drenched blue field this section no longer
						    has. On the near-black ground it shares with the rest of the
						    page, the ordinary ink rule/label values are the right ones. */}
						<StatIndex
							items={CHANNELS}
							tone="ink"
							variant="chip"
							className="mt-5 grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-6"
						/>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
