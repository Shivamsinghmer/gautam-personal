import {
	lazy,
	Suspense,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

/**
 * Lazy, so the traced signature (about 11KB compressed) is not on the path to
 * first paint. The overlay is a flat field either way; the mark arrives into
 * it a beat later, well inside the hold this component already schedules.
 */
const Signature = lazy(() =>
	import("#/components/signature").then((m) => ({ default: m.Signature })),
);

/**
 * Preloader: the Componentry `Signature` component writing the name across a
 * flat field, then the field parting down the middle like a pair of gates.
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

/**
 * Seconds the signature takes to write, first stroke to last.
 *
 * One number now, where it used to be a per-letter stroke time and a stagger
 * between letters. That pair existed because the mark was set in a font, one
 * glyph at a time. It is his own hand now, written along the pen's path at a
 * constant speed, so the only thing to choose is how long the whole thing
 * takes. 2.2s is the length the font version settled on: fast enough that the
 * hand reads as confident, slow enough to watch it being written.
 */
const DURATION = 2.2;
/**
 * Beat after the last stroke lands, before the gates part. Long enough for the
 * finished name to register as finished - at 0.3 the doors were already moving
 * by the time the eye reached the end of the word.
 */
const HOLD = 0.55;
/**
 * The gates opening. Must match `gk-gate-open` in styles.css - this is the
 * timer that unmounts the overlay, so if it runs short the doors are cut off
 * mid-swing.
 */
const OPEN = 1.15;

/** When the writing finishes, counted from the first stroke. */
const WRITE_END = DURATION;

/**
 * How long to wait for the mark before giving up on it.
 *
 * A failsafe for the lazy chunk never arriving. It mattered more when the mark
 * was built at runtime from a font - opentype.js then fetching and parsing an
 * .otf could put the first stroke well over a second in - and the signature is
 * static data now, but a chunk can still fail to load, and the page must not
 * stay locked behind the overlay if it does.
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
	 * at the first stroke rather than at mount: the mark arrives in a lazy chunk,
	 * and time spent fetching it is time the field is simply empty. (When the
	 * mark was built from a font this gap ran to over a second and cut the
	 * writing off before it finished.)
	 *
	 * Until the mark is ready the only thing scheduled is the cap, so a chunk
	 * that never arrives still releases the page.
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
		}, OPEN * 1000);
		return () => window.clearTimeout(t);
	}, [leaving]);

	if (!active) return null;

	return (
		// Two layers, and the exit is entirely the second one.
		//
		// The writing layer is what you watch: the field and the mark being
		// traced. Under it sit the two gate leaves - the same field and the same
		// mark, already fully drawn, each leaf clipped to one half of the screen.
		// They are mounted from the start, not at the end, because the mark is
		// produced at runtime from a font: a copy mounted at the moment of
		// leaving would be blank for the frames it takes to build its outlines.
		//
		// When it is time to go, the writing layer is dropped in the same commit
		// the leaves start to move. Both draw the identical, finished mark at the
		// identical position, so the hand-off has no visible frame; what you see
		// is the name split down its middle and carried apart on two doors. The
		// mark never fades - that was the point of the rewrite. The old exit was a
		// clip-path edge lifting off the top with the signature dissolving ahead
		// of it.
		<output
			aria-label={TEXT}
			data-leaving={leaving ? "true" : "false"}
			onPointerDown={() => setLeaving(true)}
			className="gk-gate fixed inset-0 z-[100] cursor-pointer"
		>
			<GateLeaf side="left" />
			<GateLeaf side="right" />

			{leaving ? null : (
				<div
					className="absolute inset-0 flex items-center justify-center"
					style={{ backgroundColor: FIELD }}
				>
					<Suspense fallback={null}>
						<Signature
							color={INK}
							duration={DURATION}
							onReady={() => setMarkReady(true)}
							className={MARK_CLASS}
						/>
					</Suspense>
				</div>
			)}
		</output>
	);
}

/** Shared by the writing layer and both leaves, so all three draw one mark. */
const MARK_CLASS = "h-auto w-[min(86vw,900px)]";

/**
 * One door. Full-screen and clipped to its half, rather than a half-width box,
 * so the mark inside it is laid out against the whole viewport exactly as the
 * writing layer lays it out - the two halves meet at the seam with no shift.
 * Opening is a translate of half its own width, which takes its visible half
 * clean off its edge of the screen.
 */
function GateLeaf({ side }: { side: "left" | "right" }) {
	return (
		<div
			aria-hidden="true"
			className={`gk-gate__leaf gk-gate__leaf--${side} absolute inset-0 flex items-center justify-center`}
			style={{ backgroundColor: FIELD }}
		>
			<Suspense fallback={null}>
				<Signature color={INK} duration={0} className={MARK_CLASS} />
			</Suspense>
			{/* The leaf's inner edge, so the seam reads as two doors parting
			    rather than as a picture being cut in half. */}
			<span className="gk-gate__edge" />
		</div>
	);
}
