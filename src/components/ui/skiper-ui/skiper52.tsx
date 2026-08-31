"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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

	return (
		<div className={cn("flex flex-col items-center", className)}>
			<div className="flex items-stretch justify-center gap-1.5">
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
							style={{ height }}
							initial={false}
							animate={{ width: isActive ? expandedWidth : collapsedWidth }}
							transition={{ duration: 0.35, ease: "easeInOut" }}
							onClick={() => setActiveIndex(index)}
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
			<div className="relative mt-10 min-h-[7rem] w-full max-w-2xl text-center">
				<AnimatePresence mode="wait">
					<motion.figure
						key={activeIndex}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.22, ease: "easeOut" }}
						className="m-0"
					>
						<blockquote className="text-balance text-lg leading-relaxed text-white/85 sm:text-xl">
							“{active.quote}”
						</blockquote>
					</motion.figure>
				</AnimatePresence>
			</div>
		</div>
	);
}
