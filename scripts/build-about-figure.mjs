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
 * **Sized to the render, at 2x.** The old 396px cap existed because the cut-out
 * had no more resolution than that. These are sized to what the section
 * actually asks for - see each job - and never enlarged past their source.
 *
 * Re-run after replacing the original:
 *
 *   node scripts/build-about-figure.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/about";
mkdirSync(OUT, { recursive: true });

/**
 * Two derivatives, both from the same original.
 *
 * One derivative, because the section renders one plate. A 16:9 cut shipped
 * beside this for a while, for a full-measure plate and then a 72% one; the
 * section puts the photograph in a column of its own now, and the wide file is
 * referenced by nothing. Removed rather than left in public/ to ship unused.
 */
const JOBS = [
	/**
	 * The one plate the section renders, at every size: the uncropped 3:4 frame.
	 *
	 * A 16:9 cut shipped here for a while, for a full-measure plate and then a
	 * 72% one. The section puts the photograph in a column of its own now -
	 * roughly 460px at the widest - and 16:9 inside that is a 260px band, a
	 * letterbox rather than a portrait. The frame's own ratio stands up in a
	 * narrow column, and cropping nothing is the honest version anyway.
	 *
	 * 1000px covers that column at 2x with room to spare, and is a downscale
	 * from the 1400px source rather than an upscale.
	 */
	{ out: "studio.webp", src: "photos/about-studio.jpg", width: 1000 },
];

for (const job of JOBS) {
	let pipeline = sharp(job.src).rotate(); // EXIF before it is stripped on write.
	if (job.extract) pipeline = pipeline.extract(job.extract);
	pipeline = pipeline.resize({ width: job.width, withoutEnlargement: true });
	const info = await pipeline.webp({ quality: 82 }).toFile(`${OUT}/${job.out}`);
	console.log(
		`${job.out.padEnd(18)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`,
	);
}
