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
/**
 * The field the mark is written on, and it has to be the page's own ground.
 *
 * This was `#001219` - a teal-navy left over from the pre-theme palette -
 * against a page that is now `--ink` (#0a0a0a). The overlay was therefore
 * fading one colour out over a different one, so the first thing the opening
 * did was change the colour of the screen. That tonal shift is read as a
 * flash, and no amount of choreography underneath survives it.
 */
const FIELD = "#0a0a0a";
const INK = "#ffffff";

/** Passed to Signature: how long a single character's stroke takes. */
const DURATION = 0.72;
/**
 * Seconds between characters. 0.11, not the component's 0.2 default: the mark
 * is fourteen characters, so the stagger - not the stroke - is what sets the
 * length of the wait, and at 0.2 the last stroke landed at 3.6s. Fast enough
 * that the hand reads as confident, slow enough that you can still watch it
 * being written.
 */
const STAGGER = 0.11;
/** Beat after the last stroke lands, before the curtain starts to lift. */
const HOLD = 0.3;
/**
 * The curtain lift. Must match `gk-curtain-lift` in styles.css - this is the
 * timer that unmounts the overlay, so if it runs short the curtain is cut off
 * mid-travel.
 */
const FADE = 1.05;

/**
 * When the writing finishes, counted from the first stroke. Derived rather than
 * written down, because it is a consequence of Signature's own schedule: it
 * delays character i by i * STAGGER and runs each for `duration`, over every
 * character in the string - the space included, since it is pushed as an empty
 * path and still takes a turn.
 */
const WRITE_END = (TEXT.length - 1) * STAGGER + DURATION;

/**
 * How long to wait for the mark before giving up on it.
 *
 * A failsafe, not a normal-path timeout, and the distinction matters: the
 * outlines are produced at runtime (opentype.js is a lazy chunk, and it then
 * fetches and parses the .otf), so on a cold start the first stroke can land
 * well over a second in. At 2s this fired *before* the font arrived and lifted
 * the curtain on an empty field - the "signature is not showing" bug. The font
 * is preloaded from the document head now, which is the actual fix; this only
 * covers the case where it never arrives at all, and 5s is long enough that a
 * slow connection still gets to see the mark it waited for.
 */
const MARK_WAIT_CAP = 5000;

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
	/**
	 * Whether there are glyph outlines on screen yet. The exit is scheduled off
	 * this, not off mount - see `MARK_WAIT_CAP`.
	 */
	const [markReady, setMarkReady] = useState(false);
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

		// Skipping goes straight to the exit rather than tearing the overlay away.
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" || e.key === "Enter" || e.key === " ")
				setLeaving(true);
		};
		window.addEventListener("keydown", onKey);

		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
		};
	}, [active]);

	/**
	 * When to leave.
	 *
	 * Its own effect, and keyed on `markReady`, because the clock has to start
	 * at the first stroke rather than at mount. Timed from mount it was counting
	 * through the several hundred milliseconds opentype.js spends fetching and
	 * parsing the font - time when the field is simply empty - and then cutting
	 * the writing off before the last characters had landed.
	 *
	 * Until the mark is ready the only thing scheduled is the cap, so a font
	 * that never resolves still releases the page.
	 */
	useEffect(() => {
		if (!active || skipped.current) return;

		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		// Reduced motion renders the mark already drawn, so there is no writing
		// to wait through - just long enough to register that it was there.
		const wait = markReady
			? reduced
				? 600
				: (WRITE_END + HOLD) * 1000
			: MARK_WAIT_CAP;

		const start = window.setTimeout(() => setLeaving(true), wait);
		return () => window.clearTimeout(start);
	}, [active, markReady]);

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
		// The exit is CSS, not an inline opacity transition - see `.gk-curtain`
		// in styles.css. It is a clip-path edge travelling up and off, with the
		// mark carried away ahead of it, which needs two elements moving on
		// different curves; a single `transition` on this node cannot express
		// that, and the flat fade it used to run is what made the page appear
		// rather than arrive.
		<output
			aria-label={TEXT}
			data-leaving={leaving ? "true" : "false"}
			onPointerDown={() => setLeaving(true)}
			className="gk-curtain fixed inset-0 z-[100] flex cursor-pointer items-center justify-center"
			style={{ backgroundColor: FIELD }}
		>
			<div className="gk-curtain__mark">
				<Suspense fallback={null}>
					<Signature
						text={TEXT}
						color={INK}
						fontSize={64}
						duration={DURATION}
						stagger={STAGGER}
						onReady={() => setMarkReady(true)}
						className="h-auto w-[min(86vw,900px)]"
					/>
				</Suspense>
			</div>
		</output>
	);
}
