import { useEffect, useState } from "react";

/**
 * Reports when the signature preloader has finished covering the page.
 *
 * The preloader sets `data-preloader` on <html> ("writing", then "done"), which
 * the CSS reveal in styles.css already keys off. Anything that animates in the
 * hero needs the same signal from JS: the hero mounts *underneath* the overlay,
 * so a viewport-triggered animation starts and finishes while nobody can see
 * it, and reads as static once the overlay lifts.
 */
export function usePreloaderDone() {
	const [done, setDone] = useState(false);

	useEffect(() => {
		const root = document.documentElement;
		if (root.dataset.preloader === "done") {
			setDone(true);
			return;
		}

		const observer = new MutationObserver(() => {
			if (root.dataset.preloader === "done") {
				setDone(true);
				observer.disconnect();
			}
		});
		observer.observe(root, {
			attributes: true,
			attributeFilter: ["data-preloader"],
		});

		// The preloader is opt-in and skips itself on repeat visits, so the
		// attribute may never be written at all. Release the gate regardless
		// after the longest the animation could run - a counter waiting forever
		// on a signal that is not coming would sit at 0, which is a wrong
		// number rather than a missing effect.
		const fallback = setTimeout(() => setDone(true), 3000);

		return () => {
			observer.disconnect();
			clearTimeout(fallback);
		};
	}, []);

	return done;
}
