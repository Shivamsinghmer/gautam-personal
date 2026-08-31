"use client";

import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
} from "framer-motion";
import type React from "react";
import { useEffect, useState } from "react";
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

	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const springConfig = { damping: 25, stiffness: 300 };
	const springX = useSpring(x, springConfig);
	const springY = useSpring(y, springConfig);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleMouseMove = (e: React.MouseEvent) => {
		x.set(e.clientX - 120); // Center horizontally (width 240 / 2)
		y.set(e.clientY + 20); // Offset vertically slightly below cursor
	};

	return (
		<>
			<a
				href={href}
				className={cn(
					"relative inline-block font-bold text-neutral-900 dark:text-neutral-100 transition-colors",
					"hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded px-1 -mx-1",
					className,
				)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onMouseMove={handleMouseMove}
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
