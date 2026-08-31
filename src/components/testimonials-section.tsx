import { Reveal, ScatterText } from "#/components/ui/scroll-reveal";
import {
	HoverExpand_001,
	type HoverExpandItem,
} from "#/components/ui/skiper-ui/skiper52";
import { HERO_DEEP } from "#/lib/palette";

const UNSPLASH = (id: string, w: number, h: number) =>
	`https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

/**
 * Placeholder portraits (Unsplash) and placeholder quotes under generic
 * designations rather than named individuals - stand-ins for real testimonial
 * photos and quotes from officers Gautam has trained. Swap for the real
 * thing before this ships.
 */
const TESTIMONIALS: HoverExpandItem[] = [
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

export function TestimonialsSection() {
	return (
		<section
			className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28"
			style={{ backgroundColor: HERO_DEEP }}
		>
			<Reveal>
				<p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
					What people say
				</p>
			</Reveal>
			<h2 className="mt-4 text-center text-4xl font-bold text-white sm:text-5xl">
				<ScatterText text="About me" spread={26} tilt={26} />
			</h2>

			{/* Nine portraits: eight collapsed at 3rem plus one open at 20rem is
			    about 44rem, so the row fits a laptop without scrolling. The
			    overflow-x stays as the escape hatch for narrow screens. */}
			<Reveal delay={0.1} className="mt-14 overflow-x-auto pb-2">
				<HoverExpand_001 items={TESTIMONIALS} className="min-w-max px-4" />
			</Reveal>
		</section>
	);
}
