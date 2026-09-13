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
			<div className="relative mx-auto w-full max-w-6xl">
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
					{/* He stands in the gutter the grid leaves for him - four of the
					    twelve columns, floor-aligned so the frames meet him at the
					    shoulder. Masked top and bottom so he emerges from the field
					    instead of ending on a cut. Hidden below lg, where the frames
					    stack and there is no gutter to stand in. */}
					{/* A fixed column down the middle of the grid rather than a
					    centred image: `middle.jpg` is landscape (1024x637), so sizing
					    it by height made it 887px wide and it ran behind both columns
					    of cards, and capping its width made it small. Given a tall
					    column and object-cover it crops to the subject instead - he
					    fills the gutter at full height, which is what the composition
					    wants. Masked on every edge so the photo's own pale studio
					    background feathers into the field rather than reading as a
					    bright rectangle. */}
					<div
						aria-hidden="true"
						// Taller than the grid on purpose. `object-contain` fits the plate
						// inside its box, so the box's *height* is what caps the figure -
						// widening it alone did nothing. Letting it hang past the row top
						// and bottom lets him grow wide enough to run behind all four
						// frames rather than sitting between them.
						// Full-bleed width, no overhang. The oversizing and the 13% vertical
						// hang were there to force a narrower plate to reach across all four
						// frames; a wide plate covers the row on its own, so the box is just
						// the section's width and the row's height again.
						className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-screen -translate-x-1/2 lg:block"
					>
						{/* A big background figure with the frames laid over it, rather
						    than a narrow strip tucked into the gutter between them. He
						    spans past all four cards and they sit on top, which is what
						    makes the layers read as depth.

						    `object-cover`, not `object-contain`: contain fits the whole
						    20:9 plate inside the box's height, which on this row is far
						    shorter than 20:9 needs to reach full width - so the "full-bleed"
						    box was framing a much narrower picture with dark gutters either
						    side of it. Cover scales until the box's width is met and crops
						    the excess height instead, which is what actually reaches both
						    edges of the screen. `object-top` keeps that crop off his head.

						    The plate is 20:9 and already shot on black - measured, its
						    corners read 0-1 and four fifths of it sits in the darkest
						    luminance bin. So the radial mask that used to hide a pale
						    studio ground is gone (it was only cutting into him), and
						    `screen` drops the black out completely: black contributes
						    nothing to a screen blend, so only the lit figure lands on
						    the field. */}
						<img
							src="/collage/middle.jpg"
							alt=""
							loading="lazy"
							decoding="async"
							// 0.5, not 0.9. The plate carries a bright radial glow behind him -
							// its centre reads 235 against a field of 10 - and a screen blend
							// puts that straight onto the page: at 0.9 the middle of the
							// section composites to 213, which is the washed-out grey this
							// page is meant to be rid of. At 0.5 it reads as a spotlight and
							// the field stays black.
							className="h-full w-full object-cover object-top opacity-50 mix-blend-screen"
						/>
					</div>

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
