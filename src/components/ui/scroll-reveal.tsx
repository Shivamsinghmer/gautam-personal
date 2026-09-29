"use client";

import {
	type MotionValue,
	motion,
	useReducedMotion,
	useScroll,
	useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { cn } from "#/lib/utils";

/**
 * The site's scroll-motion primitives.
 *
 * Skiper's `Skiper31` / `Skiper19` are complete demo pages - hardcoded copy,
 * their own colours, a 350vh stage advertising skiperui.com - so neither drops
 * into a section. What is reusable is the technique inside them: characters
 * transformed individually against a scroll progress value. `ScatterText`
 * below is that idea, taken from Skiper31's `CharacterV1` and made to run off
 * an element entering the viewport rather than off a whole-page stage.
 *
 * Everything here degrades to "just visible" under `prefers-reduced-motion`:
 * these are entrances, and an entrance nobody asked for is worse than none.
 *
 * That path matters for more than preference. Each of these starts at
 * `opacity: 0` and is brought in by an IntersectionObserver, so anything that
 * stops the observer firing - reduced motion, a browser that never delivers
 * the callback - would otherwise leave the content permanently invisible.
 * Rendering plainly is the safe failure, not the hidden state.
 */

const EASE = [0.22, 0.61, 0.36, 1] as const;

export type RevealDirection = "up" | "down" | "left" | "right" | "none";

const OFFSET: Record<RevealDirection, { x: number; y: number }> = {
	up: { x: 0, y: 28 },
	down: { x: 0, y: -28 },
	left: { x: 28, y: 0 },
	right: { x: -28, y: 0 },
	none: { x: 0, y: 0 },
};

/**
 * Fades and slides its children in the first time they enter the viewport.
 *
 * `once` is the default on purpose: content that re-animates every time it
 * scrolls back into view reads as broken rather than alive, and it makes a
 * page tiring to scroll back up.
 */
export function Reveal({
	children,
	className,
	direction = "up",
	delay = 0,
	duration = 0.6,
	amount = 0.25,
	once = true,
	as = "div",
}: {
	children: ReactNode;
	className?: string;
	direction?: RevealDirection;
	delay?: number;
	duration?: number;
	/** How much of the element must be visible before it plays. */
	amount?: number;
	once?: boolean;
	as?: "div" | "section" | "li";
}) {
	const Tag = motion[as];
	const from = OFFSET[direction];
	const still = useReducedMotion();

	if (still) {
		const Plain = as;
		return <Plain className={className}>{children}</Plain>;
	}

	return (
		<Tag
			className={className}
			initial={{ opacity: 0, x: from.x, y: from.y }}
			whileInView={{ opacity: 1, x: 0, y: 0 }}
			viewport={{ once, amount }}
			transition={{ duration, delay, ease: EASE }}
		>
			{children}
		</Tag>
	);
}

/**
 * Staggers its children in as a group - each direct child animates a beat
 * after the one before it. Pair with `RevealItem`.
 */
export function RevealGroup({
	children,
	className,
	stagger = 0.08,
	delay = 0,
	amount = 0.2,
	once = true,
}: {
	children: ReactNode;
	className?: string;
	stagger?: number;
	delay?: number;
	amount?: number;
	once?: boolean;
}) {
	const still = useReducedMotion();
	if (still) return <div className={className}>{children}</div>;

	return (
		<motion.div
			className={className}
			initial="hidden"
			whileInView="shown"
			viewport={{ once, amount }}
			variants={{
				hidden: {},
				shown: {
					transition: { staggerChildren: stagger, delayChildren: delay },
				},
			}}
		>
			{children}
		</motion.div>
	);
}

export function RevealItem({
	children,
	className,
	direction = "up",
}: {
	children: ReactNode;
	className?: string;
	direction?: RevealDirection;
}) {
	const from = OFFSET[direction];
	const still = useReducedMotion();
	if (still) return <div className={className}>{children}</div>;

	return (
		<motion.div
			className={className}
			variants={{
				hidden: { opacity: 0, x: from.x, y: from.y },
				shown: {
					opacity: 1,
					x: 0,
					y: 0,
					transition: { duration: 0.55, ease: EASE },
				},
			}}
		>
			{children}
		</motion.div>
	);
}

/**
 * Per-character scroll reveal, adapted from Skiper31's `CharacterV1`.
 *
 * Each glyph starts pushed out from the centre of the line - the further from
 * centre, the further out - and is pulled home as the block scrolls through
 * the viewport, so the word gathers itself rather than simply fading.
 *
 * Spaces get an explicit width because an inline-block whitespace collapses.
 */
export function ScatterText({
	text,
	className,
	spread = 34,
	tilt = 34,
}: {
	text: string;
	className?: string;
	/** How far the outermost characters start from home, in px per step. */
	spread?: number;
	/** How much they start rotated, in degrees per step. */
	tilt?: number;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		// Runs while the block travels from just below the fold to the middle of
		// the screen, so it has finished by the time it is comfortably read.
		offset: ["start 0.95", "center 0.6"],
	});

	const characters = [...text];
	const centre = (characters.length - 1) / 2;
	const still = useReducedMotion();

	if (still) return <span className={className}>{text}</span>;

	return (
		<span ref={ref} className={cn("inline-block", className)}>
			{characters.map((char, index) => (
				<Character
					// biome-ignore lint/suspicious/noArrayIndexKey: position in the string is the identity here
					key={index}
					char={char}
					offset={index - centre}
					spread={spread}
					tilt={tilt}
					progress={scrollYProgress}
				/>
			))}
		</span>
	);
}

function Character({
	char,
	offset,
	spread,
	tilt,
	progress,
}: {
	char: string;
	offset: number;
	spread: number;
	tilt: number;
	progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
	const x = useTransform(progress, [0, 1], [offset * spread, 0]);
	const rotateX = useTransform(progress, [0, 1], [offset * tilt, 0]);
	const opacity = useTransform(progress, [0, 0.6], [0, 1]);

	return (
		<motion.span
			className={cn("inline-block", char === " " && "w-[0.28em]")}
			style={{ x, rotateX, opacity }}
		>
			{char === " " ? " " : char}
		</motion.span>
	);
}

/** A run of prose for the fill: plain text, or a term set in bold. */
export type FillSegment = string | { strong: string };

/** One paragraph in a `ScrollFillBlock`. */
export interface FillParagraph {
	segments: FillSegment[];
	className?: string;
	/** Classes for the bold terms. */
	strongClassName?: string;
}

type Token = { text: string; strong: boolean; slot: number };

/** Split prose into words and spaces, numbering the words from `from`. */
function tokenize(segments: FillSegment[], from: number) {
	const out: Token[] = [];
	let slot = from;
	for (const seg of segments) {
		const strong = typeof seg !== "string";
		const text = strong ? seg.strong : seg;
		for (const part of text.split(/(\s+)/)) {
			if (!part) continue;
			const space = /^\s+$/.test(part);
			out.push({ text: space ? " " : part, strong, slot: space ? -1 : slot++ });
		}
	}
	return { out, next: slot };
}

/**
 * Paragraphs that fill from dim to white, word by word, as a single edge.
 *
 * ## One progress for the whole block
 *
 * This first shipped with a scroll progress per paragraph, and that is wrong
 * the moment two paragraphs share the screen: each runs its own clock, so they
 * fill in parallel and every one of them sits half-lit at once - the eye has
 * no line to follow. Here there is one `useScroll` on the wrapper and one
 * word count running through every paragraph, so the edge finishes the first
 * paragraph before it touches the second. It reads in the order it is read.
 *
 * The fill runs from the block's top reaching 85% down the screen to its
 * bottom reaching the middle - a scroll distance of the block's height plus a
 * third of the viewport - which lands each line at about the point it is being
 * read.
 *
 * ## What moves
 *
 * Only opacity, over text already in its final colour, so a scroll that stops
 * halfway leaves nothing in an in-between grey that the design never chose.
 * Screen readers get every word either way; under `prefers-reduced-motion`
 * the block renders plain and fully lit.
 */
export function ScrollFillBlock({
	paragraphs,
	className,
	floor = 0.18,
}: {
	paragraphs: FillParagraph[];
	/** Classes for the wrapper that holds the paragraphs. */
	className?: string;
	/** Opacity of a word before its turn - dim enough to read as unfilled. */
	floor?: number;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const still = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 0.85", "end 0.5"],
	});

	// Word slots numbered continuously across paragraphs - the whole point.
	const { rows, total } = useMemo(() => {
		let next = 0;
		const rows = paragraphs.map((p) => {
			const t = tokenize(p.segments, next);
			next = t.next;
			return t.out;
		});
		return { rows, total: next };
	}, [paragraphs]);

	return (
		<div ref={ref} className={className}>
			{paragraphs.map((p, pi) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: a fixed list of paragraphs that never reorders
				<p key={pi} className={p.className}>
					{rows[pi].map((t, ti) => {
						if (t.slot < 0) return " ";
						if (still) {
							return t.strong ? (
								// biome-ignore lint/suspicious/noArrayIndexKey: tokens derive from fixed prose
								<strong key={ti} className={p.strongClassName}>
									{t.text}
								</strong>
							) : (
								t.text
							);
						}
						return (
							<FillWord
								// biome-ignore lint/suspicious/noArrayIndexKey: tokens derive from fixed prose
								key={ti}
								progress={scrollYProgress}
								// A slice of the one progress, overlapping the next words so
								// the fill reads as a travelling edge rather than words
								// switching on one at a time.
								range={[t.slot / total, Math.min(1, (t.slot + 2.5) / total)]}
								floor={floor}
								strong={t.strong}
								className={t.strong ? p.strongClassName : undefined}
							>
								{t.text}
							</FillWord>
						);
					})}
				</p>
			))}
		</div>
	);
}

/** A single paragraph with the same fill. */
export function ScrollFillText({
	segments,
	className,
	strongClassName,
	floor,
}: FillParagraph & { floor?: number }) {
	return (
		<ScrollFillBlock
			paragraphs={[{ segments, className, strongClassName }]}
			floor={floor}
		/>
	);
}

function FillWord({
	children,
	progress,
	range,
	floor,
	strong,
	className,
}: {
	children: string;
	progress: MotionValue<number>;
	range: [number, number];
	floor: number;
	strong: boolean;
	className?: string;
}) {
	const opacity = useTransform(progress, range, [floor, 1]);
	return strong ? (
		<motion.strong className={className} style={{ opacity }}>
			{children}
		</motion.strong>
	) : (
		<motion.span style={{ opacity }}>{children}</motion.span>
	);
}
