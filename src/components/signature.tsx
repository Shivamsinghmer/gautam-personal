"use client";

import { motion, useReducedMotion } from "framer-motion";
import opentype from "opentype.js";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "#/lib/utils";

interface SignatureProps {
	/** Text to generate signature for */
	text?: string;
	/** Color of the signature path */
	color?: string;
	/** Font size of the signature */
	fontSize?: number;
	/** Animation duration in seconds */
	duration?: number;
	/** Delay before animation starts in seconds */
	delay?: number;
	/**
	 * Seconds between one character starting and the next. The whole mark
	 * takes `(text.length - 1) * stagger + duration`, so on a long string this
	 * is the dominant term - "Gautam Kumawat" at the original hardcoded 0.2
	 * ran 3.6s before the last stroke landed.
	 */
	stagger?: number;
	/** Additional CSS classes */
	className?: string;
	/** Only animate when in view */
	inView?: boolean;
	/** Only animate once */
	once?: boolean;
	/** Custom font URL to load */
	fontUrl?: string;
	/**
	 * Fired once the glyph outlines exist and the stroke animation is about to
	 * start - or once loading the font has definitively failed.
	 *
	 * The font is fetched and parsed at runtime by opentype.js, which takes
	 * several hundred milliseconds even on a warm cache, and nothing is drawn
	 * before it resolves. Any caller timing something against this mark has to
	 * count from here rather than from mount, or it is counting from a moment
	 * when there was still nothing on screen.
	 */
	onReady?: () => void;
}

export function Signature({
	text = "Signature",
	color = "currentColor",
	fontSize = 32,
	duration = 1,
	delay = 0,
	stagger = 0.2,
	className,
	inView = false,
	once = true,
	fontUrl,
	onReady,
}: SignatureProps) {
	const still = useReducedMotion();
	// Held in a ref so a caller passing an inline arrow does not re-run the
	// font load on every render.
	const ready = useRef(onReady);
	ready.current = onReady;
	const [paths, setPaths] = useState<string[]>([]);
	const [width, setWidth] = useState<number>(300);
	const height = fontSize * 3; // Give plenty of vertical space
	const horizontalPadding = fontSize * 0.1;
	const topMargin = fontSize * 1.5; // Shift down
	const baseline = topMargin;
	const maskId = `signature-reveal-${useId().replace(/:/g, "")}`;

	useEffect(() => {
		async function load() {
			try {
				let font: opentype.Font | undefined;
				const fontPaths = fontUrl
					? [fontUrl]
					: [
							"/LastoriaBoldRegular.otf",
							"./LastoriaBoldRegular.otf",
							"https://www.componentry.fun/LastoriaBoldRegular.otf",
						];

				for (const path of fontPaths) {
					try {
						font = await opentype.load(path as string);
						break;
					} catch {
						// Try next path
					}
				}

				if (!font) {
					throw new Error("Font could not be loaded from any path");
				}

				let x = horizontalPadding;
				const newPaths: string[] = [];

				for (const char of text) {
					const glyph = font.charToGlyph(char);
					const path = glyph.getPath(x, baseline, fontSize);
					newPaths.push(path.toPathData(3));

					const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
					x += advanceWidth * (fontSize / font.unitsPerEm);
				}

				setPaths(newPaths);
				setWidth(x + horizontalPadding);
				ready.current?.();
			} catch (error) {
				console.error("Signature component font load error:", error);
				setPaths([]);
				setWidth(text.length * fontSize * 0.6);
				// Still "ready", in the sense the caller needs: there will never be
				// a mark, so anything waiting on one has to be released rather than
				// left waiting on a font that is not coming.
				ready.current?.();
			}
		}

		load();
	}, [text, fontSize, baseline, horizontalPadding, fontUrl]);

	/** Drawn, not written: no stroke-on animation at all. */
	const isStatic = still || duration <= 0;

	const variants = {
		hidden: { pathLength: 0, opacity: 0 },
		visible: { pathLength: 1, opacity: 1 },
	};

	return (
		<motion.svg
			key={paths.length}
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			fill="none"
			className={cn("text-foreground overflow-visible", className)}
			// `hidden` is pathLength 0 AND opacity 0, so an animation that never
			// runs leaves nothing on the page. Reduced motion, and `duration={0}`
			// for callers that want the mark simply drawn, both start at the
			// finished state - not at a zero-length tween, which still costs a
			// frame at pathLength 0 and can flash.
			initial={isStatic ? "visible" : "hidden"}
			whileInView={inView && !isStatic ? "visible" : undefined}
			animate={inView && !isStatic ? undefined : "visible"}
			viewport={{ once }}
		>
			<defs>
				<mask id={maskId} maskUnits="userSpaceOnUse">
					{paths.map((d, i) => (
						<motion.path
							// biome-ignore lint/suspicious/noArrayIndexKey: paths are a fixed, ordered list
							key={i}
							d={d}
							stroke="white"
							strokeWidth={fontSize * 0.22}
							fill="none"
							variants={variants}
							transition={{
								pathLength: {
									delay: delay + i * stagger,
									duration,
									ease: "easeInOut",
								},
								opacity: {
									delay: delay + i * stagger + 0.01,
									duration: 0.01,
								},
							}}
							vectorEffect="non-scaling-stroke"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					))}
				</mask>
			</defs>

			{paths.map((d, i) => (
				<motion.path
					// biome-ignore lint/suspicious/noArrayIndexKey: paths are a fixed, ordered list
					key={i}
					d={d}
					stroke={color}
					strokeWidth={2}
					fill="none"
					variants={variants}
					transition={{
						pathLength: {
							delay: delay + i * 0.2,
							duration,
							ease: "easeInOut",
						},
						opacity: {
							delay: delay + i * 0.2 + 0.01,
							duration: 0.01,
						},
					}}
					vectorEffect="non-scaling-stroke"
					strokeLinecap="butt"
					strokeLinejoin="round"
				/>
			))}

			<g mask={`url(#${maskId})`}>
				{paths.map((d, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: paths are a fixed, ordered list
					<path key={i} d={d} fill={color} />
				))}
			</g>
		</motion.svg>
	);
}
