"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";
import { cn } from "#/lib/utils";
import { SIGNATURE } from "./signature-data";

interface SignatureProps {
	/** Colour of the ink. */
	color?: string;
	/**
	 * Seconds the whole signature takes to write, first stroke to last. `0`
	 * renders it already written - no animation at all.
	 */
	duration?: number;
	/** Seconds before the pen starts. */
	delay?: number;
	/** Additional CSS classes */
	className?: string;
	/** Only start writing once the mark scrolls into view. */
	inView?: boolean;
	/** With `inView`: write once, not every time it re-enters. */
	once?: boolean;
	/**
	 * Fired on mount, once the mark is on screen and about to be written.
	 *
	 * Kept from the font-driven version, where it meant something: the glyphs
	 * were built at runtime by opentype.js and nothing existed until the font
	 * had been fetched and parsed, so a caller timing against the mark had to
	 * wait for this. The mark is static data now and is ready the moment it
	 * renders; the callback stays so callers do not have to change.
	 */
	onReady?: () => void;
}

/**
 * Gautam's own signature, written out as a pen would write it.
 *
 * ## Where it comes from
 *
 * A scan of the real signature (photos/signature.png), traced to a vector by
 * scripts/build-signature.mjs into signature-data.ts. That file holds two
 * things: the traced ink as a single filled path, and the pen's centre lines -
 * found by thinning the ink down to a one-pixel skeleton - in the order the
 * pen moves along them.
 *
 * This used to be generated from a script font: opentype.js and a 177KB .otf
 * fetched at runtime, laid out letter by letter. It looked like a signature
 * and was not his.
 *
 * ## How it writes
 *
 * The ink sits under a mask, and the mask is the centre lines stroked wide
 * enough to cover the ink around them, each one drawn on with `pathLength`.
 * So the ink appears along the path of the pen, at the pen's pace: down the
 * upstroke of the k, along the cross of the t, left to right through each
 * word, with a short lift across the gap between them.
 *
 * It is not done per letter, the way the font version did it, because a
 * joined-up hand does not have letters to stagger - "Gautam" is close to one
 * continuous shape. Tracing round the outline of a shape that size reads as
 * ink racing round the edge of a word, not as a pen writing it. The centre
 * lines are what make it read as handwriting.
 *
 * Every stroke keeps one speed - each one's duration is its share of the
 * total length - so the pen never hurries on short marks and drags on long
 * ones. A few zero-length strokes are dots covering the very tips of strokes
 * that thinning stops short of; with them, the finished mask covers every
 * pixel of the ink, so the written mark and the drawn one are identical.
 */
export function Signature({
	color = "currentColor",
	duration = 2.2,
	delay = 0,
	className,
	inView = false,
	once = true,
	onReady,
}: SignatureProps) {
	const still = useReducedMotion();
	const ready = useRef(onReady);
	ready.current = onReady;
	const maskId = `signature-reveal-${useId().replace(/:/g, "")}`;

	useEffect(() => {
		ready.current?.();
	}, []);

	/** Drawn, not written: no stroke-on animation at all. */
	const isStatic = still || duration <= 0;
	const { width, height, maskWidth, fill, strokes } = SIGNATURE;

	if (isStatic) {
		return (
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				fill="none"
				aria-hidden="true"
				className={cn("overflow-visible", className)}
			>
				<path d={fill} fill={color} />
			</svg>
		);
	}

	return (
		<motion.svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			fill="none"
			aria-hidden="true"
			className={cn("overflow-visible", className)}
			// `hidden` is pathLength 0 AND opacity 0. A stroke at pathLength 0 with
			// a round cap still paints a dot at its start, so opacity holds every
			// stroke invisible until its own turn.
			initial="hidden"
			whileInView={inView ? "visible" : undefined}
			animate={inView ? undefined : "visible"}
			viewport={{ once }}
		>
			<defs>
				<mask id={maskId} maskUnits="userSpaceOnUse">
					{strokes.map(([d, start, length], i) => {
						const at = delay + start * duration;
						const dot = length === 0;
						return (
							<motion.path
								// biome-ignore lint/suspicious/noArrayIndexKey: generated data, fixed order
								key={i}
								d={d}
								stroke="white"
								strokeWidth={maskWidth}
								strokeLinecap="round"
								strokeLinejoin="round"
								fill="none"
								variants={{
									hidden: { pathLength: dot ? 1 : 0, opacity: 0 },
									visible: { pathLength: 1, opacity: 1 },
								}}
								transition={{
									// Linear: the strokes run back to back, and an ease on each
									// would make the pen stutter at every join.
									pathLength: {
										delay: at,
										duration: length * duration,
										ease: "linear",
									},
									opacity: { delay: at, duration: 0.01 },
								}}
							/>
						);
					})}
				</mask>
			</defs>

			<path d={fill} fill={color} mask={`url(#${maskId})`} />
		</motion.svg>
	);
}
