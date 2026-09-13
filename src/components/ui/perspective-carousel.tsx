"use client";

import {
	animate as animateMotionValue,
	motion,
	type MotionValue,
	motionValue,
	type Transition,
	useAnimationFrame,
	useMotionValue,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { cn } from "#/lib/utils.ts";

export interface PerspectiveCarouselItem {
	src: string;
	title: string;
	alt?: string;
	/**
	 * Supply these and the slide becomes a card - portrait, words, attribution -
	 * instead of a bare image with a caption beneath it. The image-only form is
	 * kept so the component stays useful for its original purpose.
	 */
	quote?: string;
	name?: string;
	role?: string;
}

export interface PerspectiveCarouselProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	items: PerspectiveCarouselItem[];
	activeIndex?: number;
	defaultActiveIndex?: number;
	onActiveIndexChange?: (index: number) => void;
	loop?: boolean;
	slideWidth?: number;
	/** Card height, when the items carry a quote. */
	slideHeight?: number;
	/** Snap to the nearest slide on release. Ignored when `continuous` is set. */
	draggable?: boolean;
	/**
	 * In the default (stepped) mode: advance every N ms, 0 turns it off.
	 * In `continuous` mode: the time it takes the ring to drift the width of
	 * one slide - the rate of the drift, not a pause between discrete jumps.
	 * Requires `loop` to run forever either way.
	 */
	autoPlayMs?: number;
	/**
	 * A conveyor belt rather than a slideshow: the ring drifts at a constant
	 * rate every frame instead of holding a slide and then jumping to the
	 * next. Dragging scrubs the drift directly rather than snapping to a
	 * neighbour, and a click still glides the chosen card to centre - it just
	 * rejoins the drift from there instead of stopping. Hover still pauses it
	 * (see `heldRef`), same as the stepped mode.
	 */
	continuous?: boolean;
	rotationStep?: number;
	inactiveScale?: number;
	transition?: Transition;
	showControls?: boolean;
	showDots?: boolean;
	viewportClassName?: string;
	slideClassName?: string;
	imageClassName?: string;
	labelClassName?: string;
	controlsClassName?: string;
}

const DEFAULT_TRANSITION: Transition = {
	type: "spring",
	bounce: 0.14,
	duration: 0.9,
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

/** Shortest signed distance from `from` to `to` around a ring of size `length`. */
function shortestOffset(
	from: number,
	to: number,
	length: number,
	loop: boolean,
) {
	const raw = to - from;
	if (!loop || length <= 0) return raw;
	return raw - length * Math.round(raw / length);
}

export function PerspectiveCarousel({
	items,
	activeIndex,
	defaultActiveIndex = 0,
	onActiveIndexChange,
	loop = false,
	slideWidth = 200,
	slideHeight = 460,
	draggable = false,
	autoPlayMs = 0,
	continuous = false,
	rotationStep = 60,
	inactiveScale = 0.85,
	transition = DEFAULT_TRANSITION,
	showControls = true,
	showDots = true,
	viewportClassName,
	slideClassName,
	imageClassName,
	labelClassName,
	controlsClassName,
	className,
	onKeyDown,
	tabIndex,
	...props
}: PerspectiveCarouselProps) {
	const maxIndex = Math.max(0, items.length - 1);
	/**
	 * Set while a drag is in flight so the release does not also fire the click
	 * on whichever card happens to be under the pointer - which would fight the
	 * snap and select the wrong slide.
	 */
	const draggingRef = React.useRef(false);
	const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
		clamp(defaultActiveIndex, 0, maxIndex),
	);
	const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
	// The interval below is created once; without this mirror it would close
	// over the index from that first render and always step to slide 1.
	const currentIndexRef = React.useRef(currentIndex);
	currentIndexRef.current = currentIndex;
	const safeSlideWidth = Math.max(96, slideWidth);
	const safeInactiveScale = clamp(inactiveScale, 0.5, 1);
	/** How many cards either side of the active one stay visible. */
	const visibleArc = Math.min(3, Math.floor((items.length - 1) / 2));

	const rootRef = React.useRef<HTMLDivElement>(null);
	/**
	 * Held while the visitor is pointing at or dragging the rail.
	 *
	 * Only ever written on a device that can hover: a tap on a phone fires a
	 * synthetic `mouseenter` with no matching `mouseleave`, so on touch this
	 * would latch true on the first tap and the rail would never advance again.
	 */
	const heldRef = React.useRef(false);
	const canHover = () =>
		typeof window !== "undefined" &&
		window.matchMedia("(hover: hover)").matches;

	const selectSlide = React.useCallback(
		(nextIndex: number) => {
			if (!items.length) {
				return;
			}

			const resolvedIndex = loop
				? (nextIndex + items.length) % items.length
				: clamp(nextIndex, 0, maxIndex);

			if (activeIndex === undefined) {
				setUncontrolledIndex(resolvedIndex);
			}

			onActiveIndexChange?.(resolvedIndex);
		},
		[activeIndex, items.length, loop, maxIndex, onActiveIndexChange],
	);

	// ── Continuous mode ──────────────────────────────────────────────────────
	// A single motion value carries the ring's position in fractional "slide
	// units" - 2.3 sits three tenths of the way from card 2 to card 3 - and a
	// per-frame loop below drifts it, drags scrub it, and clicks glide it to a
	// target. Nothing here touches `currentIndex`/`selectSlide` above except to
	// keep them mirrored for `aria-current` and `onActiveIndexChange`.
	const phase = useMotionValue(currentIndex);
	/**
	 * One set of motion values per slide, held in a ref and grown in place.
	 *
	 * Deliberately not a `useMemo`: the honest dependency is `items`, and the
	 * caller builds that array inline, so a memo keyed on it would hand every
	 * render a new set of motion values - the per-frame loop below would then be
	 * writing to objects the DOM is no longer bound to, and the ring would sit
	 * frozen at its initial transform. Keyed on `items.length` instead it lies
	 * about what it reads. A ref sidesteps the question: these are plain
	 * objects, not subscriptions, so creating them during render is safe, and
	 * the pool only ever grows to fit.
	 */
	const itemMotionRef = React.useRef<
		{
			x: MotionValue<number>;
			rotateY: MotionValue<number>;
			scale: MotionValue<number>;
			opacity: MotionValue<number>;
		}[]
	>([]);
	while (itemMotionRef.current.length < items.length) {
		itemMotionRef.current.push({
			x: motionValue(0),
			rotateY: motionValue(0),
			scale: motionValue(1),
			opacity: motionValue(1),
		});
	}
	const itemMotion = itemMotionRef.current;
	const onScreenRef = React.useRef(true);
	const reducedMotionRef = React.useRef(false);

	React.useEffect(() => {
		if (!continuous) return;
		reducedMotionRef.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const node = rootRef.current;
		if (!node) return;
		const io = new IntersectionObserver((entries) => {
			onScreenRef.current = entries[0]?.isIntersecting ?? true;
		});
		io.observe(node);
		return () => io.disconnect();
	}, [continuous]);

	useAnimationFrame((_time, delta) => {
		if (!continuous || !items.length) return;
		const canRun =
			onScreenRef.current &&
			document.visibilityState === "visible" &&
			!heldRef.current &&
			!draggingRef.current;

		if (canRun && autoPlayMs > 0 && !reducedMotionRef.current) {
			const slidesPerMs = 1 / autoPlayMs;
			phase.set(phase.get() + delta * slidesPerMs);
		}

		const p = phase.get();
		items.forEach((_, index) => {
			const offset = shortestOffset(p, index, items.length, loop);
			const m = itemMotion[index];
			m.x.set(offset * safeSlideWidth);
			m.rotateY.set(-offset * rotationStep);
			// Continuous rather than a binary active/inactive cut, so the scale
			// breathes as a card drifts toward and away from centre instead of
			// snapping the instant it crosses some threshold.
			const closeness = clamp(1 - Math.abs(offset), 0, 1);
			m.scale.set(safeInactiveScale + (1 - safeInactiveScale) * closeness);
			m.opacity.set(Math.abs(offset) > visibleArc ? 0 : 1);
		});

		const rounded =
			((Math.round(p) % items.length) + items.length) % items.length;
		if (rounded !== currentIndexRef.current) {
			currentIndexRef.current = rounded;
			if (activeIndex === undefined) setUncontrolledIndex(rounded);
			onActiveIndexChange?.(rounded);
		}
	});

	/** Glide the ring so `index` lands at centre, the short way round. */
	const glideTo = React.useCallback(
		(index: number) => {
			const target =
				phase.get() + shortestOffset(phase.get(), index, items.length, loop);
			animateMotionValue(phase, target, {
				type: "spring",
				stiffness: 140,
				damping: 24,
			});
		},
		[phase, items.length, loop],
	);

	if (!items.length) {
		return null;
	}

	const isPreviousDisabled = !loop && currentIndex === 0;
	const isNextDisabled = !loop && currentIndex === maxIndex;
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);

		if (event.defaultPrevented) {
			return;
		}

		if (event.key === "ArrowLeft") {
			event.preventDefault();
			if (continuous) glideTo(Math.round(phase.get()) - 1);
			else selectSlide(currentIndex - 1);
		}

		if (event.key === "ArrowRight") {
			event.preventDefault();
			if (continuous) glideTo(Math.round(phase.get()) + 1);
			else selectSlide(currentIndex + 1);
		}
	};

	return (
		<div
			ref={rootRef}
			onMouseEnter={() => {
				if (canHover()) heldRef.current = true;
			}}
			onMouseLeave={() => {
				heldRef.current = false;
			}}
			role="region"
			aria-roledescription="carousel"
			aria-label="Perspective image carousel"
			tabIndex={tabIndex ?? 0}
			onKeyDown={handleKeyDown}
			className={cn(
				"relative isolate h-full w-full overflow-hidden",
				className,
			)}
			{...props}
		>
			<div
				className={cn("absolute inset-0 overflow-hidden", viewportClassName)}
				style={{ perspective: "1200px" }}
			>
				{/* A ring, not a rail. Each slide is placed by its *shortest circular
				    distance* from the active card, so there is always a card on both
				    sides and the last one is followed by the first. Translating a
				    single flex row - the original approach - can only ever wrap the
				    index: at slide 0 there is nothing to the left, and going from the
				    last back to the first slides the whole strip backwards. */}
				<motion.div
					className={cn(
						"absolute inset-0",
						draggable && "cursor-grab active:cursor-grabbing",
					)}
					transition={transition}
					drag={draggable ? "x" : false}
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.14}
					dragMomentum={false}
					onDragStart={() => {
						draggingRef.current = true;
					}}
					onDrag={(_event, info) => {
						// Continuous mode treats the drag as scrubbing the belt directly
						// rather than throwing the whole rail - the container itself
						// stays pinned at x:0 (see `dragConstraints`) and only feeds the
						// gesture into `phase`.
						if (continuous)
							phase.set(phase.get() - info.delta.x / safeSlideWidth);
					}}
					onDragEnd={(_event, info) => {
						if (continuous) {
							// The belt simply keeps drifting from wherever the gesture left
							// it - no snap, the same way it never snaps between automatic
							// steps either.
							window.setTimeout(() => {
								draggingRef.current = false;
							}, 0);
							return;
						}
						// Snap by whichever is more decisive: how far it was thrown, or how
						// fast. A short flick should still advance a slide.
						const byOffset = -info.offset.x / safeSlideWidth;
						const byVelocity = -info.velocity.x / 900;
						const step = Math.round(
							Math.abs(byVelocity) > Math.abs(byOffset) ? byVelocity : byOffset,
						);
						if (step !== 0) selectSlide(currentIndex + step);
						// Let the click that ends the drag pass before re-arming.
						window.setTimeout(() => {
							draggingRef.current = false;
						}, 0);
					}}
				>
					{items.map((item, index) => {
						const isActive = currentIndex === index;
						// Shortest way round the ring: (-n/2, n/2].
						const raw = index - currentIndex;
						const offset = loop
							? raw - items.length * Math.round(raw / items.length)
							: raw;
						const m = continuous ? itemMotion[index] : undefined;

						return (
							<div
								key={`${item.src}-${index}`}
								className="absolute top-1/2 left-1/2"
								style={{
									width: safeSlideWidth,
									marginLeft: -safeSlideWidth / 2,
									perspective: "1200px",
									// Nearest cards paint over farther ones.
									zIndex: items.length - Math.abs(offset),
								}}
							>
								<motion.div
									className={cn(
										"flex w-full -translate-y-1/2 flex-col items-center gap-3 will-change-transform",
										slideClassName,
									)}
									// Position now comes entirely from the animated values, so
									// the first render has to *be* the target rather than animate
									// towards it - otherwise every card paints stacked at the
									// centre until the first frame runs.
									initial={false}
									{...(m
										? {
												style: {
													x: m.x,
													rotateY: m.rotateY,
													scale: m.scale,
													opacity: m.opacity,
													transformStyle: "preserve-3d",
												},
											}
										: {
												animate: {
													x: offset * safeSlideWidth,
													rotateY: -offset * rotationStep,
													scale: isActive ? 1 : safeInactiveScale,
													// Cards beyond the visible arc are hidden, so the one
													// that wraps from one end of the ring to the other does
													// it out of sight rather than flying across the frame.
													opacity: Math.abs(offset) > visibleArc ? 0 : 1,
												},
												transition,
												style: { transformStyle: "preserve-3d" },
											})}
								>
									{item.quote ? (
										// Card form: a 5:6 portrait with the words laid over it.
										// The text sits on the picture rather than beneath it, so
										// the card is one object instead of an image with a panel
										// stapled underneath. 5:6, not the taller 3:4 this used to
										// run: at 3:4 the ring's wrapping box (sized to match) left
										// no vertical slack, so a card nudged out of true centre by
										// drag or the settle from a click clipped its own top edge
										// against the viewport's `overflow-hidden`. Shorter cards
										// carry that margin instead.
										<button
											type="button"
											aria-label={`Show ${item.name ?? item.title}`}
											aria-current={isActive ? "true" : undefined}
											onClick={() => {
												if (draggingRef.current) return;
												if (continuous) glideTo(index);
												else selectSlide(index);
											}}
											className="relative aspect-[5/6] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 text-left shadow-xl"
										>
											<img
												src={item.src}
												alt={item.alt ?? item.name ?? item.title}
												draggable={false}
												loading="lazy"
												decoding="async"
												className={cn(
													"absolute inset-0 h-full w-full select-none object-cover",
													imageClassName,
												)}
											/>

											{/* Weighted to the bottom, where the type is, so the
											    top of the portrait stays untouched. */}
											<span
												aria-hidden="true"
												className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/65 via-45% to-transparent"
											/>

											<figure className="absolute inset-x-0 bottom-0 m-0 p-5">
												<blockquote className="text-[0.9rem] leading-relaxed text-white">
													&ldquo;{item.quote}&rdquo;
												</blockquote>
												<figcaption className="mt-3 border-t border-white/20 pt-3">
													<span className="block text-sm font-semibold text-white">
														{item.name ?? item.title}
													</span>
													{item.role ? (
														<span className="mt-0.5 block text-xs text-white/70">
															{item.role}
														</span>
													) : null}
												</figcaption>
											</figure>
										</button>
									) : (
										<>
											<button
												type="button"
												aria-label={`Show ${item.title}`}
												aria-current={isActive ? "true" : undefined}
												className="aspect-[3/4] w-full cursor-pointer"
												onClick={() => {
													if (draggingRef.current) return;
													if (continuous) glideTo(index);
													else selectSlide(index);
												}}
											>
												<img
													src={item.src}
													alt={item.alt ?? item.title}
													draggable={false}
													className={cn(
														"h-full w-full select-none rounded-lg object-cover shadow-xl",
														imageClassName,
													)}
												/>
											</button>

											<motion.p
												className={cn(
													"whitespace-nowrap text-sm",
													labelClassName,
												)}
												animate={{
													filter: isActive ? "blur(0px)" : "blur(2px)",
													opacity: isActive ? 1 : 0,
												}}
												transition={transition}
											>
												{item.title}
											</motion.p>
										</>
									)}
								</motion.div>
							</div>
						);
					})}
				</motion.div>
			</div>

			{showControls && (
				<div
					className={cn(
						"absolute inset-x-4 bottom-5 z-10 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-neutral-300/80 bg-neutral-200/70 px-2 text-neutral-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-100",
						controlsClassName,
					)}
				>
					<button
						type="button"
						aria-label="Show previous slide"
						disabled={isPreviousDisabled}
						className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
						onClick={() =>
							continuous
								? glideTo(Math.round(phase.get()) - 1)
								: selectSlide(currentIndex - 1)
						}
					>
						<ChevronLeft className="size-5" />
					</button>

					{showDots && (
						<div className="flex items-center justify-center gap-2">
							{items.map((item, index) => (
								<button
									key={`${item.title}-${index}`}
									type="button"
									aria-label={`Show slide ${index + 1}: ${item.title}`}
									aria-current={currentIndex === index ? "true" : undefined}
									className={cn(
										"h-2 rounded-full bg-current transition-[width,opacity] duration-300",
										currentIndex === index
											? "w-7 opacity-100"
											: "w-2 opacity-30",
									)}
									onClick={() =>
										continuous ? glideTo(index) : selectSlide(index)
									}
								/>
							))}
						</div>
					)}

					<button
						type="button"
						aria-label="Show next slide"
						disabled={isNextDisabled}
						className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
						onClick={() =>
							continuous
								? glideTo(Math.round(phase.get()) + 1)
								: selectSlide(currentIndex + 1)
						}
					>
						<ChevronRight className="size-5" />
					</button>
				</div>
			)}
		</div>
	);
}

export default PerspectiveCarousel;
