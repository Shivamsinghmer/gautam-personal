import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import motionCoreLogo from "#/assets/motion-core-logo.svg?raw";
import type { MenuGroup } from "#/components/floating-menu";
import { FloatingMenu } from "#/components/floating-menu";

export const Route = createFileRoute("/nav-demo")({ component: NavDemo });

const menuGroups: MenuGroup[] = [
	{
		title: "Platform",
		variant: "muted",
		links: [
			{ label: "Home", href: "#" },
			{ label: "Components", href: "#" },
			{ label: "Showcase", href: "#" },
		],
	},
	{
		title: "Resources",
		variant: "default",
		links: [
			{ label: "Documentation", href: "#" },
			{ label: "API Reference", href: "#" },
			{ label: "Community", href: "#" },
		],
	},
	{
		title: "Company",
		variant: "muted",
		links: [
			{ label: "About Us", href: "#" },
			{ label: "Blog", href: "#" },
			{ label: "Careers", href: "#" },
		],
	},
];

function NavDemo() {
	const [demoContainer, setDemoContainer] = useState<HTMLDivElement | null>(
		null,
	);

	return (
		<div
			ref={setDemoContainer}
			className="relative flex h-full min-h-150 w-full scale-[1] transform items-center justify-center overflow-hidden p-4"
		>
			<p className="text-center">
				Due to the nature of the component, testing in full-screen mode is
				recommended.
			</p>
			{demoContainer ? (
				<FloatingMenu
					portalTarget={demoContainer}
					menuGroups={menuGroups}
					primaryButton={{ label: "Get Started", href: "#" }}
					logo={
						<a href="/" className="flex items-center">
							<span
								className="inline-flex shrink-0 items-center text-accent [&>svg]:h-6 [&>svg]:w-auto [&>svg]:fill-current"
								aria-hidden="true"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: static build-time SVG asset, not user input
								dangerouslySetInnerHTML={{ __html: motionCoreLogo }}
							/>
							<span className="sr-only">Home</span>
						</a>
					}
				/>
			) : null}
		</div>
	);
}
