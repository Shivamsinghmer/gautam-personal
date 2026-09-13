import { Reveal, RevealGroup, RevealItem } from "#/components/ui/scroll-reveal";
import { PAPER, PAPER_INK, PAPER_INK_SOFT } from "#/lib/palette";
import { PRESS } from "#/lib/press";
import { cn } from "#/lib/utils";

/**
 * The press wall - and the page's one cut to daylight.
 *
 * Two things were wrong here, and they were the same thing twice.
 *
 * The logos were knocked back to white silhouettes on black and set moving in
 * a two-row marquee that never stops. A masthead is evidence; hiding its ink
 * and sliding it past at walking pace is presenting evidence as wallpaper. The
 * drift is also the perpetual ambient motion PRODUCT.md rules out - the row
 * moves whether or not anyone is reading it.
 *
 * So: cut to paper. Mastheads live on white, which is where they are printed
 * and where a reader has seen every one of them before, and the wall holds
 * still so they can actually be read. It is also the page's structural relief
 * - nine consecutive sections on one ink was the single thing making a long
 * scroll feel like a template, and this is the beat where the lights come up
 * before the reach section drops them again into full brand blue.
 *
 * Logo treatment: every masthead in its own brand colour from the first paint.
 * This ran desaturated-at-rest, colour-on-hover - eleven brand palettes read
 * as a colour chart rather than a body of evidence, so the plan was to let
 * grey carry the set and colour arrive only on the mark being looked at. In
 * practice a wall of grey logos read as a placeholder strip rather than as
 * eleven real outlets, and a hover reveal a touch-screen reader never sees at
 * all is the wrong trade for that. Colour now IS the evidence, all the time.
 *
 * The hover still does one thing: the outlet's name comes up as a caption -
 * worth having since two of these are broadcast bugs rather than wordmarks (a
 * red "R." tile does not say Republic TV to most readers) - at the foot of the
 * cell rather than over the mark, so nothing is swapped away at the moment it
 * is being looked at.
 */

export function FeaturedInSection() {
	return (
		<section
			id="press"
			className="band-tight scroll-mt-24 px-6 sm:px-10"
			style={{ backgroundColor: PAPER }}
		>
			<div className="mx-auto max-w-6xl">
				{/* Statement and supporting line share one baseline from lg, so the
				    head costs one row of height rather than two. No eyebrow: the
				    section says what it is in the heading. */}
				<div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
					<Reveal>
						<h2
							className="display text-[clamp(1.95rem,3.8vw,3.1rem)]"
							style={{ color: PAPER_INK }}
						>
							National press.
							<br />
							National television.
						</h2>
					</Reveal>

					<Reveal delay={0.08}>
						<p
							className="mt-5 max-w-[38ch] text-[0.95rem] leading-relaxed text-pretty lg:mt-0 lg:pb-2 lg:text-right"
							style={{ color: PAPER_INK_SOFT }}
						>
							Eleven outlets running the same subject he trains on — the
							coverage came to the work, not the other way round.
						</p>
					</Reveal>
				</div>

				{/* Twelve cells, not eleven. Eleven logos leave a ragged last row at
				    every column count; the closing line completes the grid at 2, 3
				    and 4 across and gives the wall somewhere to end. The rules are
				    drawn container-top-left plus cell-right-bottom, which is what
				    keeps a single hairline between neighbours instead of two. */}
				<RevealGroup
					className="mt-12 grid grid-cols-2 border-t border-l border-[color:var(--rule-paper)] sm:mt-16 sm:grid-cols-3 lg:grid-cols-4"
					stagger={0.045}
				>
					{PRESS.map((press) => (
						<RevealItem
							key={press.name}
							className="group relative flex items-center justify-center border-r border-b border-[color:var(--rule-paper)] px-5 py-9 sm:px-7 sm:py-11"
						>
							<img
								src={press.src}
								alt={press.name}
								loading="lazy"
								decoding="async"
								className={cn(
									// Height per logo, width free. A fixed box squeezes every
									// wordmark into the same width, which renders the wide ones
									// as slivers and lets the square marks fill it.
									"w-auto max-w-full object-contain",
									press.size,
									press.tile && "rounded-[3px]",
								)}
							/>

							{/* The name, on hover. Worth showing because two of these are
							    broadcast bugs rather than wordmarks - a red "R." tile does
							    not say Republic TV to most readers.

							    It used to sit across the middle of the cell and the mark
							    faded out behind it, which cannot survive the hover now
							    being the colour reveal - you would be swapping the logo
							    away at the exact moment it became worth looking at. So it
							    moved to the foot of the cell, where it captions the mark
							    instead of replacing it. Below every logo's centred box,
							    so nothing overlaps. */}
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-0 bottom-3 px-3 text-center text-[0.68rem] font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:bottom-4"
								style={{ color: PAPER_INK_SOFT, letterSpacing: "0.08em" }}
							>
								{press.name}
							</span>
						</RevealItem>
					))}

					<RevealItem className="flex items-center justify-center border-r border-b border-[color:var(--rule-paper)] px-5 py-9 text-center sm:px-7 sm:py-11">
						<span
							className="text-[0.72rem] font-medium uppercase"
							style={{ color: PAPER_INK_SOFT, letterSpacing: "0.16em" }}
						>
							and others
						</span>
					</RevealItem>
				</RevealGroup>
			</div>
		</section>
	);
}
