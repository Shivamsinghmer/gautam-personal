import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatedFooter } from "#/components/animated-footer";
import { BookingCards } from "#/components/booking-cards";
import { NewsletterSection } from "#/components/newsletter-section";
import { ShaderGradientBackground } from "#/components/shader-gradient-background";
import {
	HERO_DEEP as DEEP,
	HERO_MINT as MINT,
	HERO_SAND as SAND,
	SHADER_BLUE_BRIGHT,
	HERO_TEAL as TEAL,
} from "#/lib/palette";

export const Route = createFileRoute("/")({ component: Home });

/** Copy tints, chosen against the shader's brightest moment (see below). */
const TYPE = "#f4fbf8";
const TYPE_SOFT = "#d8efe7";
const TYPE_DIM = "#c3e2d9";

function Home() {
	// The canvas is swapped in on the client only. Server-rendered markup keeps
	// the still gradient, which is also what anyone asking for reduced motion
	// keeps: the shader drifts continuously and has no resting frame to hold.
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
				className="relative isolate flex min-h-screen items-center overflow-hidden px-6 sm:px-10"
				style={{ backgroundColor: DEEP }}
			>
				{/* Painted first so there is never a bare panel: the gradient holds the
				    frame before WebGL has a context, and stays the whole picture where
				    WebGL is unavailable or motion is unwelcome. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-20"
					style={{
						background: `radial-gradient(120% 90% at 18% 12%, ${TEAL} 0%, transparent 55%),
							radial-gradient(90% 70% at 82% 78%, ${MINT}55 0%, transparent 60%),
							radial-gradient(70% 60% at 62% 22%, ${SAND}33 0%, transparent 65%),
							${DEEP}`,
					}}
				/>

				{motion ? (
					<ShaderGradientBackground className="absolute inset-0 -z-10 h-full w-full" />
				) : null}

				{/* An even veil, not a directional wipe. The previous scrim ramped from
				    95% opaque on the left to 10% on the right, which is why the
				    gradient only survived down the right-hand edge - it was fitted
				    for the old mesh shader, whose palette carried mint and sand and
				    genuinely needed that much shading. This shader's palette is all
				    dark blue (#0a3e8c, #142241, #0953ff); its brightest colour has a
				    relative luminance of 0.135, so a flat 30% veil is enough. Over
				    that brightest lobe the headline still measures 9.2:1 and the body
				    copy 7.7:1 - both well clear of AA - while the gradient now reads
				    across the whole hero. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10"
					style={{ backgroundColor: `${DEEP}4d` }}
				/>

				{/* A soft pool of shade under the copy only, so the left column keeps
				    a little extra separation without draining the field around it. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10"
					style={{
						background: `radial-gradient(70% 80% at 26% 52%, ${DEEP}b3 0%, ${DEEP}66 45%, ${DEEP}00 78%)`,
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
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[26vh]"
					style={{
						backdropFilter: "blur(14px)",
						WebkitBackdropFilter: "blur(14px)",
						maskImage: "linear-gradient(to bottom, #0000 0%, #000 65%)",
						WebkitMaskImage: "linear-gradient(to bottom, #0000 0%, #000 65%)",
					}}
				/>

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

				<div className="relative mx-auto w-full max-w-5xl py-24">
					<p
						className="gk-reveal text-xs font-semibold uppercase tracking-[0.28em]"
						style={{ color: SAND, ["--gk-delay" as string]: "0.05s" }}
					>
						Portfolio
					</p>

					<h1
						className="gk-reveal mt-6 max-w-3xl text-5xl font-bold leading-[1.03] sm:text-7xl"
						style={{ color: TYPE, ["--gk-delay" as string]: "0.14s" }}
					>
						Gautam Kumawat
					</h1>

					<p
						className="gk-reveal mt-7 max-w-xl text-lg leading-relaxed"
						style={{ color: TYPE_SOFT, ["--gk-delay" as string]: "0.22s" }}
					>
						The signature writes itself in the middle of the page, then floods
						the frame with its own ink — and the colour it settles on is the
						deepest note of this field, so there is no curtain to lift.
					</p>

					<p
						className="gk-reveal mt-12 text-sm"
						style={{ color: TYPE_DIM, ["--gk-delay" as string]: "0.3s" }}
					>
						Add <code>?replay</code> to the URL to watch it again.
					</p>
				</div>
			</section>

			<NewsletterSection />

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
			{/* Exactly one screen. The art band is flex-1, so it simply takes
			    whatever height is left after the cards and the wordmark - which is
			    also why the hands get smaller here than they were at 1100px. No
			    min-height: on a short viewport the art should shrink rather than
			    push the footer into a second screen. */}
			<div className="h-screen w-full">
				<AnimatedFooter
					headingLines={["Gautam Kumawat"]}
					leftImage="/hand-left.jpg"
					rightImage="/hand-right.jpg"
					background={DEEP}
					textColor="#ffffff"
					charColor={TEAL}
					hoverColor={SHADER_BLUE_BRIGHT}
					hoverCharColor={DEEP}
				>
					<div className="mx-auto w-full max-w-3xl">
						<BookingCards />
					</div>
				</AnimatedFooter>
			</div>
		</main>
	);
}
