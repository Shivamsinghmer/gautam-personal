/**
 * Derives the gallery section's image set from the originals in `photos/`.
 *
 * `photos/` is the one directory on this project that is *not* served. The
 * other two image scripts read their sources straight out of `public/`
 * (`public/gautam.png`, `public/collage/*`), which means every source ships in
 * the build whether or not anything renders it - `gautam.png` alone is 1MB of
 * dist that no page ever requests. These six originals total 3.4MB, so they
 * live outside `public/` and only their derivatives cross over.
 *
 * Two things happen here that the other scripts do not need:
 *
 * - **Colour is kept.** The journey set is graded to grayscale so six frames
 *   shot years apart read as one sequence. This section is the opposite case:
 *   the whole point is six *different* places, and the green-lit studio, the
 *   monitor glow and the daylight on the river are what make them read as
 *   different. PRODUCT.md's "no matrix green-on-black" anti-reference is about
 *   green used as *decoration* - a real photograph of the room he actually
 *   works in is evidence, which principle 1 asks for by name.
 * - **Each frame keeps its own aspect ratio.** No common crop. The set is
 *   3:4, 1:1, 4:3 and three 9:16 phone frames, and the layout is built around
 *   that variety rather than flattening it - see gallery-section.tsx.
 *
 * Widths are the largest the layout can ask for at a 2x DPR: the widest cell
 * is 7 of 12 columns in a 72rem container (~662px), so 1400 covers it. The
 * tall phone frames never exceed 4 columns (~348px), so 900 - their native
 * width - is already more than enough and they are passed through at source
 * size rather than upscaled.
 *
 * `first-desk.jpg` is deliberately absent from the list. It is still the source
 * of the journey stack's opening card (see build-journey-images.mjs, which
 * reads it straight out of `photos/`), it just no longer has a gallery frame.
 * Re-add a row here and re-run to bring it back.
 *
 * Re-run after replacing any original:
 *
 *   node scripts/build-gallery-images.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const SRC = "photos";
const OUT = "public/gallery";

/**
 * `width` is a cap, not a resize target: `withoutEnlargement` means a source
 * narrower than the cap is left at its own size. Height is always derived, so
 * the ratio is whatever the camera recorded.
 */
const JOBS = [
	{ in: "studio-desk.jpg", out: "studio-desk.webp", width: 1100 },
	{ in: "threat-map.jpg", out: "threat-map.webp", width: 1400 },
	{ in: "budapest-anonymus.jpg", out: "budapest-anonymus.webp", width: 900 },
	{ in: "budapest-parliament.jpg", out: "budapest-parliament.webp", width: 900 },
	{ in: "moscow-embankment.jpg", out: "moscow-embankment.webp", width: 900 },
];

mkdirSync(OUT, { recursive: true });

for (const job of JOBS) {
	const info = await sharp(`${SRC}/${job.in}`)
		.rotate() // Honour EXIF orientation before it is stripped on write.
		.resize({ width: job.width, withoutEnlargement: true })
		.webp({ quality: 82 })
		.toFile(`${OUT}/${job.out}`);
	console.log(
		`${job.out.padEnd(28)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`,
	);
}
