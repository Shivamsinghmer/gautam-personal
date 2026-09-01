import {
	Facebook,
	Instagram,
	Linkedin,
	Mail,
	Send,
	Youtube,
} from "lucide-react";
import { SHADER_BLUE_BRIGHT } from "#/lib/palette";

/**
 * The social row.
 *
 * ⚠️ PLACEHOLDER HREFS. Every link below points at `#`. They are real,
 * focusable links with real labels, so they read correctly to a screen reader
 * and to the eye - but they go nowhere until the actual profile URLs are
 * dropped in. Same open item as the counts in `reach-section.tsx`.
 *
 * X has no outline form - the mark is a monoline glyph - so it is drawn as a
 * filled path rather than pulled from lucide, whose `X` is the close/cross
 * icon and would read as "dismiss" in a row of profiles.
 */
function XMark({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			className={className}
		>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

const SOCIALS: {
	label: string;
	href: string;
	Icon: (props: { className?: string }) => React.ReactNode;
}[] = [
	{ label: "Instagram", href: "#", Icon: Instagram },
	{ label: "Facebook", href: "#", Icon: Facebook },
	{ label: "X", href: "#", Icon: XMark },
	{ label: "LinkedIn", href: "#", Icon: Linkedin },
	{ label: "YouTube", href: "#", Icon: Youtube },
	{ label: "Telegram", href: "#", Icon: Send },
	{ label: "Email", href: "#", Icon: Mail },
];

export function SocialLinks({ heading }: { heading?: string }) {
	return (
		<div className="flex pt-10 flex-col items-center gap-5 sm:gap-6">
			{/* Sized well below the wordmark underneath it. The name is the footer's
			    display type; this is a line of speech pointing at the row, and it
			    would fight the wordmark if it competed on scale. */}
			{heading ? (
				<h2 className="text-center text-xl font-medium tracking-[-0.01em] text-white/85 sm:text-2xl">
					{heading}
				</h2>
			) : null}

			<ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
				{SOCIALS.map(({ label, href, Icon }) => (
					<li key={label}>
						<a
							href={href}
							aria-label={label}
							// The accent arrives as a custom property so the hover fill and
							// the focus ring both read from palette.ts rather than repeating
							// the hex in a Tailwind arbitrary value.
							style={{ "--accent": SHADER_BLUE_BRIGHT } as React.CSSProperties}
							// `text-white/70!` and `hover:text-white!` are marked important on
							// purpose: styles.css carries an unlayered `a { color }` rule, and
							// unlayered CSS beats Tailwind's layered utilities regardless of
							// specificity. The hover fill is the same blue the ASCII hands
							// light up with, so the whole footer reacts in one colour.
							className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70! transition-colors duration-200 hover:border-transparent hover:bg-[var(--accent)] hover:text-white! focus-visible:border-transparent focus-visible:bg-[var(--accent)] focus-visible:text-white! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:h-12 sm:w-12"
						>
							<Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
