import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import signatureLogo from "#/assets/signature.svg";
import type { MenuGroup } from "#/components/floating-menu";
import { FloatingMenu } from "#/components/floating-menu";
import { SignaturePreloader } from "../components/preloader/SignaturePreloader";
import appCss from "../styles.css?url";

const menuGroups: MenuGroup[] = [
	{
		title: "Navigate",
		links: [
			{ label: "Home", href: "/" },
			{ label: "Work", href: "#" },
			{ label: "About", href: "#" },
		],
	},
	{
		title: "Connect",
		variant: "muted",
		links: [
			{ label: "GitHub", href: "#" },
			{ label: "LinkedIn", href: "#" },
			{ label: "Email", href: "mailto:gautam.kumawat.kkb@gmail.com" },
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
				{children}
				<FloatingMenu
					menuGroups={menuGroups}
					primaryButton={{ label: "Resume", href: "#" }}
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
				<SignaturePreloader />
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
