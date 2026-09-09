import { Reveal } from "#/components/ui/scroll-reveal";
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
 * book. The only motion is a slow push on the photograph under the pointer -
 * no lift, no shadow, none of the card behaviour the collage uses to signal
 * that a tile is a button.
 *
 * ## The captions
 *
 * Every note below states only what is visible in its own frame. That is not
 * fussiness, it is the section's whole risk: three of these are photographs of
 * a man standing in a city, and a caption is all it would take to turn them
 * into a claim about work he did there. PRODUCT.md's first principle is
 * evidence over adjectives, so the captions describe and never assert.
 *
 * ⚠️ TWO CAPTIONS ARE READ FROM THE IMAGES, NOT FROM A SOURCE.
 *
 * `budapest-parliament` and `moscow-embankment` are identified by their
 * landmarks - the Hungarian Parliament across the Danube, and what appears to
 * be one of Moscow's Stalin-era "Seven Sisters" across the Moskva. Confident
 * reads, but reads. Confirm both, or fall back to a caption that names no
 * city, before this ships.
 *
 * ## The layout
 *
 * Five photographs, left at exactly the ratios they were shot: 3:4, 4:3 and
 * three 9:16 phone frames. Nothing is cropped to a common tile. The variety is
 * the composition - a grid of identical rectangles is the "identical icon-card
 * grid" PRODUCT.md rules out, and it would also flatten the one thing that
 * distinguishes these five, which is that they are five genuinely different
 * places.
 *
 * The rows are placed by hand on a twelve-column field, the same idiom the
 * collage uses, and each is a beat: the room the work runs from, then the
 * places away from it. Both rows close flush, so the section ends on the last
 * photograph and its caption. It carried a sixth frame and a closing line
 * beside it until the frame came out; the line went with it.
 */

interface Frame {
	src: string;
	/** Intrinsic size of the derivative, so the row reserves its height. */
	width: number;
	height: number;
	alt: string;
	/** Tailwind aspect class matching the source ratio. Nothing is cropped. */
	ratio: string;
	/** The short label. */
	title: string;
	/** What is actually in the frame. Descriptive, never a claim. */
	note: string;
	/** Placement on the twelve-column field at lg. */
	place: string;
}

const FRAMES: Frame[] = [
	{
		src: "/gallery/studio-desk.webp",
		width: 1100,
		height: 1467,
		alt: "Gautam Kumawat at his studio desk, hands steepled, a boom microphone and monitors behind him",
		ratio: "aspect-[3/4]",
		title: "The room it runs from",
		note: "Boom mic, two screens and a wall lit green. Where the courses get recorded.",
		place: "lg:col-span-4 lg:col-start-1 lg:row-start-1",
	},
	{
		src: "/gallery/threat-map.webp",
		width: 1400,
		height: 1050,
		alt: "A darkened desk with a live cyberthreat map, a packet capture and a laptop showing the HackingFlix logo",
		ratio: "aspect-[4/3]",
		title: "A quiet night at the desk",
		note: "A cyberthreat live map, a capture running beside it, HackingFlix on the laptop.",
		place: "lg:col-span-8 lg:col-start-5 lg:row-start-1",
	},
	{
		src: "/gallery/budapest-anonymus.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat sitting on the plinth of the hooded Anonymus statue in Budapest",
		ratio: "aspect-[9/16]",
		title: "Anonymus, Budapest",
		note: "A hooded figure with no face, cast in 1903. The name was taken a long time before the internet.",
		place: "lg:col-span-4 lg:col-start-1 lg:row-start-2",
	},
	{
		src: "/gallery/budapest-parliament.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat on a river embankment at night, the lit Hungarian Parliament building across the water",
		ratio: "aspect-[9/16]",
		title: "The Danube, after dark",
		note: "Parliament lit up on the far bank, a sightseeing cruise tied up on the near one.",
		place: "lg:col-span-4 lg:col-start-5 lg:row-start-2",
	},
	{
		src: "/gallery/moscow-embankment.webp",
		width: 900,
		height: 1600,
		alt: "Gautam Kumawat on a flower-lined embankment, a tall Stalin-era tower block across the river behind him",
		ratio: "aspect-[9/16]",
		title: "Across the Moskva",
		note: "One of the Seven Sisters on the far bank, its spire still under scaffolding.",
		place: "lg:col-span-4 lg:col-start-9 lg:row-start-2",
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
				    a device that appears once. */}
				<Reveal>
					<div className="flex items-center justify-between gap-6 border-t border-white/20 pt-5">
						<p
							className="text-[0.7rem] font-semibold uppercase text-white/60"
							style={{ letterSpacing: "0.18em" }}
						>
							Off the stage
						</p>
						<p
							className="text-[0.7rem] font-semibold uppercase text-white/35"
							style={{ letterSpacing: "0.18em" }}
						>
							Five frames
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
							The desk the work runs from, and a few of the places away from it.
						</p>
					</Reveal>
				</div>

				{/* `items-start`: the frames keep their own heights, so a row's
				    shorter tile sits at the top of the row rather than being
				    stretched to match its neighbour. */}
				<div className="mt-12 grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-y-14">
					{FRAMES.map((frame, index) => (
						<Reveal
							key={frame.src}
							delay={(index % 3) * 0.07}
							className={frame.place}
						>
							<figure className="group m-0">
								<div className="overflow-hidden rounded-xl ring-1 ring-white/10">
									<img
										src={frame.src}
										alt={frame.alt}
										width={frame.width}
										height={frame.height}
										loading="lazy"
										decoding="async"
										className={`${frame.ratio} w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
									/>
								</div>

								{/* Under the frame, not over it. A scrim and type laid across
								    the photograph is what the collage does to sell a booking;
								    a gallery caption belongs beside the picture, where it
								    costs the picture nothing. */}
								<figcaption className="mt-4">
									<p className="display-tight text-[1.05rem] text-white sm:text-[1.15rem]">
										{frame.title}
									</p>
									<p className="mt-1.5 max-w-[38ch] text-[0.82rem] leading-relaxed text-pretty text-white/60">
										{frame.note}
									</p>
								</figcaption>
							</figure>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
