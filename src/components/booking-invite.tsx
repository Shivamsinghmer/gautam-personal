import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "#/components/ui/scroll-reveal";
import { SHADER_BLUE_BRIGHT } from "#/lib/palette";

/**
 * The booking invitation.
 *
 * This was a row of three cards, then two of the three were cut. Rather than
 * leave one card sitting in a grid built for three, the section is rebuilt as
 * a single composition: the room on the left, the ask on the right.
 *
 * The photograph does the arguing. "The room is the proof" - a full auditorium
 * is a stronger case for booking him than any sentence about being engaging,
 * so the image is given real size and the copy stays short beside it. Two
 * panels overlap its edges to break the rectangle and stop the photo reading
 * as a stock plate dropped into a slot.
 *
 * The panels are solid, not frosted. Glass over a photograph is decoration;
 * these carry text that has to stay readable over whatever is behind them.
 */
const FORMATS = [
	{
		title: "Keynotes",
		note: "Auditoriums, school and college circuits, conference main stages.",
	},
	{
		title: "Workshops",
		note: "Hands-on sessions for officers, faculty and security teams.",
	},
];

export function BookingInvite({ className }: { className?: string }) {
	return (
		<div
			className={`grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-16 ${className ?? ""}`}
		>
			{/* ── The room ────────────────────────────────────────────────────── */}
			<Reveal direction="right" className="relative">
				{/* Padding on the wrapper reserves the space the two panels hang
				    into, so they overlap the photograph without ever leaving the
				    column and colliding with the copy beside it. */}
				<div className="relative pb-14 pl-4 sm:pb-16 sm:pl-8">
					<img
						src="/collage/t1.webp"
						alt="A full auditorium of students watching Gautam Kumawat speak from the stage"
						loading="lazy"
						decoding="async"
						className="aspect-[4/3] w-full rounded-2xl object-cover"
					/>

					{/* Top left, hanging off the photograph's edge. Both figures are
					    the ones the page already stands behind; stated flat, at the
					    moment someone is deciding whether to ask. */}
					<div
						className="absolute top-6 left-0 rounded-xl border border-white/10 px-5 py-4 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]"
						style={{ backgroundColor: "#02171f" }}
					>
						<p className="text-xl font-extrabold leading-none text-white">
							41,000+
						</p>
						<p className="mt-1.5 text-xs text-white/55">Students trained</p>
						<p className="mt-4 text-xl font-extrabold leading-none text-white">
							162
						</p>
						<p className="mt-1.5 text-xs text-white/55">Countries reached</p>
					</div>

					{/* Bottom right, the counterweight. */}
					<div
						className="absolute right-4 bottom-0 rounded-xl border border-white/10 px-5 py-4 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)] sm:right-10"
						style={{ backgroundColor: "#02171f" }}
					>
						<p className="text-base font-bold leading-tight text-white">
							Gautam Kumawat
						</p>
						<p className="mt-1 text-xs text-white/55">
							Cybersecurity trainer &amp; investigator
						</p>
					</div>
				</div>
			</Reveal>

			{/* ── The ask ─────────────────────────────────────────────────────── */}
			<div>
				<Reveal>
					<h2 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[clamp(2.6rem,4vw,3.6rem)]">
						Book me for{" "}
						{/* The one underlined phrase, in the accent. Emphasis by rule and
						    weight rather than a second colour of text. */}
						<span
							className="decoration-[5px] underline-offset-[10px]"
							style={{
								textDecorationLine: "underline",
								textDecorationColor: SHADER_BLUE_BRIGHT,
							}}
						>
							your event
						</span>
						.
					</h2>
				</Reveal>

				<Reveal delay={0.08}>
					<p className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/65 sm:text-lg">
						Seven years of casework, told to the room in front of me. No slide
						deck of generic threats — the material is rebuilt for whoever is
						sitting there, whether that is a hall of first-years or a room of
						serving officers.
					</p>
				</Reveal>

				<Reveal delay={0.14}>
					<div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
						<a
							href="#book"
							className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
							// styles.css carries an unlayered `a { color }` rule, which beats
							// Tailwind's layered utilities whatever the specificity - so the
							// label colour is set here or it renders teal on blue.
							style={{ backgroundColor: SHADER_BLUE_BRIGHT, color: "#ffffff" }}
						>
							Check availability
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</a>

						{/* The reference put a "watch video" link here. There is no video,
						    and inventing a play button that goes nowhere is worse than
						    not having one - so the secondary action points at the thing
						    that actually exists: the photographs of the rooms. */}
						<a
							href="#the-room"
							className="group inline-flex items-center gap-3 text-sm font-medium text-white!"
						>
							<span
								aria-hidden="true"
								className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors group-hover:bg-white/5"
								style={{
									borderColor: `${SHADER_BLUE_BRIGHT}66`,
									color: SHADER_BLUE_BRIGHT,
								}}
							>
								<ArrowUpRight className="h-4 w-4" />
							</span>
							<span className="underline-offset-4 group-hover:underline">
								See the rooms
							</span>
						</a>
					</div>
				</Reveal>

				{/* Two formats, set as type with a small accent marker. Not cards -
				    two items do not need chrome to be two items. */}
				<Reveal delay={0.2}>
					<dl className="mt-12 grid gap-8 sm:grid-cols-2">
						{FORMATS.map(({ title, note }) => (
							<div key={title}>
								<dt className="flex items-center gap-2.5 text-base font-bold text-white">
									<span
										aria-hidden="true"
										className="h-2.5 w-2.5 rounded-[3px]"
										style={{ backgroundColor: SHADER_BLUE_BRIGHT }}
									/>
									{title}
								</dt>
								<dd className="mt-2 text-sm leading-relaxed text-white/55">
									{note}
								</dd>
							</div>
						))}
					</dl>
				</Reveal>
			</div>
		</div>
	);
}
