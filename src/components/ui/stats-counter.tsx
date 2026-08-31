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
}

export default function StatsCounter({
	value,
	duration = 1.5,
	prefix = "",
	suffix = "",
	decimals = 0,
	className,
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
		if (isInView) {
			motionValue.set(value);
		}
	}, [isInView, value, motionValue]);

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
		const t = setTimeout(
			() => {
				setDisplayValue((shown) => (shown === 0 ? value : shown));
			},
			(duration + 0.6) * 1000,
		);
		return () => clearTimeout(t);
	}, [still, value, duration]);

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
