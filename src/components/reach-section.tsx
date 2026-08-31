import { ArrowRight, Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "#/components/ui/scroll-reveal";
import StatsCounter from "#/components/ui/stats-counter";
import { HERO_DEEP, SHADER_BLUE_BRIGHT } from "#/lib/palette";

/**
 * Audience reach: a wide headline on the left, the case for it on the right,
 * with the numbers carried by a stack of per-channel cards rather than one
 * block of prose.
 *
 * ⚠️ PLACEHOLDER FIGURES. These counts are taken from the reference design
 * that inspired the layout - they are NOT Gautam's real audience numbers.
 * They read as factual claims on a real person's site, so replace every
 * `value` below with the true figure before this goes anywhere public.
 */
const CHANNELS: {
	icon: typeof Facebook;
	value: number;
	suffix: string;
	label: string;
	href: string;
}[] = [
	{
		icon: Facebook,
		value: 175,
		suffix: "k+",
		label: "Followers",
		href: "#",
	},
	{
		icon: Instagram,
		value: 62,
		suffix: "k+",
		label: "Followers",
		href: "#",
	},
	{
		icon: Linkedin,
		value: 12,
		suffix: "K+",
		label: "Followers",
		href: "#",
	},
	{
		icon: Mail,
		value: 500,
		suffix: "K+",
		label: "Subscribers",
		href: "#",
	},
];

export function ReachSection() {
	return (
		<section
			className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28"
			style={{ backgroundColor: HERO_DEEP }}
		>
			<div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-20">
				<Reveal>
					<h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[4rem]">
						Reach that
						<br />
						<span style={{ color: "#8fa3a8" }}>speaks for itself</span>
					</h2>
				</Reveal>

				<div>
					<Reveal delay={0.08}>
						<p className="text-base leading-relaxed text-white/60 sm:text-lg">
							Cybersecurity only protects people who hear about it. Alongside
							the training rooms and the case work, the same material reaches a
							standing audience every week — across the channels below.
						</p>
					</Reveal>

					{/* Two up on desktop, stacked on a phone. The accent bar sits on the
					    left edge of each card, echoing the reference's lit border
					    without ringing the whole card in blue. */}
					<RevealGroup className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
						{CHANNELS.map(({ icon: Icon, value, suffix, label, href }) => (
							<RevealItem key={label + suffix + value}>
								<a
									href={href}
									className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] py-4 pr-5 pl-6 transition-colors hover:border-white/25"
									// styles.css carries an unlayered `a { color }` rule that
									// beats Tailwind's layered utilities, so this is inline.
									style={{ color: "#ffffff" }}
								>
									<span
										aria-hidden="true"
										className="absolute inset-y-0 left-0 w-[3px] transition-shadow group-hover:shadow-[0_0_14px_2px_rgba(9,83,255,0.7)]"
										style={{ backgroundColor: SHADER_BLUE_BRIGHT }}
									/>
									<Icon
										className="h-6 w-6 shrink-0 text-white/90"
										aria-hidden="true"
									/>
									<span className="leading-tight">
										<span className="block text-lg font-bold">
											<StatsCounter value={value} duration={1.4} />
											{suffix}
										</span>
										<span className="block text-xs text-white/50">{label}</span>
									</span>
								</a>
							</RevealItem>
						))}
					</RevealGroup>

					<Reveal delay={0.12}>
						<a
							href="#book"
							className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium transition-colors hover:border-white/35"
							style={{ color: "#ffffff" }}
						>
							Learn more
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</a>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
