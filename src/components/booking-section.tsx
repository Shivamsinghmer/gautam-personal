import { BookingCards } from "#/components/booking-cards";
import { GradientBars } from "#/components/gradient-bars";
import { Reveal, ScatterText } from "#/components/ui/scroll-reveal";
import {
	HERO_DEEP,
	SHADER_BLUE_BRIGHT,
	SHADER_BLUE_DEEP,
	SHADER_BLUE_INK,
} from "#/lib/palette";

/**
 * What this section replaced: a generic template "join our waitlist" block -
 * fake beta-access perks, an email capture form, social icons - none of it
 * about Gautam. Same shell (the bars, the hand-off gradients, the grain),
 * real content: the three things he's actually booked for, each with its own
 * CTA. `BookingCards` used to repeat in the footer too - one bookable grid,
 * not two, so it lives here now and `#book` (the hero's "Book a Call" target)
 * points at this section instead.
 */
const QUOTE =
	"The internet doesn't wait for you to be ready. My job is to make sure you already are.";

export function BookingSection() {
	return (
		<section
			id="book"
			className="relative isolate scroll-mt-24 overflow-hidden px-6 py-24 sm:px-10"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* A finer comb of shorter bars: more of them so the row reads as a
			    texture rather than as counted columns, and capped well below full
			    height so they sit under the copy instead of framing it. The scale
			    curve is a valley - shortest at the centre, tallest at the edges -
			    so lowering maxScale is what takes the height out of the edges. */}
			<GradientBars
				animation="wave"
				duration={2}
				numBars={25}
				minScale={0.05}
				maxScale={0.75}
				delayStep={0.04}
				colors={[SHADER_BLUE_DEEP, SHADER_BLUE_INK, SHADER_BLUE_BRIGHT]}
				className="-z-20 opacity-90"
				raiseOnView
			/>
			{/* The other half of the hand-off. The hero fades down to DEEP; this
			    starts on DEEP and clears, so the bars rise out of the same colour
			    the hero ended on instead of beginning at full strength against a
			    hard edge. Alpha-zero DEEP again, not `transparent`. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30vh]"
				style={{
					background: `linear-gradient(to bottom, ${HERO_DEEP} 0%, ${HERO_DEEP}b3 42%, ${HERO_DEEP}00 100%)`,
				}}
			/>

			{/* Scrim keeps the copy readable over the bars, built from the hero's
			    own deep tone (hex + alpha suffix) so the hand-off reads as one field. */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10"
				style={{
					background: `linear-gradient(180deg, ${HERO_DEEP}1a 0%, ${HERO_DEEP}80 55%, ${HERO_DEEP}d9 100%)`,
				}}
			/>
			{/* Grain: SVG feTurbulence noise, overlay-blended to texture the field
			    and break up banding across the bars/scrim. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-overlay"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: "180px 180px",
				}}
			/>

			<div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
				<Reveal>
					<p
						className="text-xs font-semibold uppercase tracking-[0.28em]"
						style={{ color: "#e9d8a6" }}
					>
						Work Together
					</p>
				</Reveal>

				<Reveal>
					<h2 className="mt-6 max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
						Three Ways to{" "}
						<em className="font-serif italic font-thin text-white/90">
							<ScatterText text="Book Gautam" />
						</em>
					</h2>
				</Reveal>

				<BookingCards className="mt-14" />

				<Reveal>
					<blockquote className="mt-16 max-w-xl text-balance font-serif text-xl italic leading-relaxed text-white/80 sm:text-2xl">
						“{QUOTE}”
					</blockquote>
					<p className="mt-4 text-sm text-white/50">— Gautam Kumawat</p>
				</Reveal>
			</div>
		</section>
	);
}
