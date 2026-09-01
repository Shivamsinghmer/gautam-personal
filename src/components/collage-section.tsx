import { Reveal } from "#/components/ui/scroll-reveal";
import { HERO_DEEP } from "#/lib/palette";

/**
 * The rooms he has worked: one row of photographs, held to one screen.
 *
 * Design notes:
 *
 * - Every frame shares the same 4:3 crop and the same column span, so the row
 *   reads as one set rather than four differently shaped tiles. What keeps it
 *   from being the identical-card-grid reflex is that these are photographs
 *   carrying their own subject, not repeated icon/heading/text cards.
 * - No tracked-uppercase eyebrow. The section states its claim in a headline
 *   instead; an eyebrow over every section is scaffolding, not voice.
 * - Each caption carries evidence, not an adjective - the venue, the format,
 *   the masthead - so the photographs argue rather than decorate.
 * - The figure stands behind the row, bottom-aligned, so the photographs
 *   overlap him and the layers read as depth.
 */

interface Panel {
	src: string;
	alt: string;
	/** The word that names the format. */
	title: string;
	/** What the frame actually shows. Verifiable, not adjectival. */
	note: string;
	/** Column span on the 12-column composition at lg. */
	place: string;
}

const PANELS: Panel[] = [
	{
		src: "/collage/t1.webp",
		alt: "A full auditorium of students watching Gautam Kumawat speak from the stage",
		title: "Keynotes",
		note: "Full auditoriums, school and college circuits",
		place: "lg:col-span-3",
	},
	{
		src: "/collage/t2.webp",
		alt: "Students at a lectern asking questions during a session",
		title: "Workshops",
		note: "Questions from the floor",
		place: "lg:col-span-3",
	},
	{
		src: "/collage/b2.webp",
		alt: "Gautam Kumawat delivering a talk under stage lighting",
		title: "Talks",
		note: "Stage sets, no slides",
		place: "lg:col-span-3",
	},
	{
		src: "/collage/b1.webp",
		alt: "Gautam Kumawat on the India Today Future Talk panel, name card visible",
		title: "Panels",
		note: "India Today · Future Talk",
		place: "lg:col-span-3",
	},
];
export function CollageSection() {
	return (
		<section
			id="the-room"
			className="relative flex flex-col justify-center overflow-hidden scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* Bottom-aligned behind the row so the photographs overlap his
			    shoulders. Hidden below lg, where the panels stack over him. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 hidden justify-center lg:flex"
			>
				<img
					src="/collage/middle.jpg"
					alt=""
					loading="lazy"
					decoding="async"
					className="h-[78vh] w-auto max-w-none object-contain object-bottom opacity-55 [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_88%,transparent)]"
				/>
			</div>

			<div className="relative mx-auto max-w-6xl">
				{/* Headline and its line sit on one baseline at lg, so the block
				    costs one row of height instead of two and the photographs keep
				    the rest of the screen. */}
				<div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
					<Reveal>
						<h2 className="max-w-[13ch] text-pretty text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[clamp(2.6rem,4.6vw,4rem)]">
							The room is the proof
						</h2>
					</Reveal>

					<Reveal delay={0.08}>
						<p className="mt-5 max-w-[42ch] text-base leading-relaxed text-white/60 lg:mt-0 lg:pb-2 lg:text-right">
							The work happens in front of people. Easier to show than to claim.
						</p>
					</Reveal>
				</div>

				{/* One column on a phone, two on a tablet, four across from lg.
				    Every frame carries the same 4:3 crop and the same span, so the
				    row reads as one set of photographs rather than four differently
				    shaped tiles. */}
				<div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-12 lg:items-end lg:gap-5">
					{PANELS.map((panel, index) => (
						<Reveal
							key={panel.src}
							delay={index * 0.09}
							direction={index % 2 === 0 ? "right" : "left"}
							className={panel.place}
						>
							<figure className="group relative m-0 overflow-hidden rounded-lg">
								<img
									src={panel.src}
									alt={panel.alt}
									loading="lazy"
									decoding="async"
									className={`aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
								/>

								{/* Scrim only where the type sits. Bottom-weighted, so the top
								    two thirds of every photograph stay untouched. */}
								<span
									aria-hidden="true"
									className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/45 to-transparent"
								/>

								<figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
									<span className="block text-2xl font-bold leading-none tracking-[-0.02em] text-white sm:text-3xl">
										{panel.title}
									</span>
									<span className="mt-2 block text-xs leading-snug text-white/65 sm:text-sm">
										{panel.note}
									</span>
								</figcaption>
							</figure>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
