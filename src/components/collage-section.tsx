import { ArrowUpRight } from "lucide-react";
import { Reveal } from "#/components/ui/scroll-reveal";
import { INK, SHADER_BLUE_BRIGHT } from "#/lib/palette";

/**
 * The rooms he has worked, as a 2x2 with him standing in the middle of it.
 *
 * The frames sit in the outer thirds of a twelve-column field and the figure
 * fills the four columns between them, so he is *inside* the composition
 * rather than behind a row of tiles. That centre gutter is the whole idea: the
 * photographs are the rooms, and the man between them is the reason they were
 * full.
 *
 * Each frame carries its format as display type over the picture, right
 * aligned, with a bottom scrim so the words never sit on bare photograph.
 *
 * Hovering lifts the card and swaps the format for the action. They are real
 * links to the booking block - keynotes, workshops, talks and panels are all
 * things he is actually booked for - because a card that animates like a
 * button and then does nothing is worse than one that never moved.
 */

interface Panel {
	src: string;
	alt: string;
	/** The word that names the format. */
	title: string;
	/** What the frame actually shows. Verifiable, not adjectival. */
	note: string;
	/** Placement on the twelve-column field at lg. */
	place: string;
}

const PANELS: Panel[] = [
	{
		src: "/collage/t1.webp",
		alt: "A full auditorium of students watching Gautam Kumawat speak from the stage",
		title: "Keynotes",
		note: "Full auditoriums, school and college circuits",
		place: "lg:col-span-4 lg:col-start-1 lg:row-start-1",
	},
	{
		src: "/collage/b1.webp",
		alt: "Gautam Kumawat on the India Today Future Talk panel, name card visible",
		title: "Panels",
		note: "India Today · Future Talk",
		place: "lg:col-span-4 lg:col-start-9 lg:row-start-1",
	},
	{
		src: "/collage/b2.webp",
		alt: "Gautam Kumawat delivering a talk under stage lighting",
		title: "Talks",
		note: "Stage sets, no slides",
		place: "lg:col-span-4 lg:col-start-1 lg:row-start-2",
	},
	{
		src: "/collage/t2.webp",
		alt: "Students at a lectern asking questions during a session",
		title: "Workshops",
		note: "Questions from the floor",
		place: "lg:col-span-4 lg:col-start-9 lg:row-start-2",
	},
];

export function CollageSection() {
	return (
		<section
			id="the-room"
			className="band relative flex flex-col justify-center overflow-hidden scroll-mt-24 px-6 sm:px-10"
			style={{ backgroundColor: INK }}
		>
			{/* The figure is the section's ground now, not a layer inside the card
			    row. It used to be `inset-y-0` on that row's wrapper, so it started
			    below the heading and stopped at the last card - a tall band of
			    photograph with the section's own padding dark above and below it,
			    which read as a panel behind the cards rather than as the field they
			    sit on. Hung on the section instead, `inset-0` covers the whole
			    thing, heading included.

			    `lg:block` only. Below that the cards stack into a single column and
			    there is no composition left for him to stand in the middle of. */}
			{/* Inset rather than flush to the section's edges. Covering the box
			    exactly made him the largest thing on the page and put the plate's
			    glow right behind the heading; pulling the box in ~8% horizontally
			    and 6% vertically takes the figure down a step without giving up the
			    full-section ground the layer is here to provide. `screen` means the
			    inset costs nothing visually - the margin it leaves is the plate's
			    own black, which contributes nothing to the blend either way. */}
			{/* Masked at the top and bottom edges, because the plate's black is
			    not black there.

			    The note below says the corners read 0-1. That holds for the left
			    and right edges (1.1 and 0.8 mean) and not for the top and bottom,
			    which average 5.8 and 5.0. Screened at 0.5 over a ground of 10 that
			    composites the field inside this box to about 12.7 - a step of
			    nearly three levels - and because the layer is inset 6%, the step
			    landed as a hard horizontal line partway into the section with flat
			    ink above it. On a near-black ground, three levels across a straight
			    edge is a seam you can see, and it read as the section boundary
			    being wrong rather than as a layer edge.

			    The fade rolls the layer to nothing over the outer eighth, so the
			    lift arrives gradually and there is no edge to catch. Vertical only:
			    the side edges contribute about half a level, which is under the
			    threshold where a boundary is visible, and masking them too would
			    narrow the figure for nothing. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-[8%] inset-y-[6%] z-0 hidden lg:block"
				style={{
					maskImage:
						"linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
					WebkitMaskImage:
						"linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
				}}
			>
				{/* `object-cover` and `object-top`: cover scales until the box's
				    width is met and crops the excess height, which is what reaches
				    both edges; contain would fit the whole 20:9 plate inside the
				    height and leave dark gutters either side. `object-top` keeps
				    the crop off his head.

				    The plate is 20:9 and already shot on black - its corners read
				    0-1 and four fifths of it sits in the darkest luminance bin - so
				    `screen` drops that black out completely and only the lit figure
				    lands on the field. 0.5, not 0.9: the plate carries a bright
				    radial glow whose centre reads 235 against a field of 10, and at
				    0.9 the middle of the section composited to 213, which is the
				    washed-out grey this page is meant to be rid of. */}
				<img
					src="/collage/middle.jpg"
					alt=""
					loading="lazy"
					decoding="async"
					className="h-full w-full object-cover object-top opacity-50 mix-blend-screen"
				/>
			</div>

			<div className="relative z-10 mx-auto w-full max-w-6xl">
				{/* Headline and its line share one baseline at lg, so the block costs
				    one row of height instead of two. */}
				<div className="lg:flex lg:items-end lg:justify-between lg:gap-16">
					<Reveal>
						<h2 className="display max-w-[12ch] text-[clamp(2.3rem,5vw,4.1rem)] text-white">
							The room is the proof
						</h2>
					</Reveal>

					<Reveal delay={0.08}>
						<p className="mt-5 max-w-[40ch] text-[0.95rem] leading-relaxed text-pretty text-white/60 sm:text-base lg:mt-0 lg:pb-3 lg:text-right">
							The work happens in front of people. Easier to show than to claim.
						</p>
					</Reveal>
				</div>

				<div className="relative mt-12 lg:mt-16">
					<div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
						{PANELS.map((panel, index) => (
							<Reveal
								key={panel.src}
								delay={index * 0.07}
								direction={index % 2 === 0 ? "right" : "left"}
								className={panel.place}
							>
								<a
									href="#book"
									aria-label={`${panel.title} — ${panel.note}. Check availability.`}
									className="group relative block overflow-hidden rounded-xl ring-1 ring-white/10 transition-[transform,box-shadow,--tw-ring-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.95)] focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
									style={{ outlineColor: SHADER_BLUE_BRIGHT }}
								>
									<img
										src={panel.src}
										alt={panel.alt}
										loading="lazy"
										decoding="async"
										className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
									/>

									{/* Scrim only where the type sits, so the top of every
									    photograph is left alone. */}
									<span
										aria-hidden="true"
										className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/85 via-black/45 to-transparent"
									/>

									{/* The label. Format by default; the action on hover, in
									    the same slot so the card reads as one thing changing
									    rather than two labels stacked. */}
									<span className="pointer-events-none absolute inset-0 flex flex-col items-end justify-center p-6 text-right sm:p-7">
										{/* Both states share one grid cell, so the box is as wide
										    as the wider of the two and neither can wrap. As an
										    absolutely-positioned overlay the CTA inherited the
										    title's width, broke onto two lines and collided with
										    the note underneath. */}
										<span className="grid justify-items-end">
											<span className="display-tight [grid-area:1/1] text-[clamp(1.6rem,3.2vw,2.4rem)] text-white transition-[opacity,transform] duration-300 group-hover:-translate-y-1 group-hover:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:opacity-100">
												{panel.title}
											</span>

											<span className="flex translate-y-1 [grid-area:1/1] items-center gap-2 self-center whitespace-nowrap text-[clamp(1.4rem,2.8vw,2rem)] font-extrabold tracking-tight text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
												Book this
												<ArrowUpRight
													className="h-6 w-6 shrink-0"
													style={{ color: SHADER_BLUE_BRIGHT }}
													aria-hidden="true"
												/>
											</span>
										</span>

										<span className="mt-2 block max-w-[22ch] text-xs leading-snug text-white/70 sm:text-[0.8rem]">
											{panel.note}
										</span>
									</span>
								</a>
							</Reveal>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
