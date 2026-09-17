/**
 * Derives the journey spiral's image set from the photographs already in
 * public/, plus one original out of the unserved `photos/` directory.
 *
 * The frames were shot in different venues, years and lighting, and four of
 * them appear again in their original colour further down the page - in the
 * collage, and now in the gallery too. One grade solved both problems at once:
 * the stack read as a single sequence rather than a mixed bag, and it did not
 * look like the collage repeated.
 *
 * That grade is applied at runtime now, not baked in here. The stack's cards
 * desaturate as they leave and come back to full colour as they reach centre
 * (see the `grayscale` filter in case-study-flip-stack.tsx), which needs the
 * colour to still be in the file - a grayscale webp has nothing to restore.
 * The sequence still reads as one set, because at any moment every frame but
 * the one you are looking at is grey; the difference is that the grade is now
 * something the scroll can move.
 *
 * `grade: "mono"` is therefore per-job rather than global, and only
 * `02-agencies.webp` still takes it: that frame is not in the stack at all
 * (see below), and the section that does use it wants the flat graded plate.
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
 *
 * The numbers are this script's ordering, not the section's - `journey-section.tsx`
 * matches each frame to the stage it suits, so they do not run 01..07 down the
 * stack. Do not renumber to "fix" that.
 *
 * `02-agencies.webp` is built here but rendered somewhere else entirely: it is
 * the reach section's card. Step 01 used to carry it and now carries
 * `07-first-desk.webp`, and rather than go spare it took over the reach card
 * from `gautam-figure.png` - which that section had been sharing with about.
 * So this script feeds two sections, and deleting that row breaks reach.
 */
const JOBS = [
	{ in: "public/collage/middle.jpg", out: "01-case-work.webp", position: "attention" },
	{ in: "public/gautam.png", out: "02-agencies.webp", position: "top", grade: "mono" },
	// "left", not "attention". The subject is the man at the lectern, and he
	// stands in the left third of a wide frame - sharp's attention heuristic
	// went for the livelier group of faces on the right instead and cropped him
	// out of his own photograph entirely. Gravity beats the heuristic when you
	// already know where the subject is.
	{ in: "public/collage/t2.webp", out: "03-classroom.webp", position: "left" },
	{ in: "public/collage/b2.webp", out: "04-stage.webp", position: "attention" },
	{ in: "public/collage/b1.webp", out: "05-press.webp", position: "attention" },
	{ in: "public/collage/t1.webp", out: "06-scale.webp", position: "attention" },
	// The only genuine period photograph on the page, and the one frame here
	// whose source is not already in public/. "attention" holds the whole of
	// him plus both screens; a centre crop clips the second monitor, and "top"
	// loses the laptop the picture is actually about.
	{ in: "photos/first-desk.jpg", out: "07-first-desk.webp", position: "attention" },
	// The second period photograph, and the one that now opens the stack. Its
	// source is a 179x228 thumbnail - the only surviving copy - so this job is
	// a 4.5x upscale and the only one that takes `sharpen`. A light unsharp
	// pass buys back some edge without turning the JPEG's
	// blocking into texture; anything stronger made the haze behind him crawl.
	// It is still the softest frame in the set, which the card's own grade and
	// near-black ground carry better than a full-bleed hero would.
	{
		in: "photos/village-years.jpg",
		out: "08-village-years.webp",
		position: "attention",
		sharpen: true,
	},
	// The reach card, and the one job here that is not 800x1000.
	//
	// That section's card is a landscape frame, and it had been cropping
	// `02-agencies.webp` to get there - cropping a derivative that was itself
	// already cropped out of the square original with `top` gravity. Two crops
	// deep the headroom is gone: at 3:2 his hair touches the top edge and the
	// shoulders are cut, and anything wider takes the top of his head off.
	//
	// Cut straight from the square source instead, at the ratio the card
	// actually renders, there is room for the whole head plus shoulders and
	// the studio ground around them. 3:2 is the widest this photograph will
	// go - 16:10 crowds the hair against the top and 16:9 clips it - so a
	// wider card than this needs a differently composed photograph, not a
	// different crop.
	{
		in: "public/gautam.png",
		out: "02-agencies-wide.webp",
		position: "top",
		grade: "mono",
		size: { width: 1200, height: 800 },
	},
];

mkdirSync(OUT, { recursive: true });

for (const job of JOBS) {
	const mono = job.grade === "mono";
	// 800x1000 is the stack's card; `size` is the override for the one job
	// that feeds a landscape frame elsewhere.
	const { width, height } = job.size ?? { width: 800, height: 1000 };
	let pipeline = sharp(job.in).resize(width, height, {
		fit: "cover",
		position: job.position,
	});
	if (mono) pipeline = pipeline.grayscale();
	// Only the upscaled thumbnail asks for this; every other source is larger
	// than the output and comes out of the resize sharp already.
	if (job.sharpen) pipeline = pipeline.sharpen({ sigma: 1, m1: 0.6, m2: 2 });
	const info = await pipeline
		// A light contrast lift, so the frames keep their subject against the
		// section's near-black ground. It is worth as much in colour as it was
		// in grayscale: these are dark rooms and stage lighting, and the card
		// sits on near-black.
		.linear(1.08, -8)
		.webp({ quality: 82 })
		.toFile(`${OUT}/${job.out}`);
	console.log(
		`${job.out}  ${mono ? "mono  " : "colour"}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`,
	);
}
