/** The hero's own palette (routes/index.tsx), shared so other sections can match it exactly. */
export const HERO_DEEP = "#001219";
export const HERO_TEAL = "#005f73";
export const HERO_MINT = "#94d2bd";
export const HERO_SAND = "#e9d8a6";

/** The shader-gradient background's blue palette (shader-gradient-background.tsx). */
export const SHADER_BLUE_DEEP = "#0a3e8c";
export const SHADER_BLUE_INK = "#142241";
export const SHADER_BLUE_BRIGHT = "#0953ff";

/**
 * The page's three stages.
 *
 * The site used to run every section on `HERO_DEEP`, which is what made a long
 * scroll read as one endless band rather than as a composition. It now cuts
 * between three grounds, and each cut is a deliberate beat:
 *
 * - `INK` — the default room. Hero, about, journey, the rooms, the book, the ask.
 * - `PAPER` — one hard cut to daylight, for the press wall. Mastheads belong on
 *   white; that is where they actually live, and knocking them all back to
 *   white silhouettes on black was hiding the evidence rather than presenting it.
 * - `SIGNAL` — the accent used as a surface for exactly one section, so the blue
 *   finally acts as a colour instead of as a garnish on buttons.
 *
 * Contrast, verified rather than assumed: `SIGNAL` has a relative luminance of
 * 0.135, so pure white on it is 5.7:1 and clears AA for body text - but white
 * at 70% opacity composites to 3.5:1 and does not. Secondary copy on the blue
 * field therefore floors at 90% white (4.9:1), never the usual `/60` or `/70`.
 */
export const INK = HERO_DEEP;
/** One step up from `INK`, for the rare panel that has to separate from it. */
export const INK_RAISE = "#04202a";
/** Below `INK`, for the shade under type over photography. */
export const INK_DEEP = "#000a0e";
export const SIGNAL = SHADER_BLUE_BRIGHT;

/**
 * Paper, and the ink that sits on it. Kept in sync with the `--paper` /
 * `--paper-ink` custom properties in styles.css - these exist so a section can
 * set the ground from an inline style the way every other section here sets
 * `backgroundColor`, without a second source of truth for the value.
 *
 * A true off-white at 0.006 chroma, tilted toward the signal's hue rather than
 * toward warmth: the warm near-white band is the cream default this brand's
 * anti-references rule out.
 */
export const PAPER = "oklch(0.965 0.006 264)";
export const PAPER_INK = "oklch(0.235 0.024 250)";
export const PAPER_INK_SOFT = "oklch(0.44 0.02 250)";
