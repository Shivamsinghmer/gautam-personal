/**
 * The site's colours, expressed as the theme's own values.
 *
 * These names are historical - they were a teal/sand set before the theme
 * landed - but every section reads its ground from here, so remapping the
 * values is what actually applies the theme across the page rather than
 * touching fifteen components.
 *
 * They stay six-digit hex on purpose: call sites build translucent variants by
 * concatenating an alpha pair onto them (`${INK}99`, `${INK_DEEP}f2`), which
 * `oklch(...)` or `var(...)` would break.
 */
export const HERO_DEEP = "#171717";
export const HERO_TEAL = "#404040";
export const HERO_MINT = "#a1a1a1";
export const HERO_SAND = "#a1a1a1";

/** The shader-gradient background's blue palette (shader-gradient-background.tsx). */
export const SHADER_BLUE_DEEP = "#1a4eda";
export const SHADER_BLUE_INK = "#1f3fad";
export const SHADER_BLUE_BRIGHT = "#1447e6";

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
 * Contrast, re-measured after the theme swap rather than carried over: the new
 * `SIGNAL` has a relative luminance of 0.104 (the previous blue was 0.135), so
 * pure white on it is 6.83:1 - a little better than before. The rule it implies
 * is unchanged: white at 70% composites to 4.11:1 and still misses AA for body
 * text, so secondary copy on the blue field floors at 90% white (5.82:1), never
 * the usual `/60` or `/70`.
 */
export const INK = HERO_DEEP;
/** One step up from `INK`, for the rare panel that has to separate from it. */
export const INK_RAISE = "#262626";
/** Below `INK`, for the shade under type over photography. */
export const INK_DEEP = "#0e0e0e";
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
export const PAPER = "#fafafa";
export const PAPER_INK = "#171717";
export const PAPER_INK_SOFT = "#737373";
