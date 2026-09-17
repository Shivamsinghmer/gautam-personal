import { Reveal, RevealGroup, RevealItem } from "#/components/ui/scroll-reveal";
import { INK } from "#/lib/palette";

/**
 * The gallery: the rooms nobody books him for.
 *
 * ## Why it exists, and why it is not the collage again
 *
 * `CollageSection` is the on-stage evidence - full auditoriums, panels, a
 * lectern - and it is built to sell: every frame is a link into the booking
 * block, and the hover swaps the format for "Book this". That section answers
 * "can he hold a room". This one answers the question a visitor asks straight
 * afterwards, which is "who is this", and it has to answer it without a CTA
 * on every tile or it is just the collage with different photographs.
 *
 * So the frames here are `<figure>`s, not links. Nothing to click, nothing to
 * book.
 *
 * ## The wall
 *
 * It was five frames placed by hand on a twelve-column field, each with a
 * title and a descriptive note beside it. It is a mosaic now - seventeen
 * frames, masonry columns, no captions - because the set grew past what the
 * old layout could hold: hand-placing seventeen cells is not a layout, it is
 * seventeen decisions, and seventeen captions would bury the pictures under
 * text nobody came here to read.
 *
 * Losing the captions also retires a standing risk. The old notes named
 * cities, and two were read off the photographs rather than from any source -
 * a warning sat in this file asking for both to be confirmed before shipping.
 * Twelve more frames would have meant twelve more guesses. The alt text now
 * describes rather than asserts: where a place names itself in frame it is
 * named (the Jungfraujoch sign, the Eiffel Tower, Saint Basil's), and where it
 * does not, the alt says what is visible and stops.
 *
 * `columns-*` rather than a grid with spans. Masonry is what this wants -
 * every frame at its own height, no common crop - and CSS columns do it in one
 * declaration with no per-item bookkeeping. The cost is DOM order running down
 * each column rather than across, which for an unordered wall of photographs
 * is not a cost.
 *
 * Mixed ratios are load-bearing here, not incidental. Twelve of these are
 * portrait phone frames at the same 9:16, so left to themselves they would
 * stack into an even grid with no stagger at all; `threat-map` (4:3) and
 * `studio-desk` (3:4) are what break the rows and make the columns read as
 * masonry. That is why the two of them sit early in the list rather than at
 * the end.
 *
 * The ground stays `INK`. The reference for this layout was on white, but the
 * page already spends its one cut to daylight on the press wall, and a second
 * white section would make that cut mean less - these are saturated travel
 * frames and they carry themselves on near-black.
 */

interface Frame {
	src: string;
	/** Intrinsic size of the derivative, so the column reserves its height. */
	width: number;
	height: number;
	/** Describes what is in the frame. Never asserts a place the photo does not. */
	alt: string;
}

const FRAMES: Frame[] = [
	{
		src: "/gallery/threat-map.webp",
		width: 1400,
		height: 1050,
		alt: "A darkened desk with a live cyberthreat map, a packet capture and a laptop showing the HackingFlix logo",
	},
	{
		src: "/gallery/eiffel-tower.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat beneath the Eiffel Tower, lit gold against a night sky",
	},
	{
		src: "/gallery/jungfraujoch.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat beside the Jungfraujoch 'Top of Europe' sign, snow and rock behind him",
	},
	{
		src: "/gallery/studio-desk.webp",
		width: 1100,
		height: 1467,
		alt: "Gautam Kumawat at his studio desk, hands steepled, a boom microphone and monitors behind him",
	},
	{
		src: "/gallery/st-basils.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat with both arms thrown wide in front of Saint Basil's Cathedral and its painted domes",
	},
	{
		src: "/gallery/alpine-valley.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat at a railing above a green alpine valley, a chalet below and cloud sitting on the peaks",
	},
	{
		src: "/gallery/city-square.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat standing on a city square, a grand brick department store and tram wires behind him",
	},
	{
		src: "/gallery/palace-stairs.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat seated on the balustraded staircase of a white and gold palace",
	},
	{
		src: "/gallery/mountain-train.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat seated in a mountain railway carriage, snow-covered slopes through the window",
	},
	{
		src: "/gallery/budapest-anonymus.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat sitting on the plinth of the hooded Anonymus statue",
	},
	{
		src: "/gallery/glass-towers.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat in front of a cluster of glass skyscrapers rising into haze",
	},
	{
		src: "/gallery/palace-flag.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat on the steps of a gilded baroque palace, a flag flying from its roof",
	},
	{
		src: "/gallery/rooftops.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat at a parapet above a city of red tiled rooftops",
	},
	{
		src: "/gallery/moscow-embankment.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat on a flower-lined embankment, a tall tower block across the river behind him",
	},
	{
		src: "/gallery/horse-statue.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat at the plinth of a bronze statue of a man wrestling a rearing horse",
	},
	{
		src: "/gallery/city-dusk.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat on a city street at dusk, towers and moving traffic behind him",
	},
	{
		src: "/gallery/budapest-parliament.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat on a river embankment at night, a lit parliament building across the water",
	},
];

export function GallerySection() {
	return (
		<section
			id="gallery"
			className="band relative scroll-mt-24 px-6 sm:px-10"
			style={{ backgroundColor: INK }}
		>
			<div className="mx-auto w-full max-w-6xl">
				{/* The running head the journey section opens with - a rule with the
				    span at one end and the count at the other. Reused rather than
				    reinvented, which is what makes it the page's grammar instead of
				    a device that appears once. The count is read off the list so it
				    cannot drift from what renders. */}
				<Reveal>
					<div className="flex items-center justify-between gap-6 border-t border-white/20 pt-5">
						<p
							className="text-[0.7rem] font-semibold uppercase text-white/60"
							style={{ letterSpacing: "0.18em" }}
						>
							Off the stage
						</p>
						<p
							className="tnum text-[0.7rem] font-semibold uppercase text-white/35"
							style={{ letterSpacing: "0.18em" }}
						>
							{FRAMES.length} frames
						</p>
					</div>
				</Reveal>

				{/* Heading left, standfirst right on the same baseline - the same row
				    the journey and the collage open with. */}
				<div className="mt-9 lg:flex lg:items-end lg:justify-between lg:gap-20">
					<Reveal>
						<h2 className="display max-w-[11ch] text-balance text-[clamp(2.3rem,5vw,4.1rem)] text-white">
							The rest of it
						</h2>
					</Reveal>

					<Reveal delay={0.08}>
						<p className="mt-5 max-w-[40ch] text-[0.95rem] leading-relaxed text-pretty text-white/60 sm:text-base lg:mt-0 lg:pb-3 lg:text-right">
							The desk the work runs from, and the places away from it.
						</p>
					</Reveal>
				</div>

				{/* Masonry. `break-inside-avoid` is what stops a figure being split
				    across a column break - without it the browser balances the
				    columns by slicing an image in half. The gap is deliberately
				    tight: the wall should read as one surface rather than as
				    seventeen cards. */}
				<RevealGroup
					className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:mt-16 lg:columns-4"
					stagger={0.035}
				>
					{FRAMES.map((frame) => (
						<RevealItem
							key={frame.src}
							className="mb-3 break-inside-avoid sm:mb-4"
						>
							<figure className="group m-0 overflow-hidden rounded-xl ring-1 ring-white/10">
								<img
									src={frame.src}
									alt={frame.alt}
									width={frame.width}
									height={frame.height}
									loading="lazy"
									decoding="async"
									// `h-auto` plus the intrinsic width/height is what makes
									// this masonry rather than a grid: the browser reserves
									// each frame's real height before the image lands, so the
									// columns do not reflow as they load.
									className="block h-auto w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
								/>
							</figure>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
