import { useEffect, useState } from "react";
import {
	PerspectiveCarousel,
	type PerspectiveCarouselItem,
} from "#/components/ui/perspective-carousel";
import { Reveal, ScatterText } from "#/components/ui/scroll-reveal";
import { HERO_DEEP } from "#/lib/palette";

/**
 * Six real people. Four gave quotes, verbatim, for this page; the two
 * law-enforcement officers appear as attribution-only cards - photograph, name
 * and role, and nothing in quotation marks - because neither has given
 * publishable wording in writing. That split is the rule of this list:
 *
 * - Photo + name + role, no quote: fine. A face asserts no endorsement and a
 *   caption claims no words.
 * - Photo + name + invented quote: never. A real name beside words someone else
 *   wrote is a fabricated endorsement, and these are the last two people to
 *   publish one about (their files entered git history with invented quotes in
 *   commit 1aae5b1 and were deliberately dropped).
 *
 * Add a quote to either officer card only when that person has supplied the
 * exact words themselves and approved them for publication in writing.
 */
const TESTIMONIALS: Omit<PerspectiveCarouselItem, "title">[] = [
	{
		src: "/testimonials/vivek-hackw0rm.jpg",
		alt: "Vivek, photographed in a Guy Fawkes mask and hooded jacket in the rain at night",
		name: "Vivek",
		role: "CEO, Hackw0rm",
		quote:
			"Gautam didn't just rise, he uploaded himself into success: a mystery, a machine, a master of his craft.",
	},
	{
		src: "/testimonials/santosh-pyasa.jpg",
		alt: "Santosh Pyasa at a desk in a computer lab, wearing a headset",
		name: "Santosh Pyasa",
		role: "Journalist",
		quote:
			"I have known Gautam long before the world called him a hacker. He is living proof that when passion meets persistence, transformation begins.",
	},
	{
		src: "/testimonials/abhay-sharma.jpg",
		alt: "Portrait of Abhay Sharma seated by a window",
		name: "Abhay Sharma",
		role: "Mentor",
		quote:
			"Once Gautam decides on something, he pursues it with relentless dedication, working aggressively until commitment turns into achievement.",
	},
	{
		src: "/testimonials/ashok-prajapati.jpg",
		alt: "Official portrait of Ashok Prajapati in front of the United States and NASA flags",
		name: "Ashok Prajapati",
		role: "AST, NASA HQ",
		quote:
			"I was truly amazed by his outstanding cyber security capabilities at such a young age — expertise that surpasses even many seasoned professionals.",
	},
	{
		src: "/testimonials/pankaj-kumar-singh.jpeg",
		alt: "Official portrait of Pankaj Kumar Singh",
		name: "Pankaj Kumar Singh",
		role: "Dy NSA, DG BSF", 
		quote:
			"Gautam is defined by a rare blend of intense curiosity and quiet precision. always three steps ahead, effortlessly spotting patterns that others overlook..",

	},
	{
		src: "/testimonials/navdeep-singh-virk.jpg",
		alt: "Official portrait of Navdeep Singh Virk",
		name: "Navdeep Singh Virk",
		role: "IPS, ADGP of Haryana Police", 
		quote:
			" I am delighted to note that the efforts made by Gautam in  course on “Cyber Crime Investigation & Cyber Security”  in simple and professional manner have been extraordinary. ",

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
						From Those Who Know
					</p>
				</Reveal>
				<h2 className="mt-4 text-center text-4xl font-bold text-white sm:text-5xl">
					<ScatterText text="About Gautam" spread={26} tilt={26} />
				</h2>
			</div>

			{/* Cards, not a strip of portraits: each slide carries the quote and
			    the attribution inside it, so nothing has to be read from a caption
			    parked outside the card. A conveyor rather than a slideshow - the
			    ring drifts on its own without ever holding still, `continuous`
			    scrubs that drift under a drag instead of snapping to a neighbour,
			    and hovering pauses it (the carousel's own `heldRef`). The bottom
			    bar - arrows plus a dot per testimonial - existed to navigate and
			    report position for a carousel that otherwise sat still between
			    steps; a belt that is always moving needs neither, so it's gone
			    along with the height that used to reserve room for it. */}
			<Reveal delay={0.1} className="mt-12 sm:mt-14">
				{/* The card is 5:6 (see perspective-carousel.tsx); +24px of slack on
				    top of that so a card unsettled from centre - mid-drag, or still
				    gliding back after a click - has margin to move in before its own
				    top edge meets the viewport's `overflow-hidden` clip. */}
				<div style={{ height: Math.round((size.width * 6) / 5) + 24 }}>
					<PerspectiveCarousel
						draggable
						loop
						continuous
						autoPlayMs={5000}
						showControls={false}
						slideWidth={size.width}
						rotationStep={28}
						inactiveScale={0.86}
						items={TESTIMONIALS.map((t) => ({ ...t, title: t.name ?? "" }))}
					/>
				</div>
			</Reveal>
		</section>
	);
}
