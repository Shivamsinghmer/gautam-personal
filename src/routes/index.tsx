import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShaderBackground } from "#/components/shader-background";

export const Route = createFileRoute("/")({ component: Home });

/** The four colours the shader mixes, for the scrim and the still fallback. */
const DEEP = "#001219";
const TEAL = "#005f73";
const MINT = "#94d2bd";
const SAND = "#e9d8a6";
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
					<ShaderBackground className="absolute inset-0 -z-10 h-full w-full" />
				) : null}

				{/* The mesh drifts through mint and sand, so type laid straight on it
				    loses contrast every time a light lobe passes under it. This scrim
				    is keyed to the shader's own darkest colour and weighted to the
				    left where the copy sits; the stops were fitted by rendering the
				    shader across a 25s sweep and taking the brightest composite the
				    copy column ever sees. At these values the headline holds 7.2:1
				    and the body copy 6.3:1 at that worst moment - the first draft's
				    lighter scrim fell to 3.8:1 and 2.3:1. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10"
					style={{
						background: `linear-gradient(100deg, ${DEEP}f2 0%, ${DEEP}db 45%, ${DEEP}73 75%, ${DEEP}1a 100%)`,
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
		</main>
	);
}
