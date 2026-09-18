/**
 * Derives the about section's photograph from `photos/about-studio.jpg`.
 *
 * ## It is a framed picture now, not a cut-out
 *
 * This script used to trim `public/gautam-figure.png` to its alpha channel and
 * emit `figure.webp`, a silhouette with no background. The whole about
 * composition was built on that: the element's box and the figure's outline
 * were the same thing, so `bottom: 0` put his shoes on the section's closing
 * rule rather than putting a transparent gutter on it, and a radial pool of
 * light underneath stopped the cut-out reading as pasted onto flat ink.
 *
 * The replacement is an ordinary rectangular photograph of the room he records
 * in - it has a background, and no alpha to trim. None of that treatment
 * survives the swap: there is no silhouette to stand on a line, and a floor
 * glow under a rectangle is light pooling beneath a picture frame. So the
 * section frames it instead, and the cut-out handling came out with it.
 *
 * `gautam-figure.png` and the old `figure.webp` are both still in `public/`
 * and are now referenced by nothing. Left rather than deleted because the
 * cut-out is the only alpha-channel asset of him in the project and is the
 * obvious material if a free-standing figure is ever wanted again.
 *
 * ## Choices here
 *
 * **Colour, not grayscale.** The old cut-out was graded to sit with the
 * journey stack's monochrome set. This one is kept as shot: the green is the
 * actual lighting of his actual studio, and PRODUCT.md's "no matrix
 * green-on-black" anti-reference is about green used as decoration - a
 * photograph of the room the work happens in is the evidence principle 1 asks
 * for by name. The same argument is already written down in
 * build-gallery-images.mjs for the same room.
 *
 * **1000px wide.** The section renders it at most ~400px across, so this
 * covers a 2x display with room to spare. The old 396px cap existed because
 * the cut-out had no more resolution than that; this source is 1400px, so
 * that constraint is gone.
 *
 * Re-run after replacing the original:
 *
 *   node scripts/build-about-figure.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/about";
mkdirSync(OUT, { recursive: true });

const info = await sharp("photos/about-studio.jpg")
	.rotate() // Honour EXIF orientation before it is stripped on write.
	.resize({ width: 1000, withoutEnlargement: true })
	.webp({ quality: 82 })
	.toFile(`${OUT}/studio.webp`);

console.log(
	`studio.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`,
);
