import { ChevronsDown } from "lucide-react";
import {
	type CaseStudyFlipItem,
	CaseStudyFlipStack,
} from "#/components/ui/case-study-flip-stack";
import { Reveal } from "#/components/ui/scroll-reveal";
import {
	HERO_DEEP,
	HERO_MINT,
	HERO_TEAL,
	SHADER_BLUE_BRIGHT,
	SHADER_BLUE_DEEP,
} from "#/lib/palette";

/**
 * The journey: the work in the order it happened, as a stack of six cards that
 * flip away one at a time under the scroll.
 *
 * Design notes:
 *
 * - The order is the information here, so the sequence is the mechanic: a step
 *   holds the screen until you scroll past it, and you cannot reach step six
 *   without passing five. That is what earns the numbering - 01/02/03 as an
 *   ornament above every section is the reflex this avoids.
 * - The card grounds run one deliberate ramp rather than six unrelated colours:
 *   near-black ink, teal, the two blues, and out to mint. Dark to light across
 *   the sequence, so the palette itself carries the arc from closed case files
 *   to a full auditorium. Four of them are the site's own tokens, and the brand
 *   blue finally gets used at full strength as a surface rather than as type it
 *   is too dark to carry on this ground.
 * - Every foreground is picked against its own card: the lightest ground takes
 *   the deep ink, the rest take near-white, and all six clear 5.7:1 or better.
 * - The photographs are one graded monochrome set (see
 *   scripts/build-journey-images.mjs). Four of these frames appear again in
 *   colour further down the page; the grade keeps this from reading as that
 *   section repeated, and holds six pictures shot years apart together.
 * - No `overflow-hidden` on the section: the stack is `position: sticky`, and a
 *   clipped ancestor silently turns that back into static.
 */

const NEAR_WHITE = "#eef6f8";

const STEPS: CaseStudyFlipItem[] = [
	{
		number: "01",
		eyebrow: "Case work",
		title: "Darknet investigation and digital forensics",
		description:
			"Cybercrimes of profound complexity, worked as case files years before any of it became a curriculum.",
		image: "/journey/01-case-work.webp",
		imageAlt: "Gautam Kumawat reading case material from a tablet",
		background: "#072a36",
		foreground: NEAR_WHITE,
	},
	{
		number: "02",
		eyebrow: "The agencies",
		title: "Seven years inside law enforcement",
		description:
			"Prestigious institutions in India and the US. The job was training serving officials, and solving what came in.",
		image: "/journey/02-agencies.webp",
		imageAlt: "Studio portrait of Gautam Kumawat",
		background: "#0b4353",
		foreground: NEAR_WHITE,
	},
	{
		number: "03",
		eyebrow: "The classroom",
		title: "Taught from field practice, not theory",
		description:
			"The same cases, opened up for people who had never seen one. Questions from the floor, answered straight.",
		image: "/journey/03-classroom.webp",
		imageAlt:
			"A student at the lectern putting a question to the room, classmates behind him",
		background: HERO_TEAL,
		foreground: "#ffffff",
	},
	{
		number: "04",
		eyebrow: "The stage",
		title: "Auditoriums on the school and college circuit",
		description:
			"Stage sets rather than lecture halls. Full rooms, no slides, one subject everyone in them had already met online.",
		image: "/journey/04-stage.webp",
		imageAlt: "Gautam Kumawat mid-talk on a darkened stage, hands raised",
		background: SHADER_BLUE_DEEP,
		foreground: "#ffffff",
	},
	{
		number: "05",
		eyebrow: "The press",
		title: "The subject escalated into national media",
		description:
			"India Today, Hindustan Times, The Hindu, Times of India, Economic Times, and others besides.",
		image: "/journey/05-press.webp",
		imageAlt:
			"Gautam Kumawat on the India Today Future Talk panel, his name card on the table",
		background: SHADER_BLUE_BRIGHT,
		foreground: "#ffffff",
	},
	{
		number: "06",
		eyebrow: "The scale",
		title: "41,000 students across 162 countries",
		description:
			"Same material, same field practice behind it. What changed is the size of the room.",
		image: "/journey/06-scale.webp",
		imageAlt: "A packed auditorium of students watching from tiered seating",
		background: HERO_MINT,
		foreground: HERO_DEEP,
	},
];

export function JourneySection() {
	return (
		<section
			id="journey"
			className="relative scroll-mt-24"
			style={{ backgroundColor: HERO_DEEP }}
		>
			<div className="mx-auto max-w-6xl px-6 pt-[var(--band)] sm:px-10">
				<div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-end lg:gap-16">
					<Reveal>
						{/* One colour. The white-line/grey-line split belongs to the hero
						    and only the hero - it was running in three separate headings,
						    which turns a device into a tic. */}
						<h2 className="display max-w-[13ch] text-[clamp(2.3rem,5vw,4.1rem)] text-white">
							Six rooms, in the order they happened
						</h2>
					</Reveal>

					<Reveal delay={0.08}>
						<div>
							<p className="text-[0.95rem] leading-relaxed text-pretty text-white/60 sm:text-base">
								None of it started in a classroom. The sequence runs from case
								work inside law-enforcement agencies to 41,000 students in 162
								countries.
							</p>
							{/* The stack only advances on scroll, and a card that fills the
							    screen looks like a destination rather than a step. One line
							    says which it is. */}
							<p className="mt-4 flex items-center gap-2 text-xs text-white/45">
								<ChevronsDown className="h-3.5 w-3.5" aria-hidden="true" />
								Six steps. Keep scrolling to move through them.
							</p>
						</div>
					</Reveal>
				</div>
			</div>

			<CaseStudyFlipStack
				items={STEPS}
				scrollPerCard={72}
				className="mt-10 sm:mt-14"
			/>
		</section>
	);
}
