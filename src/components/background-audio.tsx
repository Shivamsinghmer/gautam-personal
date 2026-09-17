"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The site's background track, and the control that owns it.
 *
 * It does not start on its own, and that is not a limitation being worked
 * around - it is the only correct behaviour here, for three separate reasons:
 *
 * 1. Browsers block it. Chrome, Safari and Firefox all refuse `play()` with
 *    sound before a user gesture, so an "autoplay" track would simply throw on
 *    first load and play for nobody.
 * 2. WCAG 2.2 SC 1.4.2 (Audio Control) requires a way to stop any sound that
 *    plays automatically for more than three seconds. PRODUCT.md targets AA.
 * 3. Two of this site's audiences arrive on a desktop during working hours -
 *    a training coordinator opening a candidate's site at their desk is the
 *    worst possible person to startle with music.
 *
 * So the button is the feature: off until asked, and one click away either
 * direction. The choice is remembered, and on a return visit playback is
 * attempted once - if the browser blocks it, the control simply shows as off
 * rather than lying about its state.
 *
 * `preload="none"` is load-bearing. The file is ~6.4MB, four times the hero
 * plate, and fetching it on every visit to a page almost nobody will turn the
 * sound on for would be the single most expensive thing this site downloads.
 * Nothing is requested until the first click.
 */

const SRC = "/bgm.mp3";
const PREF_KEY = "gk:bgm";
/** Background, not foreground: loud enough to notice, quiet enough to talk over. */
const VOLUME = 0.28;
/** A cut to silence reads as a fault. This is short enough not to feel slow. */
const FADE_MS = 650;

export function BackgroundAudio() {
	const [on, setOn] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const fadeRef = useRef<number | null>(null);

	/** Ramps volume rather than cutting it, and never leaves two fades running. */
	const fadeTo = useCallback((target: number, done?: () => void) => {
		const el = audioRef.current;
		if (!el) return;
		if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
		const from = el.volume;
		const started = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - started) / FADE_MS);
			el.volume = from + (target - from) * t;
			if (t < 1) {
				fadeRef.current = requestAnimationFrame(step);
			} else {
				fadeRef.current = null;
				done?.();
			}
		};
		fadeRef.current = requestAnimationFrame(step);
	}, []);

	// A visitor who turned it on last time gets it back, if the browser allows.
	// A rejected play() is the expected path, not an error: it just means this
	// visit has not had a gesture yet, and the control stays off until it does.
	useEffect(() => {
		let stored: string | null = null;
		try {
			stored = localStorage.getItem(PREF_KEY);
		} catch {
			// Private mode, or storage blocked. Treat as "no preference".
		}
		if (stored !== "on") return;
		const el = audioRef.current;
		if (!el) return;
		el.volume = 0;
		el.play()
			.then(() => {
				fadeTo(VOLUME);
				setOn(true);
			})
			.catch(() => {});
	}, [fadeTo]);

	useEffect(
		() => () => {
			if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current);
		},
		[],
	);

	const remember = (value: "on" | "off") => {
		try {
			localStorage.setItem(PREF_KEY, value);
		} catch {
			// Nothing to do - the control still works for this visit.
		}
	};

	const toggle = async () => {
		const el = audioRef.current;
		if (!el) return;

		if (on) {
			setOn(false);
			remember("off");
			fadeTo(0, () => el.pause());
			return;
		}

		el.volume = 0;
		try {
			await el.play();
			setOn(true);
			remember("on");
			fadeTo(VOLUME);
		} catch {
			// Blocked, or the file failed to load. Leave the control off so it
			// matches what is actually happening.
			setOn(false);
		}
	};

	return (
		<>
			{/* biome-ignore lint/a11y/useMediaCaption: an instrumental background
			    track carries no speech, so there is nothing for a caption track to
			    transcribe. The control below is what makes it accessible. */}
			<audio ref={audioRef} src={SRC} loop preload="none" />

			{/* Bottom-left, not bottom-right: the router devtools sit bottom-right
			    in development and would cover it. Below the preloader's z-100, so
			    the overlay is never competing with a control you cannot reach.

			    The positioning lives on this wrapper rather than on the button,
			    and it has to: `.liquid-metal-ring` sets `position: relative`, and
			    styles.css is unlayered, so it beats Tailwind's layered `fixed`
			    utility no matter the specificity. On the button itself the control
			    silently stayed in flow and sat 12,000px down the page. */}
			<div className="fixed bottom-4 left-4 z-40 sm:bottom-5 sm:left-5">
				<button
					type="button"
					onClick={toggle}
					aria-pressed={on}
					aria-label={
						on ? "Turn background music off" : "Turn background music on"
					}
					title={on ? "Music on" : "Music off"}
					className="liquid-metal-ring h-11 w-11 cursor-pointer sm:h-12 sm:w-12"
				>
					<span className="liquid-metal-ring__fill text-white/70 transition-colors duration-200 hover:text-white">
						{on ? (
							<Volume2 className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
						) : (
							<VolumeX className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
						)}
					</span>
				</button>
			</div>
		</>
	);
}
