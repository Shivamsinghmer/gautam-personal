import { ArrowRight, ArrowUpRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { LiquidMetalButtonFallback } from "#/components/liquid-metal-button";
import { ClientOnly } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { INK_DEEP, SIGNAL } from "#/lib/palette";

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

/**
 * The booking invitation.
 *
 * The room on the left, the ask on the right. The photograph does the arguing:
 * a full auditorium is a stronger case for booking him than any sentence about
 * being engaging, so the image gets real size and the copy stays short beside
 * it.
 *
 * What changed:
 *
 * - **The two floating panels** that used to hang off the photograph's corners
 *   are down to one, and it is a nameplate rather than a card. The first held
 *   "41,000+ students / 162 countries", which by this point in the page is the
 *   third time those two figures have been stated - the hero indexes them and
 *   the about copy says them in a sentence. Repeating a number does not make
 *   it larger.
 * - **What is left is the lower-third**: a short signal rule, the name, the
 *   role. It is the one place on the page that motif appears, on the one
 *   photograph that needs the person in it identified, which is what keeps it
 *   a piece of art direction instead of a decoration applied to every frame.
 *   Drawn as a rule above the type, never as a coloured stripe down the side
 *   of a box.
 * - **The formats block is gone.** "Keynotes / Workshops" restated what the
 *   paragraph above already says, under the heading that already says it.
 * - **The mastheads moved out.** They used to be joined flush to the underside
 *   of the photograph so the room and the coverage of that room read as one
 *   block. The idea was sound and the width was not: half a page is not enough
 *   room for eleven marks, and they scrolled past too small to be recognised.
 *   `PressStrip` now runs them across the full measure below this composition,
 *   which is where the section had space going spare anyway.
 */

export function BookingInvite({ className }: { className?: string }) {
	return (
		<div
			className={`grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-20 ${className ?? ""}`}
		>
			{/* ── The room ────────────────────────────────────────────────────── */}
			<Reveal direction="right" className="relative">
				<figure className="relative m-0">
					<img
						src="/collage/t1.webp"
						alt="A full auditorium of students watching Gautam Kumawat speak from the stage"
						loading="lazy"
						decoding="async"
						className="aspect-[4/3] w-full object-cover"
					/>

					{/* The nameplate. Solid, not frosted: glass over a photograph is
					    decoration, and this carries text that has to stay readable
					    over whatever is behind it. */}
					<figcaption
						className="absolute bottom-0 left-0 px-6 py-5 sm:px-7 sm:py-6"
						style={{ backgroundColor: INK_DEEP }}
					>
						<span
							aria-hidden="true"
							className="block h-[3px] w-10"
							style={{ backgroundColor: SIGNAL }}
						/>
						<span className="display-tight mt-4 block text-[1.4rem] text-white sm:text-[1.7rem]">
							Gautam Kumawat
						</span>
						<span
							className="mt-2 block text-[0.68rem] font-medium uppercase text-white/55"
							style={{ letterSpacing: "0.14em" }}
						>
							Cybersecurity trainer &amp; investigator
						</span>
					</figcaption>
				</figure>
			</Reveal>

			{/* ── The ask ─────────────────────────────────────────────────────── */}
			<div>
				<Reveal>
					<h2 className="display text-[clamp(2.3rem,4.6vw,3.7rem)] text-white">
						Book me for{" "}
						{/* The one underlined phrase, in the accent. Emphasis by rule and
						    weight rather than a second colour of text. */}
						<span
							className="decoration-[5px] underline-offset-[10px]"
							style={{
								textDecorationLine: "underline",
								textDecorationColor: SIGNAL,
							}}
						>
							your event
						</span>
						.
					</h2>
				</Reveal>

				<Reveal delay={0.08}>
					<p className="prose-measure mt-7 max-w-[46ch] text-base leading-relaxed text-white/70 sm:text-[1.0625rem]">
						Seven years of casework, told to the room in front of me. No slide
						deck of generic threats — the material is rebuilt for whoever is
						sitting there, whether that is a hall of first-years or a room of
						serving officers.
					</p>
				</Reveal>

				<Reveal delay={0.14}>
					<div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
						{/* The same shader button the hero and nav carry, so the page's
						    primary action reads as one design wherever it lands rather
						    than as a fill-and-radius recipe copied into each section. */}
						<ClientOnly
							fallback={
								<LiquidMetalButtonFallback
									label="Check availability"
									href="#book"
									icon={ArrowRight}
								/>
							}
						>
							<Suspense
								fallback={
									<LiquidMetalButtonFallback
										label="Check availability"
										href="#book"
										icon={ArrowRight}
									/>
								}
							>
								<LiquidMetalButton
									label="Check availability"
									href="#book"
									icon={ArrowRight}
								/>
							</Suspense>
						</ClientOnly>

						{/* The reference put a "watch video" link here. There is no video,
						    and inventing a play button that goes nowhere is worse than
						    not having one - so the secondary action points at the thing
						    that actually exists: the photographs of the rooms. */}
						<a
							href="#the-room"
							className="group inline-flex items-center gap-3 text-sm font-medium text-white!"
						>
							<span
								aria-hidden="true"
								className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors group-hover:bg-white/10"
								style={{ borderColor: `${SIGNAL}80`, color: SIGNAL }}
							>
								<ArrowUpRight className="h-4 w-4" />
							</span>
							<span className="underline-offset-4 group-hover:underline">
								See the rooms
							</span>
						</a>
					</div>
				</Reveal>
			</div>
		</div>
	);
}
