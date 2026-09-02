/**
 * Every off-site address the page links to, in one place.
 *
 * These were scattered as `href: "#"` placeholders across the footer row, the
 * nav's Connect group and the reach cards, which is how three copies of the
 * same link drift apart. Import from here instead of retyping a URL.
 */
export const SOCIALS = {
	instagram: "https://www.instagram.com/gautamventure/",
	facebook: "https://www.facebook.com/GautamKumawatOfficial/",
	x: "https://x.com/GautamVenture/",
	linkedin: "https://www.linkedin.com/in/gautamventure/",
	youtube: "https://www.youtube.com/channel/UCoZKk9vYjpH1ShYK-xD29wg",
	telegram: "https://t.me/GautamVenture",
	email: "mailto:gautam.kumawat.kkb@gmail.com",
} as const;

/** Anything leaving the site needs both, so it is written once. */
export const EXTERNAL_LINK_PROPS = {
	target: "_blank",
	rel: "noopener noreferrer",
} as const;
