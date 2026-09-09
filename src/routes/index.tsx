import { createFileRoute } from "@tanstack/react-router";
import { useLenis } from "lenis/react";
import { PhoneCall } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AboutSection } from "#/components/about-section";
import { AnimatedFooter } from "#/components/animated-footer";
import { BookSection } from "#/components/book-section";
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

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

/**
 * A slow sweep of light across the footer's closing wordmark, replacing the
 * glass-warp shader it used to run - installed via
 * `npx shadcn add @react-bits/ShinyText-TS-TW`. Lazy for the same reason
 * `LiquidMetalButton` is: a `useAnimationFrame` loop has no business in the
 * first chunk for a line nobody sees until they have scrolled the whole page.
 */
const ShinyText = lazy(() => import("#/components/ShinyText"));

export const Route = createFileRoute("/")({ component: Home });

/**
 * What stands in for the shader button until its chunk arrives, and what the
 * server renders. A real button with the real action - not a placeholder -
 * so the primary CTA is never dead on first paint.
 */
function PlainConnectButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
			style={{ backgroundColor: SHADER_BLUE_BRIGHT, color: "#ffffff" }}
		>
			<PhoneCall className="h-4 w-4" aria-hidden="true" />
			Let's Connect
		</button>
	);
}

/** Copy tints, chosen against the shader's brightest moment (see below). */
const TYPE = "#f4fbf8";
const TYPE_SOFT = "#d8efe7";

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
	"The internet doesn't wait for you to be ready. My job is to make sure you already are.";

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
	/**
	 * The page's scroll is owned by Lenis, so an in-page jump goes through it
	 * rather than through the browser - `href="#connect"` would land instantly
	 * and fight the smooth scroller on the way.
	 */
	const lenis = useLenis();
	const goToConnect = () => {
		const target = document.querySelector("#connect");
		if (!target) return;
		if (lenis) lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
		else target.scrollIntoView({ behavior: "smooth", block: "start" });
		window.history.replaceState(null, "", "#connect");
	};

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

				{/* The opening wordmark, and only the opening. It rises behind the
				    figure while he is still large and close to the viewer, then
				    clears as he settles - so the resting hero is the corner blocks
				    rather than a name laid across his chest. `aria-hidden` because
				    the name is already the document title and the top-left label;
				    this is choreography, not a second heading. */}
				<p
					aria-hidden="true"
					className="gk-intro-mark pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 text-center font-extrabold leading-[0.9] tracking-[-0.05em] text-white/85"
					style={{ fontSize: "clamp(2.4rem, 10vw, 7.5rem)" }}
				>
					Gautam Kumawat
				</p>

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

				{/* Five blocks in three rows, in the shape of the reference: an
				    identifier top left, the claim and a quiet label on the middle
				    line, the action and the summing-up line along the bottom. The
				    secondary "Read the story" link went - the reference carries one
				    action here, and the story is one scroll away regardless. */}
				<div // `self-stretch`, because `h-full` resolves to auto against a
					// `min-h-svh` parent - the column was shrink-wrapping its content
					// and being centred, so `mt-auto` had no space to push into and the
					// claim landed across his face.
					// `pt-24`, not the `pt-16` this briefly was: the floating nav is
					// `fixed`, outside this flow entirely, so it does not push this
					// column down on its own - `pt-16` put the identity line only
					// ~13px under the nav's own bottom edge, close enough to read as
					// tucked under it rather than clear of it.
					className="pointer-events-none relative z-20 mx-auto flex w-full max-w-[104rem] flex-col justify-start self-stretch pt-24 pb-10 text-center sm:justify-between sm:pt-28 sm:pb-14 sm:text-left"
				>
					<p
						className="gk-reveal pointer-events-auto text-[0.78rem] leading-snug sm:text-[0.85rem]"
						style={{ color: TYPE, ["--gk-delay" as string]: "1.3s" }}
					>
						Gautam Kumawat /
						<br />
						<span style={{ color: TYPE_SOFT }}>Cybercrime investigator.</span>
					</p>

					<div className="mt-auto flex flex-col items-center justify-between gap-8 sm:mt-0 sm:flex-row sm:items-center">
						{/* Below `sm` this used to sit in normal flow with the caption,
						    which `mt-auto` then pushed down to share the bottom third
						    with the button - stacked on his chest rather than read
						    against clear ground. Pulled out with `absolute` and set just
						    under the identity line, above where the figure actually
						    starts (~341px at a 375-wide phone), it reads before the
						    photograph rather than over it. `sm:static` hands it straight
						    back to the flex row for the desktop composition, unchanged.
						    Sized up on the way, too - `6.6vw` at 375px landed a hair
						    under the 1.55rem floor, which read as small for the one line
						    doing the most work in the hero. */}
						<h1
							className="display absolute inset-x-0 top-40 z-10 max-w-[17ch] text-[clamp(2rem,9vw,3rem)] sm:static sm:inset-auto sm:top-auto sm:z-auto sm:max-w-[30%] sm:text-[clamp(1.55rem,3.3vw,3rem)]"
							style={{ color: TYPE }}
						>
							<span
								className="gk-line"
								style={{ ["--gk-delay" as string]: "1.42s" }}
							>
								<span>Cybercrime</span>
							</span>
							<span
								className="gk-line"
								style={{ ["--gk-delay" as string]: "1.54s" }}
							>
								<span>investigator.</span>
							</span>
							<span
								className="gk-line"
								style={{ ["--gk-delay" as string]: "1.66s" }}
							>
								<span>Trainer to officers.</span>
							</span>
						</h1>

						{/* Desktop-only before this: `hidden sm:block` cut it entirely
						    on a phone, which was one of two credential lines this hero
						    carries just gone, and left the gap under the headline with
						    nothing in it. Centred and unconstrained in width below
						    `sm`, where it was right-aligned inside a 24%-wide column. */}
						<p
							className="gk-reveal text-center text-[0.78rem] leading-snug sm:max-w-[24%] sm:text-right sm:text-[0.85rem]"
							style={{ color: TYPE_SOFT, ["--gk-delay" as string]: "1.78s" }}
						>
							Law-enforcement agencies
							<br />
							India · United States
						</p>
					</div>

					<div className="mt-7 flex flex-col items-center justify-between gap-7 sm:mt-0 sm:flex-row sm:items-end sm:gap-8">
						{/* The same shader button the nav carries, so the page's one
						    primary action looks like one action wherever it appears. It
						    is a <button>, not a link, so the destination is handled by
						    `goToConnect`; the fallback below is a real button too, which
						    means the CTA works from first paint rather than after a
						    shader compiles. */}
						<div
							className="gk-reveal pointer-events-auto"
							style={{ ["--gk-delay" as string]: "1.92s" }}
						>
							<ClientOnly
								fallback={<PlainConnectButton onClick={goToConnect} />}
							>
								<Suspense
									fallback={<PlainConnectButton onClick={goToConnect} />}
								>
									<LiquidMetalButton
										label="Let's Connect"
										onClick={goToConnect}
									/>
								</Suspense>
							</ClientOnly>
						</div>

						{/* Also cut entirely below `sm` before this - the bottom row on
						    a phone was the button alone, with the closing line that
						    balances it on desktop simply missing. Centred under the
						    button rather than right-aligned in a 30%-wide column. */}
						<p
							className="display text-center max-w-none text-[clamp(1rem,1.8vw,1.7rem)] sm:max-w-[30%] sm:text-right"
							style={{ color: TYPE }}
						>
							<span
								className="gk-line"
								style={{ ["--gk-delay" as string]: "1.62s" }}
							>
								<span>Cybercrime scales.</span>
							</span>
							<span
								className="gk-line"
								style={{ ["--gk-delay" as string]: "1.72s" }}
							>
								<span>So must the people</span>
							</span>
							<span
								className="gk-line"
								style={{ ["--gk-delay" as string]: "1.82s" }}
							>
								<span>who stop it.</span>
							</span>
						</p>
					</div>
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
					{/* Six figures, to match the row the reference carries.

					    This ran as `variant="chip"` - a circular icon badge over each
					    number - which is the one place on the page that motif showed
					    up. Every other index on the site (reach, the about section's
					    figure) is a hairline rule, a tabular number, a label under it;
					    no glyph, no tint. A shield or a microphone icon does not help
					    anyone read a count, and a row of coloured badge circles reads
					    as the stock SaaS "trusted by" strip rather than as this site's
					    own grammar. `variant="rule"` is that grammar, so this band now
					    matches the ledger it is meant to be rather than sitting apart
					    from it as the one page element in a different style.

					    Five are real: four the page already stood behind, plus "Media
					    outlets", which is simply a count of the mastheads rendered in
					    the strip directly below this band - so it cannot drift from
					    what the page shows.

					    ⚠️ "Sessions" is a PLACEHOLDER. There is no source behind 250
					    anywhere in this project; it exists because the row was asked to
					    be six wide and nothing verifiable was left to fill it. It reads
					    as a factual claim on a real person's site, so replace it with
					    the true figure - or cut it back to five - before this ships. */}
					<StatIndex
						size="md"
						start={revealed}
						className="grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-6 lg:gap-x-8"
						items={[
							{ value: 41, suffix: "K+", label: "Students" },
							{ value: 162, label: "Countries" },
							{ value: 7, suffix: "+", label: "Years" },
							{ value: 30, suffix: "+", label: "Agencies" },
							{ value: 11, label: "Media outlets" },
							{ value: 250, suffix: "+", label: "Sessions" },
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

			<BookSection />

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
					// Attribution note: the book model is "Stylized Book" by Kevin on
					// Sketchfab (https://sketchfab.com/3d-models/stylized-book-dfe34d6fe2404c67a70c3703bff3ba69),
					// licensed CC BY 4.0.
					headingLines={["Gautam Kumawat"]}
					// The wordmark is drawn through ShinyText's shine sweep instead
					// of the footer's own per-character unmask. `headingLines` stays
					// for the accessible name and as the fallback path.
					headingSlot={
						<ClientOnly fallback={FOOTER_NAME_FALLBACK}>
							<Suspense fallback={FOOTER_NAME_FALLBACK}>
								<ShinyText
									text="GAUTAM KUMAWAT"
									speed={2.2}
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
