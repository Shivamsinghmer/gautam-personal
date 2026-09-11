import { ArrowUpRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { LiquidMetalButtonFallback } from "#/components/liquid-metal-button";
import { ClientOnly } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import {
	INK,
	INK_RAISE,
	PAPER,
	PAPER_INK,
	PAPER_INK_SOFT,
	SIGNAL,
} from "#/lib/palette";

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

const NOTIFY = "mailto:gautam.kumawat.kkb@gmail.com?subject=The%20book";

/**
 * The book, before it is a book.
 *
 * There is no title, no cover, no date — and inventing any of them would be
 * the exact guru move this brand rules out. So the section shows the honest
 * object instead: a working manuscript, mid-edit, with its title withheld.
 * The redaction bars are the site's own language (an investigator's case
 * file), not decoration, and the stamp carries the unlaunched status so no
 * eyebrow kicker or "in progress" slug line has to.
 *
 * One decisive artifact on the dark field — the page's single cut to
 * daylight in this band — with the copy beside it kept to three things: what
 * it is, when you'll hear, and the one action. The generic 3D book model is
 * gone on purpose: a placeholder object spinning under a spotlight read as a
 * section that hadn't loaded its real asset yet, and three.js is the heaviest
 * import on the page.
 */
const MANUSCRIPT_ROWS: { id: string; width: string; marked?: boolean }[] = [
	{ id: "row-1", width: "100%" },
	{ id: "row-2", width: "94%" },
	{ id: "row-3", width: "100%", marked: true },
	{ id: "row-4", width: "88%" },
	{ id: "row-5", width: "66%" },
];

function Manuscript() {
	return (
		<div
			aria-hidden="true"
			className="relative mx-auto w-full max-w-[20rem] select-none"
			style={{ perspective: "1400px" }}
		>
			{/* Floor light and contact shadow, so the stack sits on ground. */}
			<div
				className="pointer-events-none absolute -inset-x-10 -bottom-12 h-40"
				style={{
					background:
						"radial-gradient(50% 100% at 50% 100%, rgb(255 255 255 / 0.1) 0%, rgb(255 255 255 / 0.03) 45%, rgb(255 255 255 / 0) 75%)",
				}}
			/>
			<div className="pointer-events-none absolute inset-x-6 -bottom-4 h-10 bg-black/60 blur-2xl" />

			<div
				className="relative"
				style={{ transform: "rotateY(-8deg) rotateX(2deg)" }}
			>
				{/* The sheet beneath: one corner showing is enough to read a stack. */}
				<div
					className="absolute inset-0 translate-x-4 translate-y-3 rotate-[2.5deg] rounded-[3px] border border-white/10"
					style={{ backgroundColor: INK_RAISE }}
				/>

				{/* The working page. */}
				<div
					className="relative rounded-[3px] p-5 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] sm:p-6"
					style={{ backgroundColor: PAPER }}
				>
					<div className="flex items-baseline justify-between gap-4">
						<p
							className="text-[0.62rem] font-bold uppercase"
							style={{ color: PAPER_INK_SOFT, letterSpacing: "0.22em" }}
						>
							Working manuscript
						</p>
						<p
							className="text-[0.62rem] font-bold uppercase"
							style={{ color: SIGNAL, letterSpacing: "0.22em" }}
						>
							Draft
						</p>
					</div>

					{/* The title, withheld — stated, not faked. */}
					<div className="mt-5 space-y-2">
						<div
							className="h-[12px] rounded-[2px]"
							style={{ backgroundColor: PAPER_INK, width: "92%" }}
						/>
						<div
							className="h-[12px] rounded-[2px]"
							style={{ backgroundColor: PAPER_INK, width: "76%" }}
						/>
						<div
							className="h-[12px] rounded-[2px]"
							style={{ backgroundColor: PAPER_INK, width: "44%" }}
						/>
						<p
							className="pt-1 text-[0.6rem] font-semibold uppercase"
							style={{ color: PAPER_INK_SOFT, letterSpacing: "0.2em" }}
						>
							Title withheld
						</p>
					</div>

					<div
						aria-hidden="true"
						className="my-5 h-px w-full"
						style={{ backgroundColor: `${PAPER_INK}26` }}
					/>

					{/* Body in progress: set lines plus the editor's marks, rather
					    than lorem ipsum or invented chapters. */}
					<div className="space-y-2.5">
						{MANUSCRIPT_ROWS.map((row) => (
							<div key={row.id} className="flex items-center gap-3">
								{row.marked ? (
									<span
										className="h-4 w-[3px] shrink-0 rounded-full"
										style={{ backgroundColor: SIGNAL }}
									/>
								) : (
									<span className="h-4 w-[3px] shrink-0" />
								)}
								<span
									className="block h-2 rounded-full"
									style={{
										backgroundColor: `${PAPER_INK}1f`,
										width: row.width,
									}}
								/>
							</div>
						))}
					</div>

					<div className="mt-6 flex items-baseline justify-between gap-4">
						<p
							className="text-[0.6rem] font-semibold uppercase"
							style={{ color: PAPER_INK_SOFT, letterSpacing: "0.2em" }}
						>
							Not for circulation
						</p>
						<p
							className="text-[0.6rem] font-semibold uppercase"
							style={{ color: PAPER_INK_SOFT, letterSpacing: "0.2em" }}
						>
							GK
						</p>
					</div>

					{/* The status, stamped on the object — diegetic, not a kicker. */}
					<p
						className="absolute top-20 -right-3 rotate-[7deg] rounded-[3px] border-2 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase sm:-right-5"
						style={{
							color: SIGNAL,
							borderColor: SIGNAL,
							letterSpacing: "0.24em",
							backgroundColor: `${PAPER}d9`,
						}}
					>
						In progress
					</p>
				</div>
			</div>
		</div>
	);
}

export function BookSection() {
	return (
		<section
			id="the-book"
			className="relative isolate scroll-mt-24 overflow-hidden px-6 py-12 sm:px-10 sm:py-14"
			style={{ backgroundColor: INK }}
		>
			{/* Hand-offs into the dark sections either side. Alpha-zero INK,
			    not `transparent`, so the ramp midpoint never drags to black. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-40"
				style={{
					background: `linear-gradient(to bottom, ${INK} 0%, ${INK}00 100%)`,
				}}
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
				style={{
					background: `linear-gradient(to top, ${INK} 0%, ${INK}00 100%)`,
				}}
			/>
			{/* Grain, to texture the field. Plain alpha, never a blend mode. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.07]"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
					backgroundSize: "180px 180px",
				}}
			/>

			<div className="relative mx-auto w-full max-w-6xl">
				{/* The opening rule, with the page's one accent on it. */}
				<Reveal>
					<div aria-hidden="true" className="flex h-px w-full">
						<span
							className="w-[clamp(3rem,7vw,6rem)]"
							style={{ backgroundColor: SIGNAL }}
						/>
						<span className="flex-1 bg-white/15" />
					</div>
				</Reveal>

				<Reveal className="mt-8">
					<h2 className="display max-w-[15ch] text-balance text-[clamp(1.9rem,3.4vw,2.8rem)] text-white">
						Seven years of cases. One book.
					</h2>
				</Reveal>

				<div className="mt-7 grid items-center gap-10 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
					<div>
						<Reveal delay={0.08}>
							<p className="max-w-[42ch] text-pretty text-[0.95rem] leading-[1.7] text-white/75 sm:text-base">
								Darknet investigations, forensics casework, and the method
								behind them — the parts that never make it into a syllabus. Now
								being written as one book.
							</p>
						</Reveal>

						<Reveal delay={0.16} className="mt-7">
							<ClientOnly
								fallback={
									<LiquidMetalButtonFallback
										label="Notify me"
										href={NOTIFY}
										icon={ArrowUpRight}
									/>
								}
							>
								<Suspense
									fallback={
										<LiquidMetalButtonFallback
											label="Notify me"
											href={NOTIFY}
											icon={ArrowUpRight}
										/>
									}
								>
									<LiquidMetalButton
										label="Notify me"
										href={NOTIFY}
										icon={ArrowUpRight}
									/>
								</Suspense>
							</ClientOnly>
							<p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-white/50">
								No title, no date yet. One email when it lands — nothing else.
							</p>
						</Reveal>
					</div>

					<Reveal delay={0.12} direction="none">
						<Manuscript />
						<p className="mx-auto mt-6 max-w-[20rem] text-center text-sm text-white/50">
							Working manuscript. Title and cover to be announced.
						</p>
					</Reveal>
				</div>

				{/* The closing rule, so the band lands rather than stopping. */}
				<div
					aria-hidden="true"
					className="mt-8 border-t border-white/15 lg:mt-10"
				/>
			</div>
		</section>
	);
}
