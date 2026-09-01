import {
	lazy,
	Suspense,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

/**
 * Lazy, so opentype.js is not on the path to first paint. The overlay is a
 * flat field either way; the mark simply arrives into it a beat later, well
 * inside the hold this component already schedules.
 */
const Signature = lazy(() =>
	import("#/components/signature").then((m) => ({ default: m.Signature })),
);

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
	/**
	 * Records the skip decision synchronously.
	 *
	 * `setActive(false)` below only takes effect on the *next* render, but the
	 * first commit's passive effect still runs with `active` captured as true -
	 * so the play-the-animation effect would fire on a visit that is meant to
	 * skip, and leave `data-preloader="writing"` set forever with no overlay on
	 * screen. Everything keyed off "done" (the hero's `.gk-reveal` entrance,
	 * `usePreloaderDone`) then waits for a signal that never arrives. A ref is
	 * readable immediately, so the effect can see the decision that was made
	 * microseconds earlier.
	 */
	const skipped = useRef(false);

	// Decide before first paint whether this visit gets the animation at all.
	useLayoutEffect(() => {
		const replay = window.location.search.includes("replay");
		if (once && !replay && sessionStorage.getItem(SEEN_KEY) === "1") {
			skipped.current = true;
			document.documentElement.dataset.preloader = "done";
			setActive(false);
			finish.current?.();
		}
	}, [once]);

	useEffect(() => {
		if (!active || skipped.current) {
			// Whatever happens, the page must not be left waiting on "writing".
			document.documentElement.dataset.preloader = "done";
			return;
		}
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

		// Flip to "done" as the fade BEGINS, not when it ends.
		//
		// `.gk-reveal` has no hidden resting state - it renders in its final
		// position - and the entrance is `animation: gk-rise ... both`, which
		// only attaches under `[data-preloader='done']`. Setting the flag after
		// the fade meant the hero was fully visible underneath the overlay for
		// the whole 0.45s, and then every element snapped back to opacity 0 and
		// re-entered: the section appeared to render twice. Starting it here
		// runs the entrance behind the clearing overlay, which is the
		// choreography that was intended.
		document.documentElement.dataset.preloader = "done";

		const t = window.setTimeout(() => {
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
			<Suspense fallback={null}>
				<Signature
					text={TEXT}
					color={INK}
					fontSize={64}
					duration={DURATION}
					className="h-auto w-[min(86vw,900px)]"
				/>
			</Suspense>
		</output>
	);
}
