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
 * Logo treatment: desaturated at rest, in their own colours under the cursor.
 * Eleven mastheads carry eleven brand palettes, and all eleven at once on a
 * white wall is a colour chart rather than a body of evidence - grey, they
 * read as one set, and the colour arrives on the single mark being looked at.
 * `grayscale`, not `brightness-0`: two of these are filled broadcast bugs with
 * the mark knocked out in white, and flattening to one ink would fill the tile
 * solid and swallow it.
 *
 * The hover therefore does one thing, not two. It used to fade the mark out
 * and bring the outlet's name up in its place; that name is still worth having
 * - a red "R." tile does not say Republic TV to most readers - so it now sits
 * at the foot of the cell as a caption rather than standing where the logo is.
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
									//
									// Grey at rest, their own colour under the cursor. Eleven
									// mastheads in eleven brand palettes is eleven colours
									// competing on one white wall; desaturated they read as one
									// set of evidence, and the colour arrives on the one you
									// are actually looking at.
									//
									// `grayscale` rather than `brightness-0`: flattening to a
									// single ink would fill the two broadcast tiles solid and
									// swallow the marks knocked out of them.
									//
									// A touch screen has no cursor to reveal anything with, so
									// there the marks simply start in colour - Tailwind's
									// `hover` variant is itself gated on `(hover: hover)`, so
									// without this the phone would only ever see grey.
									"w-auto max-w-full object-contain grayscale transition-[filter,opacity] duration-300 group-hover:grayscale-0 [@media(hover:none)]:grayscale-0",
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
