import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Signature } from "#/components/signature";

/**
 * Preloader: the Componentry `Signature` component writing the name across a
 * flat field, then the overlay leaves.
 *
 * The drawing is entirely `Signature`'s - its outline-tracing mask, its
 * per-glyph stagger, its easing, its font. Nothing here reaches into it. This
 * file only owns the shell: the field it sits on, the scroll lock, when the
 * overlay goes, and how to get past it.
 */

const TEXT = "Gautam Kumawat";
/** Matches the hero beneath, so the overlay leaves on the colour already there. */
const FIELD = "#001219";
const INK = "#ffffff";

/** Passed to Signature. Its own default, and the duration asked for. */
const DURATION = 1;
/** Signature staggers each character by this much. Fixed inside that component. */
const STAGGER = 0.2;
/** Beat after the last stroke lands, before the overlay starts to go. */
const HOLD = 0.35;
const FADE = 0.45;

/**
 * When the writing finishes. Derived rather than written down, because it is a
 * consequence of Signature's own schedule: it delays character i by i * 0.2 and
 * runs each for `duration`, over every character in the string - the space
 * included, since it is pushed as an empty path and still takes a turn.
 */
const WRITE_END = (TEXT.length - 1) * STAGGER + DURATION;

const SEEN_KEY = "gk:preloader:seen";

export function SignaturePreloader({
	once = false,
	onDone,
}: {
	/**
	 * Play only the first time per browser session. Off by default: a preloader
	 * that silently does nothing on the second load reads as broken rather than
	 * as considerate. Append `?replay` to override it when it is on.
	 */
	once?: boolean;
	onDone?: () => void;
}) {
	const [active, setActive] = useState(true);
	const [leaving, setLeaving] = useState(false);
	const finish = useRef(onDone);
	finish.current = onDone;

	// Decide before first paint whether this visit gets the animation at all.
	useLayoutEffect(() => {
		const replay = window.location.search.includes("replay");
		if (once && !replay && sessionStorage.getItem(SEEN_KEY) === "1") {
			document.documentElement.dataset.preloader = "done";
			setActive(false);
			finish.current?.();
		}
	}, [once]);

	useEffect(() => {
		if (!active) return;
		sessionStorage.setItem(SEEN_KEY, "1");
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.documentElement.dataset.preloader = "writing";

		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		// Reduced motion still gets the mark, just not a long wait for it.
		const start = window.setTimeout(
			() => setLeaving(true),
			reduced ? 700 : (WRITE_END + HOLD) * 1000,
		);

		// Skipping goes straight to the fade rather than tearing the overlay away.
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" || e.key === "Enter" || e.key === " ")
				setLeaving(true);
		};
		window.addEventListener("keydown", onKey);

		return () => {
			window.clearTimeout(start);
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
		};
	}, [active]);

	// The fade and the unmount are one step behind the decision to go, so every
	// route into leaving - the timer, a key, a click - ends the same way and the
	// scroll lock is always released.
	useEffect(() => {
		if (!leaving) return;
		const t = window.setTimeout(() => {
			document.documentElement.dataset.preloader = "done";
			setActive(false);
			finish.current?.();
		}, FADE * 1000);
		return () => window.clearTimeout(t);
	}, [leaving]);

	if (!active) return null;

	return (
		<output
			aria-label={TEXT}
			onPointerDown={() => setLeaving(true)}
			className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center"
			style={{
				backgroundColor: FIELD,
				opacity: leaving ? 0 : 1,
				transition: `opacity ${FADE}s cubic-bezier(0.4, 0, 1, 1)`,
			}}
		>
			<Signature
				text={TEXT}
				color={INK}
				fontSize={64}
				duration={DURATION}
				className="h-auto w-[min(86vw,900px)]"
			/>
		</output>
	);
}
