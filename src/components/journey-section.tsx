import {
	type CaseStudyFlipItem,
	CaseStudyFlipStack,
} from "#/components/ui/case-study-flip-stack";
import { Reveal } from "#/components/ui/scroll-reveal";
import { HERO_DEEP } from "#/lib/palette";

/**
 * The journey: twenty years in the order they happened, as a stack of six cards
 * that flip away one at a time under the scroll.
 *
 * Design notes:
 *
 * - The order is the information here, so the sequence is the mechanic: a step
 *   holds the screen until you scroll past it, and you cannot reach step six
 *   without passing five. That is what earns the numbering - 01/02/03 as an
 *   ornament above every section is the reflex this avoids.
 * - Each card carries its years twice: on the card, where everyone gets them,
 *   and in the rail up the left margin, which is the whole arc at a glance and
 *   only appears where there is margin to spare. Under the years sits a short
 *   dated list rather than a paragraph - the dates are the argument.
 * - Each card now carries its own ground, one per stage, rather than sharing
 *   `INK_RAISE` across all six. The stack cross-fades between them as it flips
 *   (see `backgroundColor` in case-study-flip-stack.tsx), so the shade itself
 *   becomes a second signal that a step has changed, alongside the flip. Pure
 *   greys, not hues - a version with a colour tilt per stage fought the
 *   photographs, which are graded as one monochrome set, so the six grounds
 *   below only move up and down the same black-to-charcoal scale.
 * - The photographs are one graded monochrome set (see
 *   scripts/build-journey-images.mjs). Their filenames carry that script's
 *   ordering, not this section's, so 07-first-desk opening the stack is
 *   expected rather than a mistake - the images are matched to the stage they
 *   suit. Several of these frames appear again in colour further down the page,
 *   in the collage and the gallery; the grade keeps this from reading as those
 *   sections repeated.
 * - Step 01 is the one card whose photograph is actually *of* the years it
 *   describes: a period shot of him at a home desk, running the grade over a
 *   green-on-black laptop screen that would otherwise be the exact hacker
 *   cliche PRODUCT.md rules out. Everything else here is a modern frame
 *   standing in for its stage, which is why this one earns the opening slot.
 * - 01-case-work is the same shoot as the about section's cut-out figure. It
 *   sits on step 05 to put as much page between the two as the sequence allows
 *   - about is the section immediately above this one. That repeat is now
 *   avoidable rather than forced: 02-agencies came free when step 01 took the
 *   period photograph, and is still generated for exactly this swap.
 * - No `overflow-hidden` on the section: the stack is `position: sticky`, and a
 *   clipped ancestor silently turns that back into static.
 */

const NEAR_WHITE = "#f5f5f5";

/**
 * One ground per stage, all pure neutral greys - no hue, only lightness - so
 * the shift between steps reads as the same black deepening or lifting
 * rather than as a colour change. The curve rises from `HERO_DEEP` (#0a0a0a)
 * toward `INK_RAISE` (#1c1c1c) and back down again: quiet at the start,
 * brightest at the stage that is loudest in the copy ("One programme, 162
 * countries"), settling back toward black for the close.
 */
const STEP_GROUND = {
	beginning: "#101010",
	struggle: "#161616",
	recognition: "#1c1c1c",
	scale: "#232323",
	impact: "#191919",
	comeback: "#0e0e0e",
};

const STEPS: CaseStudyFlipItem[] = [
	{
		number: "01",
		year: "2006–2011",
		eyebrow: "The beginning",
		title: "A chimni lamp and an 8 km walk",
		description:
			"A village with no electricity. Homework by a homemade lamp, and school 8 km away on foot.",
		facts: [
			{ year: "2006", text: "First telephone hacking tricks." },
			{ year: "2007", text: "Broke the PIN lock on a Nokia 1100." },
			{
				year: "2011",
				text: "Free-internet workarounds on Reliance and Airtel.",
			},
		],
		image: "/journey/07-first-desk.webp",
		imageAlt:
			"A much younger Gautam Kumawat at a home desk, a laptop and a monitor in front of him both running terminal output",
		background: STEP_GROUND.beginning,
		foreground: NEAR_WHITE,
	},
	{
		number: "02",
		year: "2012–2013",
		eyebrow: "Struggle into purpose",
		title: "The talent the marksheet missed",
		description:
			"47% in the 10th, 59% in the 12th — and police already asking him for help on live cases.",
		facts: [
			{ year: "2012", text: "Began helping police with investigations." },
			{ year: "2012", text: "The casework reached the national newspapers." },
			{ year: "2013", text: "Sat the 12th again, and scored 61%." },
		],
		image: "/journey/03-classroom.webp",
		// This and step 03's alt were swapped: 03-classroom is built from the
		// lectern frame and 05-press from the India Today panel, but each
		// carried the other's description - so a screen reader was told this
		// card showed a name card on a panel table, and the panel card showed a
		// student at a lectern.
		imageAlt:
			"A young man putting a question to the room from a lectern, classmates behind him",
		background: STEP_GROUND.struggle,
		foreground: NEAR_WHITE,
	},
	{
		number: "03",
		year: "2016–2017",
		eyebrow: "Recognition",
		title: "From 47% to college topper",
		description:
			"The student the exams had written off finished the year at the top of his college.",
		facts: [
			{ year: "2016", text: "College topper." },
			{
				year: "2017",
				text: "Featured in India's leading English newspapers.",
			},
		],
		image: "/journey/05-press.webp",
		imageAlt:
			"Gautam Kumawat on the India Today Future Talk panel, his name card on the table",
		background: STEP_GROUND.recognition,
		foreground: NEAR_WHITE,
	},
	{
		number: "04",
		year: "2018",
		eyebrow: "Teaching at scale",
		title: "One programme, 162 countries",
		description:
			"The casework became a course, and the course did not stop at the border.",
		facts: [
			{ year: "2018", text: "Launched his hacking programme." },
			{ text: "41,000 students enrolled." },
			{ text: "162 countries between them." },
		],
		image: "/journey/06-scale.webp",
		imageAlt: "A packed auditorium of students watching from tiered seating",
		background: STEP_GROUND.scale,
		foreground: NEAR_WHITE,
	},
	{
		number: "05",
		year: "2019–2020",
		eyebrow: "From job to impact",
		title: "Left the job, kept the work",
		description:
			"Three months into a career at EY, he left it for the work that was already his.",
		facts: [
			{ year: "2019", text: "Left EY after three months." },
			{ year: "2019", text: "Started consulting for Fortune 500 companies." },
			{ year: "2020", text: "500+ live webinars, and Impact Billions Online." },
		],
		image: "/journey/01-case-work.webp",
		imageAlt: "Gautam Kumawat reading case material from a tablet",
		background: STEP_GROUND.impact,
		foreground: NEAR_WHITE,
	},
	{
		number: "06",
		year: "2021–2026",
		eyebrow: "The comeback",
		title: "Retired five times, then 10x",
		description:
			"Five years off the circuit, then back to build at a different scale.",
		facts: [
			{ year: "2021", text: "Retired." },
			{ year: "2022–2025", text: "Retired, four more times." },
			{ year: "2026", text: "HackingFlix, ten times over." },
		],
		image: "/journey/04-stage.webp",
		imageAlt: "Gautam Kumawat mid-talk on a darkened stage, hands raised",
		background: STEP_GROUND.comeback,
		foreground: NEAR_WHITE,
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
				{/* A running head, not a kicker on the heading's shoulder: the span at
				    the left, the count at the right, both sitting on one rule across
				    the full measure. It is the same device the book section opens
				    with, which makes it the page's grammar rather than a decoration
				    invented here. It also does real work - two words of display type
				    alone on a black field read as a section that failed to load, and
				    the rule gives the heading something to hang from. */}
				<Reveal>
					<div className="flex items-center justify-between gap-6 border-t border-white/20 pt-5">
						<p
							className="tnum text-[0.7rem] font-semibold uppercase text-white/60"
							style={{ letterSpacing: "0.18em" }}
						>
							2006 — 2026
						</p>
						<p
							className="text-[0.7rem] font-semibold uppercase text-white/35"
							style={{ letterSpacing: "0.18em" }}
						>
							Six stages
						</p>
					</div>
				</Reveal>

				{/* Heading left, standfirst right and set on the same baseline, so the
				    empty half of the row is filled by the thing that explains what is
				    about to scroll past rather than by nothing. */}
				<div className="mt-9 lg:flex lg:items-end lg:justify-between lg:gap-20">
					<Reveal>
						<h2 className="display max-w-[9ch] text-balance text-[clamp(2.6rem,6vw,4.6rem)] text-white">
							The journey
						</h2>
					</Reveal>

					<Reveal delay={0.08}>
						<p className="mt-5 max-w-[38ch] text-[0.95rem] leading-relaxed text-pretty text-white/60 sm:text-base lg:mt-0 lg:pb-3 lg:text-right">
							Twenty years in the order they happened — from studying by a
							kerosene lamp to running the whole thing at ten times the scale.
						</p>
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
