import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { useEffect, useState } from "react";
import { cn } from "#/lib/utils";

export function ShaderGradientBackground({
	className,
}: {
	className?: string;
}) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className={cn("fixed inset-0 -z-10", className)} aria-hidden="true">
			{/* lazyLoad unmounts the canvas rather than pausing it - the library
			    renders the R3F <Canvas> only while `(!lazyLoad || isInView)` - and
			    it was turned off here because a fresh mount paints flat until the
			    "city" environment map reloads, which showed as a blank hero when
			    you scrolled back up.

			    Off, though, it never stops: the canvas is still drawing a
			    full-screen shader when the visitor is ten screens down, behind
			    sections that are all opaque. Measured, it was still issuing draw
			    calls at scrollY 10145.

			    So it is back on with a large rootMargin instead. The observer
			    watches this element, which the caller sizes to the hero, so the
			    canvas only tears down once the hero is a full screen behind you -
			    and it remounts a screen early, giving the HDR time to load before
			    anything is visible. The blank-on-return case is what rootMargin is
			    for; switching the whole thing off was the wrong lever. */}
			<ShaderGradientCanvas
				lazyLoad
				rootMargin="1200px"
				style={{ width: "100%", height: "100%" }}
				pixelDensity={1}
				pointerEvents="auto"
			>
				<ShaderGradient
					animate="on"
					type="sphere"
					wireframe={false}
					shader="defaults"
					uTime={0}
					uSpeed={0.3}
					uStrength={0.3}
					uDensity={0.8}
					uFrequency={5.5}
					uAmplitude={3.2}
					positionX={-0.1}
					positionY={0}
					positionZ={0}
					rotationX={0}
					rotationY={130}
					rotationZ={70}
					color1="#0a3e8c"
					color2="#142241"
					color3="#0953ff"
					reflection={0.4}
					cAzimuthAngle={270}
					cPolarAngle={180}
					cDistance={0.5}
					cameraZoom={15.1}
					lightType="env"
					brightness={0.8}
					envPreset="city"
					grain="on"
					toggleAxis={false}
					zoomOut={false}
					hoverState=""
					enableTransition={false}
				/>
			</ShaderGradientCanvas>
		</div>
	);
}
