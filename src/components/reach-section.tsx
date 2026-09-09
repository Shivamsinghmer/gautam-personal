import { ArrowRight } from "lucide-react";
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
 * `02-agencies.webp`, out of the journey section's graded set - a studio
 * headshot on a white ground, and a plate with its own background rather than
 * a cut-out.
 *
 * Two things follow from that. First, it ends a duplicate: the card used to
 * run `gautam-figure.png`, which is also the about section's cut-out, and
 * public/ holds exactly two cut-outs, both from the same shoot, so two
 * sections that each wanted a free-standing figure had to share one. About
 * keeps it to itself now. Second, the frame holds a rectangle, so everything
 * that used to sit behind a cut-out figure had to go - see the inline note.
 *
 * The white ground is kept deliberately. It makes this the one cut to daylight
 * on the page outside the press wall, which means this section no longer
 * carries a saturated blue surface; the accent here is the shader button.
 *
 * ⚠️ PLACEHOLDER FIGURES. The four counts below are taken from the reference
 * design that inspired the original layout - they are NOT Gautam's real
 * audience numbers. They read as factual claims on a real person's site, so
 * replace every `value` with the true figure before this goes anywhere public.
 */
const CHANNELS = [
	{ value: 175, suffix: "K+", label: "Facebook" },
	{ value: 62, suffix: "K+", label: "Instagram" },
	{ value: 12, suffix: "K+", label: "LinkedIn" },
	{ value: 500, suffix: "K+", label: "Newsletter" },
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
			    notice if you look. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
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

				<div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-center lg:gap-14">
					<Reveal direction="right">
						{/* 4:3, capped at a fixed 22rem from lg rather than sized off a
						    grid fraction - the fr-based column used to render the card
						    at 574×431, which on its own was most of what pushed the
						    section past one screen. Fixed and smaller, it holds the same
						    proportions at roughly half the footprint. */}
						<figure className="relative m-0 aspect-[6/4] max-w-[22rem] overflow-hidden rounded-[1.5rem] sm:aspect-[4/3]">
							{/* The plate keeps its own white studio ground, so this card is the
							    page's one cut to daylight outside the press wall. That is why
							    there is nothing layered over it: the blue wash this card used to
							    carry turned the white to a pale periwinkle, and a multiply blend
							    turned it into a flat blue field - both of them arguments with the
							    photograph rather than treatments of it. The section still gets
							    its accent from the shader button directly below.

							    No ring and no sheen for the same reason. A white/10 hairline is
							    invisible on white, and the old radial highlight was white light
							    drawn on a white ground. White on near-black draws its own edge.

							    `object-[50%_10%]`, measured: the source is 4:5 and the card is
							    4:3, so cover shows an 800x600 window with 400px of vertical
							    slack. 10% of it keeps the hair clear of the top edge and still
							    lands the crop below his collar - 0% buys headroom by cutting the
							    shoulders off, and 20% starts shaving the hair. */}
							<img
								src="/journey/02-agencies.webp"
								alt="Studio portrait of Gautam Kumawat"
								width={800}
								height={1000}
								loading="lazy"
								decoding="async"
								className="absolute inset-0 h-full w-full object-cover object-[50%_10%]"
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
							className="mt-5 grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 sm:gap-x-6"
						/>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
