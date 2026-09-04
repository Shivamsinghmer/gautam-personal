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
import { useRef } from "react";
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
 */
export interface CaseStudyFlipItem {
	number?: string;
	eyebrow: string;
	title: string;
	description: string;
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
}: {
	item: CaseStudyFlipItem;
	index: number;
	total: number;
	progress: MotionValue<number>;
	reduceMotion: boolean;
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

	return (
		<motion.article
			className="absolute inset-x-0 top-0 aspect-[3/4] will-change-transform sm:aspect-[1.76/1]"
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
				className="grid h-full overflow-hidden rounded-[clamp(18px,2vw,30px)] shadow-[0_16px_50px_rgba(20,17,10,0.18)] sm:grid-cols-[1.15fr_0.85fr]"
				style={{
					backgroundColor: item.background,
					color: item.foreground ?? "white",
					y: entryY,
					scale: entryScale,
					transformOrigin: "50% 100%",
				}}
			>
				<div className="flex min-w-0 flex-col p-[clamp(24px,3vw,48px)] md:pr-[clamp(22px,3vw,48px)]">
					<div className="flex items-start">
						<span className="text-[clamp(24px,2.5vw,36px)] font-medium leading-none tracking-[-0.06em]">
							{item.number ?? String(index + 1).padStart(2, "0")}
						</span>
					</div>

					<div className="mt-auto max-w-[46rem] pt-8">
						<p className="mb-[clamp(10px,1.5vw,22px)] text-xs font-semibold uppercase tracking-[0.16em]">
							{item.eyebrow}
						</p>
						<h3 className="max-w-[16ch] text-balance text-[clamp(28px,3.25vw,48px)] font-semibold leading-[0.96] tracking-[-0.05em]">
							{item.title}
						</h3>
						<p className="mt-[clamp(16px,1.8vw,24px)] max-w-[42rem] text-[clamp(13px,1.1vw,16px)] leading-[1.5]">
							{item.description}
						</p>
					</div>
				</div>

				<div className="relative m-[clamp(10px,1.2vw,18px)] min-h-[180px] overflow-hidden rounded-[clamp(12px,1.4vw,22px)] sm:ml-0">
					<img
						src={item.image}
						alt={item.imageAlt}
						className="h-full w-full object-cover"
						loading={index < 2 ? "eager" : "lazy"}
						draggable={false}
					/>
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
				</div>
			</motion.div>
		</motion.article>
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
				<div className="relative mx-auto aspect-[3/4] w-full max-w-[860px] [perspective:800px] sm:aspect-[1.76/1]">
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
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}
