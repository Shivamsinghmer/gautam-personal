import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useLenis } from "lenis/react";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

interface LiquidMetalButtonProps {
	label?: string;
	onClick?: () => void;
	viewMode?: "text" | "icon";
	/**
	 * A trailing glyph, for the callers that used to pair their old flat pill
	 * with `ArrowRight`/`ArrowUpRight`. Rendered in the same dim chrome tone as
	 * the label rather than the page's accent - a coloured icon on this button
	 * would fight the metal instead of sitting on it.
	 */
	icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
	/**
	 * Lets this double as a real link: right-click, middle-click and "copy
	 * link address" all keep working, which a bare `onClick` button cannot
	 * offer. An in-page `#hash` is intercepted and handed to Lenis - see the
	 * note on `handleClick` - so it still moves with the same easing as every
	 * other scroll on the site rather than jumping the way a native anchor
	 * would. Anything else (`mailto:`, an external URL) is left to navigate
	 * normally.
	 */
	href?: string;
	/** Adds `target="_blank" rel="noopener noreferrer"` for an `href` that leaves the site. */
	external?: boolean;
}

/**
 * One canvas, reused for every measurement rather than one per button
 * instance or per keystroke - text measurement is the only thing it is for.
 */
let measureCanvas: HTMLCanvasElement | null = null;
function measureTextWidth(text: string, font: string): number {
	if (typeof document === "undefined") return 0;
	measureCanvas ??= document.createElement("canvas");
	const ctx = measureCanvas.getContext("2d");
	if (!ctx) return 0;
	ctx.font = font;
	return ctx.measureText(text).width;
}

export function LiquidMetalButton({
	label = "Get Started",
	onClick,
	viewMode = "text",
	icon: Icon,
	href,
	external,
}: LiquidMetalButtonProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isPressed, setIsPressed] = useState(false);
	const [ripples, setRipples] = useState<
		Array<{ x: number; y: number; id: number }>
	>([]);
	const shaderRef = useRef<HTMLDivElement>(null);
	const shaderMount = useRef<ShaderMount | null>(null);
	const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
	const rippleId = useRef(0);
	const lenis = useLenis();

	// Every caller before this one carried the string "Get Started" or "Let's
	// Connect" - both comfortably inside the original fixed 142px box. This
	// button is now also the site's "Check availability" and "Tell me when it
	// lands", which are not, so the box is measured off the actual label
	// instead of hard-coded. The font string has to match the label span's own
	// size and weight below or the measurement is for a different button.
	const dimensions = useMemo(() => {
		if (viewMode === "icon") {
			return {
				width: 46,
				height: 46,
				innerWidth: 42,
				innerHeight: 42,
				shaderWidth: 46,
				shaderHeight: 46,
			};
		}
		const textWidth = measureTextWidth(
			label,
			"400 14px 'DM Sans', ui-sans-serif, system-ui, sans-serif",
		);
		const iconAllowance = Icon ? 15 + 6 : 0;
		const width = Math.max(120, Math.round(textWidth + iconAllowance + 64));
		return {
			width,
			height: 46,
			innerWidth: width - 4,
			innerHeight: 42,
			shaderWidth: width,
			shaderHeight: 46,
		};
	}, [viewMode, label, Icon]);

	useEffect(() => {
		const styleId = "shader-canvas-style-exploded";
		if (!document.getElementById(styleId)) {
			const style = document.createElement("style");
			style.id = styleId;
			style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
			document.head.appendChild(style);
		}

		if (shaderRef.current) {
			shaderMount.current?.dispose();

			shaderMount.current = new ShaderMount(
				shaderRef.current,
				liquidMetalFragmentShader,
				{
					u_repetition: 4,
					u_softness: 0.5,
					u_shiftRed: 0.3,
					u_shiftBlue: 0.3,
					u_distortion: 0,
					u_contour: 0,
					u_angle: 45,
					u_scale: 8,
					u_shape: 1,
					u_offsetX: 0.1,
					u_offsetY: -0.1,
				},
				undefined,
				0.6,
			);
		}

		return () => {
			shaderMount.current?.dispose();
			shaderMount.current = null;
		};
	}, []);

	const handleMouseEnter = () => {
		setIsHovered(true);
		shaderMount.current?.setSpeed(1);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
		setIsPressed(false);
		shaderMount.current?.setSpeed(0.6);
	};

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
	) => {
		shaderMount.current?.setSpeed(2.4);
		setTimeout(() => {
			shaderMount.current?.setSpeed(isHovered ? 1 : 0.6);
		}, 300);

		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const ripple = { x, y, id: rippleId.current++ };

			setRipples((prev) => [...prev, ripple]);
			setTimeout(() => {
				setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
			}, 600);
		}

		// A bare `#hash` left to the browser jumps instantly and fights the
		// smooth scroller on the way; handing it to Lenis instead is what
		// keeps this button's in-page moves on the same easing as the rest of
		// the site. Anything else - `mailto:`, an external URL, no href at
		// all - is left alone.
		if (href?.startsWith("#")) {
			e.preventDefault();
			const target = document.querySelector(href);
			if (target) {
				if (lenis) lenis.scrollTo(target as HTMLElement, { duration: 1.2 });
				else target.scrollIntoView({ behavior: "smooth", block: "start" });
				window.history.replaceState(null, "", href);
			}
		}

		onClick?.();
	};

	const Tag = href ? "a" : "button";
	const tagProps = href
		? {
				href,
				...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}),
			}
		: { type: "button" as const };

	return (
		<div className="relative inline-block">
			<div
				style={{
					perspective: "1000px",
					perspectiveOrigin: "50% 50%",
				}}
			>
				<div
					style={{
						position: "relative",
						width: `${dimensions.width}px`,
						height: `${dimensions.height}px`,
						transformStyle: "preserve-3d",
						transition:
							"all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
						transform: "none",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: `${dimensions.width}px`,
							height: `${dimensions.height}px`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							transformStyle: "preserve-3d",
							transition:
								"all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, gap 0.4s ease",
							transform: "translateZ(20px)",
							zIndex: 30,
							pointerEvents: "none",
						}}
					>
						{viewMode === "icon" && (
							<Sparkles
								size={16}
								style={{
									color: "#666666",
									filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
									transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
									transform: "scale(1)",
								}}
							/>
						)}
						{viewMode === "text" && (
							<>
								<span
									style={{
										fontSize: "14px",
										color: "#666666",
										fontWeight: 400,
										textShadow: "0px 1px 2px rgba(0, 0, 0, 0.5)",
										transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
										transform: "scale(1)",
										whiteSpace: "nowrap",
									}}
								>
									{label}
								</span>
								{Icon ? (
									<Icon
										size={15}
										style={{
											color: "#666666",
											filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
										}}
									/>
								) : null}
							</>
						)}
					</div>

					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: `${dimensions.width}px`,
							height: `${dimensions.height}px`,
							transformStyle: "preserve-3d",
							transition:
								"all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
							transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
							zIndex: 20,
						}}
					>
						<div
							style={{
								width: `${dimensions.innerWidth}px`,
								height: `${dimensions.innerHeight}px`,
								margin: "2px",
								borderRadius: "100px",
								background: "linear-gradient(180deg, #202020 0%, #000000 100%)",
								boxShadow: isPressed
									? "inset 0px 2px 4px rgba(0, 0, 0, 0.4), inset 0px 1px 2px rgba(0, 0, 0, 0.3)"
									: "none",
								transition:
									"all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						/>
					</div>

					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: `${dimensions.width}px`,
							height: `${dimensions.height}px`,
							transformStyle: "preserve-3d",
							transition:
								"all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
							transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
							zIndex: 10,
						}}
					>
						<div
							style={{
								height: `${dimensions.height}px`,
								width: `${dimensions.width}px`,
								borderRadius: "100px",
								boxShadow: isPressed
									? "0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
									: isHovered
										? "0px 0px 0px 1px rgba(0, 0, 0, 0.4), 0px 12px 6px 0px rgba(0, 0, 0, 0.05), 0px 8px 5px 0px rgba(0, 0, 0, 0.1), 0px 4px 4px 0px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.2)"
										: "0px 0px 0px 1px rgba(0, 0, 0, 0.3), 0px 36px 14px 0px rgba(0, 0, 0, 0.02), 0px 20px 12px 0px rgba(0, 0, 0, 0.08), 0px 9px 9px 0px rgba(0, 0, 0, 0.12), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)",
								transition:
									"all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
								background: "rgb(0 0 0 / 0)",
							}}
						>
							<div
								ref={shaderRef}
								className="shader-container-exploded"
								style={{
									borderRadius: "100px",
									overflow: "hidden",
									position: "relative",
									width: `${dimensions.shaderWidth}px`,
									maxWidth: `${dimensions.shaderWidth}px`,
									height: `${dimensions.shaderHeight}px`,
									transition: "width 0.4s ease, height 0.4s ease",
								}}
							/>
						</div>
					</div>

					<Tag
						ref={buttonRef}
						{...tagProps}
						onClick={handleClick}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						onMouseDown={() => setIsPressed(true)}
						onMouseUp={() => setIsPressed(false)}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: `${dimensions.width}px`,
							height: `${dimensions.height}px`,
							background: "transparent",
							border: "none",
							cursor: "pointer",
							outline: "none",
							zIndex: 40,
							transformStyle: "preserve-3d",
							transform: "translateZ(25px)",
							transition:
								"all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
							overflow: "hidden",
							borderRadius: "100px",
						}}
						aria-label={label}
					>
						{ripples.map((ripple) => (
							<span
								key={ripple.id}
								style={{
									position: "absolute",
									left: `${ripple.x}px`,
									top: `${ripple.y}px`,
									width: "20px",
									height: "20px",
									borderRadius: "50%",
									background:
										"radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
									pointerEvents: "none",
									animation: "ripple-animation 0.6s ease-out",
								}}
							/>
						))}
					</Tag>
				</div>
			</div>
		</div>
	);
}

/**
 * What every `LiquidMetalButton` renders as until its shader library has
 * arrived - a real anchor or button, styled flat in the same dark chrome, so
 * the site's one button design works from first paint rather than after a
 * WebGL context compiles. Nav and hero kept their own bespoke versions of
 * this (`PlainPrimaryButton`, `PlainConnectButton`) from before every pill CTA
 * on the site used the shader button; this is the one every later caller
 * shares, so a fifth copy of the same four classes never gets written.
 */
export function LiquidMetalButtonFallback({
	label,
	onClick,
	href,
	external,
	icon: Icon,
}: {
	label: string;
	onClick?: () => void;
	href?: string;
	external?: boolean;
	icon?: React.ComponentType<{ className?: string }>;
}) {
	const className =
		"inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90";
	if (href) {
		return (
			<a
				href={href}
				onClick={onClick}
				className={className}
				{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
			>
				{label}
				{Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
			</a>
		);
	}
	return (
		<button type="button" onClick={onClick} className={className}>
			{label}
			{Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
		</button>
	);
}
