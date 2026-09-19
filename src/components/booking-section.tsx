import { BookingInvite } from "#/components/booking-invite";
import { PressStrip } from "#/components/press-strip";
import { Reveal } from "#/components/ui/scroll-reveal";

import { HERO_DEEP } from "#/lib/palette";

/**
 * What this section replaced: a generic template "join our waitlist" block -
 * fake beta-access perks, an email capture form, social icons - none of it
 * about Gautam. The shell is unchanged (the bars, the hand-off gradients, the
 * grain); the content inside it now is a single invitation rather than a row
 * of CTAs, since only one of the three offers survived.
 *
 * The section heading went with them. `BookingInvite` opens on its own <h2>,
 * and a second heading above it was announcing a layout that no longer exists.
 *
 * The order is now poster, room, mastheads: a centred ask on the measure, the
 * stage photograph full-bleed underneath it as the section's floor, then the
 * coverage. The photograph used to sit beside the ask at half a measure, which
 * made the strongest argument in the section the quieter half of a two-column
 * row. It is the widest element on the page now and it shares a row with
 * nothing.
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
			className="relative isolate scroll-mt-24 overflow-hidden px-6 pt-16 pb-16 sm:px-10 sm:pt-24 sm:pb-20"
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
			</div>

			{/* The room, as the section's floor.

			    Full bleed, which means out past this section's own gutters
			    (`-mx-6 sm:-mx-10`) rather than inside the measure the copy above
			    sits on. That is the point of it: the ask is a centred poster on the
			    measure, and then the thing being asked about runs edge to edge
			    underneath with no margin holding it in. It is the widest element on
			    the page.

			    Art-directed by ratio rather than by a second file. The plate is
			    2004x785 - about 2.55:1 - which is a 150px strip at phone width, so
			    the frame tightens as the viewport narrows and `object-cover` takes
			    the crop in toward the speaker and the centre screen. The full sweep,
			    with both wing screens and the depth of the hall, is the reward for a
			    wide viewport. */}
			<Reveal direction="none" className="relative z-0 mt-16 sm:mt-20">
				<figure className="relative m-0 -mx-6 sm:-mx-10">
					<img
						src="/book/stage.webp"
						alt="Gautam Kumawat on stage in front of a full auditorium, flanked by three screens reading People. Technology. A Safer Tomorrow."
						width={2004}
						height={785}
						loading="lazy"
						decoding="async"
						className="block aspect-[4/3] w-full object-cover object-center sm:aspect-[2/1] lg:aspect-[2004/785]"
					/>

					{/* The plate's own ceiling is already near-black, so a short ramp
					    out of the field above is enough to stop the top edge reading as
					    a pasted-in rectangle. Alpha-zero DEEP rather than
					    `transparent`, so the ramp's midpoint never drags toward true
					    black and band. */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 top-0 h-[22%]"
						style={{
							background: `linear-gradient(to bottom, ${HERO_DEEP} 0%, ${HERO_DEEP}00 100%)`,
						}}
					/>
					{/* And a shorter one at the foot, so the audience settles into the
					    ground the mastheads sit on instead of stopping on a line. */}
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%]"
						style={{
							background: `linear-gradient(to top, ${HERO_DEEP} 0%, ${HERO_DEEP}00 100%)`,
						}}
					/>
				</figure>
			</Reveal>

			<div className="relative mx-auto w-full max-w-6xl">
				{/* The mastheads, across the whole measure. */}
				<PressStrip className="mt-16 sm:mt-20" />
			</div>
		</section>
	);
}
