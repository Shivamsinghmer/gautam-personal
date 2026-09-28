import { createFileRoute } from "@tanstack/react-router";
import { Building2, CalendarRange, Globe, Mic2, Newspaper } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AboutSection } from "#/components/about-section";
import { AnimatedFooter } from "#/components/animated-footer";
// import { BookSection } from "#/components/book-section";
import { BookingSection } from "#/components/booking-section";
import { CollageSection } from "#/components/collage-section";
import { FeaturedInSection } from "#/components/featured-in-section";
import { GallerySection } from "#/components/gallery-section";
import { HeroBackdrop } from "#/components/hero-backdrop";
import { JourneySection } from "#/components/journey-section";
import { ReachSection } from "#/components/reach-section";
import { SocialLinks } from "#/components/social-links";
import { TestimonialsSection } from "#/components/testimonials-section";
import { ClientOnly } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { StatIndex } from "#/components/ui/stat-index";
import { HERO_DEEP as DEEP, SHADER_BLUE_BRIGHT } from "#/lib/palette";
import { usePreloaderDone } from "#/lib/use-preloader-done";

/**
 * A slow sweep of light across the footer's closing wordmark, replacing the
 * glass-warp shader it used to run - installed via
 * `npx shadcn add @react-bits/ShinyText-TS-TW`.
 */
const ShinyText = lazy(() => import("#/components/ShinyText"));

export const Route = createFileRoute("/")({ component: Home });

/** Copy tint, chosen against the shader's brightest moment (see below). */
const TYPE = "#f4fbf8";

/**
 * The wordmark as plain type. This is what the server renders and what stands
 * in until ShinyText's chunk arrives, so the footer is never headless.
 */
/**
 * Sized to the string, not guessed: "GAUTAM KUMAWAT" in Archivo ExtraBold at
 * -0.04em tracking measures ~9.66x its own font size wide. `12vw` (the old
 * value, carried over from a shorter placeholder word) let the line grow
 * faster than the viewport did, so past a certain width the string no longer
 * fit its `px-8` gutters and wrapped to two lines. `8.8vw - 5.6px` is solved
 * from that same ratio for a line that fills ~85% of the available width at
 * every size instead - the 15% left over is slack for font-metric rounding,
 * not a target in itself. Past `9rem` the line stops growing at all, and by
 * then the viewport has so much more room than the fixed-width text needs
 * that it can only ever wrap by getting *narrower*, which `clamp` already
 * rules out.
 */
const FOOTER_NAME_SIZE = "clamp(1.4rem, calc(8.8vw - 5.6px), 9rem)";

const FOOTER_NAME_FALLBACK = (
	<span
		className="block w-full whitespace-nowrap text-center font-extrabold tracking-[-0.04em]"
		style={{
			color: TYPE,
			fontFamily: "var(--font-display)",
			fontSize: FOOTER_NAME_SIZE,
			lineHeight: 0.9,
		}}
	>
		GAUTAM KUMAWAT
	</span>
);

const QUOTE =
	"You have to take a risk or you will be doing the same shit for the rest of your life.";

function Home() {
	// The canvas is swapped in on the client only. Server-rendered markup keeps
	// the still gradient, which is also what anyone asking for reduced motion
	// keeps: the shader drifts continuously and has no resting frame to hold.
	// The hero sits under the preloader while it plays, so anything that
	// animates here has to wait for it - see use-preloader-done.ts.
	const revealed = usePreloaderDone();

	// The hero plate is large, and its entrance must not start before it can be
	// seen. `complete` covers the cached case, where the load event has already
	// fired by the time this runs.
	const figureRef = useRef<HTMLImageElement>(null);
	const [figureReady, setFigureReady] = useState(false);
	useEffect(() => {
		if (figureRef.current?.complete) setFigureReady(true);
	}, []);

	return (
		<main>
			<section
				// `svh`, not `vh`. On a phone `100vh` is the viewport with the browser
				// chrome retracted - the tallest it ever gets - so a `100vh` hero is
				// taller than what is actually on screen while the address bar is
				// showing, and the bottom row lands under it. That row carries the
				// CTA, so the one thing the hero is asking for was the one thing
				// below the fold on arrival. `svh` is the smallest viewport: the
				// whole composition fits whatever the chrome is doing.
				//
				// (`lg:min-h-screen` was the same value as the base, so it went.)
				className="relative isolate flex min-h-svh items-center overflow-hidden px-6 sm:px-10"
				style={{ backgroundColor: DEEP }}
			>
				{/* The stage. One photograph pushed slowly, with a field of light
				    over it that the pointer disturbs - see hero-backdrop.tsx. This
				    replaces the shader gradient and the ASCII portrait both: the
				    hero is the picture now, and the type stands on it. */}
				<div className="gk-stage absolute inset-0 -z-20 overflow-hidden">
					{/* The same portrait as the figure, at a different scale: blown
					    up until only the eyes are in frame, blurred back and dimmed
					    so it reads as depth rather than as a second picture. One
					    asset doing two jobs.

					    `object-[50%_21%]` is derived, not guessed: object-cover fits
					    the square plate to the viewport width, leaving 540px of
					    vertical overflow, and 21% of that puts the eye line at the
					    centre of the frame - which is where scale() then magnifies
					    from. `object-top` framed the hair. */}
					<HeroBackdrop
						image="/hero.png"
						className="absolute inset-0 overflow-hidden"
						// A touch brighter below `sm`: the tighter 2.6 crop plus the
						// same 0.62 brightness the wider desktop plate uses left the
						// phone hero reading as close to flat black above and beside
						// the figure, with nothing for the eye to land on. 0.72 is
						// still dim enough that the scrims and the corner type read
						// clearly over it - just not empty.
						imageClassName="scale-[2.6] blur-[2px] brightness-[0.72] object-[50%_21%] sm:scale-[2.2] sm:brightness-[0.62]"
					/>
				</div>

				{/* Two scrims rather than one. A flat veil seats the photograph in
				    the page's key; a wedge weighted to the left puts ground under
				    the type without draining the picture on the right, where there
				    is nothing to read. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10"
					style={{ backgroundColor: `${DEEP}4d` }}
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10"
					style={{
						background: `linear-gradient(100deg, ${DEEP}d9 0%, ${DEEP}a6 38%, ${DEEP}4d 66%, ${DEEP}1a 100%)`,
					}}
				/>

				{/* Phones only. The wedge above runs left-to-right, which puts no
				    ground under a centred column - so the lower half gets its own
				    vertical scrim, where the type actually sits. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[62%] sm:hidden"
					style={{
						background: `linear-gradient(to bottom, ${DEEP}00 0%, ${DEEP}8c 38%, ${DEEP}e6 72%, ${DEEP} 100%)`,
					}}
				/>

				{/* The hand-off into the section below. The seam was not softness -
				    it was two different colours meeting at a hard line: live shader
				    above, flat DEEP beneath. These two layers make both sides arrive
				    at the same colour.

				    First a graduated blur. backdrop-filter alone would band at its
				    own top edge, so it is masked with a gradient - blur fades in as
				    the ramp does, and the shader's structure dissolves rather than
				    stopping. */}
				{/* This was a masked backdrop-filter. A masked backdrop blur is one
				    of the most expensive things a page can ask for - the compositor
				    renders the region offscreen, blurs it, then masks it, on every
				    frame it is on screen - and it sat across the full width of the
				    hero. The colour ramp below already carries the hand-off; the
				    blur was buying a softness nobody would name, at a cost that
				    showed up in every scroll. */}

				{/* Then the colour ramp, ending on exactly DEEP so the hero's last
				    pixels match the next section's first. The stops carry DEEP's own
				    rgb at zero alpha rather than `transparent`: `transparent` is
				    rgba(0,0,0,0), and interpolating from it drags the midpoint of
				    the ramp toward black. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34svh]"
					style={{
						background: `linear-gradient(to bottom, ${DEEP}00 0%, ${DEEP}59 40%, ${DEEP}bf 72%, ${DEEP} 100%)`,
					}}
				/>

				{/* Behind wordmark below: front-to-back fly-in that clears with
				    the curtain, so the resting hero is the headline rather than
				    a name laid across his chest. Timed off `done` (0.1s delay,
				    2.2s run) to play through the curtain's last third like the
				    figure and copy cascade. */}

				{/* Behind wordmark: flies in from the front, drops back, then
				    clears with the preloader (see `gk-behind-fly` in styles.css).
				    Outer div centers it; inner p animates, so the entrance
				    transform never fights the centering. Color carries the dimming
				    (not `opacity`), since the keyframes own opacity. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
				>
					<p
						className="gk-behind text-center font-extrabold leading-[0.9] tracking-[-0.05em] whitespace-nowrap"
						style={{
							color: "rgb(244 251 248 / 0.9)",
							fontFamily: "var(--font-display)",
							fontSize: "clamp(2rem, 9.5vw, 7.5rem)",
						}}
					>
						GAUTAM KUMAWAT
					</p>
				</div>

				{/* The figure, centred and bottom-anchored, standing in front of
				    his own enlarged face. Sized by width rather than height: the
				    plate is square, so height-sizing made it wide enough to leave
				    the flanking copy no room. */}
				{/* The animated element and the masked element are deliberately not
				    the same node. With the mask on the thing being transformed, every
				    frame re-rasterises a masked 1.6MB plate instead of compositing a
				    finished layer, which is what made the entrance land with a thud.
				    The wrapper moves; the picture inside it just sits there. */}
				<div
					data-ready={figureReady ? "true" : "false"}
					className="gk-figure pointer-events-none absolute bottom-0 left-1/2 z-10 h-[58svh] -translate-x-1/2 sm:h-[clamp(360px,84svh,1040px)]"
				>
					<img
						ref={figureRef}
						src="/hero.png"
						alt="Gautam Kumawat"
						decoding="async"
						// Matches the preload hint in `__root.tsx` head - both exist so
						// this request wins the fight for bandwidth against everything
						// else the page is loading, on the connection where that fight
						// matters most.
						fetchPriority="high"
						onLoad={() => setFigureReady(true)}
						className="h-full w-auto max-w-none object-contain object-bottom"
						style={{
							maskImage:
								"linear-gradient(to bottom, #000 0%, #000 58%, rgb(0 0 0 / 0.35) 82%, transparent 100%)",
							WebkitMaskImage:
								"linear-gradient(to bottom, #000 0%, #000 58%, rgb(0 0 0 / 0.35) 82%, transparent 100%)",
						}}
					/>
				</div>

				{/* Left-side headline. Only this copy and the background wordmark
				    remain in the hero - the identifier, credential lines, closing
				    line and CTA were removed.

				    Centred from `sm`. Below it the h1 grows to fill this column
				    instead, so the two halves can sit at opposite ends of the
				    screen - see the note on the h1.

				    `30svh` on a phone, not `pt-24`. The top half only has to clear
				    the floating nav, but sitting right under it read as a second
				    navigation row rather than as the opening of a sentence. Pushed
				    down it belongs to the picture instead: it lands in the gap
				    between the nav and the crown of his head, close enough to the
				    figure to be part of the frame and still clear of his hair.

				    A share of the screen rather than a fixed 16rem, because what
				    it has to clear is the head in a photograph that is sized in
				    viewport units too. 256px is a comfortable 30% of an 844pt
				    phone and a crowding 40% of a 640pt one, where it landed in his
				    hair; `svh` keeps the same relationship at both. `pb-28` stays
				    fixed, because the audio toggle it holds off is itself pinned a
				    fixed distance from the foot. */}
				<div // `self-stretch`, because `h-full` resolves to auto against a
					// `min-h-svh` parent - the column was shrink-wrapping its content
					// and being centred, so `mt-auto` had no space to push into and the
					// claim landed across his face.
					className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[104rem] flex-col justify-end self-stretch pt-24 pb-28 text-left max-sm:pt-[30svh] max-sm:text-center sm:justify-center sm:pt-28 sm:pb-14"
				>
					{/* The line is split across the composition rather than stacked in
					    one corner: "A Man On" holds the left edge, "A Mission" the
					    right, and the figure standing between them is what the sentence
					    is about. Read left to right, he is literally in the middle of
					    it.

					    That is the `sm` arrangement. A phone has no left and right to
					    play with - at 375px the two halves want ~345px of a 327px
					    container - so the split turns through ninety degrees and
					    becomes top and bottom. "A Man On" sits above the figure, in
					    the clear dark air under the nav; "A Mission" sits on the
					    photograph itself, over his shoulder where the plate's mask
					    has already faded it to near-black. The same idea either way:
					    the man is in the middle of the sentence.

					    "A Mission" is set larger there, and only there (48px against
					    38.4px). Two halves of one line want one size when they share
					    a baseline, but stacked at opposite ends of a screen they are
					    read as two separate beats - and the second one, the one on
					    the photograph, is the half that carries the claim.

					    The delays now clear the curtain rather than riding it. The
					    overlay takes 0.95s to lift (`gk-curtain-lift`), and these used
					    to start at 0.72s so the words arrived through the travelling
					    edge - deliberate then, because the old copy was a four-block
					    cascade that wanted to overlap the reveal. Two words either side
					    of the frame are a single beat, and a beat lands better after
					    the thing it follows than underneath it. */}
					<h1
						className="display flex w-full grow flex-col justify-between gap-1 text-[clamp(2.4rem,7vw,4.8rem)] sm:grow-0 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:text-[clamp(2.4rem,5.2vw,5.2rem)]"
						style={{ color: TYPE }}
					>
						{/* Staggered off the shared baseline - the left half lifted, the
						    right dropped - so the pair reads as a diagonal across his
						    face rather than as one line a photograph happens to interrupt.

						    `translate`, not margin: the offset is purely optical, and
						    leaving the layout boxes where they are keeps the h1 centred
						    on its own midpoint. It also stays clear of the entrance -
						    that animation transforms the inner span, this transforms the
						    masking one, so neither overwrites the other. */}
						<span
							className="gk-line sm:-translate-y-6 lg:-translate-y-10"
							style={{ ["--gk-delay" as string]: "1.05s" }}
						>
							<span>A Man On</span>
						</span>
						<span
							className="gk-line max-sm:text-[clamp(3rem,12vw,3.6rem)] sm:translate-y-6 sm:text-right lg:translate-y-10"
							style={{ ["--gk-delay" as string]: "1.18s" }}
						>
							<span>A Mission</span>
						</span>
					</h1>
				</div>
			</section>

			{/* The figures, as a band of their own under the hero rather than a
			    fourth block crowding the corner layout. Full width, one row, on a
			    hairline - so the hero stays the photograph and the numbers get
			    read as a ledger instead of as hero furniture. */}
			<section
				aria-label="By the numbers"
				className="relative z-10 border-y px-6 py-8 sm:px-10 sm:py-10"
				style={{
					backgroundColor: DEEP,
					borderColor: "rgb(255 255 255 / 0.12)",
				}}
			>
				<div className="mx-auto max-w-6xl">
					{/* Five figures, each under its own glyph in the liquid-metal ring
					    (see `.liquid-metal-ring` in styles.css) - the same rotating-chrome
					    border `LiquidMetalButton` renders as a fill. "Students" is cut:
					    the journey section already carries "41,000 students enrolled" a
					    few sections down, and losing it here is what lets the row land
					    on five across evenly instead of six with an empty seat.

					    Years, agencies, media outlets and sessions are the figures
					    supplied for this row. "Media outlets" used to be a count of the
					    mastheads in the strip below, so it could not drift from what the
					    page shows; it is the supplied 30+ now, which is more outlets than
					    the strip carries - the strip is a selection, not the full list. */}
					<StatIndex
						variant="chip"
						start={revealed}
						// Wrapped flex, not a grid, and `justify-center` is the whole
						// reason. Five items never divide evenly into two or three
						// columns, so a grid strands the remainder hard against the
						// left edge: on a phone "Sessions" sat alone in the left cell
						// with the right half of the band empty beside it, which reads
						// as a missing sixth stat rather than as the end of five. A
						// wrap centres whatever is left over at every width. The
						// bases are the column widths a grid would have given, minus
						// each item's share of the gaps.
						className="flex flex-wrap justify-center gap-x-8 gap-y-10 [&>div]:basis-[calc(50%-1rem)] sm:gap-x-10 sm:[&>div]:basis-[calc(33.333%-1.667rem)] lg:gap-x-8 lg:[&>div]:basis-[calc(20%-1.6rem)]"
						items={[
							{ value: 162, label: "Countries", icon: Globe },
							{ value: 17, suffix: "+", label: "Years", icon: CalendarRange },
							{ value: 100, suffix: "+", label: "Agencies", icon: Building2 },
							{
								value: 30,
								suffix: "+",
								label: "Media outlets",
								icon: Newspaper,
							},
							{ value: 1700, suffix: "+", label: "Sessions", icon: Mic2 },
						]}
					/>
				</div>
			</section>

			<AboutSection />
			<FeaturedInSection />

			<JourneySection />

			<ReachSection />

			<CollageSection />

			{/* The counterpoint to the collage, and it has to follow it: that
			    section is the rooms he is booked into, this one is everywhere
			    else. Read the other way round the personal frames would be
			    standing in front of the evidence. */}
			<GallerySection />

			<TestimonialsSection />

			{/* The book section is off the page for now, not deleted - put this
			    back to show it again. */}
			{/* <BookSection /> */}

			<BookingSection />

			{/* The hands live at the public root, not the component's default
			    /animated-footer/ path, so both are passed explicitly. They are dark
			    subjects on white, which is what this effect wants: the ASCII ramp
			    skips any cell brighter than ~0.6 luminance, so the white ground
			    drops out and only the hand is drawn.

			    Every colour is passed explicitly. Left unset, the component picks
			    its defaults from usePrefersDark() - which is what made the hands
			    burnt orange (#803500), and would have made them peach on an OS set
			    to light. This page is dark either way, so an OS preference has no
			    business choosing its palette. */}
			{/* Exactly one screen. No children now: the booking cards used to sit
			    here too, repeating what's now `BookingSection` above - one bookable
			    grid, not two. Without them the art band (flex-1) simply takes the
			    full height back. */}
			{/* The hand-off into the footer. Same two-layer treatment as the hero
			    seam: a graduated blur so the bars above dissolve rather than stop,
			    then a colour ramp ending on exactly DEEP so both sides of the
			    boundary arrive at the same value and there is no line to see.
			    The blur is masked - unmasked, backdrop-filter bands at its own top
			    edge and simply moves the seam upward. */}
			<div className="relative" aria-hidden="true">
				{/* Second masked backdrop blur, removed for the same reason as the
				    hero seam. The ramp below it is what actually joins the two
				    sections. */}
				<div
					className="pointer-events-none absolute inset-x-0 -top-48 h-48"
					style={{
						background: `linear-gradient(to bottom, ${DEEP}00 0%, ${DEEP}66 42%, ${DEEP}c4 74%, ${DEEP} 100%)`,
					}}
				/>
			</div>

			{/* The nav's "Let's Connect" points here: the sign-off block carries
			    the social row and the address, so it is where "connect" lands. */}
			<div id="connect" className="h-svh w-full scroll-mt-0">
				<AnimatedFooter
					// The slot renders directly above the wordmark, so the profiles and
					// the name read as one sign-off block rather than a separate strip.
					// Note: public/stylized_book.glb ("Stylized Book" by Kevin on
					// Sketchfab, CC BY 4.0) is currently unused — the book section
					// shows a manuscript artifact instead. Delete the asset if the
					// model is not coming back.
					headingLines={["Gautam Kumawat"]}
					// The wordmark is drawn through ShinyText's shine sweep instead
					// of the footer's own per-character unmask. `headingLines` stays
					// for the accessible name and as the fallback path.
					headingSlot={
						<ClientOnly fallback={FOOTER_NAME_FALLBACK}>
							<Suspense fallback={FOOTER_NAME_FALLBACK}>
								<ShinyText
									text="GAUTAM KUMAWAT"
									speed={3.2}
									delay={0}
									color="#181818"
									shineColor="#f7f6f6"
									spread={120}
									direction="left"
									yoyo={false}
									pauseOnHover={false}
									disabled={false}
									className="pointer-events-auto block w-full whitespace-nowrap font-extrabold leading-[0.9]"
									style={{
										display: "block",
										textAlign: "center",
										// The site's own display face - Archivo, the same one
										// every other big heading on the page uses - rather
										// than the Manrope this carried over from WarpText's
										// own default.
										fontFamily: "var(--font-display)",
										// See the comment on `FOOTER_NAME_SIZE` above - same
										// formula, so the real wordmark and its plain-text
										// fallback never disagree on how wide a line they draw.
										fontSize: FOOTER_NAME_SIZE,
										letterSpacing: "-0.04em",
										// No fixed `height` any more. That was sized for
										// WarpText's canvas, which needed an explicit box; a
										// plain block of text does not, and against a `9rem`
										// max font size the old `320px` cap reserved far more
										// room than the glyphs ever filled - the block element
										// then rendered its text at the top and left the extra
										// height as dead space underneath, which is the gap
										// that was showing above the footer's own bottom
										// padding.
									}}
								/>
							</Suspense>
						</ClientOnly>
					}
					leftImage="/hand-left.jpg"
					rightImage="/hand-right.jpg"
					background={DEEP}
					textColor="#ffffff"
					// The glyphs, not the field, are what made the footer read grey
					// when this was HERO_TEAL's mid-grey - 2,800 of them across the
					// band lifted the whole thing off black. The fix for that
					// overcorrected: #2b2b2b sits close enough to the near-black
					// field that the hands barely read at all. #454545 is the
					// middle - the ASCII pattern is legible as two hands again,
					// without the band reading as a grey panel.
					charColor="#454545"
					hoverColor={SHADER_BLUE_BRIGHT}
					hoverCharColor={DEEP}
				>
					{/* The sign-off, stacked: what he says, where to find him, then
					    the name. Moved out of the booking section - a closing line
					    reads as a closing line at the end of the page, not halfway
					    down it above a CTA. */}
					<Reveal className="flex flex-col items-center gap-9" amount={0.15}>
						<figure className="m-0 max-w-3xl text-center">
							<blockquote className="display-wide text-[clamp(1.35rem,3vw,2.1rem)] text-white/90">
								{QUOTE}
							</blockquote>
							<figcaption
								className="mt-6 text-[0.7rem] font-medium uppercase text-white/45"
								style={{ letterSpacing: "0.18em" }}
							>
								Gautam Kumawat
							</figcaption>
						</figure>

						<SocialLinks heading="Find me here" />
					</Reveal>
				</AnimatedFooter>
			</div>
		</main>
	);
}
