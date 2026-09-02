"use client";

import StatsCounter from "#/components/ui/stats-counter";
import { cn } from "#/lib/utils";

/**
 * The ruled figure index.
 *
 * What it replaced: a row of circular icon chips, each with a number and a
 * label under it. That shape - big number, small label, supporting stats, an
 * accent tint - is the hero-metric template, and it appeared twice on this
 * page. It also put a lucide glyph beside every figure, which adds nothing: a
 * shield icon does not help anyone read "500 cases".
 *
 * This is the broadcast alternative. Each figure sits under its own hairline,
 * set in condensed Archivo with tabular numerals, label beneath in Manrope.
 * The rules align across the grid, so the block reads as one index rather than
 * as six tiles - and because the rule belongs to each cell rather than sitting
 * between cells, it survives any wrap without stranding a divider at the end
 * of a row.
 *
 * No accent on the suffixes. "One accent, used with intent" - six blue plus
 * signs is everything highlighted, which is nothing highlighted.
 */

export interface StatEntry {
	value: number;
	/** "K+", "+", "" - set at a lighter weight beside the figure. */
	suffix?: string;
	label: string;
}

type Tone = "ink" | "signal";

const TONE: Record<Tone, { rule: string; figure: string; label: string }> = {
	ink: {
		rule: "rgb(255 255 255 / 0.16)",
		figure: "#ffffff",
		label: "rgb(255 255 255 / 0.55)",
	},
	// On the signal field, secondary type floors at 92% white. White at the
	// usual /55 composites to 3.5:1 over this blue and fails AA outright; see
	// the contrast note in lib/palette.ts.
	signal: {
		rule: "rgb(255 255 255 / 0.34)",
		figure: "#ffffff",
		label: "rgb(255 255 255 / 0.92)",
	},
};

export function StatIndex({
	items,
	tone = "ink",
	size = "md",
	className,
	/** Held until true, for figures that sit behind the intro overlay. */
	start = true,
}: {
	items: StatEntry[];
	tone?: Tone;
	size?: "md" | "lg";
	className?: string;
	start?: boolean;
}) {
	const t = TONE[tone];
	const big = size === "lg";

	return (
		<dl className={cn("grid", className)}>
			{items.map(({ value, suffix, label }) => (
				<div
					key={label + value}
					className={cn("border-t", big ? "pt-5 sm:pt-6" : "pt-4")}
					style={{ borderColor: t.rule }}
				>
					<dt
						className={cn(
							"display-tight tnum",
							big
								? "text-[clamp(2.6rem,5.4vw,4.75rem)]"
								: "text-[clamp(1.75rem,3.1vw,2.6rem)]",
						)}
						style={{ color: t.figure }}
					>
						<StatsCounter value={value} duration={1.6} start={start} />
						{suffix ? (
							<span style={{ fontVariationSettings: "'wght' 500" }}>
								{suffix}
							</span>
						) : null}
					</dt>
					<dd
						className={cn(
							"mt-2 font-medium uppercase",
							big ? "text-xs sm:text-[0.8rem]" : "text-[0.68rem]",
						)}
						style={{ color: t.label, letterSpacing: "0.12em" }}
					>
						{label}
					</dd>
				</div>
			))}
		</dl>
	);
}
