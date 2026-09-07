/**
 * The outlets that have covered him, and how each mark should be drawn.
 *
 * Lifted out of the press wall so the booking section can show the same list
 * without a second copy going stale beside it. One list, two placements.
 */

export interface Press {
	name: string;
	src: string;
	/** A mark on transparency: can be flattened to a single ink. */
	mono?: boolean;
	/** A filled tile with the mark knocked out of it: never flattened. */
	tile?: boolean;
	/**
	 * Height, per logo. A single fixed box cannot serve both a wide wordmark
	 * and a near-square tile - matched on height, wordmarks read tiny; matched
	 * on width, tiles tower. These are set so each mark carries about the same
	 * optical weight.
	 */
	size: string;
}

/**
 * Eleven outlets. Logos are sourced from Wikimedia Commons (public domain /
 * freely-licensed uploads) and, for Thrive, its own site CDN.
 */
export const PRESS: Press[] = [
	{
		name: "Hindustan Times",
		src: "/logos/hindustan-times.svg",
		mono: true,
		size: "h-6 sm:h-7",
	},
	{
		name: "India Today",
		src: "/logos/india-today.png",
		mono: true,
		size: "h-9 sm:h-11",
	},
	{
		name: "The Hindu",
		src: "/logos/the-hindu.svg",
		mono: true,
		size: "h-6 sm:h-8",
	},
	{
		name: "Times of India",
		src: "/logos/times-of-india.svg",
		mono: true,
		size: "h-5 sm:h-6",
	},
	{
		name: "Economic Times",
		src: "/logos/economic-times.svg",
		mono: true,
		size: "h-6 sm:h-7",
	},
	{
		name: "NDTV",
		src: "/logos/ndtv.svg",
		mono: true,
		size: "h-6 sm:h-8",
	},
	{
		name: "Times Now",
		src: "/logos/times-now.svg",
		tile: true,
		size: "h-8 sm:h-10",
	},
	{
		name: "Republic TV",
		src: "/logos/republic-tv.svg",
		tile: true,
		size: "h-10 sm:h-12",
	},
	{
		name: "Zee News",
		src: "/logos/zee-news.svg",
		mono: true,
		size: "h-7 sm:h-9",
	},
	{
		name: "ABP News",
		src: "/logos/abp-news.svg",
		mono: true,
		size: "h-9 sm:h-11",
	},
	{
		name: "Thriveglobal",
		src: "/logos/thriveglobal.svg",
		mono: true,
		size: "h-6 sm:h-7",
	},
];
