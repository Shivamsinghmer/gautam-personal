"use client";

import { motion, type Transition } from "framer-motion";
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
	/** Snap to the nearest slide on release. */
	draggable?: boolean;
	/** Advance every N ms. 0 turns it off. Requires `loop` to run forever. */
	autoPlayMs?: number;
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

	/**
	 * Advance on a timer.
	 *
	 * Stopped when the rail is off screen or the tab is in the background - a
	 * carousel stepping through itself where nobody can see it is pure cost -
	 * and never started under reduced motion, which is exactly the kind of
	 * unrequested movement that setting asks to be spared.
	 */
	React.useEffect(() => {
		if (!autoPlayMs) return;
		const node = rootRef.current;
		if (!node) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		let onScreen = true;
		let timer = 0;
		const stop = () => {
			window.clearInterval(timer);
			timer = 0;
		};
		const start = () => {
			stop();
			if (!onScreen || document.visibilityState !== "visible") return;
			timer = window.setInterval(() => {
				if (heldRef.current || draggingRef.current) return;
				selectSlide(currentIndexRef.current + 1);
			}, autoPlayMs);
		};

		const io = new IntersectionObserver((entries) => {
			onScreen = entries[0]?.isIntersecting ?? true;
			start();
		});
		io.observe(node);
		const onVisibility = () => start();
		document.addEventListener("visibilitychange", onVisibility);
		start();

		return () => {
			stop();
			io.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [autoPlayMs, selectSlide]);

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
			selectSlide(currentIndex - 1);
		}

		if (event.key === "ArrowRight") {
			event.preventDefault();
			selectSlide(currentIndex + 1);
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
					onDragEnd={(_event, info) => {
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
									animate={{
										x: offset * safeSlideWidth,
										rotateY: -offset * rotationStep,
										scale: isActive ? 1 : safeInactiveScale,
										// Cards beyond the visible arc are hidden, so the one
										// that wraps from one end of the ring to the other does
										// it out of sight rather than flying across the frame.
										opacity: Math.abs(offset) > visibleArc ? 0 : 1,
									}}
									transition={transition}
									style={{ transformStyle: "preserve-3d" }}
								>
									{item.quote ? (
										// Card form: a 3:4 portrait with the words laid over it.
										// The text sits on the picture rather than beneath it, so
										// the card is one object instead of an image with a panel
										// stapled underneath.
										<button
											type="button"
											aria-label={`Show ${item.name ?? item.title}`}
											aria-current={isActive ? "true" : undefined}
											onClick={() => {
												if (draggingRef.current) return;
												selectSlide(index);
											}}
											className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 text-left shadow-xl"
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
													selectSlide(index);
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
						onClick={() => selectSlide(currentIndex - 1)}
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
									onClick={() => selectSlide(index)}
								/>
							))}
						</div>
					)}

					<button
						type="button"
						aria-label="Show next slide"
						disabled={isNextDisabled}
						className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
						onClick={() => selectSlide(currentIndex + 1)}
					>
						<ChevronRight className="size-5" />
					</button>
				</div>
			)}
		</div>
	);
}

export default PerspectiveCarousel;
