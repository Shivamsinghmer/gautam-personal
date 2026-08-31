"use client";

import {
	useInView,
	useMotionValue,
	useReducedMotion,
	useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils.ts";

interface StatsCounterProps {
	value: number;
	duration?: number;
	prefix?: string;
	suffix?: string;
	decimals?: number;
	className?: string;
	/**
	 * Hold the count until this is true, on top of the in-view check. For
	 * counters that sit above the fold behind an intro overlay: they are "in
	 * view" from the first frame, so without this they finish before anyone
	 * can see them. Omit it and the counter runs on visibility alone.
	 */
	start?: boolean;
}

export default function StatsCounter({
	value,
	duration = 1.5,
	prefix = "",
	suffix = "",
	decimals = 0,
	className,
	start = true,
}: StatsCounterProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const still = useReducedMotion();
	const motionValue = useMotionValue(0);
	const springValue = useSpring(motionValue, {
		duration: duration * 1000,
		bounce: 0,
	});
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (isInView && start) {
			motionValue.set(value);
		}
	}, [isInView, start, value, motionValue]);

	// A counter that never runs does not sit at "no animation" - it sits at 0,
	// which is a wrong number rather than a missing effect. Anyone who asked for
	// reduced motion gets the real figure immediately, and if the observer has
	// not reported by the time the count would have finished anyway, the figure
	// is set regardless.
	useEffect(() => {
		if (still) {
			setDisplayValue(value);
			return;
		}
		// Only arm once the gate is open, or the safety net would fire during
		// the wait and hand over the finished figure before the count begins.
		if (!start) return;
		const t = setTimeout(
			() => {
				setDisplayValue((shown) => (shown === 0 ? value : shown));
			},
			(duration + 0.6) * 1000,
		);
		return () => clearTimeout(t);
	}, [still, value, duration, start]);

	useEffect(() => {
		const unsubscribe = springValue.on("change", (latest) => {
			setDisplayValue(latest);
		});
		return unsubscribe;
	}, [springValue]);

	return (
		<span ref={ref} className={cn("tabular-nums", className)}>
			{prefix}
			{displayValue.toFixed(decimals)}
			{suffix}
		</span>
	);
}
