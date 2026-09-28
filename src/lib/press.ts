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
 * Nine outlets. Logos are sourced from Wikimedia Commons (public domain /
 * freely-licensed uploads), for Thrive its own site CDN, and for Dainik
 * Jagran a file supplied directly - flattened on white, so its ground was
 * keyed out to transparency to sit on the paper band without a box.
 *
 * Republic TV, Zee News and ABP News were taken off and Dainik Jagran added.
 * Their logo files are still in public/logos/, referenced by nothing, so they
 * can come back without a re-download.
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
		name: "Dainik Jagran",
		src: "/logos/dainik-jagran.png",
		// A stacked mark - the sun above, the wordmark below - so the wordmark is
		// only the lower third of the box. Taller than the wordmark-only entries
		// so the name reads at about their weight rather than the sun doing it.
		size: "h-10 sm:h-12",
	},
	{
		name: "Thriveglobal",
		src: "/logos/thriveglobal.svg",
		mono: true,
		size: "h-6 sm:h-7",
	},
];
