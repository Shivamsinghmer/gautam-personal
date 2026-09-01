"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Mount gates for the page's heavy decoration.
 *
 * Every WebGL surface on this site is decoration over content that already
 * exists in the markup - a shader field behind the hero, a 3D book, a glass
 * wordmark, a metal button. Shipping all of them in the first chunk meant
 * three.js, ogl and the shader libraries had to parse before anything was
 * interactive, and holding them all mounted meant four live WebGL contexts on
 * one page whether or not any of them was on screen.
 *
 * Pairing these with `React.lazy` fixes both: the library lands in its own
 * chunk, fetched only when the thing that needs it is actually approaching,
 * and its context exists only while it is worth having.
 */

/**
 * Renders children only on the client, after mount.
 *
 * The point is not the JavaScript - it is that the server never renders the
 * subtree, so a lazily-imported child cannot produce a hydration mismatch. The
 * `fallback` is what SSR and the first client frame both emit, so they agree.
 */
export function ClientOnly({
	children,
	fallback = null,
}: {
	children: ReactNode;
	fallback?: ReactNode;
}) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	return <>{mounted ? children : fallback}</>;
}

/**
 * Renders children once the wrapper comes within `rootMargin` of the viewport,
 * and - unless `once` is set - unmounts them again when it leaves.
 *
 * Unmounting is the point for WebGL: there is no portable way to pause a third
 * party's render loop, but taking the component away releases its context and
 * its rAF with it. The margin is deliberately generous so the thing is built
 * before it can be seen rather than popping in at the edge.
 */
export function InView({
	children,
	fallback = null,
	rootMargin = "600px",
	once = false,
	className,
}: {
	children: ReactNode;
	fallback?: ReactNode;
	rootMargin?: string;
	/** Keep the children mounted after the first entry. */
	once?: boolean;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const [near, setNear] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// No observer means no gate: showing the decoration is the safe failure,
		// not withholding it forever.
		if (typeof IntersectionObserver === "undefined") {
			setNear(true);
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				const hit = entries.some((e) => e.isIntersecting);
				if (hit) {
					setNear(true);
					if (once) io.disconnect();
				} else if (!once) {
					setNear(false);
				}
			},
			{ rootMargin },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [rootMargin, once]);

	return (
		<div ref={ref} className={className}>
			{near ? children : fallback}
		</div>
	);
}
