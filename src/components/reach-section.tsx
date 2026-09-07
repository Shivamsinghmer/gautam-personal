import { ArrowRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { LiquidMetalButtonFallback } from "#/components/liquid-metal-button";
import { ClientOnly } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { StatIndex } from "#/components/ui/stat-index";
import { SHADER_BLUE_INK, SIGNAL } from "#/lib/palette";

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

/**
 * Reach - and the page's one drenched section.
 *
 * ## The layout
 *
 * Built to a reference the client supplied: a line of type across the top, a
 * large portrait card beneath it with the argument set small beside it, and a
 * quiet index along the bottom that in the reference held press logos. Here
 * that index holds the audience figures instead, which is the one change asked
 * for.
 *
 * The figures used to be welded to the underside of the card in a near-black
 * slab - same width, no gap, corners rounded only on the outside of the pair.
 * That read as a caption bar bolted to a photograph, and it did two things the
 * reference does not: it introduced a third ground colour into a section whose
 * whole argument is one colour, and it pinned the index to the card's width, so
 * four figures were crushed into half the page while the other half sat empty.
 * The index now runs the full measure on the blue itself, under its own
 * hairlines. The reference keeps that row on the page ground too.
 *
 * The card was also far too wide for what is in it. At 16:9 the cut-out
 * occupied about a third of the frame and the rest was empty blue, so the
 * object that is meant to carry the section read as a wide band with a small
 * man in it. At 4:3 the same figure fills roughly three-fifths of the width and
 * is cropped by the bottom edge, which is the proportion the reference uses.
 *
 * The reference is a white page with a blue card. This section is the inverse,
 * because the blue is the point: the brand colour spends the entire page as a
 * garnish - a button fill, a dot, a suffix - which is the timid way to hold an
 * accent. Here it is the surface, for one section only. The card sits on a
 * deeper blue so the cut-out figure has an edge to catch.
 *
 * ## Contrast
 *
 * This blue has a relative luminance of 0.104: pure white on it is 6.8:1 and
 * clears AA, but white at the /60 and /70 this page uses everywhere else
 * composites to 4.1:1 and fails. Every secondary line on the blue is therefore
 * at 90% white or above - which is also why `StatIndex` is given `tone`
 * `signal` rather than `ink`; that tone exists for this field and floors its
 * labels at 92%. See the note in lib/palette.ts.
 *
 * ## The photograph
 *
 * `gautam-figure.png` is also the about section's cut-out. public/ holds
 * exactly two cut-outs with a real alpha channel and both are from the same
 * shoot, so two sections that each need a free-standing figure have to share
 * one. They are two sections apart and treated differently - framed and tinted
 * inside a card here, standing free on ink there - but it is the same
 * photograph, and a second cut-out would end it.
 *
 * ⚠️ PLACEHOLDER FIGURES. The four counts below are taken from the reference
 * design that inspired the original layout - they are NOT Gautam's real
 * audience numbers. They read as factual claims on a real person's site, so
 * replace every `value` with the true figure before this goes anywhere public.
 */
const CHANNELS = [
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
				{/* The line, across the top. Set as a quotation because it is one -
				    his, about what the job actually is - and because a claim in
				    quotation marks is read as a person talking rather than as a
				    headline written about him in the third person. No decorative
				    glyph hung in the margin: the marks are in the text. */}
				<Reveal>
					<figure className="m-0">
						<blockquote className="display max-w-[17ch] text-balance text-[clamp(2.15rem,4.9vw,4rem)] text-white">
							&ldquo;The room empties. What you taught them
							doesn&rsquo;t.&rdquo;
						</blockquote>
						<figcaption
							className="mt-6 text-[0.7rem] font-semibold uppercase text-white/90"
							style={{ letterSpacing: "0.16em" }}
						>
							Gautam Kumawat
						</figcaption>
					</figure>
				</Reveal>

				<div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
					<Reveal direction="right">
						<figure className="relative m-0 aspect-[5/4] overflow-hidden rounded-[1.5rem] sm:aspect-[4/3]">
							{/* A deeper blue than the field, so the card is a distinct
							    object and the cut-out has something to sit against. The
							    wash is lit from the top right to agree with the section's
							    own light source rather than fighting it. */}
							<div
								aria-hidden="true"
								className="absolute inset-0"
								style={{
									backgroundColor: SHADER_BLUE_INK,
									backgroundImage:
										"radial-gradient(64% 78% at 78% 4%, rgb(255 255 255 / 0.17) 0%, rgb(255 255 255 / 0) 66%)",
								}}
							/>

							{/* Taller than the card and anchored near the top, so the crop
							    falls across his legs at the bottom edge rather than across
							    his head - which is the whole difference between a figure
							    standing in a frame and a photograph pasted into a box. The
							    source is a tight cut-out with no headroom of its own, so the
							    6% inset supplies it. Sized off the height, which is why the
							    width is auto and unconstrained.

							    122% of a 4:3 card renders him at about his own native
							    height, so this is the largest he goes before the browser
							    starts inventing detail. */}
							<img
								src="/gautam-figure.png"
								alt="Gautam Kumawat"
								loading="lazy"
								decoding="async"
								className="absolute top-[6%] left-[4%] h-[122%] w-auto max-w-none sm:left-[7%]"
							/>
						</figure>
					</Reveal>

					{/* The argument, small, beside the thing it is about. Centred
					    against the card: the card is a standing figure and therefore
					    tall, the copy is four lines, and top-aligning it stacked all of
					    that difference into one 350px hole under the button. Centred,
					    the same air sits half above and half below and reads as
					    measure rather than as a gap. */}
					<div>
						<Reveal delay={0.08}>
							<p className="max-w-[38ch] text-[0.95rem] leading-relaxed text-pretty text-white/90 sm:text-base">
								Cybersecurity only protects the people who hear about it. The
								same material that runs in the training rooms goes out every
								week to a standing audience — most of whom will never sit in
								one.
							</p>
						</Reveal>

						<Reveal delay={0.16}>
							<a
								href="#book"
								className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
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
				</div>

				{/* The index, along the foot of the section and across its full
				    measure - the position the reference gives its press logos. Its
				    own hairlines are the only structure it needs; a panel behind it
				    would put the section back to two grounds. */}
				<Reveal delay={0.1}>
					<div className="mt-14 sm:mt-20">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
							<p
								className="text-[0.7rem] font-semibold uppercase text-white"
								style={{ letterSpacing: "0.16em" }}
							>
								Following
							</p>
							{/* The caption belongs to the figures, so it travelled with
							    them out of the copy column. */}
							<p className="text-sm leading-relaxed text-pretty text-white/90 sm:max-w-[64ch] sm:text-right">
								Followers and subscribers across the four channels he posts to.
							</p>
						</div>

						<StatIndex
							items={CHANNELS}
							tone="signal"
							size="lg"
							className="mt-7 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6"
						/>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
