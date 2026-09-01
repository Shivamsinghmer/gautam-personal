import type { ClassValue } from "clsx";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useLenis } from "lenis/react";
import type { ReactNode } from "react";
import { Fragment, lazy, Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "#/components/ui/deferred";
import { ensureMotionCoreEase, registerPluginOnce } from "#/lib/gsap";
import { cn } from "#/lib/utils";

const LiquidMetalButton = lazy(() =>
	import("#/components/liquid-metal-button").then((m) => ({
		default: m.LiquidMetalButton,
	})),
);

/**
 * What stands in for the shader button before - or instead of - the canvas:
 * the same label, the same action, styled flat. The nav's primary action must
 * never be waiting on a WebGL library to arrive.
 */
function PlainPrimaryButton({
	label,
	onClick,
}: {
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
		>
			{label}
		</button>
	);
}

type MenuVariant = "default" | "muted";

export interface MenuLink {
	/** The text to display for the link. */
	label: string;
	/** The URL the link points to. */
	href: string;
}

export interface MenuButton {
	/** The text to display on the button. */
	label: string;
	/** The URL the button links to. */
	href: string;
}

export interface MenuGroup {
	/** The title of the menu group, displayed above the links. */
	title: string;
	/** The visual style variant of the group. 'muted' adds a background color. */
	variant?: MenuVariant;
	/** Links to display within this group. */
	links: MenuLink[];
}

export interface FloatingMenuClasses {
	root?: ClassValue;
	overlay?: ClassValue;
	header?: ClassValue;
	toggleButton?: ClassValue;
	toggleLine?: ClassValue;
	logo?: ClassValue;
	actions?: ClassValue;
	primaryButton?: ClassValue;
	secondaryButton?: ClassValue;
	menuWrapper?: ClassValue;
	grid?: ClassValue;
	group?: ClassValue;
	groupMuted?: ClassValue;
	groupTitle?: ClassValue;
	link?: ClassValue;
	linkText?: ClassValue;
	linkUnderline?: ClassValue;
	divider?: ClassValue;
}

export interface FloatingMenuProps {
	/** Groups of links to display in the menu. */
	menuGroups: MenuGroup[];
	/** Logo icon (and optional text) rendered in the header. */
	logo?: ReactNode;
	/** Configuration for the primary button in the header. */
	primaryButton?: MenuButton;
	/** Configuration for the secondary button in the header. */
	secondaryButton?: MenuButton;
	/** Additional classes for the container. */
	className?: string;
	/** Additional classes for specific menu slots. */
	classes?: FloatingMenuClasses;
	/**
	 * The element (or selector) to portal the menu into.
	 * Useful for containment in demos or specific containers.
	 * @default "body"
	 */
	portalTarget?: HTMLElement | string;
}

function resolvePortalTarget(target: HTMLElement | string): HTMLElement | null {
	if (typeof target !== "string") return target;
	return target === "body" ? document.body : document.querySelector(target);
}

export function FloatingMenu({
	menuGroups,
	logo,
	primaryButton,
	secondaryButton,
	className,
	classes,
	portalTarget = "body",
}: FloatingMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Shared by the shader button and the plain one that stands in for it, so
	// the primary action behaves the same whichever is on screen.
	const goToPrimary = () => {
		if (primaryButton?.href && primaryButton.href !== "#") {
			window.location.assign(primaryButton.href);
		}
	};
	const [hidden, setHidden] = useState(false);
	const isOpenRef = useRef(isOpen);
	isOpenRef.current = isOpen;

	const timelineRef = useRef<gsap.core.Timeline | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const menuWrapperRef = useRef<HTMLDivElement | null>(null);
	const line1Ref = useRef<HTMLSpanElement | null>(null);
	const line2Ref = useRef<HTMLSpanElement | null>(null);
	const overlayRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		registerPluginOnce(SplitText);
		ensureMotionCoreEase();
	}, []);

	// Hidden on the way down, back on the way up. Never below the header's own
	// height - a couple of scrolled pixels near the top would otherwise hide
	// it before the page has really moved - and never while the menu itself
	// is open, or it could vanish out from under an in-progress interaction.
	useLenis((lenis) => {
		if (isOpenRef.current) return;
		const pastHeader = lenis.scroll > 96;
		if (lenis.direction === 1 && pastHeader) setHidden(true);
		else if (lenis.direction === -1 || !pastHeader) setHidden(false);
	}, []);

	function toggle() {
		const timeline = timelineRef.current;
		if (!timeline) return;
		const next = !isOpenRef.current;
		setIsOpen(next);
		if (next) {
			timeline.play();
		} else {
			timeline.reverse();
		}
	}

	useEffect(() => {
		if (!mounted || !menuGroups.length) return;
		const container = containerRef.current;
		const menuWrapper = menuWrapperRef.current;
		const overlay = overlayRef.current;
		const line1 = line1Ref.current;
		const line2 = line2Ref.current;
		if (!container || !menuWrapper || !overlay || !line1 || !line2) return;

		let cancelled = false;
		let splits: SplitText[] = [];
		let ctx: gsap.Context | null = null;

		const init = async () => {
			await document.fonts.ready;
			if (cancelled) return;

			const width = window.innerWidth;
			const isMobile = width < 768;
			const isTablet = width >= 768 && width < 1024;

			let maxWidthOpen = "75%";
			let maxWidthInitial = "50%";

			if (isMobile) {
				maxWidthOpen = "100%";
				maxWidthInitial = "95%";
			} else if (isTablet) {
				maxWidthOpen = "85%";
				maxWidthInitial = "70%";
			}

			ctx?.revert();
			ctx = gsap.context(() => {
				gsap.set(overlay, { autoAlpha: 0 });
				gsap.set(container, { maxWidth: maxWidthInitial });
				gsap.set(menuWrapper, { height: 0, autoAlpha: 0 });

				const linkElements = gsap.utils.toArray(
					'[data-slot="link-text"]',
					menuWrapper,
				) as HTMLElement[];

				splits = linkElements.map((el) =>
					SplitText.create(el, { type: "lines", mask: "lines" }),
				);
				const allLines = splits.flatMap((s) => s.lines);

				const timeline = gsap.timeline({
					paused: true,
					defaults: { ease: "motion-core-ease", duration: 0.5 },
				});

				timeline
					.to(
						container,
						{
							maxWidth: maxWidthOpen,
							...(isMobile
								? {
										top: 0,
										paddingTop: "0.5rem",
										borderTopLeftRadius: 0,
										borderTopRightRadius: 0,
									}
								: {}),
						},
						0,
					)
					.to(overlay, { autoAlpha: 1 }, 0)
					.to(menuWrapper, { height: "auto", autoAlpha: 1 }, 0.2)
					.to([line1, line2], { y: 0, duration: 0.4 }, 0.2)
					.to(line1, { rotation: 45, duration: 0.4 }, 0.2)
					.to(line2, { rotation: -45, duration: 0.4 }, 0.2);

				if (allLines.length) {
					timeline.from(
						allLines,
						{ yPercent: 100, autoAlpha: 0, stagger: 0.02 },
						0.3,
					);
				}

				timelineRef.current = timeline;
			}, container);

			if (isOpenRef.current) {
				timelineRef.current?.progress(1);
			}
		};

		init();

		return () => {
			cancelled = true;
			ctx?.revert();
			ctx = null;
			timelineRef.current = null;
			splits.forEach((s) => {
				s.revert();
			});
		};
	}, [menuGroups, mounted]);

	if (!mounted) return null;

	const target = resolvePortalTarget(portalTarget);
	if (!target) return null;

	return createPortal(
		<>
			<button
				ref={overlayRef}
				type="button"
				data-slot="overlay"
				className={cn(
					"pointer-events-none fixed inset-0 z-40 cursor-default border-0 bg-[var(--sea-ink)]/40 p-0 opacity-0 data-[open=true]:pointer-events-auto",
					classes?.overlay,
				)}
				data-open={isOpen}
				onClick={toggle}
				onKeyDown={(event) => {
					if (event.key === "Escape" && isOpen) {
						event.preventDefault();
						toggle();
					}
				}}
				tabIndex={-1}
				aria-label="Close menu"
			/>

			<div
				ref={containerRef}
				data-slot="root"
				className={cn(
					"fixed top-2 left-1/2 z-50 w-full max-w-[95vw] -translate-x-1/2 rounded-md border border-[var(--line)] bg-[var(--header-bg)] text-[var(--sea-ink)] shadow-md transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.625,0.05,0,1)] md:top-4 md:max-w-[70vw] lg:max-w-[50vw]",
					hidden && "-translate-y-24 opacity-0 pointer-events-none",
					className,
					classes?.root,
				)}
			>
				<div
					data-slot="header"
					className={cn(
						"relative z-20 flex w-full items-center justify-between px-2 py-1.5",
						classes?.header,
					)}
				>
					<button
						type="button"
						onClick={toggle}
						data-slot="toggle-button"
						className={cn(
							"group relative flex h-10 items-center justify-center rounded-sm pr-2 transition-[background-color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-[var(--lagoon)]/10",
							classes?.toggleButton,
						)}
						aria-label="Toggle menu"
					>
						<div className="relative flex h-10 w-10 items-center justify-center">
							<span
								ref={line1Ref}
								data-slot="toggle-line"
								className={cn(
									"absolute h-px w-6 bg-[var(--sea-ink)] transition-[background-color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:bg-[var(--lagoon-deep)]",
									classes?.toggleLine,
								)}
								style={{ transform: "translateY(4px)" }}
							/>
							<span
								ref={line2Ref}
								data-slot="toggle-line"
								className={cn(
									"absolute h-px w-6 bg-[var(--sea-ink)] transition-[background-color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:bg-[var(--lagoon-deep)]",
									classes?.toggleLine,
								)}
								style={{ transform: "translateY(-4px)" }}
							/>
						</div>
						<span className="ml-1 text-sm font-medium text-[var(--sea-ink)] transition-[color] duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover:text-[var(--lagoon-deep)]">
							Menu
						</span>
					</button>

					<div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu"
						style={{ backfaceVisibility: "hidden" }}
					>
						{logo ? (
							<div
								data-slot="logo"
								className={cn("flex items-center gap-3", classes?.logo)}
							>
								{logo}
							</div>
						) : null}
					</div>

					<div
						data-slot="actions"
						className={cn("flex items-center gap-1", classes?.actions)}
					>
						{secondaryButton ? (
							<a
								href={secondaryButton.href}
								data-slot="secondary-button"
								className={cn(
									"hidden h-10 items-center justify-center rounded-sm px-4 text-sm font-medium text-[var(--sea-ink)]  duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:bg-[var(--surface)] hover:text-[var(--sea-ink)] md:flex",
									classes?.secondaryButton,
								)}
							>
								{secondaryButton.label}
							</a>
						) : null}
						{primaryButton ? (
							<div
								data-slot="primary-button"
								// `flex` rather than the default block: the button inside is
								// inline-block, so a block parent lays it on a text baseline
								// and reserves descender space beneath it. That was 6px of
								// dead height under the button - and since this is the
								// tallest thing in the header, all 6px went into the bar.
								className={cn(
									"flex shrink-0 items-center",
									classes?.primaryButton,
								)}
							>
								{/* The one shader on the page that is always on screen, since
								    the menu is fixed. It stays - but its library is no longer
								    part of the first chunk, and the fallback is a real button
								    so the nav works from the first paint rather than after
								    a shader compiles. */}
								<ClientOnly
									fallback={
										<PlainPrimaryButton
											label={primaryButton.label}
											onClick={goToPrimary}
										/>
									}
								>
									<Suspense
										fallback={
											<PlainPrimaryButton
												label={primaryButton.label}
												onClick={goToPrimary}
											/>
										}
									>
										<LiquidMetalButton
											label={primaryButton.label}
											onClick={goToPrimary}
										/>
									</Suspense>
								</ClientOnly>
							</div>
						) : null}
					</div>
				</div>

				<div
					ref={menuWrapperRef}
					data-slot="menu-wrapper"
					className={cn(
						"h-0 w-full overflow-hidden border-t border-[var(--line)] opacity-0",
						classes?.menuWrapper,
					)}
				>
					<div
						data-slot="grid"
						className={cn(
							"grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto overscroll-contain p-4 md:max-h-none md:grid-cols-3 md:overflow-visible",
							classes?.grid,
						)}
					>
						{menuGroups.map((group) => (
							<div
								key={group.title}
								data-slot="group"
								className={cn(
									"flex flex-col gap-4 rounded-sm p-4 transition-colors ease-[cubic-bezier(0.625,0.05,0,1)]",
									group.variant === "muted"
										? "bg-[var(--sand)]"
										: "bg-transparent",
									classes?.group,
									group.variant === "muted" && classes?.groupMuted,
								)}
							>
								<h3
									data-slot="group-title"
									className={cn(
										"mono text-xs font-medium tracking-wider text-[var(--sea-ink-soft)]/70 uppercase",
										classes?.groupTitle,
									)}
								>
									{group.title}
								</h3>
								<div className="mt-4 flex flex-col gap-4">
									{group.links.map((link, i) => (
										<Fragment key={link.href + link.label}>
											<a
												href={link.href}
												data-slot="link"
												className={cn(
													"group/link relative block w-fit text-2xl font-normal text-[var(--sea-ink-soft)] transition-colors duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] hover:text-[var(--sea-ink)]",
													classes?.link,
												)}
											>
												<span className="relative z-10 block leading-tight">
													<span
														data-slot="link-text"
														className={cn(
															"menu-link-text block whitespace-nowrap",
															classes?.linkText,
														)}
													>
														{link.label}
													</span>
												</span>
												<span
													data-slot="link-underline"
													className={cn(
														"absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-[var(--lagoon)] transition-transform duration-400 ease-[cubic-bezier(0.625,0.05,0,1)] group-hover/link:origin-left group-hover/link:scale-x-100",
														classes?.linkUnderline,
													)}
												/>
											</a>
											{i < group.links.length - 1 ? (
												<hr
													data-slot="divider"
													className={cn(
														"border-[var(--line)]",
														classes?.divider,
													)}
												/>
											) : null}
										</Fragment>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>,
		target,
	);
}
