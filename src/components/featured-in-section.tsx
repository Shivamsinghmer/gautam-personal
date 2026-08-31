import { ScrollBasedVelocity } from "#/components/ui/scroll-based-velocity";
import { HERO_DEEP } from "#/lib/palette";
import { cn } from "#/lib/utils";

interface Press {
	name: string;
	src: string;
	/** Wikimedia/press-kit logos each arrive in their own ink (black, red,
	 * blue…). Forced to a flat white silhouette via `brightness-0 invert` so
	 * the strip reads as one system instead of a clash of outlet colours.
	 * Thrive's own asset is already a light wordmark, so it's left alone. */
	mono?: boolean;
	/**
	 * A logo drawn as a filled tile with its mark knocked out in white, rather
	 * than a mark on transparency. `brightness-0 invert` destroys these - every
	 * filled pixel goes white, so the tile becomes a solid block and swallows
	 * the mark. Desaturated instead: the tile drops to grey, the knocked-out
	 * mark stays white.
	 */
	tile?: boolean;
	/**
	 * Height, per logo. A single fixed box cannot serve both a wide wordmark and
	 * a near-square tile - matched on height, wordmarks read tiny; matched on
	 * width, tiles tower. These are set so each mark reads at about the same
	 * optical weight.
	 */
	size: string;
}

/** Same outlets already named in the About copy, plus five national news
 * channels. Logos are sourced from Wikimedia Commons (public domain /
 * freely-licensed uploads) and, for Thrive, its own site CDN. */
const PRESS: Press[] = [
	{
		name: "Hindustan Times",
		src: "/logos/hindustan-times.svg",
		mono: true,
		size: "h-5 sm:h-6",
	},
	{
		name: "India Today",
		src: "/logos/india-today.png",
		mono: true,
		size: "h-8 sm:h-10",
	},
	{
		name: "The Hindu",
		src: "/logos/the-hindu.svg",
		mono: true,
		size: "h-5 sm:h-7",
	},
	{
		name: "Times of India",
		src: "/logos/times-of-india.svg",
		mono: true,
		size: "h-4 sm:h-5",
	},
	{
		name: "Economic Times",
		src: "/logos/economic-times.svg",
		mono: true,
		size: "h-5 sm:h-6",
	},
	{ name: "Thriveglobal", src: "/logos/thriveglobal.svg", size: "h-5 sm:h-6" },
	{ name: "NDTV", src: "/logos/ndtv.svg", mono: true, size: "h-5 sm:h-7" },
	{
		name: "Times Now",
		src: "/logos/times-now.svg",
		tile: true,
		size: "h-7 sm:h-9",
	},
	{
		name: "Republic TV",
		src: "/logos/republic-tv.svg",
		tile: true,
		size: "h-9 sm:h-11",
	},
	{
		name: "Zee News",
		src: "/logos/zee-news.svg",
		mono: true,
		size: "h-6 sm:h-8",
	},
	{
		name: "ABP News",
		src: "/logos/abp-news.svg",
		mono: true,
		size: "h-8 sm:h-10",
	},
];
export function FeaturedInSection() {
	return (
		<section
			className="relative overflow-hidden py-16 sm:py-20"
			style={{ backgroundColor: HERO_DEEP }}
		>
			<p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
				As featured in
			</p>

			{/* Masked so logos fade at the edges instead of clipping mid-mark. */}
			<div className="relative mt-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
				<ScrollBasedVelocity
					rows={2}
					defaultVelocity={1}
					className="items-center"
				>
					{PRESS.map((press) => (
						<img
							key={press.name}
							src={press.src}
							alt={press.name}
							className={cn(
								// Height per logo, width free. The previous fixed h-8 w-20
								// box squeezed every wordmark into the same 80px, which made
								// the wide ones (Times of India, Economic Times) render as
								// slivers while the square marks filled the box.
								"w-auto max-w-[180px] shrink-0 object-contain opacity-70 transition-opacity hover:opacity-100",
								press.size,
								press.mono && "brightness-0 invert",
								press.tile && "rounded-[3px] grayscale",
							)}
						/>
					))}
				</ScrollBasedVelocity>
			</div>
		</section>
	);
}
