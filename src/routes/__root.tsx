import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ReactLenis } from "lenis/react";
import { BackgroundAudio } from "#/components/background-audio";
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
			{ label: "Gallery", href: "#gallery" },
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
			// The hero figure is a ~1.6MB plate, and it only starts fetching once
			// React has mounted the <img> - on a slow mobile connection that put
			// its arrival well after the rest of the hero had already settled, so
			// the entrance animation played late and looked like the picture just
			// snapped into place rather than rising in. A preload hint starts the
			// request the moment the document is parsed, before hydration, which
			// is the earliest anything on this page can ask for it.
			{
				rel: "preload",
				as: "image",
				href: "/hero.png",
				fetchPriority: "high",
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
				{/* The nav lives inside the provider, not beside it. Outside it,
				    `useLenis()` has no context: the smooth `scrollTo` the menu links
				    call falls back to the browser's own jump, and the hide-on-scroll
				    subscription silently never fires. */}
				<ReactLenis root options={{ lerp: 0.18, smoothWheel: true }}>
					{children}
					{/* No `logo`. The bar carried the signature wordmark centred between
					    Menu and the action; the preloader now writes that same signature
					    across the whole screen on arrival, so the nav was repeating the
					    mark you had just watched being drawn. `FloatingMenu` treats the
					    prop as optional and renders nothing in its place. */}
					<FloatingMenu
						menuGroups={menuGroups}
						primaryButton={{ label: "Let's Connect", href: "#connect" }}
					/>
					{/* Off until asked, and it owns its own control - see the file for
					    why this is never an autoplaying track. */}
					<BackgroundAudio />
				</ReactLenis>
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
