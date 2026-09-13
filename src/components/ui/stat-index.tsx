"use client";

import StatsCounter from "#/components/ui/stats-counter";
import { cn } from "#/lib/utils";

/**
 * The figure index, in two forms.
 *
 * `rule` is the broadcast form: each figure under its own hairline, condensed
 * Archivo with tabular numerals, label beneath. The rules align across the
 * grid so the block reads as one index rather than as separate tiles, and
 * because the rule belongs to each cell rather than sitting between cells, it
 * survives any wrap without stranding a divider at the end of a row.
 *
 * `chip` is the icon form - a glyph above each figure, ringed in the same
 * rotating-chrome border `LiquidMetalButton` renders as a fill (see
 * `.liquid-metal-ring` in styles.css). This file originally argued against a
 * flat tinted badge here: big number, small label, accent tint is the
 * hero-metric template, and a coloured circle reads as the stock SaaS
 * "trusted by" strip. Chrome rather than a colour wash is the site's own
 * grammar instead of a borrowed one, which is what earns the glyph its place.
 *
 * No accent on the suffixes in either form. "One accent, used with intent" -
 * a blue plus sign on every figure is everything highlighted, which is
 * nothing highlighted.
 */

export interface StatEntry {
	value: number;
	/** "K+", "+", "" - set at a lighter weight beside the figure. */
	suffix?: string;
	label: string;
	/** Only drawn by the `chip` variant. Decorative: the label carries meaning. */
	icon?: React.ComponentType<{ className?: string }>;
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
	variant = "rule",
	accent,
	/** Held until true, for figures that sit behind the intro overlay. */
	start = true,
}: {
	items: StatEntry[];
	tone?: Tone;
	size?: "md" | "lg";
	className?: string;
	variant?: "rule" | "chip";
	/** Chip glyph colour. The chip itself is a wash of the same value. */
	accent?: string;
	start?: boolean;
}) {
	const t = TONE[tone];
	const big = size === "lg";

	if (variant === "chip") {
		const glyph = accent ?? t.figure;
		return (
			<dl className={cn("grid", className)}>
				{items.map(({ value, suffix, label, icon: Icon }) => (
					<div
						key={label + value}
						className="flex flex-col items-center text-center"
					>
						{Icon ? (
							<span
								aria-hidden="true"
								className="liquid-metal-ring mb-4 h-11 w-11 sm:h-12 sm:w-12"
							>
								<span className="liquid-metal-ring__fill">
									<Icon
										className="h-[18px] w-[18px] sm:h-5 sm:w-5"
										style={{ color: glyph }}
									/>
								</span>
							</span>
						) : null}
						<dt
							className="display-tight tnum text-[clamp(1.5rem,2.6vw,2.15rem)]"
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
							className="mt-1.5 text-[0.78rem] font-medium"
							style={{ color: t.label }}
						>
							{label}
						</dd>
					</div>
				))}
			</dl>
		);
	}

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
