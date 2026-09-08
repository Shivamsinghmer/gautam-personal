import { useEffect, useState } from "react";
import {
	PerspectiveCarousel,
	type PerspectiveCarouselItem,
} from "#/components/ui/perspective-carousel";
import { Reveal, ScatterText } from "#/components/ui/scroll-reveal";
import { HERO_DEEP } from "#/lib/palette";

const UNSPLASH = (id: string, w: number, h: number) =>
	`https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

/**
 * Placeholder portraits (Unsplash) and placeholder quotes under generic
 * designations rather than named individuals - stand-ins for real testimonial
 * photos and quotes from officers Gautam has trained. Swap for the real
 * thing before this ships.
 */
const TESTIMONIALS: Omit<PerspectiveCarouselItem, "title">[] = [
	{
		src: UNSPLASH("1519085360753-af0119f7cbe7", 480, 640),
		alt: "Portrait of a senior police officer",
		name: "Deputy Superintendent of Police",
		role: "State Police, Cyber Cell",
		quote:
			"The training reshaped how our unit approaches digital evidence - practical, current, and built for the field, not a classroom.",
	},
	{
		src: UNSPLASH("1573496359142-b8d87734a5a2", 480, 640),
		alt: "Portrait of a police training academy officer",
		name: "Faculty",
		role: "Police Training Academy",
		quote:
			"We've run this module for three consecutive batches now. Officers leave able to actually work a case, not just recite terms.",
	},
	{
		src: UNSPLASH("1560250097-0b93528c311a", 480, 640),
		alt: "Portrait of a cyber crime cell inspector",
		name: "Inspector",
		role: "Cyber Crime Cell",
		quote:
			"Sharpest breakdown of darknet investigation techniques I've sat through in over a decade on the force.",
	},
	{
		src: UNSPLASH("1607746882042-944635dfe10e", 480, 640),
		alt: "Portrait of a special task force officer",
		name: "Senior Officer",
		role: "Special Task Force",
		quote:
			"Turned a room of skeptical veterans into engaged students within the first hour. That alone says a lot.",
	},
	{
		src: UNSPLASH("1500648767791-00dcc994a43e", 480, 640),
		alt: "Portrait of a law enforcement training coordinator",
		name: "Training Coordinator",
		role: "Law Enforcement Academy",
		quote:
			"Consistently the highest-rated guest session in our annual training calendar, year after year.",
	},
	{
		src: UNSPLASH("1544005313-94ddf0286df2", 480, 640),
		alt: "Portrait of a district cyber cell officer",
		name: "Officer",
		role: "District Cyber Cell",
		quote:
			"Clear, methodical, and refreshingly honest about what actually works in the field versus what looks good on a slide.",
	},
	{
		src: UNSPLASH("1472099645785-5658abf4ff4e", 480, 640),
		alt: "Portrait of a forensics unit lead",
		name: "Unit Lead",
		role: "Digital Forensics",
		quote:
			"He does not hand you tools and wish you luck - he walks the whole chain of custody with you until it holds up.",
	},
	{
		src: UNSPLASH("1494790108377-be9c29b29330", 480, 640),
		alt: "Portrait of a prosecution liaison officer",
		name: "Prosecution Liaison",
		role: "Economic Offences Wing",
		quote:
			"Our conviction rate on cyber-enabled fraud moved after this training. That is the only review that matters.",
	},
	{
		src: UNSPLASH("1568602471122-7832951cc4c5", 480, 640),
		alt: "Portrait of a cyber security analyst",
		name: "Lead Analyst",
		role: "Security Operations Centre",
		quote:
			"Rare to find someone who can hold a room of engineers and a room of investigators with the same material.",
	},
];

/**
 * The carousel is sized in pixels, so the breakpoint has to be read rather
 * than expressed in classes: a 360px card is most of a phone screen.
 */
function useCardSize() {
	const [small, setSmall] = useState(false);
	useEffect(() => {
		const q = window.matchMedia("(max-width: 639px)");
		const sync = () => setSmall(q.matches);
		sync();
		q.addEventListener("change", sync);
		return () => q.removeEventListener("change", sync);
	}, []);
	// Height follows from the 3:4 card, so only the width is set here.
	return small ? { width: 250 } : { width: 348 };
}

export function TestimonialsSection() {
	const size = useCardSize();
	return (
		<section
			className="relative overflow-hidden px-6 py-14 sm:px-10 sm:py-28"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* Every other section caps its measure at 6xl inside the same
			    px-6/sm:px-10 gutters; this heading used to run the full width of
			    the section instead, so on a wide viewport it sat on a different
			    left edge than the sections above and below it. The carousel below
			    stays full-bleed on purpose - its cards are a fixed pixel width and
			    want the extra room to slide - but the heading now opens on the
			    site's own column. */}
			<div className="mx-auto max-w-6xl">
				<Reveal>
					<p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
						What people say
					</p>
				</Reveal>
				<h2 className="mt-4 text-center text-4xl font-bold text-white sm:text-5xl">
					<ScatterText text="About me" spread={26} tilt={26} />
				</h2>
			</div>

			{/* Cards, not a strip of portraits: each slide carries the quote and
			    the attribution inside it, so nothing has to be read from a caption
			    parked outside the card. Draggable, with the arrows and dots kept
			    as the keyboard- and pointer-accessible path. */}
			<Reveal delay={0.1} className="mt-12 sm:mt-14">
				<div style={{ height: Math.round((size.width * 4) / 3) + 132 }}>
					<PerspectiveCarousel
						draggable
						loop
						autoPlayMs={5000}
						slideWidth={size.width}
						rotationStep={38}
						inactiveScale={0.86}
						items={TESTIMONIALS.map((t) => ({ ...t, title: t.name ?? "" }))}
						controlsClassName="border-white/10! bg-white/5! text-white!"
					/>
				</div>
			</Reveal>
		</section>
	);
}
