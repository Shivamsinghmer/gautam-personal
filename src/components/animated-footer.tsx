"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "#/lib/utils";

/**
 * Animated Footer
 *
 * A cinematic, reveal-on-scroll footer: two source images are re-drawn as
 * live ASCII art on <canvas>, light up in little clusters around the cursor,
 * and drift with a soft parallax. When the footer scrolls into view the
 * display headings unmask character-by-character, the links and copy slide
 * up behind masks, and the ASCII "hands" glide in from the edges.
 *
 * Ported from the vanilla "LukeBaffait Animated Footer" (GSAP + canvas) into a
 * single, self-contained, prop-driven React component. No global smooth-scroll
 * or SplitText plugin required — the reveal is driven by an IntersectionObserver
 * and text is split in JSX.
 *
 * Deviation from the original source: `next-themes`'s `useTheme` is swapped
 * for a local `prefers-color-scheme` read - this project has no theme
 * provider/toggle, so pulling in a whole theming library just to resolve one
 * default color would be dead weight.
 */

export interface AnimatedFooterLink {
	label: string;
	href: string;
}

export interface AnimatedFooterProps {
	/** Rendered between the ASCII art and the display heading. */
	children?: React.ReactNode;
	/** The large display words along the bottom edge. Defaults to ["VengeanceUI"]. */
	headingLines?: string[];
	/** Left image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
	leftImage?: string;
	/** Right image URL, sampled into ASCII art. Must be same-origin or CORS-enabled. */
	rightImage?: string;

	/** Footer background color. Defaults to "#0f0f0f". */
	background?: string;
	/** Text color for links, copy and headings. Defaults to "#ffffff". */
	textColor?: string;

	/** Character ramp, ordered dark → light, used to render the ASCII art. */
	asciiChars?: string;
	/** Color of the ASCII glyphs. Defaults to "#803500". */
	charColor?: string;
	/** Fill color of a highlighted (hovered) cell. Defaults to "#ff6a00". */
	hoverColor?: string;
	/** Glyph color inside a highlighted cell. Defaults to "#0f0f0f". */
	hoverCharColor?: string;
	/** Number of columns each image is sampled to. Defaults to 80. */
	columns?: number;
	/** Pixel size of each ASCII cell. Defaults to 20. */
	cellSize?: number;
	/** Font size (px) of the ASCII glyphs. Defaults to 18. */
	fontSize?: number;

	/** Pointer parallax strength in px; set to 0 to disable. Defaults to 20. */
	parallaxStrength?: number;
	/** Cursor influence radius, in cells, for the hover highlight. Defaults to 8. */
	hoverRadius?: number;

	/** Play the reveal when the footer scrolls into view (else it shows immediately). Defaults to true. */
	revealOnScroll?: boolean;
	/**
	 * Controlled reveal. When set, the footer ignores its own scroll observer and
	 * plays in (`true`) / out (`false`) to match this value — drive it from your
	 * own ScrollTrigger, sentinel or state to reveal it from behind other content.
	 */
	revealed?: boolean;

	/** Extra class names for the root element. */
	className?: string;
}

const DEFAULT_ASCII_CHARS = "........:::=+xX#0369";

const HIGHLIGHT_LIFETIME = 300; // ms a hovered cell stays lit
const CLUSTER_SIZE = 10; // max cells a hover ripple spreads across
const PARALLAX_EASE = 0.05;

interface Cell {
	col: number;
	row: number;
	char: string;
	highlightEndTime: number;
}

interface Hand {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	cells: Map<string, Cell>;
	cellList: Cell[];
	rows: number;
	columns: number;
	cellSize: number;
	baselineOffset: number;
	direction: 1 | -1; // slide-in direction for the reveal curtain
	/** Repaint bookkeeping - see the frame loop. The ASCII is static unless a
	 *  cell is lit, so redrawing it every frame is almost entirely wasted. */
	dirty: boolean;
	wasLit: boolean;
	lastKey: string;
}

/** Reads `prefers-color-scheme`, live - stands in for a theme provider this project doesn't have. */
function usePrefersDark(): boolean {
	const [isDark, setIsDark] = useState(false);
	useEffect(() => {
		const query = window.matchMedia("(prefers-color-scheme: dark)");
		const sync = () => setIsDark(query.matches);
		sync();
		query.addEventListener("change", sync);
		return () => query.removeEventListener("change", sync);
	}, []);
	return isDark;
}

/** Build the ASCII cell grid for one image by sampling its brightness. */
function buildHandCells(
	image: HTMLImageElement,
	columns: number,
	asciiChars: string,
): { rows: number; cells: Map<string, Cell> } {
	const rows = Math.max(
		1,
		Math.round(columns / (image.naturalWidth / image.naturalHeight || 1)),
	);

	const sampler = document.createElement("canvas");
	sampler.width = columns;
	sampler.height = rows;
	const sampleCtx = sampler.getContext("2d");
	const cells = new Map<string, Cell>();
	if (!sampleCtx) return { rows, cells };

	sampleCtx.drawImage(image, 0, 0, columns, rows);
	const pixels = sampleCtx.getImageData(0, 0, columns, rows).data;
	const backgroundCharIndex = asciiChars.lastIndexOf(".");

	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < columns; col++) {
			const offset = (row * columns + col) * 4;
			const brightness =
				(pixels[offset] * 0.299 +
					pixels[offset + 1] * 0.587 +
					pixels[offset + 2] * 0.114) /
				255;
			const charIndex = Math.min(
				asciiChars.length - 1,
				Math.floor((1 - brightness) * asciiChars.length),
			);
			if (charIndex <= backgroundCharIndex) continue;

			cells.set(`${col},${row}`, {
				col,
				row,
				char: asciiChars[charIndex],
				highlightEndTime: 0,
			});
		}
	}

	return { rows, cells };
}

/** Light up a wandering cluster of cells starting from `startCell`. */
function highlightCluster(cells: Map<string, Cell>, startCell: Cell) {
	const now = Date.now();
	startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;

	const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
	const litCells = [startCell];
	let current = startCell;

	for (let step = 0; step < steps; step++) {
		const neighbours: Cell[] = [];
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				if (dx === 0 && dy === 0) continue;
				const neighbour = cells.get(`${current.col + dx},${current.row + dy}`);
				if (neighbour && !litCells.includes(neighbour))
					neighbours.push(neighbour);
			}
		}
		if (neighbours.length === 0) break;

		const next = neighbours[Math.floor(Math.random() * neighbours.length)];
		next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
		litCells.push(next);
		current = next;
	}
}

/** Nearest scrollable ancestor — used as the reveal's IntersectionObserver root. */
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
	let el = node?.parentElement ?? null;
	while (el) {
		const overflowY = getComputedStyle(el).overflowY;
		if (
			overflowY === "auto" ||
			overflowY === "scroll" ||
			overflowY === "overlay"
		)
			return el;
		el = el.parentElement;
	}
	return null;
}

export function AnimatedFooter({
	children,
	headingLines = ["VengeanceUI"],
	leftImage = "/animated-footer/hand-left.jpg",
	rightImage = "/animated-footer/hand-right.jpg",
	background,
	textColor,
	charColor,
	hoverColor,
	hoverCharColor,
	asciiChars = DEFAULT_ASCII_CHARS,
	columns = 80,
	cellSize = 20,
	fontSize = 18,
	parallaxStrength = 20,
	hoverRadius = 8,
	revealOnScroll = true,
	revealed,
	className,
}: AnimatedFooterProps) {
	const rootRef = useRef<HTMLElement>(null);
	const leftWrapRef = useRef<HTMLDivElement>(null);
	const rightWrapRef = useRef<HTMLDivElement>(null);
	const leftCanvasRef = useRef<HTMLCanvasElement>(null);
	const rightCanvasRef = useRef<HTMLCanvasElement>(null);

	// Reveal animations, published by the main effect so the controlled-`revealed`
	// effect below can play them without rebuilding the ASCII scene.
	const animateInRef = useRef<() => void>(() => {});
	const animateOutRef = useRef<() => void>(() => {});

	const isDark = usePrefersDark();

	const cc = charColor ?? (isDark ? "#803500" : "#e6b093");
	const hc = hoverColor ?? "#ff6a00";
	const hcc = hoverCharColor ?? (isDark ? "#0f0f0f" : "#ffffff");

	// Live-tunable values read inside the animation loop, so tweaking a color or
	// the parallax strength never tears down and rebuilds the ASCII scene.
	const liveRef = useRef({
		charColor: cc,
		hoverColor: hc,
		hoverCharColor: hcc,
		parallaxStrength,
		hoverRadius,
	});
	useEffect(() => {
		liveRef.current = {
			charColor: cc,
			hoverColor: hc,
			hoverCharColor: hcc,
			parallaxStrength,
			hoverRadius,
		};
	}, [cc, hc, hcc, parallaxStrength, hoverRadius]);

	// A signature of the structural inputs — the scene rebuilds only when one of
	// these changes (images, grid resolution, content, reveal mode).
	const sig = useMemo(
		() =>
			JSON.stringify({
				leftImage,
				rightImage,
				columns,
				cellSize,
				fontSize,
				asciiChars,
				revealOnScroll,
				headingLines,
			}),
		[
			leftImage,
			rightImage,
			columns,
			cellSize,
			fontSize,
			asciiChars,
			revealOnScroll,
			headingLines,
		],
	);

	// Rebuild only when a structural input changes (via `sig`); columns, cellSize,
	// fontSize etc. are read fresh from the closure each rebuild, and live-tunable
	// values (colors, parallax, hover radius) flow separately through `liveRef`.
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional - see sig above and liveRef below
	useEffect(() => {
		const root = rootRef.current;
		const leftWrap = leftWrapRef.current;
		const rightWrap = rightWrapRef.current;
		if (!root || !leftWrap || !rightWrap) return;

		const hands: Hand[] = [];
		const wrappers = [leftWrap, rightWrap];

		// ── ASCII hands ──────────────────────────────────────────────────────
		const setupHand = (
			image: HTMLImageElement,
			canvas: HTMLCanvasElement,
			direction: 1 | -1,
		) => {
			const { rows, cells } = buildHandCells(image, columns, asciiChars);
			if (cells.size === 0) return;

			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = columns * cellSize * dpr;
			canvas.height = rows * cellSize * dpr;

			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.font = `${fontSize}px monospace`;
			ctx.textAlign = "center";
			ctx.textBaseline = "alphabetic";

			const metrics = ctx.measureText("X");
			const glyphHeight =
				metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
			const baselineOffset =
				cellSize / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;

			hands.push({
				canvas,
				ctx,
				cells,
				cellList: [...cells.values()],
				rows,
				columns,
				cellSize,
				baselineOffset,
				direction,
				dirty: true,
				wasLit: false,
				lastKey: "",
			});
		};

		const loadHand = (
			src: string,
			canvas: HTMLCanvasElement,
			direction: 1 | -1,
		) => {
			if (!src) return;
			const image = new Image();
			image.crossOrigin = "anonymous";
			let initialized = false;
			const init = () => {
				if (initialized) return;
				initialized = true;
				setupHand(image, canvas, direction);
			};
			image.onload = init;
			image.src = src;
			if (image.complete && image.naturalWidth) init();
		};
		if (leftCanvasRef.current) loadHand(leftImage, leftCanvasRef.current, 1);
		if (rightCanvasRef.current)
			loadHand(rightImage, rightCanvasRef.current, -1);

		const renderHand = (hand: Hand, now: number) => {
			const {
				ctx,
				cellList,
				cellSize: cs,
				baselineOffset,
				columns: cols,
				rows,
			} = hand;
			const {
				charColor: cc,
				hoverColor: hc,
				hoverCharColor: hcc,
			} = liveRef.current;
			ctx.clearRect(0, 0, cols * cs, rows * cs);

			for (const cell of cellList) {
				const x = cell.col * cs;
				const y = cell.row * cs;
				const isHighlighted = cell.highlightEndTime > now;

				if (isHighlighted) {
					ctx.fillStyle = hc;
					ctx.fillRect(x, y, cs, cs);
				}
				ctx.fillStyle = isHighlighted ? hcc : cc;
				ctx.fillText(cell.char, x + cs / 2, y + baselineOffset);
			}
		};

		// ── Pointer: hover highlight + parallax target ───────────────────────
		const pointer = { x: 0, y: 0 };
		const drift = { x: 0, y: 0 };
		// Reveal "curtain": hands start pushed off the edges and slide to 0.
		const curtain = { offset: revealOnScroll ? 125 : 0 };

		const hoverHand = (hand: Hand, clientX: number, clientY: number) => {
			const rect = hand.canvas.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) return;
			const mouseCol = ((clientX - rect.left) / rect.width) * hand.columns;
			const mouseRow = ((clientY - rect.top) / rect.height) * hand.rows;

			let closest: Cell | null = null;
			let closestDist = Number.POSITIVE_INFINITY;
			for (const cell of hand.cellList) {
				const dx = mouseCol - cell.col;
				const dy = mouseRow - cell.row;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist < closestDist) {
					closestDist = dist;
					closest = cell;
				}
			}
			if (closest && closestDist <= liveRef.current.hoverRadius) {
				highlightCluster(hand.cells, closest);
			}
		};

		const onMouseMove = (event: MouseEvent) => {
			const strength = liveRef.current.parallaxStrength;
			const rect = root.getBoundingClientRect();
			const w = rect.width || 1;
			const h = rect.height || 1;
			pointer.x = ((event.clientX - rect.left) / w - 0.5) * strength * 2;
			pointer.y = ((event.clientY - rect.top) / h - 0.5) * strength * 2;
			for (const hand of hands) hoverHand(hand, event.clientX, event.clientY);
		};
		window.addEventListener("mousemove", onMouseMove);

		// ── Unified render loop: ASCII + parallax + reveal curtain ───────────
		let rafId = 0;
		// Nothing here is worth a frame while the footer is off screen or the tab
		// is in the background. The reveal observer below is a separate concern -
		// it only decides when the curtain plays.
		let onScreen = true;
		let tabVisible =
			typeof document === "undefined" || document.visibilityState === "visible";
		const running = () => onScreen && tabVisible;
		const frame = () => {
			const now = Date.now();

			// The ASCII only changes when a cell is lit by the cursor or when a
			// colour prop changes. Everything else about it is static, so redrawing
			// it every frame cost ~2,800 fillText calls a frame for nothing. Now a
			// hand repaints on its first draw, while any cell is lit, on the frame
			// after the last one expires (to clear it), and on a colour change.
			const live = liveRef.current;
			const key = `${live.charColor}|${live.hoverColor}|${live.hoverCharColor}`;
			for (const hand of hands) {
				let lit = false;
				for (const cell of hand.cellList) {
					if (cell.highlightEndTime > now) {
						lit = true;
						break;
					}
				}
				if (hand.dirty || lit || hand.wasLit || hand.lastKey !== key) {
					renderHand(hand, now);
					hand.dirty = false;
					hand.lastKey = key;
				}
				hand.wasLit = lit;
			}

			drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
			drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
			const strength = liveRef.current.parallaxStrength;
			const scale = 1 + (strength * 2) / 200;

			wrappers.forEach((wrapper, i) => {
				const dir = i === 0 ? 1 : -1;
				const revealX = i === 0 ? -curtain.offset : curtain.offset;
				const x = drift.x * dir || 0;
				const y = -drift.y || 0;
				// Apply reveal via translateX, then apply parallax via translate, avoiding calc() mixed-unit bugs
				wrapper.style.transform = `translateX(${revealX}%) translate(${x}px, ${y}px) scale(${scale})`;
			});

			rafId = running() ? requestAnimationFrame(frame) : 0;
		};
		rafId = requestAnimationFrame(frame);

		const wake = () => {
			if (running() && rafId === 0) rafId = requestAnimationFrame(frame);
		};
		const onVisibility = () => {
			tabVisible = document.visibilityState === "visible";
			wake();
		};
		document.addEventListener("visibilitychange", onVisibility);
		const activity = new IntersectionObserver(
			(entries) => {
				onScreen = entries[0]?.isIntersecting ?? true;
				// A hand may have been mid-highlight when it left; repaint on return.
				for (const hand of hands) hand.dirty = true;
				wake();
			},
			{ rootMargin: "200px" },
		);
		activity.observe(root);

		// ── Reveal (chars + curtain) ─────────────────────────
		const chars = gsap.utils.toArray<HTMLElement>(
			root.querySelectorAll("[data-af-char]"),
		);

		const animateIn = () => {
			gsap.to(curtain, {
				offset: 0,
				duration: 1,
				ease: "power3.out",
				overwrite: true,
			});
			gsap.to(chars, {
				yPercent: 0,
				duration: 1,
				ease: "power3.out",
				stagger: { each: 0.04, from: "center" },
				overwrite: true,
			});
		};

		const animateOut = () => {
			gsap.to(curtain, {
				offset: 125,
				duration: 0.4,
				ease: "power2.in",
				overwrite: true,
			});
			gsap.to(chars, {
				yPercent: 125,
				duration: 0.4,
				ease: "power2.in",
				stagger: { each: 0.01, from: "center" },
				overwrite: true,
			});
		};

		// Publish for the controlled-`revealed` effect.
		animateInRef.current = animateIn;
		animateOutRef.current = animateOut;

		const maskAll = () => {
			gsap.set(chars, { yPercent: 125 });
		};
		const showAll = () => {
			gsap.set(chars, { yPercent: 0 });
		};

		let observer: IntersectionObserver | null = null;

		if (revealed !== undefined) {
			// Controlled: the `revealed` effect below drives the reveal. Set the
			// initial state to match, and never attach the scroll observer.
			curtain.offset = revealed ? 0 : 125;
			if (revealed) showAll();
			else maskAll();
		} else if (revealOnScroll) {
			// Start fully masked — nothing shows until the footer is scrolled into view.
			maskAll();

			// Drive the reveal purely from scroll position, relative to the nearest
			// scrollable ancestor (the page in real use, or the preview's scroll
			// container in the docs). Plays in when the footer crosses into view and
			// reverses when you scroll back up.
			let isRevealed = false;
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting && !isRevealed) {
							isRevealed = true;
							animateIn();
						} else if (!entry.isIntersecting && isRevealed) {
							isRevealed = false;
							animateOut();
						}
					}
				},
				{ root: getScrollParent(root), threshold: 0.35 },
			);
			observer.observe(root);
		} else {
			showAll();
		}

		// ── Cleanup ──────────────────────────────────────────────────────────
		return () => {
			cancelAnimationFrame(rafId);
			activity.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("mousemove", onMouseMove);
			observer?.disconnect();
			gsap.killTweensOf([curtain, ...chars]);
		};
	}, [sig]);

	// Controlled reveal: play in/out to match the `revealed` prop without
	// rebuilding the scene. Ignored entirely when `revealed` is undefined.
	useEffect(() => {
		if (revealed === undefined) return;
		if (revealed) animateInRef.current();
		else animateOutRef.current();
	}, [revealed]);

	// Whether the content starts masked on first paint (avoids a flash before the
	// effect runs): hidden unless it's meant to be shown immediately.
	const startsHidden = revealed !== undefined ? !revealed : revealOnScroll;
	const offEdge = startsHidden ? 125 : 0;

	return (
		<footer
			ref={rootRef}
			className={cn(
				"relative flex h-full w-full flex-col overflow-hidden",
				!background && "bg-white dark:bg-black",
				!textColor && "text-black dark:text-white",
				className,
			)}
			style={{
				backgroundColor: background,
				color: textColor,
				containerType: "inline-size",
			}}
		>
			{/* ASCII hands. Pinned to the top half rather than inset-0: the canvas
			    height follows its own width, so at w-2/5 over the full height the
			    art ran straight through the heading. Narrower and top-anchored
			    leaves a clear band beneath it for the slot and the wordmark. */}
			<div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-between overflow-hidden px-4 pb-64">
				<div
					ref={leftWrapRef}
					className="relative h-full w-[31%] min-w-[200px] will-change-transform"
					style={{ transform: `translateX(-${offEdge}%)` }}
				>
					{/* Sized to the band, not to its own width. The canvas is square,
					    so `h-auto w-full` made it as tall as it was wide and it
					    overflowed the band and got clipped. object-contain keeps the
					    art in proportion inside whatever height is left. */}
					<canvas
						ref={leftCanvasRef}
						className="block h-full w-full object-contain"
					/>
				</div>
				<div
					ref={rightWrapRef}
					className="relative h-full w-[31%] min-w-[200px] will-change-transform"
					style={{ transform: `translateX(${offEdge}%)` }}
				>
					{/* Sized to the band, not to its own width. The canvas is square,
					    so `h-auto w-full` made it as tall as it was wide and it
					    overflowed the band and got clipped. object-contain keeps the
					    art in proportion inside whatever height is left. */}
					<canvas
						ref={rightCanvasRef}
						className="block h-full w-full object-contain"
					/>
				</div>
			</div>

			{/* Slot + display headings, stacked. The heading stays pinned to the
			    bottom edge; anything passed as children sits directly above it with
			    a real gap, in the band the art no longer covers. */}
			<div className="relative z-10 mt-auto flex shrink-0 flex-col items-center gap-8 px-8 pt-6 pb-8">
				{children ? (
					<div className="pointer-events-auto w-full">{children}</div>
				) : null}
				<div className="flex w-full items-end justify-center gap-4">
					{headingLines.map((word, wi) => (
						<h2
							// biome-ignore lint/suspicious/noArrayIndexKey: headingLines is a fixed, ordered list
							key={`${word}-${wi}`}
							aria-label={word}
							className="overflow-hidden whitespace-nowrap pb-[0.15em] -mb-[0.15em] font-medium leading-none tracking-tight"
							style={{ fontSize: "clamp(2rem, 13cqw, 11rem)" }}
						>
							{Array.from(word).map((ch, ci) => (
								<span
									// biome-ignore lint/suspicious/noArrayIndexKey: characters are a fixed, ordered list per word
									key={ci}
									data-af-char
									aria-hidden="true"
									className="inline-block"
								>
									{ch === " " ? " " : ch}
								</span>
							))}
						</h2>
					))}
				</div>
			</div>
		</footer>
	);
}

export default AnimatedFooter;
