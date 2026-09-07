import { Reveal } from "#/components/ui/scroll-reveal";
import { PRESS } from "#/lib/press";

/**
 * The eleven mastheads, as one scrolling row.
 *
 * It used to be joined to the underside of the auditorium photograph in the
 * booking invitation - same width, no gap, one hairline between them - so that
 * the room and the coverage of that room read as a single block. That was a
 * fair idea and it cost too much: pinned to the photograph, the row had half
 * the page to work in, so eleven marks scrolled past in a 550px window while
 * the other half of the section sat empty. It now runs the full measure
 * underneath the whole composition, where the marks are large enough to be
 * recognised, which is the only reason to show a masthead at all.
 *
 * The list is imported from lib/press.ts, the same one the press wall renders,
 * so the two cannot drift apart.
 *
 * The marks are dark artwork on transparency, so on this field
 * `brightness-0 invert` flattens each to its alpha and lifts it to white; the
 * two broadcast bugs are filled tiles, which that would swallow, so they
 * desaturate instead.
 */

/**
 * How many times the list is laid down.
 *
 * The track slides left by exactly one copy and then snaps back, so the loop
 * only stays seamless while the copies that remain still cover the window: with
 * `n` copies that is `(n - 1) x listWidth >= containerWidth`. Measured, one list
 * is 2,646px at desktop sizes and 2,120px on a phone, against a container that
 * caps at 1,152px - so a single spare copy covers the window twice over and two
 * is the honest number. Three was the first guess here and it bought nothing
 * but eleven more `<img>` elements.
 *
 * It is written down because widening this row is exactly the change that would
 * break the constraint, and it has just been widened once. The count is
 * published to the keyframe as `--gk-marquee-copies`, so the markup and the
 * travel distance cannot disagree.
 */
const COPIES = 2;

export function PressStrip({ className }: { className?: string }) {
	return (
		<Reveal className={className}>
			<div
				className="border-t pt-5"
				style={{ borderColor: "rgb(255 255 255 / 0.14)" }}
			>
				<p
					className="text-[0.68rem] font-medium uppercase text-white/60"
					style={{ letterSpacing: "0.14em" }}
				>
					Featured in
				</p>
			</div>

			<div className="mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
				<div
					className="gk-marquee flex w-max items-center"
					style={{ "--gk-marquee-copies": COPIES } as React.CSSProperties}
				>
					{Array.from({ length: COPIES }).flatMap((_, copy) =>
						PRESS.map((press) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: the same list is laid down COPIES times on purpose, so the outlet name alone is not unique - the pass number is the rest of the identity, and neither the list nor its order ever changes
								key={`${press.name}-${copy}`}
								className="flex shrink-0 items-center pr-12 sm:pr-16"
								// Only the first pass is read out; the rest are the same
								// eleven names again and would be announced as a list of
								// thirty-three outlets.
								aria-hidden={copy > 0 ? "true" : undefined}
							>
								<img
									src={press.src}
									alt={copy > 0 ? "" : press.name}
									loading="lazy"
									decoding="async"
									className={`w-auto object-contain ${press.size} ${
										press.tile
											? "rounded-[3px] opacity-70 grayscale"
											: "opacity-60 brightness-0 invert"
									}`}
								/>
							</span>
						)),
					)}
				</div>
			</div>
		</Reveal>
	);
}
