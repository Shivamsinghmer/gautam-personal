"use client";

import { useEffect, useRef } from "react";
import { useActiveInView } from "#/lib/use-active-in-view";

/**
 * The hero stage: a photograph that never quite stops moving, with a field of
 * light over it that the pointer pushes around.
 *
 * Three effects, deliberately split across two technologies:
 *
 * - **The slow push (Ken Burns)** is a CSS keyframe on the image. Transform
 *   only, so it runs on the compositor and costs the main thread nothing, and
 *   it is paused by `animation-play-state` the moment the hero leaves the
 *   screen or the tab goes to the background.
 * - **The particle field** and **the pointer disturbance** share one 2D canvas.
 *   Not WebGL: this page already carries several GL contexts, and a few dozen
 *   soft arcs a frame is far cheaper than another shader. Pointer movement
 *   gives nearby motes an impulse and they drift back, which reads as liquid
 *   without running a fluid solver - a real one would be the most expensive
 *   thing on a page that has already been too slow once.
 *
 * Under `prefers-reduced-motion` the push stops, the field is painted once and
 * left there, and the pointer does nothing. The picture and the type are
 * untouched by any of it.
 */
export function HeroBackdrop({
	image,
	className,
	imageClassName,
}: {
	image: string;
	className?: string;
	/** Extra classes on the picture itself - scale, blur, tone. */
	imageClassName?: string;
}) {
	const [hostRef, active] = useActiveInView<HTMLDivElement>("120px");
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const runningRef = useRef(active);
	runningRef.current = active;
	/** Set by the effect below so the visibility gate can restart the loop. */
	const wakeRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const host = hostRef.current;
		if (!canvas || !host) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		// Cap the buffer: a retina hero at full dpr is four times the fill for a
		// layer nobody is meant to look at directly.
		const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

		let w = 0;
		let h = 0;
		let raf = 0;

		type Mote = {
			x: number;
			y: number;
			vx: number;
			vy: number;
			r: number;
			a: number;
			depth: number;
		};
		let motes: Mote[] = [];

		const seed = () => {
			// Density by area, so a phone does not pay for a monitor's worth.
			const count = Math.max(18, Math.min(70, Math.round((w * h) / 26000)));
			motes = Array.from({ length: count }, () => {
				const depth = 0.35 + Math.random() * 0.65;
				return {
					x: Math.random() * w,
					y: Math.random() * h,
					vx: (Math.random() - 0.5) * 0.16 * depth,
					vy: (Math.random() - 0.5) * 0.12 * depth - 0.04,
					r: (0.7 + Math.random() * 1.9) * depth,
					a: (0.16 + Math.random() * 0.4) * depth,
					depth,
				};
			});
		};

		const resize = () => {
			const rect = host.getBoundingClientRect();
			w = Math.max(1, Math.round(rect.width));
			h = Math.max(1, Math.round(rect.height));
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			seed();
		};

		// Pointer state. `power` decays so the disturbance settles rather than
		// leaving a permanent dent wherever the cursor stopped.
		const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, power: 0 };
		const onPointerMove = (e: PointerEvent) => {
			if (still) return;
			const rect = host.getBoundingClientRect();
			const nx = e.clientX - rect.left;
			const ny = e.clientY - rect.top;
			const dx = nx - pointer.x;
			const dy = ny - pointer.y;
			pointer.px = pointer.x;
			pointer.py = pointer.y;
			pointer.x = nx;
			pointer.y = ny;
			pointer.power = Math.min(1, pointer.power + Math.hypot(dx, dy) * 0.014);
		};
		const onPointerLeave = () => {
			pointer.x = -9999;
			pointer.y = -9999;
		};

		const draw = () => {
			ctx.clearRect(0, 0, w, h);
			for (const m of motes) {
				ctx.beginPath();
				ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(226, 240, 255, ${m.a})`;
				ctx.fill();
			}
		};

		const RADIUS = 130;
		const step = () => {
			if (!runningRef.current || still) {
				raf = 0;
				return;
			}
			for (const m of motes) {
				// Pointer impulse, strongest at the centre of the disturbance.
				if (pointer.power > 0.001 && pointer.x > -9000) {
					const dx = m.x - pointer.x;
					const dy = m.y - pointer.y;
					const dist = Math.hypot(dx, dy);
					if (dist < RADIUS && dist > 0.001) {
						const falloff = (1 - dist / RADIUS) ** 2;
						const push = falloff * pointer.power * 0.9 * m.depth;
						m.vx += (dx / dist) * push;
						m.vy += (dy / dist) * push;
					}
				}
				m.x += m.vx;
				m.y += m.vy;
				// Settle back toward the drift speed instead of accelerating away.
				m.vx *= 0.965;
				m.vy *= 0.965;
				m.vy -= 0.0006 * m.depth;

				if (m.x < -12) m.x = w + 12;
				if (m.x > w + 12) m.x = -12;
				if (m.y < -12) m.y = h + 12;
				if (m.y > h + 12) m.y = -12;
			}
			pointer.power *= 0.94;
			draw();
			raf = requestAnimationFrame(step);
		};

		const ro = new ResizeObserver(() => {
			resize();
			draw();
		});
		ro.observe(host);
		resize();
		// Paint once immediately, so the field exists even if the loop never
		// starts - reduced motion, a stalled observer, a headless render.
		draw();

		const wake = () => {
			if (still || raf || !runningRef.current) return;
			raf = requestAnimationFrame(step);
		};
		wakeRef.current = wake;

		if (!still) {
			host.addEventListener("pointermove", onPointerMove);
			host.addEventListener("pointerleave", onPointerLeave);
			wake();
		}

		return () => {
			cancelAnimationFrame(raf);
			raf = 0;
			wakeRef.current = null;
			ro.disconnect();
			host.removeEventListener("pointermove", onPointerMove);
			host.removeEventListener("pointerleave", onPointerLeave);
		};
	}, [hostRef]);

	// The loop returns without rescheduling once the gate closes, so coming
	// back on screen has to restart it explicitly.
	useEffect(() => {
		if (active) wakeRef.current?.();
	}, [active]);

	return (
		<div ref={hostRef} className={className} aria-hidden="true">
			<img
				src={image}
				alt=""
				decoding="async"
				// No `object-center` here. It is the CSS initial value anyway, and as a
				// utility it competes with whatever the caller passes in
				// `imageClassName` - same specificity, so stylesheet order decides and
				// the caller silently loses.
				className={`gk-kenburns absolute inset-0 ml-40 object-cover ${imageClassName ?? ""}`}
				style={{ animationPlayState: active ? "running" : "paused" }}
			/>
			<canvas
				ref={canvasRef}
				className="pointer-events-none absolute inset-0 size-full"
			/>
		</div>
	);
}
