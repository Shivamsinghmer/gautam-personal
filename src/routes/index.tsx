import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, PhoneCall } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { AboutSection } from "#/components/about-section";
import { AnimatedFooter } from "#/components/animated-footer";
import { BookSection } from "#/components/book-section";
import { BookingSection } from "#/components/booking-section";
import { CollageSection } from "#/components/collage-section";
import { FeaturedInSection } from "#/components/featured-in-section";
import { JourneySection } from "#/components/journey-section";
import { ReachSection } from "#/components/reach-section";
import { SocialLinks } from "#/components/social-links";
import { TestimonialsSection } from "#/components/testimonials-section";
import { AsciiEffect } from "#/components/ui/ascii-effect";
import { ClientOnly } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { StatIndex } from "#/components/ui/stat-index";
import {
	HERO_DEEP as DEEP,
	HERO_SAND as SAND,
	SHADER_BLUE_BRIGHT,
	SHADER_BLUE_DEEP,
	SHADER_BLUE_INK,
	HERO_TEAL as TEAL,
} from "#/lib/palette";
import { usePreloaderDone } from "#/lib/use-preloader-done";

/**
 * The page's two WebGL surfaces, each in its own chunk.
 *
 * Both are decoration over markup that already stands on its own - the hero
 * keeps its painted gradient, the footer wordmark keeps real text - so
 * deferring them costs nothing and takes @shadergradient/react, three.js and
 * ogl out of the bundle that has to parse before the page is interactive.
 */
const ShaderGradientBackground = lazy(() =>
	import("#/components/shader-gradient-background").then((m) => ({
		default: m.ShaderGradientBackground,
	})),
);

const WarpText = lazy(() =>
	import("#/components/ui/warp-text").then((m) => ({ default: m.WarpText })),
);

export const Route = createFileRoute("/")({ component: Home });

/** Copy tints, chosen against the shader's brightest moment (see below). */
const TYPE = "#f4fbf8";
const TYPE_SOFT = "#d8efe7";

/**
 * The wordmark as plain type. This is what the server renders and what stands
 * in until ogl arrives, so the footer is never headless.
 */
const FOOTER_NAME_FALLBACK = (
	<span
		className="flex w-full items-center justify-center text-center font-extrabold tracking-[-0.04em]"
		style={{
			color: TYPE,
			fontSize: "clamp(2.4rem, 12vw, 9rem)",
			height: "clamp(120px, 22vw, 320px)",
			lineHeight: 0.9,
		}}
	>
		Gautam Kumawat
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

	const [motion, setMotion] = useState(false);
	useEffect(() => {
		const q = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setMotion(!q.matches);
		sync();
		q.addEventListener("change", sync);
		return () => q.removeEventListener("change", sync);
	}, []);

	return (
		<main>
			<section
				className="relative isolate flex min-h-screen items-center overflow-hidden px-6 sm:px-10 lg:min-h-screen"
				style={{ backgroundColor: DEEP }}
			>
				{/* Painted first so there is never a bare panel: the gradient holds the
				    frame before WebGL has a context, and stays the whole picture where
				    WebGL is unavailable or motion is unwelcome.

				    Built from the shader's own three blues. It used to be teal, mint
				    and sand - the site's older palette - which was fine as long as
				    you never saw it. But the canvas is unmounted once the hero is a
				    screen behind you, so jumping straight back to the top from the
				    footer showed this layer bare for the moment before WebGL had a
				    context again: the hero flashed green. Same colours as the
				    shader, and the swap stops being visible. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-20"
					style={{
						background: `radial-gradient(120% 90% at 18% 12%, ${SHADER_BLUE_DEEP} 0%, transparent 58%),
							radial-gradient(95% 75% at 84% 74%, ${SHADER_BLUE_BRIGHT}40 0%, transparent 62%),
							radial-gradient(80% 65% at 60% 20%, ${SHADER_BLUE_INK}cc 0%, transparent 68%),
							${DEEP}`,
					}}
				/>

				{motion ? (
					<ClientOnly>
						<Suspense fallback={null}>
							<ShaderGradientBackground className="absolute inset-0 -z-10 h-full w-full" />
						</Suspense>
					</ClientOnly>
				) : null}

				{/* An even veil, not a directional wipe. This shader's palette is all
				    dark blue (#0a3e8c, #142241, #0953ff) and its brightest colour has
				    a relative luminance of only 0.135, so the veil can be light and
				    still leave a wide contrast margin. Pulled back from 30% to 16% so
				    the gradient reads as a lit field rather than something behind
				    frosted glass; the copy keeps its own pool of shade below. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10"
					style={{ backgroundColor: `${DEEP}29` }}
				/>

				{/* Bloom. Screen-blended so it adds light instead of painting over
				    the shader, and placed in the two corners the copy does not use -
				    top right, where the streak already runs, and bottom left. This
				    is the glow the flat veil used to flatten out. */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10"
					style={{
						mixBlendMode: "screen",
						background: `radial-gradient(46% 52% at 88% 8%, ${SHADER_BLUE_BRIGHT}59 0%, ${SHADER_BLUE_BRIGHT}1a 42%, transparent 72%),
							radial-gradient(58% 46% at 72% 96%, ${SHADER_BLUE_BRIGHT}3d 0%, transparent 70%),
							radial-gradient(40% 44% at 4% 88%, ${TEAL}47 0%, transparent 72%)`,
					}}
				/>

				{/* A soft pool of shade under the copy only, so the left column keeps
				    a little extra separation without draining the field around it. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10"
					style={{
						background: `radial-gradient(64% 76% at 26% 52%, ${DEEP}a6 0%, ${DEEP}54 45%, ${DEEP}00 76%)`,
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
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34vh]"
					style={{
						background: `linear-gradient(to bottom, ${DEEP}00 0%, ${DEEP}59 40%, ${DEEP}bf 72%, ${DEEP} 100%)`,
					}}
				/>

				{/* Copy left, portrait right, in the shape of the reference: a ruled
				    eyebrow, a three-line headline that drops one line to grey, a
				    subline with the facts bolded out of it, a filled primary next to
				    a quiet text link, and a stat row along the bottom. */}
				<div className="relative mx-auto grid w-full max-w-6xl items-center gap-5 pt-20 pb-8 sm:gap-10 sm:pt-28 sm:pb-16 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-14 lg:py-0">
					<div className="order-2 lg:order-1">
						<p
							className="gk-reveal flex items-center gap-4 text-[0.7rem] font-semibold uppercase sm:text-xs"
							style={{
								color: SAND,
								letterSpacing: "0.2em",
								["--gk-delay" as string]: "0.05s",
							}}
						>
							<span
								aria-hidden="true"
								className="h-px w-8 shrink-0"
								style={{ backgroundColor: SAND }}
							/>
							Cybercrime investigator · Trainer to law enforcement
						</p>

						{/* One line in grey rather than three in white - it gives the
						    block a middle and stops it reading as a wall. */}
						<h1
							className="gk-reveal display mt-[clamp(0.9rem,3.2vh,1.75rem)] max-w-[19ch] text-[clamp(1.95rem,min(5vw,8vh),3.5rem)]"
							style={{ color: TYPE, ["--gk-delay" as string]: "0.14s" }}
						>
							From law enforcement
							<br />
							<span style={{ color: "#8fa3a8" }}>to 41,000 students</span>
							<br />
							across 162 countries
						</h1>

						<p
							className="gk-reveal prose-measure mt-[clamp(0.9rem,3.2vh,1.75rem)] max-w-xl text-[0.95rem] leading-relaxed sm:text-lg"
							style={{ color: TYPE_SOFT, ["--gk-delay" as string]: "0.22s" }}
						>
							Seven years training officials across{" "}
							<strong className="font-semibold" style={{ color: TYPE }}>
								law enforcement agencies
							</strong>{" "}
							in India and the US. Now teaching{" "}
							<strong className="font-semibold" style={{ color: TYPE }}>
								ethical hacking and darknet investigation
							</strong>{" "}
							— from field practice, not theory.
						</p>

						<div
							className="gk-reveal mt-[clamp(1rem,3.4vh,2.25rem)] flex flex-wrap items-center gap-x-7 gap-y-4"
							style={{ ["--gk-delay" as string]: "0.3s" }}
						>
							<a
								href="#book"
								className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
								// Inline colour: styles.css carries an unlayered `a { color }`
								// rule that beats Tailwind's layered utilities.
								style={{
									backgroundColor: SHADER_BLUE_BRIGHT,
									color: "#ffffff",
								}}
							>
								<PhoneCall className="h-4 w-4" aria-hidden="true" />
								Book a Call
							</a>
							<a
								href="#about"
								className="group inline-flex min-h-11 items-center gap-2 py-2 text-sm font-medium transition-colors"
								style={{ color: TYPE_SOFT }}
							>
								Read the story
								<ArrowRight
									className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
									aria-hidden="true"
								/>
							</a>
						</div>

						{/* The figures, as a ruled index rather than the six circular icon
						    chips that were here. Big number, small label, supporting stats,
						    accent tint is the hero-metric template, and a lucide shield next
						    to "500 cases" was decoration standing in for information.

						    Four figures, not six. "750K community" was the sum of the channel
						    counts the reach section lists in full a few screens down, and
						    "500+ cases" was a stand-in with no source behind it - so the row
						    now carries only what the page can actually stand behind, at
						    roughly twice the size. Agencies survives over cases because the
						    institutional buyer is the audience that needs it.

						    Held until the preloader lifts - see use-preloader-done.ts - so
						    the figures tick over in front of the visitor rather than behind
						    the overlay. */}
						<div
							className="gk-reveal mt-[clamp(1.25rem,4.4vh,3rem)]"
							style={{ ["--gk-delay" as string]: "0.38s" }}
						>
							<StatIndex
								start={revealed}
								className="grid-cols-4 gap-x-3 gap-y-0 sm:gap-x-8"
								items={[
									{ value: 41, suffix: "K+", label: "Students" },
									{ value: 162, label: "Countries" },
									{ value: 7, suffix: "+", label: "Years" },
									{ value: 30, suffix: "+", label: "Agencies" },
								]}
							/>
						</div>
					</div>

					<div
						className="gk-reveal relative order-1 mx-auto aspect-square w-full max-w-[210px] overflow-hidden rounded-2xl border border-white/10 sm:max-w-[300px] lg:order-2 lg:mx-0 lg:aspect-auto lg:h-[min(560px,68vh)] lg:max-w-[460px]"
						style={{ ["--gk-delay" as string]: "0s" }}
					>
						<AsciiEffect
							variant="glitch"
							imageSrc="/gautam.png"
							alt="ASCII portrait of Gautam Kumawat"
							backgroundColor={DEEP}
							colors={[SHADER_BLUE_BRIGHT, TYPE]}
							fit="cover"
							fontSize={6}
							contrast={1.2}
							posterize={48}
							glitchIntensity={0.65}
							glitchFrequency={1.4}
							revealDuration={1400}
							className="size-full"
						/>
					</div>
				</div>
			</section>

			<AboutSection />

			<JourneySection />

			<FeaturedInSection />

			<ReachSection />

			<CollageSection />

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
			<div id="connect" className="h-screen w-full scroll-mt-0">
				<AnimatedFooter
					// The slot renders directly above the wordmark, so the profiles and
					// the name read as one sign-off block rather than a separate strip.
					// Attribution note: the book model is "Stylized Book" by Kevin on
					// Sketchfab (https://sketchfab.com/3d-models/stylized-book-dfe34d6fe2404c67a70c3703bff3ba69),
					// licensed CC BY 4.0.
					headingLines={["Gautam Kumawat"]}
					// The wordmark is drawn through WarpText's glass shader instead of
					// the footer's own per-character unmask. `headingLines` stays for
					// the accessible name and as the fallback path.
					headingSlot={
						<ClientOnly fallback={FOOTER_NAME_FALLBACK}>
							<Suspense fallback={FOOTER_NAME_FALLBACK}>
								<WarpText
									text="Gautam Kumawat"
									// Manrope is the site's own face; the component's default
									// "inherit" would pick up whatever the footer sets, and the
									// example's monospace is not this brand's voice.
									fontFamily="Manrope, ui-sans-serif, system-ui, sans-serif"
									fontWeight={800}
									fontSize="clamp(2.4rem, 12vw, 9rem)"
									letterSpacing="-0.04em"
									color={TYPE}
									warpStrength={0.15}
									warpScale={2.5}
									speed={0.95}
									pointerInfluence={0.66}
									pointerStrength={0.71}
									refraction={0.045}
									// The ambient warp is already the effect; a ripple chasing the
									// cursor on top of it is the fidget PRODUCT.md rules out.
									ripple={false}
									className="pointer-events-auto min-h-0"
									style={{ height: "clamp(120px, 22vw, 320px)" }}
								/>
							</Suspense>
						</ClientOnly>
					}
					leftImage="/hand-left.jpg"
					rightImage="/hand-right.jpg"
					background={DEEP}
					textColor="#ffffff"
					charColor={TEAL}
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
