"use client";

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
} from "framer-motion";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "#/lib/utils.ts";

export interface CursorCardProps {
	children: React.ReactNode;
	image: string;
	description: string;
	href?: string;
	className?: string;
	/**
	 * Classes for the floating preview card itself (`className` styles the
	 * inline trigger). Added because this app never sets a `.dark` class, so the
	 * component's own `dark:` variants are inert and the card would otherwise
	 * always paint in its light look - a white panel on a dark page.
	 */
	cardClassName?: string;
}

export function CursorCard({
	children,
	image,
	description,
	href = "#",
	className,
	cardClassName,
}: CursorCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [mounted, setMounted] = useState(false);
	const anchorRef = useRef<HTMLAnchorElement>(null);

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = { damping: 25, stiffness: 300 };
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	useEffect(() => {
		setMounted(true);
	}, []);

	const CARD_W = 240;

	/**
	 * Park the card directly under the link.
	 *
	 * The card is `fixed top-0 left-0` and moved by these two motion values,
	 * which were only ever written by `onMouseMove`. On a touch screen that
	 * event never fires, so both stayed at 0 and the card opened in the corner
	 * of the viewport, on top of the nav. Anchoring it to the link's own rect
	 * is the behaviour that makes sense without a cursor: it appears where the
	 * word is. `jump` rather than `set` so it does not spring in from 0,0.
	 */
	const placeUnderAnchor = useCallback(() => {
		const el = anchorRef.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const left = Math.min(
			Math.max(12, r.left + r.width / 2 - CARD_W / 2),
			window.innerWidth - CARD_W - 12,
		);
		const top = r.bottom + 12;
		for (const [value, next] of [
			[x, left],
			[springX, left],
			[y, top],
			[springY, top],
		] as const) {
			if (typeof value.jump === "function") value.jump(next);
			else value.set(next);
		}
	}, [x, y, springX, springY]);

	/** True where there is no hover - a phone, a tablet. */
	const isTouch = () =>
		typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isTouch()) return;
		x.set(e.clientX - 120); // Center horizontally (width 240 / 2)
		y.set(e.clientY + 20); // Offset vertically slightly below cursor
	};

	// Tapping a link whose href is a bare "#" jumps the page to the top, which
	// is what made the card feel like it teleported you away. On touch the tap
	// opens the card in place instead; a real href still navigates.
	const handleClick = (e: React.MouseEvent) => {
		// A bare "#" is not a destination - following it scrolls the page to the
		// top, which is a bad surprise from a word in the middle of a paragraph.
		// These links exist to show a preview, so on every device the click is
		// swallowed unless there is somewhere real to go.
		if (href === "#") e.preventDefault();
		if (!isTouch()) return;
		placeUnderAnchor();
		setIsHovered((open) => !open);
	};

	// Close on the next tap anywhere else.
	useEffect(() => {
		if (!isHovered || !isTouch()) return;
		const close = (e: Event) => {
			if (!anchorRef.current?.contains(e.target as Node)) setIsHovered(false);
		};
		document.addEventListener("pointerdown", close);
		return () => document.removeEventListener("pointerdown", close);
	}, [isHovered]);

	return (
		<>
			<a
				ref={anchorRef}
				href={href}
				className={cn(
					"relative inline-block font-bold text-neutral-900 dark:text-neutral-100 transition-colors",
					"hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded px-1 -mx-1",
					className,
				)}
				onMouseEnter={() => {
					if (isTouch()) return;
					placeUnderAnchor();
					setIsHovered(true);
				}}
				onMouseLeave={() => {
					if (isTouch()) return;
					setIsHovered(false);
				}}
				onMouseMove={handleMouseMove}
				onClick={handleClick}
			>
				{children}
			</a>

			{mounted &&
				typeof document !== "undefined" &&
				createPortal(
					<AnimatePresence>
						{isHovered && (
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ duration: 0.15, ease: "easeOut" }}
								style={{
									x: springX,
									y: springY,
								}}
								className={cn(
									"fixed top-0 left-0 pointer-events-none z-50 w-[240px]",
									"bg-white dark:bg-neutral-900 p-3 shadow-2xl rounded-xl border border-neutral-200 dark:border-neutral-800",
									cardClassName,
								)}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={image}
									alt="hover preview"
									className="w-full h-auto rounded-md mb-3 object-cover"
								/>
								<p className="m-0 text-sm leading-relaxed text-current opacity-70">
									{description}
								</p>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</>
	);
}

export default CursorCard;
