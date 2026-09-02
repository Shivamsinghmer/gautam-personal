"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils";

export interface HoverExpandItem {
	src: string;
	alt: string;
	name: string;
	role: string;
	quote: string;
}

/**
 * A row of portraits that widen on hover/tap. The active photo is shown clean -
 * nothing is drawn over it - and what the person said is read from a caption
 * beneath the row.
 *
 * Vendored from Skiper UI's "Skiper 52" (HoverExpand_001) and reworked:
 *
 * - the original laid a `bg-black/35 backdrop-blur-md` panel over the expanded
 *   photo to hold the quote, which meant the one image you had chosen to look
 *   at was the only one you could not see clearly. The quote moved out from
 *   over the picture and into its own block below.
 * - the original also shipped `swiper/css` imports it never used (there is no
 *   <Swiper> in the file) and surfaced a bare "# 23" label instead of content.
 */
export function HoverExpand_001({
	items,
	className,
	collapsedWidth = "3rem",
	expandedWidth = "20rem",
	height = "24rem",
}: {
	items: HoverExpandItem[];
	className?: string;
	collapsedWidth?: string;
	expandedWidth?: string;
	height?: string;
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const active = items[activeIndex];

	/**
	 * Small screens get their own geometry. Nine portraits at 3rem collapsed
	 * plus a 20rem expanded card is 704px of row, which on a phone squeezed
	 * every inactive photo into an unreadable sliver.
	 */
	const [small, setSmall] = useState(false);
	useEffect(() => {
		const q = window.matchMedia("(max-width: 639px)");
		const sync = () => setSmall(q.matches);
		sync();
		q.addEventListener("change", sync);
		return () => q.removeEventListener("change", sync);
	}, []);

	const size = small
		? { collapsed: "2.25rem", expanded: "14rem", h: "17rem" }
		: { collapsed: collapsedWidth, expanded: expandedWidth, h: height };

	const rowRef = useRef<HTMLDivElement>(null);
	const activeRef = useRef<HTMLButtonElement>(null);
	/**
	 * Set while the visitor is pointing at or focused inside the row.
	 *
	 * Only ever written on a device that can actually hover. A tap on a phone
	 * fires a synthetic `mouseenter` with no matching `mouseleave`, so on touch
	 * this latched to true on the first tap and the carousel never advanced
	 * again. Touch pauses through `pausedUntil` instead, which expires on its
	 * own.
	 */
	const held = useRef(false);
	const pausedUntil = useRef(0);
	const canHover = () =>
		typeof window !== "undefined" &&
		window.matchMedia("(hover: hover)").matches;

	/** Give the visitor time to read a card they chose before moving on. */
	const holdAfterTap = () => {
		pausedUntil.current = Date.now() + 8000;
	};

	// Keep the expanded card in view when the row has to scroll, which it does
	// on a phone - otherwise the timer advances to a card off the right edge.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-runs per active card
	useEffect(() => {
		activeRef.current?.scrollIntoView({
			behavior: "smooth",
			inline: "center",
			block: "nearest",
		});
	}, [activeIndex]);

	/**
	 * Advance every five seconds.
	 *
	 * Held while the visitor is interacting, stopped when the row is off screen
	 * or the tab is in the background, and never started at all under reduced
	 * motion - a carousel that reshuffles itself is exactly the kind of motion
	 * that setting asks to be spared.
	 */
	const advance = useCallback(() => {
		setActiveIndex((i) => (i + 1) % items.length);
	}, [items.length]);

	useEffect(() => {
		const row = rowRef.current;
		if (!row) return;
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
				if (held.current || Date.now() < pausedUntil.current) return;
				advance();
			}, 4000);
		};

		const io = new IntersectionObserver((entries) => {
			onScreen = entries[0]?.isIntersecting ?? true;
			start();
		});
		io.observe(row);
		const onVisibility = () => start();
		document.addEventListener("visibilitychange", onVisibility);
		start();

		return () => {
			stop();
			io.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [advance]);

	return (
		<div className={cn("flex w-full flex-col items-center", className)}>
			{/* Only the row scrolls. It used to be wrapped - together with the
			    quote - in one `overflow-x-auto min-w-max` box, so the quote
			    inherited the row's width and ran off the side of the screen
			    instead of wrapping. */}
			<div
				ref={rowRef}
				onMouseEnter={() => {
					if (canHover()) held.current = true;
				}}
				onMouseLeave={() => {
					held.current = false;
				}}
				onFocusCapture={() => {
					held.current = true;
				}}
				onBlurCapture={() => {
					held.current = false;
				}}
				className="flex w-full items-stretch justify-start gap-1.5 overflow-x-auto px-4 pb-2 sm:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
			>
				{items.map((item, index) => {
					const isActive = activeIndex === index;
					return (
						<motion.button
							key={item.name + item.src}
							type="button"
							aria-label={`${item.name}, ${item.role}`}
							aria-pressed={isActive}
							className={cn(
								"relative shrink-0 cursor-pointer overflow-hidden rounded-3xl",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
							)}
							ref={isActive ? activeRef : undefined}
							style={{ height: size.h }}
							initial={false}
							animate={{ width: isActive ? size.expanded : size.collapsed }}
							transition={{ duration: 0.35, ease: "easeInOut" }}
							onClick={() => {
								holdAfterTap();
								setActiveIndex(index);
							}}
							onHoverStart={() => setActiveIndex(index)}
							onFocus={() => setActiveIndex(index)}
						>
							{/* No overlay on the active card - the whole point of expanding
							    a photo is to see it. The inactive ones are dimmed instead,
							    so the active one reads as lit rather than uncovered. */}
							<img
								src={item.src}
								alt={item.alt}
								loading="lazy"
								decoding="async"
								className={cn(
									"size-full object-cover transition-[filter,opacity] duration-300",
									isActive
										? "opacity-100"
										: "opacity-45 saturate-50 hover:opacity-75",
								)}
							/>
							{isActive ? (
								<>
									{/* Name and role sit on the photo. A bottom-anchored
									    gradient rather than a panel over the whole frame: it
									    darkens only the strip the type needs, so the picture
									    stays clear everywhere else. */}
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.25, delay: 0.1 }}
										className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-5 pt-16 pb-5 text-left"
									>
										<span className="block text-sm font-semibold text-white">
											{item.name}
										</span>
										<span className="mt-0.5 block text-xs text-white/70">
											{item.role}
										</span>
									</motion.div>
									<span
										aria-hidden="true"
										className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20"
									/>
								</>
							) : null}
						</motion.button>
					);
				})}
			</div>

			{/* The quote. Name and role are on the photo now, so this is the words
			    only. min-height is fixed so a shorter quote does not shrink the
			    block and jog the whole section as you move across the row. */}
			<div className="relative mt-8 min-h-[8.5rem] w-full max-w-2xl px-6 text-center sm:mt-10 sm:min-h-[7rem]">
				<AnimatePresence mode="wait">
					<motion.figure
						key={activeIndex}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.22, ease: "easeOut" }}
						className="m-0"
					>
						<blockquote className="text-balance text-base leading-relaxed text-white/85 sm:text-xl">
							“{active.quote}”
						</blockquote>
					</motion.figure>
				</AnimatePresence>
			</div>
		</div>
	);
}
