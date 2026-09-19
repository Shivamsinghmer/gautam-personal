import { ArrowRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { LiquidMetalButtonFallback } from "#/components/liquid-metal-button";
import { ClientOnly } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

/**
 * The booking invitation: the ask, centred, above the room it is asking about.
 *
 * ## Why this is centred when nothing else on the page is
 *
 * Every other section here is ruled and left-aligned - an opening hairline,
 * type hung on the measure's left edge, evidence beside it. That grammar is
 * for reading. This is the last thing before the footer and it asks for one
 * thing, so it is built as a poster instead: heading, one paragraph, one
 * button, on the centre line, with nothing else competing. A centred stack has
 * no second column to look at, which is the entire reason to use it here and
 * the reason not to use it anywhere else.
 *
 * ## What it replaced
 *
 * A two-column composition: the auditorium photograph on the left with a
 * nameplate hung in its corner, the heading and ask on the right. The
 * photograph argued well and the arrangement made it argue quietly - half a
 * measure wide, one of two things to look at, and the ask reading as a caption
 * beside it. The room is now the section's floor at full bleed and it does not
 * share a row with anything.
 *
 * The nameplate came out with it. It identified the man in the photograph,
 * which mattered when he was a figure on a stage in a half-width frame; the
 * heading above is in the first person and the section is named for him, so a
 * lower-third repeating it was labelling a photograph the page has already
 * introduced.
 */
export function BookingInvite({ className }: { className?: string }) {
	return (
		<div
			className={`mx-auto w-full max-w-[52rem] text-center ${className ?? ""}`}
		>
			<Reveal>
				<h2 className="display text-balance text-[clamp(2.3rem,4.6vw,3.7rem)] text-white">
					Book me for{" "}
					{/* The one underlined phrase. Emphasis by rule and weight rather
					    than a second colour of text. */}
					<span
						className="decoration-[5px] underline-offset-[10px]"
						style={{
							textDecorationLine: "underline",
							textDecorationColor: "#ffffff",
						}}
					>
						your event
					</span>
					.
				</h2>
			</Reveal>

			<Reveal delay={0.08}>
				{/* `mx-auto` with a character cap rather than a full-width block:
				    centred text that runs the whole measure is a paragraph the eye
				    has to re-find the start of on every line. */}
				<p className="mx-auto mt-7 max-w-[54ch] text-pretty text-base leading-relaxed text-white/70 sm:text-[1.0625rem]">
					Seven years of casework, told to the room in front of me. No slide
					deck of generic threats — the material is rebuilt for whoever is
					sitting there, whether that is a hall of first-years or a room of
					serving officers.
				</p>
			</Reveal>

			<Reveal delay={0.14}>
				{/* The same shader button the hero and nav carry, so the page's
				    primary action reads as one design wherever it lands rather than
				    as a fill-and-radius recipe copied into each section. */}
				<div className="mt-9 flex justify-center">
					<ClientOnly
						fallback={
							<LiquidMetalButtonFallback
								label="Check availability"
								href="#book"
								icon={ArrowRight}
							/>
						}
					>
						<Suspense
							fallback={
								<LiquidMetalButtonFallback
									label="Check availability"
									href="#book"
									icon={ArrowRight}
								/>
							}
						>
							<LiquidMetalButton
								label="Check availability"
								href="#book"
								icon={ArrowRight}
							/>
						</Suspense>
					</ClientOnly>
				</div>
			</Reveal>
		</div>
	);
}
