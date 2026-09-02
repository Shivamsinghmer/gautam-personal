import { BookingInvite } from "#/components/booking-invite";
import { GradientBars } from "#/components/gradient-bars";

import {
	HERO_DEEP,
	SHADER_BLUE_BRIGHT,
	SHADER_BLUE_DEEP,
	SHADER_BLUE_INK,
} from "#/lib/palette";

/**
 * What this section replaced: a generic template "join our waitlist" block -
 * fake beta-access perks, an email capture form, social icons - none of it
 * about Gautam. The shell is unchanged (the bars, the hand-off gradients, the
 * grain); the content inside it now is a single invitation rather than a row
 * of CTAs, since only one of the three offers survived.
 *
 * The section heading went with them. `BookingInvite` opens on its own <h2>,
 * and a centred "Three Ways to Book Gautam" above a left-right composition was
 * announcing a layout that no longer exists. One heading, on the copy column,
 * where the eye lands after the photograph.
 */
export function BookingSection() {
	return (
		<section
			id="book"
			className="relative isolate scroll-mt-24 overflow-hidden px-6 pt-16 pb-36 sm:px-10 sm:pt-24 sm:pb-72"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* A finer comb: more bars, so the row reads as a texture rather than
			    as counted columns. The scale curve is a valley - shortest at the
			    centre, tallest at the edges.

			    The comb is a band along the bottom edge, not the whole section.
			    Full height, it ran up through the copy: the formats row sat
			    directly on a bright blue bar, which is both a collision and a
			    contrast failure. The band is shorter than the section's bottom
			    padding, so the bars have the floor to themselves and the copy has
			    clear ground - and because nothing needs scrimming down there, the
			    bars can read at full strength right to the bottom edge. */}
			<GradientBars
				animation="wave"
				duration={2}
				numBars={30}
				// Full height, not a strip along the bottom. `top-auto` plus a fixed
				// h-64 pinned the comb to a shallow band, so the tallest bars still
				// only reached a fraction of the section - which is what read as
				// "half". Left to fill the section, maxScale 1 puts the outer bars
				// at the full height and the valley does the rest.
				minScale={0.12}
				maxScale={1}
				delayStep={0.04}
				// Bright at the foot, fading out toward each bar's top edge, so the
				// comb dissolves into the field instead of ending on a hard line.
				colors={[SHADER_BLUE_BRIGHT, SHADER_BLUE_DEEP, `${SHADER_BLUE_INK}00`]}
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

			{/* Scrim over the copy, built from the hero's own deep tone (hex +
			    alpha suffix) so the hand-off reads as one field. It clears before
			    the bars start: it used to end on d9 - 85% opaque - which is what
			    blacked the comb out exactly where it met the bottom edge and made
			    the bars look cut short. */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 bottom-40 -z-10 sm:bottom-56"
				style={{
					background: `linear-gradient(180deg, ${HERO_DEEP}1a 0%, ${HERO_DEEP}73 60%, ${HERO_DEEP}00 100%)`,
				}}
			/>
			{/* Grain: SVG feTurbulence noise, to texture the field and break up
			    banding across the bars and scrim.

			    Plain alpha rather than mix-blend-overlay. A blend mode over a
			    full-bleed section forces the whole thing onto its own layer and
			    re-blends it every frame it is on screen, which is a real cost for
			    a texture you only notice if you look for it. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: "180px 180px",
				}}
			/>

			<div className="relative mx-auto w-full max-w-6xl">
				<BookingInvite />
			</div>
		</section>
	);
}
