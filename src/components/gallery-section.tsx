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
 * ## The wall
 *
 * Ten frames on paper, in a masonry of mixed tile ratios. Built to a reference
 * the client supplied: photographs at deliberately different sizes and heights
 * on a white ground, tight gaps, generous corner radius, no captions.
 *
 * **The ratios are assigned, not inherited, and that is the whole mechanism.**
 * Every source here is a portrait phone frame at an identical 9:16, so a wall
 * that respected the source ratios would stack into a dead-even grid - the one
 * thing the reference is not. Each tile is given a ratio from `RATIOS` instead
 * and `object-cover` crops to it, which is what produces the staggered column
 * heights. The order of the list is therefore load-bearing: it is sequenced so
 * no two neighbouring tiles share a height.
 *
 * Cropping a 9:16 frame to 1:1 throws away a lot of picture, so the crops were
 * checked rather than assumed - each one rendered at its assigned ratio and
 * inspected for whether the subject survived. `object-center` holds for all
 * ten; where a crop needed biasing it is set per frame.
 *
 * No captions, which is the reference and also the safer answer. The notes
 * this section used to carry named cities that had been read off the
 * photographs rather than from a source - a warning sat in this file asking
 * for them to be confirmed before shipping. The alt text names a place only
 * where the frame names itself (the Jungfraujoch sign, the Eiffel Tower,
 * Saint Basil's) and otherwise says what is visible and stops.
 *
 * ## The white
 *
 * This is now the page's second cut to daylight, after the press wall, and it
 * was asked for. Worth knowing what it costs: that wall's white was built as
 * *the* one break in a dark page, so a second one makes the device ordinary
 * rather than structural. The two are at least doing different jobs - one is
 * mastheads printed on white, this is a photo wall - and on white these
 * saturated frames carry themselves without the ring they needed on ink.
 */

interface Frame {
	src: string;
	alt: string;
	/** Tailwind aspect class. Assigned for rhythm - see the note above. */
	ratio: string;
	/** Crop bias, where centring loses the subject. */
	position?: string;
}

/**
 * Four heights, cycled so neighbours differ. Tall, three-quarter, four-fifths
 * and square: enough spread to break the columns without any single tile
 * looking like a mistake.
 */
const FRAMES: Frame[] = [
	{
		src: "/gallery/eiffel-tower.webp",
		alt: "Gautam Kumawat beneath the Eiffel Tower, lit gold against a night sky",
		ratio: "aspect-[3/4]",
	},
	{
		src: "/gallery/st-basils.webp",
		alt: "Gautam Kumawat with both arms thrown wide in front of Saint Basil's Cathedral and its painted domes",
		ratio: "aspect-[9/16]",
	},
	{
		src: "/gallery/alpine-valley.webp",
		alt: "Gautam Kumawat at a railing above a green alpine valley, a chalet below and cloud sitting on the peaks",
		ratio: "aspect-[4/5]",
	},
	{
		src: "/gallery/palace-stairs.webp",
		alt: "Gautam Kumawat seated on the balustraded staircase of a white and gold palace",
		ratio: "aspect-[1/1]",
	},
	{
		src: "/gallery/jungfraujoch.webp",
		alt: "Gautam Kumawat beside the Jungfraujoch 'Top of Europe' sign, snow and rock behind him",
		ratio: "aspect-[9/16]",
	},
	{
		src: "/gallery/glass-towers.webp",
		alt: "Gautam Kumawat in front of a cluster of glass skyscrapers rising into haze",
		ratio: "aspect-[3/4]",
	},
	{
		src: "/gallery/palace-flag.webp",
		alt: "Gautam Kumawat on the steps of a gilded baroque palace, a flag flying from its roof",
		ratio: "aspect-[1/1]",
	},
	{
		src: "/gallery/rooftops.webp",
		alt: "Gautam Kumawat at a parapet above a city of red tiled rooftops",
		ratio: "aspect-[4/5]",
	},
	{
		src: "/gallery/horse-statue.webp",
		alt: "Gautam Kumawat at the plinth of a bronze statue of a man wrestling a rearing horse",
		ratio: "aspect-[9/16]",
	},
	{
		src: "/gallery/city-dusk.webp",
		alt: "Gautam Kumawat on a city street at dusk, towers and moving traffic behind him",
		ratio: "aspect-[3/4]",
	},
];

export function GallerySection() {
	return (
		<section
			id="gallery"
			className="band relative scroll-mt-24 px-6 sm:px-10"
			style={{ backgroundColor: PAPER }}
		>
			<div className="mx-auto w-full max-w-6xl">
				{/* The running head the journey section opens with - a rule with the
				    span at one end and the count at the other. Reused rather than
				    reinvented, which makes it the page's grammar instead of a device
				    that appears once. `--rule-paper` and the paper inks, because on
				    white the white/20 rule and white/60 label of the dark sections
				    would both be invisible. The count is read off the list so it
				    cannot drift from what renders. */}
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
							{FRAMES.length} frames
						</p>
					</div>
				</Reveal>

				{/* Heading left, standfirst right on the same baseline - the same row
				    the journey and the collage open with. */}
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
							Twenty-one countries, and not one of them for the conference room.
						</p>
					</Reveal>
				</div>

				{/* Masonry. `break-inside-avoid` is what stops a figure being split
				    across a column break - without it the browser balances the
				    columns by slicing a tile in half. */}
				<RevealGroup
					className="mt-12 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:mt-16 lg:columns-4"
					stagger={0.05}
				>
					{FRAMES.map((frame) => (
						<RevealItem
							key={frame.src}
							className="mb-3 break-inside-avoid sm:mb-4"
						>
							{/* A soft shadow rather than the ring these carried on ink. A
							    hairline that read as a frame edge on near-black reads as a
							    grey box on paper; a shadow lifts the photograph off the
							    white instead, which is what the reference does. */}
							<figure className="group m-0 overflow-hidden rounded-2xl shadow-[0_2px_10px_-2px_rgb(10_10_10/0.12),0_12px_28px_-12px_rgb(10_10_10/0.18)]">
								<img
									src={frame.src}
									alt={frame.alt}
									loading="lazy"
									decoding="async"
									className={`block h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${frame.ratio} ${frame.position ?? "object-center"}`}
								/>
							</figure>
						</RevealItem>
					))}
				</RevealGroup>
			</div>
		</section>
	);
}
