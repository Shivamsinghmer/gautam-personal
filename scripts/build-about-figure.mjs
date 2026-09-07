/**
 * Derives the about section's cut-out figure from public/gautam-figure.png.
 *
 * The source is a PNG with a real alpha channel and a few pixels of empty
 * margin. Trimming to the subject is what lets the layout stand him on a rule:
 * the element's box and the figure's silhouette become the same thing, so
 * `bottom: 0` puts his shoes on the line rather than putting a transparent
 * gutter on it.
 *
 * 396x593 is the whole of the resolution that exists - both cut-outs in
 * public/ trim to exactly this - so the section caps his rendered width at
 * ~330px and never asks the file for detail it does not have. Re-run after
 * replacing the source:
 *
 *   node scripts/build-about-figure.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/about";
mkdirSync(OUT, { recursive: true });

const info = await sharp("public/gautam-figure.png")
	.trim({ threshold: 10 })
	// Grayscale to sit in the same grade as the journey frames, and a light
	// sharpen because a cut-out on a near-black ground shows every soft edge.
	.grayscale()
	.sharpen({ sigma: 0.6 })
	.webp({ quality: 90, alphaQuality: 100 })
	.toFile(`${OUT}/figure.webp`);

console.log(
	`figure.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`,
);
