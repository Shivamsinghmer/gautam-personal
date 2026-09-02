import { ArrowRight } from "lucide-react";
import { Reveal } from "#/components/ui/scroll-reveal";
import { StatIndex } from "#/components/ui/stat-index";
import { SIGNAL } from "#/lib/palette";

/**
 * Reach - and the page's one drenched section.
 *
 * What was here: four cards, each with a 3px accent bar down its left edge
 * that lit up on hover. A coloured side-stripe on a card is never an
 * intentional design decision; it is the thing you reach for when a list of
 * four items needs to look designed. The whole card treatment is gone.
 *
 * What replaced it is the colour itself. The brand blue has spent the entire
 * page as a garnish - a button fill, a dot, a suffix - which is the timid way
 * to hold an accent. Here it is the surface, for one section only, and the
 * figures are set white on top of it at the size the claim deserves. One
 * saturated field in nine is not excess; it is the accent finally being used.
 *
 * Contrast is the constraint that shapes the type here. This blue has a
 * relative luminance of 0.135: pure white on it is 5.7:1 and clears AA, but
 * white at the /60 and /70 this page uses everywhere else composites to
 * 3.5:1 and fails outright. Every secondary line on this field is therefore
 * at 92% white or above. See the note in lib/palette.ts.
 *
 * ⚠️ PLACEHOLDER FIGURES. The four counts below are taken from the reference
 * design that inspired the original layout - they are NOT Gautam's real
 * audience numbers. They read as factual claims on a real person's site, so
 * replace every `value` with the true figure before this goes anywhere public.
 */
const CHANNELS: { value: number; suffix: string; label: string }[] = [
	{ value: 175, suffix: "K+", label: "Facebook" },
	{ value: 62, suffix: "K+", label: "Instagram" },
	{ value: 12, suffix: "K+", label: "LinkedIn" },
	{ value: 500, suffix: "K+", label: "Newsletter" },
];

export function ReachSection() {
	return (
		<section
			id="reach"
			className="band relative isolate scroll-mt-24 overflow-hidden px-6 sm:px-10"
			style={{ backgroundColor: SIGNAL }}
		>
			{/* Grain, to keep a full-bleed saturated field from reading as a flat
			    fill and to break up banding. Plain alpha rather than a blend mode:
			    a blend over a full-bleed section forces the whole thing onto its
			    own compositor layer and re-blends it every frame it is on screen,
			    which is a real cost for a texture you only notice if you look. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09]"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: "180px 180px",
				}}
			/>

			{/* A single soft depth pass from the top left, so the field has a light
			    source rather than being one even rectangle of blue. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background:
						"radial-gradient(78% 68% at 12% 6%, rgb(255 255 255 / 0.16) 0%, rgb(255 255 255 / 0) 62%), radial-gradient(70% 70% at 92% 100%, rgb(0 12 40 / 0.22) 0%, rgb(0 12 40 / 0) 68%)",
				}}
			/>

			<div className="relative mx-auto max-w-6xl">
				<div className="lg:flex lg:items-end lg:justify-between lg:gap-20">
					<Reveal>
						{/* One colour, no grey second line. The hero owns that device;
						    repeating it in a third section turns it into a tic. */}
						<h2 className="display max-w-[14ch] text-[clamp(2.3rem,5vw,4.1rem)] text-white">
							The room does not empty when the talk ends.
						</h2>
					</Reveal>

					<Reveal delay={0.08}>
						<p className="mt-6 max-w-[40ch] text-[0.95rem] leading-relaxed text-pretty text-white/90 sm:text-base lg:mt-0 lg:pb-3 lg:text-right">
							Cybersecurity only protects the people who hear about it. The same
							material that runs in the training rooms goes out every week to a
							standing audience — most of whom will never sit in one.
						</p>
					</Reveal>
				</div>

				{/* The ledger. Four figures under four hairlines, set large in
				    condensed Archivo with tabular numerals - the same index the hero
				    uses, in its signal tone. */}
				<Reveal delay={0.12}>
					<StatIndex
						items={CHANNELS}
						tone="signal"
						size="lg"
						className="mt-14 grid-cols-2 gap-x-8 gap-y-10 sm:mt-20 sm:grid-cols-4 sm:gap-x-10"
					/>
				</Reveal>

				<Reveal delay={0.16}>
					<p className="mt-7 text-sm text-white/90">
						Followers and subscribers across the four channels he posts to.
					</p>
				</Reveal>

				<Reveal delay={0.2}>
					<a
						href="#book"
						className="mt-12 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
						// styles.css carries an unlayered `a { color }` rule that beats
						// Tailwind's layered utilities at any specificity, so the label
						// colour is set here or it renders teal on white.
						style={{ color: SIGNAL }}
					>
						Book a session
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</a>
				</Reveal>
			</div>
		</section>
	);
}
