/**
 * Derives the booking section's stage photograph from `photos/bookme.png`.
 *
 * ## Why this exists
 *
 * The original is a 1.86MB PNG. PNG is lossless and made for flat colour and
 * hard edges; this is a photograph of a lit auditorium, which is the case it
 * is worst at. It is also the page's single largest element - full bleed, no
 * measure holding it in - so it is the one raster where the weight is most
 * worth spending and most worth not wasting.
 *
 * WebP at 82 carries it for a fraction of that, which is the same trade every
 * other raster on this site already makes.
 *
 * ## The width is a cap, not a target
 *
 * The source is 2004px wide. Full bleed on a 1440px viewport at 2x DPR would
 * ask for 2880, and there is no way to honour that from this file - so the
 * output is the source's own width and `withoutEnlargement` makes that a
 * guarantee rather than a comment. Interpolating up to hit a number would add
 * bytes and no detail.
 *
 * Re-run after replacing the original:
 *
 *   node scripts/build-stage-image.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/book";
mkdirSync(OUT, { recursive: true });

const info = await sharp("photos/bookme.png")
	.rotate() // EXIF before it is stripped on write.
	.resize({ width: 2004, withoutEnlargement: true })
	.webp({ quality: 82 })
	.toFile(`${OUT}/stage.webp`);

console.log(`stage.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
