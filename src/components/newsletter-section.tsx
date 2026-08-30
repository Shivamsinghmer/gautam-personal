import {
	Grid2x2,
	HeartHandshake,
	Instagram,
	Linkedin,
	Radio,
	Star,
	Twitter,
} from "lucide-react";
import { GradientBars } from "#/components/gradient-bars";
import {
	HERO_DEEP,
	SHADER_BLUE_BRIGHT,
	SHADER_BLUE_DEEP,
	SHADER_BLUE_INK,
} from "#/lib/palette";

const FEATURES = [
	{
		icon: Radio,
		title: "Priority Support",
		description: "Fast-tracked assistance for early adopters.",
	},
	{
		icon: Grid2x2,
		title: "Exclusive Features",
		description: "Access advanced features before others.",
	},
	{
		icon: Star,
		title: "Beta Access",
		description: "Be among the first to test new features.",
	},
	{
		icon: HeartHandshake,
		title: "Personalized Assistance",
		description: "Tailored guidance and support from our team.",
	},
];

const SOCIALS = [
	{ icon: Twitter, label: "X", href: "#" },
	{ icon: Instagram, label: "Instagram", href: "#" },
	{ icon: Linkedin, label: "LinkedIn", href: "#" },
];

export function NewsletterSection() {
	return (
		<section
			className="relative isolate overflow-hidden px-6 py-24 sm:px-10"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* A finer comb of shorter bars: more of them so the row reads as a
			    texture rather than as counted columns, and capped well below full
			    height so they sit under the copy instead of framing it. The scale
			    curve is a valley - shortest at the centre, tallest at the edges -
			    so lowering maxScale is what takes the height out of the edges. */}
			<GradientBars
				animation="wave"
				duration={2}
				numBars={25}
				minScale={0.05}
				maxScale={0.75}
				delayStep={0.04}
				colors={[SHADER_BLUE_DEEP, SHADER_BLUE_INK, SHADER_BLUE_BRIGHT]}
				className="-z-20 opacity-90"
			/>
			{/* The other half of the hand-off. The hero fades down to DEEP; this
			    starts on DEEP and clears, so the bars rise out of the same colour
			    the hero ended on instead of beginning at full strength against a
			    hard edge. Alpha-zero DEEP again, not `transparent`. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30vh]"
				style={{
					background: `linear-gradient(to bottom, ${HERO_DEEP} 0%, ${HERO_DEEP}b3 42%, ${HERO_DEEP}00 100%)`,
				}}
			/>

			{/* Scrim keeps the copy readable over the bars, built from the hero's
			    own deep tone (hex + alpha suffix) so the hand-off reads as one field. */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10"
				style={{
					background: `linear-gradient(180deg, ${HERO_DEEP}1a 0%, ${HERO_DEEP}80 55%, ${HERO_DEEP}d9 100%)`,
				}}
			/>
			{/* Grain: SVG feTurbulence noise, overlay-blended to texture the field
			    and break up banding across the bars/scrim. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-0 opacity-25 mix-blend-overlay"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: "180px 180px",
				}}
			/>

			<div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
				<h2 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
					Be the First to get update by Joining Our{" "}
					<em className="font-serif italic font-thin text-white/90">
						Waitlist!
					</em>
				</h2>

				<div className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{FEATURES.map(({ icon: Icon, title, description }) => (
						<div
							key={title}
							className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-sm"
						>
							<span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-blue-400">
								<Icon
									className="h-4 w-4"
									fill="currentColor"
									aria-hidden="true"
								/>
							</span>
							<h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
							<p className="mt-1 text-sm text-white/50">{description}</p>
						</div>
					))}
				</div>

				<p className="mt-14 text-sm text-white/70">
					Get notified on the Release
				</p>

				<form
					className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row"
					onSubmit={(event) => event.preventDefault()}
				>
					<label className="sr-only" htmlFor="newsletter-email">
						Email address
					</label>
					<input
						id="newsletter-email"
						type="email"
						required
						placeholder="Enter Your Email"
						className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
					/>
					<button
						type="submit"
						className="h-11 shrink-0 rounded-lg bg-white px-6 text-sm font-medium text-black transition-colors hover:bg-white/90"
					>
						Join Waitlist
					</button>
				</form>

				<div className="mt-8 flex items-center gap-3">
					{SOCIALS.map(({ icon: Icon, label, href }) => (
						<a
							key={label}
							href={href}
							aria-label={label}
							className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10"
							style={{ color: "#ffffff" }}
						>
							<Icon
								className="h-4 w-4"
								fill="currentColor"
								aria-hidden="true"
							/>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
