"use client";

import React, { useMemo } from "react";
import { cn } from "#/lib/utils";

export interface CarouselImage {
	src: string;
	alt?: string;
}

export interface CylinderCarouselProps
	extends React.HTMLAttributes<HTMLDivElement> {
	images: CarouselImage[];
	containerClassName?: string;
	cardClassName?: string;
	animationDuration?: number; // in seconds
	cardWidth?: number; // in pixels
}

export const CylinderCarousel = React.forwardRef<
	HTMLDivElement,
	CylinderCarouselProps
>(
	(
		{
			images,
			className,
			containerClassName,
			cardClassName,
			animationDuration = 32,
			cardWidth = 250,
			...props
		},
		ref,
	) => {
		const N = images.length;

		// We compute the CSS variables here instead of polluting the global CSS
		// --n: number of cards
		// --w: card width
		const customStyle = useMemo(
			() =>
				({
					"--n": N,
					"--w": `${cardWidth}px`,
					"--ba": `calc(1turn / var(--n))`,
					// animation duration
					"--anim-dur": `${animationDuration}s`,
				}) as React.CSSProperties,
			[N, cardWidth, animationDuration],
		);

		return (
			<div
				ref={ref}
				className={cn(
					"grid h-full min-h-[500px] w-full place-items-center overflow-hidden",
					className,
				)}
				style={{
					perspective: "35em",
					maskImage:
						"linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
					WebkitMaskImage:
						"linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
				}}
				{...props}
			>
				<div
					className={cn(
						"grid place-items-center [transform-style:preserve-3d] motion-reduce:animate-[ry_128s_linear_infinite]!",
						containerClassName,
					)}
					style={{
						...customStyle,
						animation: "ry var(--anim-dur) linear infinite",
					}}
				>
					{/* We define the keyframes inline via a style block to ensure it works without global CSS config */}
					<style>
						{`
              @keyframes ry {
                to { transform: rotateY(1turn); }
              }
            `}
					</style>

					{images.map((img, i) => (
						<img
							// biome-ignore lint/suspicious/noArrayIndexKey: cards are positional - index IS the identity, it drives the --i rotation slot
							key={i}
							src={img.src}
							alt={img.alt || `Carousel image ${i}`}
							className={cn(
								"rounded-2xl object-cover [backface-visibility:hidden] [grid-area:1/1]",
								cardClassName,
							)}
							style={
								{
									width: "60%",
									aspectRatio: "7/10",
									"--i": i,
									// transform: rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))
									// Note: using modern CSS tan() function. Fallback translates are recommended if targeting very old browsers.
									transform:
										"rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5em) / tan(0.5 * var(--ba))))",
								} as React.CSSProperties
							}
						/>
					))}
				</div>
			</div>
		);
	},
);

CylinderCarousel.displayName = "CylinderCarousel";

export default CylinderCarousel;
