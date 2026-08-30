import { ArrowRight, PhoneCall, ShieldCheck } from "lucide-react";
import { SHADER_BLUE_BRIGHT } from "#/lib/palette";

/**
 * The two booking CTAs above the footer's ASCII art.
 *
 * `description` is optional: the first card was written as a single line with
 * no supporting copy. Rather than invent a sentence to balance it, the cards
 * stretch to a shared height and each button sits after an `mt-auto` spacer,
 * so the buttons line up across the row whatever the copy above them does.
 */
const BOOKINGS: {
	icon: typeof ShieldCheck;
	title: string;
	description?: string;
	cta: string;
	href: string;
}[] = [
	{
		icon: ShieldCheck,
		title: "Teach Your Kid Cybersecurity",
		cta: "Book A Call With Expert",
		href: "#",
	},
	{
		icon: PhoneCall,
		title: "1-on-1 Mentorship Call",
		description: "Get Mentorship to achieve peak performance.",
		cta: "Yes, Book My Mentorship Call",
		href: "#",
	},
];

export function BookingCards({ className }: { className?: string }) {
	return (
		<div
			className={`grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 ${className ?? ""}`}
		>
			{BOOKINGS.map(({ icon: Icon, title, description, cta, href }) => (
				<div
					key={title}
					className="flex flex-col rounded-2xl border border-white/10 bg-[#02171f]/85 p-7 text-left backdrop-blur-sm transition-colors hover:border-white/20"
				>
					<span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-blue-400">
						<Icon className="h-5 w-5" aria-hidden="true" />
					</span>
					<h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
					{description ? (
						<p className="mt-2 text-sm text-white/50">{description}</p>
					) : null}
					{/* mt-auto pushes the button to the bottom so the two line up;
					    pt-8 keeps a minimum gap above it on the taller card, which a
					    bare mt-auto would collapse to nothing. */}
					<div className="mt-auto pt-8">
						<a
							href={href}
							className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90"
							// `color` is set here rather than with `text-white` because
							// styles.css carries an unlayered `a { color: … }` rule, and
							// unlayered CSS beats Tailwind's layered utilities whatever their
							// specificity. Without it the label renders lagoon teal on blue -
							// 1.5:1, effectively unreadable.
							style={{ backgroundColor: SHADER_BLUE_BRIGHT, color: "#ffffff" }}
						>
							{cta}
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</a>
					</div>
				</div>
			))}
		</div>
	);
}
