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
			{/* lazyLoad defaults to true, and it does not merely pause the canvas -
			    it unmounts it: the library renders the R3F <Canvas> only while
			    `(!lazyLoad || isInView)`. Scrolling the hero out of view therefore
			    tore down the WebGL context and the "city" environment map, and
			    scrolling back mounted a fresh one, which paints flat until the
			    HDR reloads. That blank pass is what showed through as the static
			    gradient beneath. Mounting once and keeping it costs an offscreen
			    render loop; a hero that is blank when you scroll back to it costs
			    more. */}
			<ShaderGradientCanvas
				lazyLoad={false}
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
