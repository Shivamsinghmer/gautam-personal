import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactLenis } from "lenis/react";
import signatureLogo from "#/assets/signature.svg";
import type { MenuGroup } from "#/components/floating-menu";
import { FloatingMenu } from "#/components/floating-menu";
import { SOCIALS } from "#/lib/socials";
import { SignaturePreloader } from "../components/preloader/SignaturePreloader";
import appCss from "../styles.css?url";

const menuGroups: MenuGroup[] = [
	{
		title: "Navigate",
		links: [
			{ label: "Home", href: "/" },
			{ label: "About", href: "#about" },
			{ label: "The rooms", href: "#the-room" },
			{ label: "Book", href: "#book" },
		],
	},
	{
		// No GitHub: he is a trainer and investigator, not a developer, and a
		// link labelled for a profile that does not exist is worse than one
		// fewer row.
		title: "Connect",
		variant: "muted",
		links: [
			{ label: "Instagram", href: SOCIALS.instagram },
			{ label: "YouTube", href: SOCIALS.youtube },
			{ label: "LinkedIn", href: SOCIALS.linkedin },
			{ label: "Email", href: SOCIALS.email },
		],
	},
];

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Gautam Kumawat",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			// Declaring an icon is what stops the browser probing /favicon.ico and
			// logging a 404. The mark is the signature's own capital G, taken from
			// the same font the preloader writes with.
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{/* `lerp` and `duration` are alternative smoothing modes in Lenis,
				    not settings that combine - passing both left which one applied
				    ambiguous. Keeping `lerp` alone, and raising it from 0.1, which
				    is heavy smoothing: the page kept gliding well after the wheel
				    stopped, which reads as the page lagging behind you rather than
				    as smoothness. 0.18 still smooths without the drag. */}
				<ReactLenis root options={{ lerp: 0.18, smoothWheel: true }}>
					{children}
				</ReactLenis>
				<FloatingMenu
					menuGroups={menuGroups}
					primaryButton={{ label: "Let's Connect", href: "#connect" }}
					logo={
						<a href="/" className="flex items-center" aria-label="Home">
							<img
								src={signatureLogo}
								alt="Gautam Kumawat"
								className="h-7 w-auto"
								style={{ color: "var(--lagoon-deep)" }}
							/>
						</a>
					}
				/>
				{/* `once` per browser session. The overlay locks scrolling and holds
				    the page for the length of the writing plus the hold and fade -
				    about four and a half seconds - and paying that on every single
				    navigation is most of what made the site feel like it was hanging.
				    First visit still gets the full mark; after that it is out of the
				    way. `?replay` in the URL brings it back. */}
				<SignaturePreloader once />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
