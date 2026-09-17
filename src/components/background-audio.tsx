"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The site's background track, and the control that owns it.
 *
 * On by default, as far as a browser will actually allow - which is the whole
 * difficulty. Chrome, Safari and Firefox all reject `play()` with sound until
 * the page has had a user gesture, so "autoplay" cannot be implemented as
 * "call play() on mount" and be done with it. That call is still made, because
 * it does succeed for a returning visitor Chrome has built up media engagement
 * for; when it is refused, the track is armed against the first gesture the
 * visitor makes anyway - a click, a key, a touch - and starts there instead.
 *
 * So the sequence is: try immediately, and failing that, start at the first
 * thing they do. Nobody has to find the button to hear it.
 *
 * Two things this deliberately keeps:
 *
 * - **An explicit "off" is permanent.** Turning it off stores that, and no
 *   later visit or gesture overrides it. Autoplay is the default, not a thing
 *   that keeps reasserting itself over someone who has said no.
 * - **The control stays visible and reachable.** WCAG 2.2 SC 1.4.2 does not
 *   forbid autoplaying audio; it requires a mechanism to stop it when it runs
 *   past three seconds. The button is that mechanism, which is what keeps this
 *   conformant - so it must never be hidden or moved behind a menu.
 *
 * `preload="none"` stays. The track is fetched when playback is first
 * attempted rather than on every page load, which matters because the request
 * now happens for essentially every visitor: at 256kbps stereo this file was
 * 6.4MB, more than the hero plate, and is re-encoded to 96kbps mono (2.3MB) on
 * the grounds that nothing playing at 28% volume behind a web page needs
 * mastering bitrate.
 */

const SRC = "/bgm.mp3";
const PREF_KEY = "gk:bgm";
/** Background, not foreground: loud enough to notice, quiet enough to talk over. */
const VOLUME = 0.28;
/** A cut to silence reads as a fault. This is short enough not to feel slow. */
const FADE_MS = 650;
/**
 * What counts as the gesture that unlocks audio. `pointerdown` rather than
 * `click` so the preloader's own dismiss-on-tap counts, and `scroll` because
 * on this page that is the first thing most people do - it is not a gesture
 * that unlocks audio on its own in every engine, but where it does, it is the
 * earliest one available.
 */
const GESTURES = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

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

	// Start it, one way or the other.
	//
	// The immediate attempt is expected to be refused on a first visit - that is
	// not an error, it is the autoplay policy doing its job - so a refusal arms
	// the same attempt against the first gesture instead. Only an explicit
	// "off" stops both paths.
	useEffect(() => {
		let stored: string | null = null;
		try {
			stored = localStorage.getItem(PREF_KEY);
		} catch {
			// Private mode, or storage blocked. Treat as "no preference", which
			// means on - the default.
		}
		if (stored === "off") return;

		const el = audioRef.current;
		if (!el) return;

		let done = false;
		const cleanup = () => {
			for (const type of GESTURES) {
				window.removeEventListener(type, onGesture);
			}
		};

		const start = () => {
			if (done) return;
			el.volume = 0;
			return el
				.play()
				.then(() => {
					done = true;
					cleanup();
					fadeTo(VOLUME);
					setOn(true);
					return true;
				})
				.catch(() => false);
		};

		function onGesture() {
			start();
		}

		start().then((ok) => {
			// Blocked. Wait for the visitor to do anything at all, then retry -
			// `once` is not used because a gesture can arrive before the file is
			// ready and fail again; the listeners are removed on success instead.
			if (ok || done) return;
			for (const type of GESTURES) {
				window.addEventListener(type, onGesture, { passive: true });
			}
		});

		return cleanup;
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
