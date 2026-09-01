import { useEffect, useRef, useState } from "react";

/**
 * True while the element is on screen AND the tab is in front.
 *
 * The page carries several perpetual animations - a rotating 3D carousel, a
 * comb of pulsing bars, an ASCII canvas that redraws thousands of glyphs per
 * burst. Left ungated they all keep running when the visitor is ten screens
 * away, which is what makes the page feel like it is dragging: the work is
 * invisible but the main thread and the compositor still pay for it.
 *
 * Defaults to `true` on the first render, before the observer has reported.
 * A gate that starts closed would hide content on any browser that delays or
 * never delivers the callback; failing to "running" is the safe direction.
 */
export function useActiveInView<T extends HTMLElement>(rootMargin = "200px") {
	const ref = useRef<T>(null);
	const [active, setActive] = useState(true);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		let onScreen = true;
		let visible = document.visibilityState === "visible";
		const sync = () => setActive(onScreen && visible);

		const observer = new IntersectionObserver(
			(entries) => {
				onScreen = entries[0]?.isIntersecting ?? true;
				sync();
			},
			{ rootMargin },
		);
		observer.observe(node);

		const onVisibility = () => {
			visible = document.visibilityState === "visible";
			sync();
		};
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			observer.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [rootMargin]);

	return [ref, active] as const;
}
