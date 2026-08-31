"use client";

import {
	motion,
	useAnimationFrame,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
	wrap,
} from "framer-motion";
import type React from "react";
import { useRef } from "react";
import { cn } from "#/lib/utils";

interface ParallaxProps {
	children: React.ReactNode;
	baseVelocity: number;
	className?: string;
	containerRef?: React.RefObject<HTMLElement | null>;
	/** How many copies of `children` to lay end to end before the loop repeats. */
	repeat?: number;
}

/**
 * One marquee row. `children` is one full "unit" (e.g. a row of logos) that
 * gets cloned `repeat` times so the strip can wrap seamlessly - the wrap
 * range is derived from `repeat` (one unit's width, as a percentage of the
 * whole track) rather than the `8` copies this was originally hard-coded for.
 */
function ParallaxText({
	children,
	baseVelocity = 100,
	className,
	containerRef,
	repeat = 6,
}: ParallaxProps) {
	const baseX = useMotionValue(0);
	const { scrollY } = useScroll(
		containerRef ? { container: containerRef } : undefined,
	);
	const scrollVelocity = useVelocity(scrollY);
	const smoothVelocity = useSpring(scrollVelocity, {
		damping: 50,
		stiffness: 400,
	});
	const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
		clamp: false,
	});

	const x = useTransform(baseX, (v) => `${wrap(-100 / repeat, 0, v)}%`);

	const directionFactor = useRef<number>(1);
	useAnimationFrame((_t, delta) => {
		let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

		// Flips direction once scroll direction flips.
		if (velocityFactor.get() < 0) {
			directionFactor.current = -1;
		} else if (velocityFactor.get() > 0) {
			directionFactor.current = 1;
		}

		moveBy += directionFactor.current * moveBy * velocityFactor.get();

		baseX.set(baseX.get() + moveBy);
	});

	return (
		<div className="flex w-full flex-nowrap overflow-hidden whitespace-nowrap">
			{/* The gap lives on each unit (pr-16), never on the track. The wrap
			    translates by exactly -100/repeat% of the track, which is only one
			    whole period if every unit is the same width INCLUDING the space that
			    follows it. With `gap-16` on the track there are repeat-1 gaps for
			    repeat units, so a period was short by gap/repeat - about 11px at
			    these values - and the strip snapped back by that much on every
			    cycle. That snap is the "restarting" every few seconds. */}
			<motion.div className={cn("flex flex-nowrap", className)} style={{ x }}>
				{Array.from({ length: repeat }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed, ordered, positionless repeats of the same unit
					<div key={i} className="flex shrink-0 items-center gap-16 pr-16">
						{children}
					</div>
				))}
			</motion.div>
		</div>
	);
}

interface ScrollBasedVelocityProps {
	children: React.ReactNode;
	defaultVelocity?: number;
	/** 2 (default) gives the classic pair of rows drifting opposite ways;
	 * 1 is a single strip, which reads better for something like a logo band. */
	rows?: 1 | 2;
	className?: string;
	containerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrollBasedVelocity({
	children,
	defaultVelocity = 5,
	rows = 2,
	className,
	containerRef,
}: ScrollBasedVelocityProps) {
	return (
		<section className="relative flex w-full flex-col gap-6">
			<ParallaxText
				baseVelocity={defaultVelocity}
				className={className}
				containerRef={containerRef}
			>
				{children}
			</ParallaxText>
			{rows === 2 ? (
				<ParallaxText
					baseVelocity={-defaultVelocity}
					className={className}
					containerRef={containerRef}
				>
					{children}
				</ParallaxText>
			) : null}
		</section>
	);
}
