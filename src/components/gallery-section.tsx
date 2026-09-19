import { Reveal, RevealGroup, RevealItem } from "#/components/ui/scroll-reveal";
import { PAPER, PAPER_INK, PAPER_INK_SOFT } from "#/lib/palette";

/**
 * The gallery: the places away from the desk.
 *
 * ## Why it is not the collage again
 *
 * `CollageSection` is the on-stage evidence - full auditoriums, panels, a
 * lectern - and it is built to sell: every frame links into the booking block
 * and the hover swaps the format for "Book this". That section answers "can he
 * hold a room". This one answers what a visitor asks straight afterwards -
 * "who is this" - and it has to answer without a CTA on every tile or it is
 * just the collage with different photographs. So these are `<figure>`s.
 * Nothing to click, nothing to book.
 *
 * ## One screen, and why that ruled out masonry
 *
 * Built to a supplied reference: a collage of ten photographs at deliberately
 * different sizes and heights on white, tight gaps, generous radius, no
 * captions, the whole thing taking a single screen.
 *
 * It is the *wall* that is a screen tall, not the section. The heading sits
 * above it in normal flow and the section runs past the fold - which is the
 * reference's own framing, where the wall fills the view and the heading is
 * cropped off the top of it. Holding the section to `h-svh` instead would
 * have meant the wall taking whatever the heading left over, and on a short
 * laptop window that is not much.
 *
 * The height constraint is what set the technique. This was `columns-*`
 * masonry, and masonry cannot be held to a height: the column flow decides
 * where each tile lands from its own intrinsic height, so the wall is as tall
 * as it is and a fixed height on the parent would only clip it. The
 * composition is explicit instead - five columns, two tiles each, the tiles
 * sized by flex ratio rather than by aspect. Give the wall a height and the
 * ratios divide it exactly, at any viewport.
 *
 * Three things produce the reference's rhythm:
 *
 * - **`grow` per tile.** Within a column one tile takes more of the height
 *   than the other, and which one varies column to column, so no two columns
 *   break at the same place.
 * - **`offset` per column.** A padding-top inside a fixed-height column both
 *   drops that column's start and shortens the space its tiles divide, so the
 *   columns disagree at the top *and* the bottom. That ragged lower edge is
 *   most of what stops this reading as a grid.
 * - **No shared crop.** Every source is a portrait phone frame at an identical
 *   9:16, so respecting the sources would give ten tiles of one shape.
 *   `object-cover` against the flex-derived box is what varies them.
 *
 * Cropping 9:16 into a landscape box discards a lot of picture, so the crops
 * were rendered at their target shapes and checked rather than assumed. All
 * ten subjects survive centred; `position` exists per tile for when one does
 * not.
 *
 * ## Below `lg`
 *
 * One screen is a desktop composition and it does not survive translation: ten
 * photographs inside a phone screen are ten postage stamps. So the height
 * constraint is `lg`-only.
 *
 * Below it the columns turn on their side: each one becomes a full-width row
 * of its own two tiles, and the five rows stack. This was five columns wrapped
 * two-up, which is an odd number in an even grid - the fifth landed alone in
 * the left half with the right half of the screen empty beside it, and that
 * hole was the first thing you saw on a phone. Rotating rather than wrapping
 * has no remainder to strand, and it keeps the pairing the columns were
 * composed as.
 *
 * The tiles keep `grow` in the row, so it sets their *widths* here where it
 * sets their heights at `lg` - a 5 against a 4 is a 56/44 split. The height
 * comes from the row (`mobileHeight`) rather than from each tile, and
 * `object-cover` absorbs the difference; see the field's own note for why the
 * tiles' aspect ratios could not do that job.
 *
 * ## The white
 *
 * This is the page's second cut to daylight, after the press wall, and it was
 * asked for. Worth knowing the cost: that wall's white was built as *the* one
 * break in a dark page, so a second makes the device ordinary rather than
 * structural. They are at least doing different jobs - one is mastheads
 * printed on white, this is a photo wall - and on white these saturated frames
 * carry themselves without the ring they needed on ink.
 *
 * No captions, which is the reference and also the safer answer: the notes
 * this section used to carry named cities read off the photographs rather than
 * from a source. The alt text names a place only where the frame names itself
 * (the Jungfraujoch sign, the Eiffel Tower, Saint Basil's) and otherwise says
 * what is visible and stops.
 */

interface Tile {
	src: string;
	alt: string;
	/** Share of its column's height at `lg`. Varied so columns break unevenly. */
	grow: number;
	/** Crop bias, where centring would lose the subject. */
	position?: string;
}

/** `offset` drops the column's start and shortens what its tiles divide. */
interface Column {
	offset: string;
	/**
	 * The row's height below `lg`, where this column lies on its side.
	 *
	 * The tiles carried their own aspect ratios here first, and two tiles with
	 * different widths *and* different ratios land at wildly different heights:
	 * the 9/16 beside the 1/1 in column two came out 391px against 110px and
	 * left a white hole most of a row deep under the short one. Giving the row
	 * the height and letting `object-cover` do the rest means the widths can
	 * still vary - which is the rhythm - without the bottoms disagreeing.
	 *
	 * Varied row to row so five stacked rows do not read as a table.
	 */
	mobileHeight: string;
	tiles: Tile[];
}

const COLUMNS: Column[] = [
	{
		mobileHeight: "h-[30svh]",
		offset: "lg:pt-0 lg:pb-[6svh]",
		tiles: [
			{
				src: "/gallery/eiffel-tower.webp",
				alt: "Gautam Kumawat beneath the Eiffel Tower, lit gold against a night sky",
				grow: 5,
			},
			{
				src: "/gallery/alpine-valley.webp",
				alt: "Gautam Kumawat at a railing above a green alpine valley, a chalet below and cloud sitting on the peaks",
				grow: 4,
			},
		],
	},
	{
		mobileHeight: "h-[26svh]",
		offset: "lg:pt-[8svh]",
		tiles: [
			{
				src: "/gallery/st-basils.webp",
				alt: "Gautam Kumawat with both arms thrown wide in front of Saint Basil's Cathedral and its painted domes",
				grow: 6,
			},
			{
				src: "/gallery/city-dusk.webp",
				alt: "Gautam Kumawat on a city street at dusk, towers and moving traffic behind him",
				grow: 3,
			},
		],
	},
	{
		mobileHeight: "h-[33svh]",
		offset: "lg:pt-0 lg:pb-[13svh]",
		tiles: [
			{
				src: "/gallery/jungfraujoch.webp",
				alt: "Gautam Kumawat beside the Jungfraujoch 'Top of Europe' sign, snow and rock behind him",
				grow: 4,
			},
			{
				src: "/gallery/palace-stairs.webp",
				alt: "Gautam Kumawat seated on the balustraded staircase of a white and gold palace",
				grow: 5,
			},
		],
	},
	{
		mobileHeight: "h-[27svh]",
		offset: "lg:pt-[11svh] lg:pb-[3svh]",
		tiles: [
			{
				src: "/gallery/glass-towers.webp",
				alt: "Gautam Kumawat in front of a cluster of glass skyscrapers rising into haze",
				grow: 5,
			},
			{
				src: "/gallery/rooftops.webp",
				alt: "Gautam Kumawat at a parapet above a city of red tiled rooftops",
				grow: 4,
			},
		],
	},
	{
		mobileHeight: "h-[31svh]",
		offset: "lg:pt-[4svh] lg:pb-[9svh]",
		tiles: [
			{
				src: "/gallery/palace-flag.webp",
				alt: "Gautam Kumawat on the steps of a gilded baroque palace, a flag flying from its roof",
				grow: 4,
			},
			{
				src: "/gallery/horse-statue.webp",
				alt: "Gautam Kumawat at the plinth of a bronze statue of a man wrestling a rearing horse",
				grow: 5,
			},
		],
	},
];

const TILE_COUNT = COLUMNS.reduce((n, c) => n + c.tiles.length, 0);

export function GallerySection() {
	return (
		<section
			id="gallery"
			className="band relative scroll-mt-24 px-6 sm:px-10"
			style={{ backgroundColor: PAPER }}
		>
			<div className="mx-auto w-full max-w-6xl">
				<div>
					{/* The running head the journey section opens with - a rule with
					    the span at one end and the count at the other. Reused rather
					    than reinvented, which makes it the page's grammar instead of a
					    device that appears once. `--rule-paper` and the paper inks:
					    on white, the dark sections' white/20 rule and white/60 label
					    would both be invisible. The count is derived from the columns
					    so it cannot drift from what renders. */}
					<Reveal>
						<div className="flex items-center justify-between gap-6 border-t border-[color:var(--rule-paper)] pt-5">
							<p
								className="text-[0.7rem] font-semibold uppercase"
								style={{ color: PAPER_INK_SOFT, letterSpacing: "0.18em" }}
							>
								Off the stage
							</p>
							<p
								className="tnum text-[0.7rem] font-semibold uppercase"
								style={{ color: PAPER_INK_SOFT, letterSpacing: "0.18em" }}
							>
								{TILE_COUNT} frames
							</p>
						</div>
					</Reveal>

					{/* Heading left, standfirst right on the same baseline - the same
					    row the journey and the collage open with, at the same clamps,
					    because the wall below no longer has to be squeezed out of
					    whatever this leaves behind. */}
					<div className="mt-9 lg:flex lg:items-end lg:justify-between lg:gap-20">
						<Reveal>
							<h2
								className="display max-w-[11ch] text-balance text-[clamp(2.3rem,5vw,4.1rem)]"
								style={{ color: PAPER_INK }}
							>
								The rest of it
							</h2>
						</Reveal>

						<Reveal delay={0.08}>
							<p
								className="mt-5 max-w-[40ch] text-[0.95rem] leading-relaxed text-pretty sm:text-base lg:mt-0 lg:pb-3 lg:text-right"
								style={{ color: PAPER_INK_SOFT }}
							>
								Twenty-one countries, and not one of them for the conference
								room.
							</p>
						</Reveal>
					</div>
				</div>

				{/* The wall, one screen tall at `lg`. `svh` rather than `vh` for the
				    reason the hero uses it: `vh` is the viewport with the browser
				    chrome retracted, the tallest it ever gets, so a `vh` box is
				    taller than what is actually on screen while the address bar
				    shows. Below `lg` the height comes off and the columns wrap
				    two-up at their own height. */}
				<RevealGroup
					className="mt-12 flex flex-col gap-3 sm:gap-4 lg:mt-16 lg:h-svh lg:flex-row"
					stagger={0.05}
				>
					{COLUMNS.map((column) => (
						<RevealItem
							key={column.tiles[0].src}
							className={`flex items-stretch gap-3 sm:gap-4 ${column.mobileHeight} lg:h-full lg:basis-0 lg:grow lg:flex-col ${column.offset}`}
						>
							{column.tiles.map((tile) => (
								<figure
									key={tile.src}
									// `flex-grow` with `basis-0` at lg, so the tile takes its
									// share of the column rather than its own intrinsic
									// height. Below lg there is no column height to divide, so
									// the aspect class carries it instead.
									className="group m-0 h-full min-w-0 basis-0 overflow-hidden rounded-2xl shadow-[0_2px_10px_-2px_rgb(10_10_10/0.12),0_12px_28px_-12px_rgb(10_10_10/0.18)] lg:h-auto lg:min-h-0"
									style={{ flexGrow: tile.grow }}
								>
									<img
										src={tile.src}
										alt={tile.alt}
										loading="lazy"
										decoding="async"
										className={`block h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${tile.position ?? "object-center"}`}
									/>
								</figure>
							))}
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
