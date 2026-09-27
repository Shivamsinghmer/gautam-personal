/**
 * Derives the collage section's centre plate from `photos/collage-middle.png`.
 *
 * ## This plate is composited, not just displayed
 *
 * The collage hangs it on the section as a `mix-blend-screen` layer at 50%, so
 * every value in the file is added to the ground rather than replacing it.
 * Two things follow, and both are the reason this has its own script.
 *
 * **The black has to stay black.** Screen maps 0 to "contributes nothing", so
 * the figure lands on the field and the surround disappears - but only while
 * the surround really is near 0. Anything the encoder leaves behind in those
 * flat dark areas gets added to the section. The source measures 0.1-1.3 mean
 * on its side edges and 1.26 across the top, which is clean; quality 88 rather
 * than the 82 the other rasters use is what keeps it that way, because
 * near-black gradients are exactly where WebP spends its error budget and
 * screen is exactly the operation that reveals it.
 *
 * **The bottom edge is not black.** It averages 26.5 - his torso runs off the
 * frame - which screens to roughly a 13-level lift where it meets the field.
 * That is handled in the component, by the mask that fades the layer's top and
 * bottom out over the outer eighth, not here: cropping it away would cut the
 * figure off at the waist, and flattening it to black would put a hard line
 * across his jacket. The fade dissolves him into the ground instead, which is
 * the right reading of a figure composited onto a field anyway.
 *
 * ## Width
 *
 * 1870 is the source's own width and the cap. The layer is inset 8% either
 * side of a full-bleed section, so on a 1440px viewport it renders about
 * 1240px across - this covers that at 1.5x, and there is no more detail in the
 * file to give it. `withoutEnlargement` makes that a guarantee.
 *
 * Re-run after replacing the original:
 *
 *   node scripts/build-collage-figure.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/collage";
mkdirSync(OUT, { recursive: true });

const info = await sharp("photos/collage-middle.png")
	.rotate() // EXIF before it is stripped on write.
	.resize({ width: 1870, withoutEnlargement: true })
	.webp({ quality: 88 })
	.toFile(`${OUT}/middle.png`);

console.log(
	`middle.png  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`,
);
