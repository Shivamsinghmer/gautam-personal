"use client";

import {
	type MotionValue,
	motion,
	useMotionTemplate,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { Fragment, useRef } from "react";
import { cn } from "#/lib/utils.ts";

/**
 * Adapted from the registry component, which ships as a whole page: its own
 * 82vh hero with a bouncing "Scroll Down", a cream `<main>`, and a 120vh
 * "The End" screen after the stack. None of that survives being dropped into a
 * page that already has a hero, a heading system and eight other sections, so
 * what is kept here is the part that is actually the component - the sticky
 * scroll track and the flip - and the surrounding page is left to the caller.
 *
 * Changes from the registry version:
 * - `<main>` (there is already one on the page) and the hero / end sections are
 *   gone; the ground is transparent rather than #eeeae2 so the section behind
 *   it shows through.
 * - The card heading is an `<h3>`, not an `<h2>`: these sit under a section
 *   heading, and four sibling h2s inside one section is a broken outline.
 * - The eyebrow and description were `opacity-70` / `opacity-82`, which put
 *   10px text at 2.8:1 on a saturated card. They now render at full strength
 *   and the caller picks a `foreground` that passes against its `background`.
 * - `scrollPerCard` replaces the hardcoded (n + 1) * 100vh track, so a stack
 *   of six does not cost seven screens of scrolling.
 * - The card is sized by `CARD_BOX` rather than by a bare 3:4 / 1.76:1 pair,
 *   and the text column takes a bigger share of it between `sm` and `lg`. Both
 *   are room for the fact list, which a fixed-ratio card will otherwise clip.
 * - `year` and `facts` are additions, not adaptations: the registry card is a
 *   case study, this one is a dated step. The year appears twice on purpose -
 *   once on the card, where every visitor gets it, and once in the side rail,
 *   which only wide screens have room for.
 */
export interface CaseStudyFlipItem {
	number?: string;
	/** Shown on the card and in the side rail. A range ("2006-2011") is fine. */
	year?: string;
	eyebrow: string;
	title: string;
	description?: string;
	/**
	 * Dated evidence under the description. `year` is optional per row: a row
	 * without one leaves its column blank and reads as a continuation of the
	 * row above, which is what the figures under a launch date actually are.
	 */
	facts?: { year?: string; text: string }[];
	image: string;
	imageAlt: string;
	background: string;
	foreground?: string;
}

export interface CaseStudyFlipStackProps {
	items?: CaseStudyFlipItem[];
	className?: string;
	/**
	 * Scroll distance each card holds the screen for, in vh. The registry
	 * default worked out at ~117vh per card; shorter reads as brisker and keeps
	 * a six-card stack from swallowing the page.
	 */
	scrollPerCard?: number;
}

/**
 * The card box, shared by the stage and by every card standing on it. The cards
 * are absolutely positioned inside the stage, so the moment these two disagree
 * about their height the stack stops lining up.
 *
 * A phone gets a card the height of the screen rather than a ratio: the copy
 * needs the room, and a full-bleed card reads better there than a small one
 * floating in the middle. Everywhere else it is a ratio, capped at the height
 * of the sticky stage (`py-8` on each side of `h-svh`, hence the 4rem) so a
 * short window shrinks the card instead of clipping it.
 */
const CARD_BOX =
	"h-[calc(100svh-4rem)] max-h-[620px] sm:h-auto sm:max-h-[calc(100svh-4rem)] sm:aspect-[1.6/1]";

const DEFAULT_ITEMS: CaseStudyFlipItem[] = [
	{
		eyebrow: "Fintech",
		title: "Boosted conversion by 42% with a product-led redesign",
		description:
			"We restructured the onboarding flow and clarified the value proposition, helping the platform turn more visitors into activated users.",
		image:
			"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1400&q=90&auto=format&fit=crop",
		imageAlt: "Portrait framed by tropical greenery",
		background: "#a94808",
		foreground: "#fff7ed",
	},
	{
		eyebrow: "Hospitality",
		title: "A slower digital experience for a faster-growing retreat",
		description:
			"A cinematic booking journey brings the landscape forward, simplifies room selection, and gives every stay a stronger sense of place.",
		image:
			"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=90&auto=format&fit=crop",
		imageAlt: "A person overlooking a mountain landscape",
		background: "#067b8f",
		foreground: "#ecfeff",
	},
	{
		eyebrow: "Culture",
		title: "Turning a living archive into something you can wander through",
		description:
			"We paired bold editorial typography with an intuitive collection system, making decades of work feel immediate, playful, and alive.",
		image:
			"https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1400&q=90&auto=format&fit=crop",
		imageAlt: "Colorful artwork in a contemporary gallery",
		background: "#ba075f",
		foreground: "#fff1f7",
	},
	{
		eyebrow: "Climate",
		title: "Making complex energy data feel clear enough to act on",
		description:
			"An approachable visual system turns live infrastructure data into useful decisions for operators, partners, and the communities they serve.",
		image:
			"https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1400&q=90&auto=format&fit=crop",
		imageAlt: "Wind turbines across a green landscape",
		background: "#3322a8",
		foreground: "#f3f1ff",
	},
];

function FlipCard({
	item,
	index,
	total,
	progress,
	reduceMotion,
	prevBackground,
}: {
	item: CaseStudyFlipItem;
	index: number;
	total: number;
	progress: MotionValue<number>;
	reduceMotion: boolean;
	/** The step behind this one's ground, so the card can fade into its own
	 *  colour from the one it is replacing instead of cutting to it. */
	prevBackground: string;
}) {
	const segment = 1 / Math.max(total, 1);
	const start = index * segment;
	const end = Math.min(start + segment, 1);
	const entryStart = Math.max(0, start - segment);
	const entryEnd =
		index === 0 ? 0.0001 : Math.min(start, entryStart + segment * 0.7);
	/**
	 * A card holds still for the first part of its segment and only then flips
	 * away. Upstream, exit ran across the whole segment, so a card began sliding
	 * the instant it reached the front and was never once at rest - at any given
	 * scroll position you were looking at the bottom half of one card and the
	 * top half of the next. These are steps meant to be read, so each one gets a
	 * beat before it leaves.
	 */
	const holdShare = 0.45;
	const exitStart = start + segment * holdShare;
	const exitEnd = end;
	/**
	 * The final card holds rather than exiting. Upstream this stack was followed
	 * by a full-height "The End" screen, so emptying it was the point; inside a
	 * section it just leaves the last step flying off into blank ground before
	 * the section ends.
	 */
	const holds = index === total - 1;
	const stackedCardGap = Math.min(24, 72 / Math.max(total - 1, 1));
	const stackedOffset = index * stackedCardGap;
	const restingOffset = Math.min(index * 12, 34);
	const restingScale = 1 - Math.min(index * 0.012, 0.035);

	const exitYPercent = useTransform(
		progress,
		[exitStart, exitEnd],
		// -118% upstream left ~120px of each departed card sitting at the top of
		// the stage - enough to show the tail of its description, so a passed
		// step's text floated above the current one. Far enough now that only the
		// cards' bottom padding shows: the pile of what you have already read
		// stays, without any legible copy in it.
		reduceMotion || holds ? [0, 0] : [0, -145],
	);
	const exitStackOffset = useTransform(
		progress,
		[exitStart, exitEnd],
		reduceMotion || holds ? [0, 0] : [0, stackedOffset],
	);
	const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`;
	const rotateX = useTransform(
		progress,
		[exitStart, exitEnd],
		reduceMotion || holds ? [0, 0] : [0, 22],
	);
	const opacity = useTransform(
		progress,
		[exitStart, exitEnd],
		reduceMotion && !holds ? [1, 0] : [1, 1],
	);
	const entryScale = useTransform(
		progress,
		[entryStart, entryEnd],
		index === 0 ? [1, 1] : [restingScale, 1],
	);
	const entryY = useTransform(
		progress,
		[entryStart, entryEnd],
		index === 0 ? [0, 0] : [restingOffset, 0],
	);
	/**
	 * The ground itself is part of the flip: each card carries its own hue
	 * (see the STEPS colours in journey-section.tsx) rather than the single
	 * neutral panel every step used to share, and it arrives by fading in
	 * from the step behind it - a colour cross-fade riding the same window as
	 * the scale/position entry above - rather than cutting straight to it.
	 * `reduceMotion` skips the interpolation and simply shows the resting
	 * colour, the same way it already does for the position and rotation.
	 */
	const backgroundColor = useTransform(
		progress,
		[entryStart, entryEnd],
		index === 0 || reduceMotion
			? [item.background, item.background]
			: [prevBackground, item.background],
	);
	/**
	 * Colour marks the card you are reading, and only that card: the pile
	 * waiting behind it and the ones already flipped past it stay a single
	 * monochrome set.
	 *
	 * The grade used to be baked into the files by scripts/build-journey-images.mjs,
	 * which made this impossible - there is nothing to restore in a grayscale
	 * webp. The six frames in the stack ship in colour now and are graded here.
	 *
	 * These windows are deliberately NOT the entry/exit windows the card's
	 * position uses. Entry opens a full segment early, because a card spends
	 * that segment sliding up the stack behind the one in front - so grading on
	 * it meant the next photograph was already better than half in colour while
	 * it was still stacked behind the active card, and several frames carried
	 * colour at once. The ramp is a quarter-segment instead, landing on `start`:
	 * a card reaches full colour exactly as it arrives at centre, holds it while
	 * it is the step being read, and drains across its flip - reaching grey at
	 * `exitEnd`, the same instant the next card reaches full colour. One
	 * handover, no overlap.
	 *
	 * The last card holds rather than exiting (`holds`), so it keeps its colour
	 * rather than draining on a flip that never comes. Under reduced motion
	 * nothing is scroll-linked and every frame simply stays in colour.
	 */
	const gradeEnd = index === 0 ? 0.0001 : start;
	const gradeStart = index === 0 ? 0 : Math.max(0, start - segment * 0.25);
	const grayscale = useTransform(
		progress,
		[gradeStart, gradeEnd, exitStart, exitEnd],
		reduceMotion ? [0, 0, 0, 0] : holds ? [1, 0, 0, 0] : [1, 0, 0, 1],
	);
	const imageFilter = useMotionTemplate`grayscale(${grayscale})`;

	return (
		<motion.article
			className={cn("absolute inset-x-0 top-0 will-change-transform", CARD_BOX)}
			style={{
				y: exitY,
				rotateX,
				opacity,
				zIndex: total - index,
				transformOrigin: "50% 50%",
				transformStyle: "preserve-3d",
				backfaceVisibility: "hidden",
			}}
		>
			<motion.div
				className="grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-[clamp(18px,2vw,30px)] shadow-[0_16px_50px_rgba(20,17,10,0.18)] sm:grid-cols-[1.3fr_0.7fr] sm:grid-rows-none lg:grid-cols-[1.15fr_0.85fr]"
				style={{
					backgroundColor,
					color: item.foreground ?? "white",
					y: entryY,
					scale: entryScale,
					transformOrigin: "50% 100%",
				}}
			>
				<div className="flex min-w-0 flex-col p-[clamp(24px,3vw,48px)] md:pr-[clamp(22px,3vw,48px)]">
					<div className="flex items-baseline justify-between gap-4">
						<span className="text-[clamp(24px,2.5vw,36px)] font-medium leading-none tracking-[-0.06em]">
							{item.number ?? String(index + 1).padStart(2, "0")}
						</span>
						{item.year ? (
							// Was a small tracked-out label - `11-14px`, the same
							// treatment as an eyebrow - sitting next to a `24-36px`
							// step number it was clearly meant to answer. The year is
							// the actual information a timeline card is carrying, so it
							// now reads at least as loud as the number beside it rather
							// than as a caption on it.
							<span className="whitespace-nowrap text-[clamp(22px,2.8vw,38px)] font-bold leading-none tracking-[-0.02em] tabular-nums">
								{item.year}
							</span>
						) : null}
					</div>

					<div className="mt-auto max-w-[46rem] pt-6 lg:pt-8">
						<p className="mb-[clamp(10px,1.5vw,22px)] text-xs font-semibold uppercase tracking-[0.16em]">
							{item.eyebrow}
						</p>
						<h3 className="max-w-[18ch] text-balance text-[clamp(28px,3.25vw,48px)] font-semibold leading-[0.96] tracking-[-0.05em]">
							{item.title}
						</h3>
						{item.description ? (
							<p className="mt-[clamp(14px,1.6vw,22px)] max-w-[42rem] text-[clamp(13px,1.1vw,16px)] leading-[1.5]">
								{item.description}
							</p>
						) : null}
						{item.facts?.length ? (
							/* A two-column grid rather than a list: the years line up in
							   their own column, which is what makes a run of rows read as
							   a timeline instead of as bullets that happen to start with
							   a number. */
							<dl className="mt-[clamp(14px,1.6vw,20px)] grid max-w-[38rem] grid-cols-[auto_1fr] gap-x-[clamp(10px,1vw,16px)] gap-y-[clamp(5px,0.6vw,9px)] text-[clamp(12px,0.95vw,15px)] leading-[1.4]">
								{item.facts.map((fact) => (
									<Fragment key={fact.text}>
										<dt className="font-semibold tabular-nums tracking-[0.02em]">
											{fact.year}
										</dt>
										<dd className="min-w-0">{fact.text}</dd>
									</Fragment>
								))}
							</dl>
						) : null}
					</div>
				</div>

				<div className="relative m-[clamp(10px,1.2vw,18px)] min-h-[140px] overflow-hidden rounded-[clamp(12px,1.4vw,22px)] sm:ml-0 sm:min-h-[180px]">
					<motion.img
						src={item.image}
						alt={item.imageAlt}
						className="h-full w-full object-cover"
						loading={index < 2 ? "eager" : "lazy"}
						draggable={false}
						style={{ filter: imageFilter }}
					/>
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
				</div>
			</motion.div>
		</motion.article>
	);
}

/**
 * One row of the side rail: the step's year, and a tick that grows as that step
 * takes the screen.
 *
 * The activeness curve is deliberately not the same as the card's exit curve.
 * A card starts flipping at 45% through its segment, but it is still the step
 * you are on until the next one lands, so the rail holds until the boundary and
 * crosses over there. The first and last rows extend their windows past the
 * ends of the track, otherwise the rail is dim at rest at the top of the stack
 * and again on the final card, which is exactly when someone looks at it.
 */
function YearRailRow({
	item,
	index,
	total,
	progress,
}: {
	item: CaseStudyFlipItem;
	index: number;
	total: number;
	progress: MotionValue<number>;
}) {
	const segment = 1 / Math.max(total, 1);
	const start = index * segment;
	const end = start + segment;
	const fade = segment * 0.12;
	const isFirst = index === 0;
	const isLast = index === total - 1;
	const active = useTransform(
		progress,
		[
			isFirst ? -1 : start - fade,
			isFirst ? -0.5 : start + fade,
			isLast ? 2 : end - fade,
			isLast ? 3 : end + fade,
		],
		[isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0],
	);
	const opacity = useTransform(active, [0, 1], [0.3, 1]);
	const tickWidth = useTransform(active, [0, 1], [10, 30]);

	return (
		<div className="grid grid-cols-[1fr_30px] items-center gap-3">
			{/* Every label occupies the width of the longest range, centred inside
			    it. Right-aligned they shared an edge but not a footprint, so the
			    one stage that is a single year - 2018, against five ranges - read
			    as a gap in the rail rather than as a shorter label. */}
			<motion.span
				className="ml-auto block w-[9ch] whitespace-nowrap text-center text-[11px] font-semibold uppercase leading-none tracking-[0.16em] tabular-nums text-white"
				style={{ opacity }}
			>
				{item.year}
			</motion.span>
			<motion.span
				className="ml-auto h-px bg-white"
				style={{ opacity, width: tickWidth }}
			/>
		</div>
	);
}

/**
 * The years, up the left-hand margin of the stage.
 *
 * It is an indicator, not navigation: the stack only moves under scroll, so
 * there is nothing here to click, and every year it shows is already on the
 * card that is in front of you - which is why it is `aria-hidden` and why the
 * layout can drop it on narrow screens without losing anything.
 *
 * It is anchored to the card rather than to the viewport (`right-full` on the
 * stage), so it tracks the card's left edge instead of drifting off to the far
 * side of a 27-inch monitor. Labels need room the margin does not have below
 * `xl`, which is where the margin first has room for them - below that the
 * card carries the year on its own.
 *
 * `w-max` is load-bearing, not tidying. An absolutely positioned box with
 * `right: 100%` and no `left` has exactly zero available width, so it shrinks
 * to min-content - which breaks "2006-2011" at the dash and puts every label on
 * two lines. Sizing to max-content lets the rail overhang its own zero-width
 * slot, which is the whole idea of hanging it in the margin.
 */
function YearRail({
	items,
	progress,
}: {
	items: CaseStudyFlipItem[];
	progress: MotionValue<number>;
}) {
	return (
		<div
			className="pointer-events-none absolute top-1/2 right-full mr-[clamp(24px,2.5vw,56px)] hidden w-max -translate-y-1/2 flex-col gap-[clamp(20px,2.4vw,34px)] xl:flex"
			aria-hidden="true"
		>
			{items.map((item, index) => (
				<YearRailRow
					key={`${item.title}-rail`}
					item={item}
					index={index}
					total={items.length}
					progress={progress}
				/>
			))}
		</div>
	);
}

export function CaseStudyFlipStack({
	items = DEFAULT_ITEMS,
	className,
	scrollPerCard = 85,
}: CaseStudyFlipStackProps) {
	const stackRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion() ?? false;
	const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
	const { scrollYProgress } = useScroll({
		target: stackRef,
		offset: ["start start", "end end"],
	});
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 22,
		mass: 0.8,
		restDelta: 0.0005,
	});
	const cardProgress = reduceMotion ? scrollYProgress : smoothProgress;

	return (
		<div
			ref={stackRef}
			className={cn("relative font-sans", className)}
			style={{ height: `${safeItems.length * scrollPerCard}vh` }}
		>
			<div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-[clamp(14px,4vw,64px)] py-8">
				<div
					className={cn(
						"relative mx-auto w-full max-w-[860px] [perspective:800px]",
						CARD_BOX,
					)}
				>
					{safeItems.some((item) => item.year) ? (
						<YearRail items={safeItems} progress={cardProgress} />
					) : null}
					{[...safeItems].reverse().map((item, reverseIndex) => {
						const index = safeItems.length - reverseIndex - 1;
						return (
							<FlipCard
								key={`${item.title}-${index}`}
								item={item}
								index={index}
								total={safeItems.length}
								progress={cardProgress}
								reduceMotion={reduceMotion}
								prevBackground={
									safeItems[index - 1]?.background ?? item.background
								}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}
