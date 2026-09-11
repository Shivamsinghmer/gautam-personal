"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "#/lib/utils";

type Orientation = "vertical" | "horizontal";
type AnimationVariant = "pulse" | "wave" | "none";

interface GradientBarsProps {
	className?: string;
	numBars?: number;
	colors?: string[];
	orientation?: Orientation;
	minScale?: number;
	maxScale?: number;
	animation?: AnimationVariant;
	duration?: number;
	delayStep?: number;
	easing?: string;
	ariaHidden?: boolean;
	/**
	 * Hold the bars flat until the strip scrolls into view, then let them rise
	 * to their resting scale. Off by default so existing uses are unchanged.
	 */
	raiseOnView?: boolean;
	/** Seconds the rise takes. */
	raiseDuration?: number;
}

export function GradientBars({
	className,
	numBars = 15,
	colors = ["#ffffff", "#ffffffcc"],
	orientation = "vertical",
	minScale = 0.2,
	maxScale = 1,
	animation = "pulse",
	duration = 2,
	delayStep = 0.08,
	easing = "ease-in-out",
	ariaHidden = true,
	raiseOnView = false,
	raiseDuration = 1.1,
}: GradientBarsProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	// Starts risen when the behaviour is off, so nothing that already uses this
	// component has to opt back in to being visible.
	const [risen, setRisen] = useState(!raiseOnView);

	useEffect(() => {
		if (!raiseOnView) return;
		const el = rootRef.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setRisen(true);
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				// Once only: bars that drop and re-rise every time you scroll past
				// read as a glitch rather than a flourish.
				if (entries.some((e) => e.isIntersecting)) {
					setRisen(true);
					io.disconnect();
				}
			},
			{ threshold: 0.15 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [raiseOnView]);
	// Separate from the one-shot `risen` observer above: this one toggles, and
	// drives `animation-play-state` so the comb stops costing anything once it
	// is off screen or the tab goes to the background.
	const [onScreen, setOnScreen] = useState(true);
	useEffect(() => {
		const el = rootRef.current;
		if (!el) return;
		let inView = true;
		let tabVisible = document.visibilityState === "visible";
		const sync = () => setOnScreen(inView && tabVisible);

		const io = new IntersectionObserver(
			(entries) => {
				inView = entries[0]?.isIntersecting ?? true;
				sync();
			},
			{ rootMargin: "150px" },
		);
		io.observe(el);

		const onVisibility = () => {
			tabVisible = document.visibilityState === "visible";
			sync();
		};
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			io.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, []);

	const bars = useMemo(() => Array.from({ length: numBars }), [numBars]);
	const gradient = `linear-gradient(${
		orientation === "vertical" ? "to top" : "to right"
	}, ${colors.join(", ")})`;

	const getScale = (index: number) => {
		const position = index / (numBars - 1 || 1);
		const distance = Math.abs(position - 0.5);
		const curve = (distance * 2) ** 2;
		return minScale + (maxScale - minScale) * curve;
	};

	return (
		<div
			ref={rootRef}
			aria-hidden={ariaHidden}
			className={cn("absolute inset-0 overflow-hidden", className)}
		>
			{/* Inline animations */}
			<style>{`
        @keyframes gradient-bar-pulse {
          from { opacity: 0.6; }
          to { opacity: 1; }
        }
        @keyframes gradient-bar-wave {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gradient-bar {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
			<div
				className={cn(
					"flex h-full w-full",
					orientation === "horizontal" && "flex-col",
				)}
			>
				{bars.map((_, index) => {
					const scale = getScale(index);
					const style: CSSProperties = {
						flex: `1 0 ${100 / numBars}%`,
						maxWidth: orientation === "vertical" ? `${100 / numBars}%` : "100%",
						maxHeight:
							orientation === "horizontal" ? `${100 / numBars}%` : "100%",
						background: gradient,
						transform:
							orientation === "vertical"
								? `scaleY(${risen ? scale : 0})`
								: `scaleX(${risen ? scale : 0})`,
						transformOrigin: "bottom left",
						// The rise gets its own, slower curve and a per-bar delay so the
						// row sweeps up rather than snapping as one block.
						transition: `transform ${raiseOnView ? raiseDuration : duration}s cubic-bezier(0.22,0.61,0.36,1) ${raiseOnView ? index * delayStep : 0}s`,
						animation:
							animation === "pulse"
								? `gradient-bar-pulse ${duration}s ${easing} infinite alternate`
								: animation === "wave"
									? `gradient-bar-wave ${duration}s ${easing} infinite`
									: undefined,
						animationDelay:
							animation !== "none" ? `${index * delayStep}s` : undefined,
						// 25 bars, each on an `infinite` keyframe animation. Cheap per
						// bar, but they never stopped - the comb kept animating while
						// the visitor was nowhere near this section. Frozen in place
						// off screen, resumed where it left off.
						animationPlayState: onScreen ? "running" : "paused",
					};
					// biome-ignore lint/suspicious/noArrayIndexKey: bars are a fixed, ordered, positionless decorative list
					return <div key={index} className="gradient-bar" style={style} />;
				})}
			</div>
		</div>
	);
}
