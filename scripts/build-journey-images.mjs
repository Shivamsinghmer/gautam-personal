/**
 * Derives the journey spiral's image set from the photographs already in
 * public/.
 *
 * The six frames were shot in different venues, years and lighting, and four
 * of them appear again in their original colour in the collage section further
 * down the page. Running them through one grade solves both problems at once:
 * the spiral reads as a single sequence rather than a mixed bag, and it does
 * not look like the collage repeated. Neutral grayscale specifically - the
 * slider's fragment shader nudges saturation up by 1.18, which would re-tint a
 * duotone but leaves a true grayscale exactly where it is.
 *
 * Output is 800x1000. The flip-stack card gives its photograph a tall panel on
 * desktop and a wide one on a phone, so a 4:5 source has the least to lose to
 * object-cover at either end. Re-run after changing any source photograph:
 *
 *   node scripts/build-journey-images.mjs
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT = "public/journey";

/**
 * `position` is per-photograph: the two studio portraits are cropped from the
 * top so the head survives the tall crop, and the wide auditorium frames lean
 * on sharp's attention heuristic to keep the crowd rather than empty ceiling.
 */
const JOBS = [
	{ in: "public/collage/middle.jpg", out: "01-case-work.webp", position: "attention" },
	{ in: "public/gautam.png", out: "02-agencies.webp", position: "top" },
	{ in: "public/collage/t2.webp", out: "03-classroom.webp", position: "attention" },
	{ in: "public/collage/b2.webp", out: "04-stage.webp", position: "attention" },
	{ in: "public/collage/b1.webp", out: "05-press.webp", position: "attention" },
	{ in: "public/collage/t1.webp", out: "06-scale.webp", position: "attention" },
];

mkdirSync(OUT, { recursive: true });

for (const job of JOBS) {
	const info = await sharp(job.in)
		.resize(800, 1000, { fit: "cover", position: job.position })
		.grayscale()
		// A light contrast lift, so the desaturated frames keep their subject
		// against the section's near-black ground.
		.linear(1.08, -8)
		.webp({ quality: 82 })
		.toFile(`${OUT}/${job.out}`);
	console.log(`${job.out}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
}
