import { BookingInvite } from "#/components/booking-invite";
import { PressStrip } from "#/components/press-strip";

import { HERO_DEEP } from "#/lib/palette";

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
 *
 * The animated bar comb that used to fill the section's floor is gone: on a
 * dark, near-black field it read as a busy stripe pattern rather than as the
 * quiet close the page wants here, and this is the section right before the
 * footer - the page settling, not one more thing in motion.
 */
export function BookingSection() {
	return (
		<section
			id="book"
			className="relative isolate scroll-mt-24 overflow-hidden px-6 pt-16 pb-36 sm:px-10 sm:pt-24 sm:pb-72"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* The hand-off from the hero, which fades down to DEEP - this section
			    starts on DEEP and clears, so the two read as one continuous field
			    rather than meeting on a hard edge. Alpha-zero DEEP again, not
			    `transparent`. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30vh]"
				style={{
					background: `linear-gradient(to bottom, ${HERO_DEEP} 0%, ${HERO_DEEP}b3 42%, ${HERO_DEEP}00 100%)`,
				}}
			/>

			{/* Scrim over the copy, built from the hero's own deep tone (hex +
			    alpha suffix) so the hand-off reads as one field. */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 bottom-40 -z-10 sm:bottom-56"
				style={{
					background: `linear-gradient(180deg, ${HERO_DEEP}1a 0%, ${HERO_DEEP}73 60%, ${HERO_DEEP}00 100%)`,
				}}
			/>
			{/* Grain: SVG feTurbulence noise, to texture the field and break up
			    banding across the scrim.

			    Plain alpha rather than mix-blend-overlay. A blend mode over a
			    full-bleed section forces the whole thing onto its own layer and
			    re-blends it every frame it is on screen, which is a real cost for
			    a texture you only notice if you look for it. 0.02, not 0.07: the
			    noise is mid-grey on average, and at 0.07 it lifted this section to
			    a visibly lighter charcoal than the flat-black sections around it.
			    0.02 keeps the texture without the lift. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: "180px 180px",
				}}
			/>

			<div className="relative mx-auto w-full max-w-6xl">
				<BookingInvite />

				{/* The mastheads, across the whole measure rather than pinned to the
				    width of the photograph above them. */}
				<PressStrip className="mt-16 sm:mt-20" />
			</div>
		</section>
	);
}
