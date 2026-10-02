/**
 * Traces `photos/signature.png` - a scan of Gautam's real signature - into
 * `src/components/signature-data.ts`, the data the `Signature` component draws
 * and writes out.
 *
 * ## What it produces
 *
 * - `fill`: the ink, traced to one vector path.
 * - `strokes`: the pen's centre lines, in the order the pen moves, each with a
 *   start time and a length as fractions of the whole write.
 * - `maskWidth`: how wide to stroke those lines so that, together, they cover
 *   the ink around them.
 *
 * The component puts the fill under a mask made of the strokes and draws them
 * on one after another - so the ink appears along the path of the pen.
 *
 * ## Steps
 *
 * 1. Flatten, trim, upscale 2x and threshold the scan, so the tracer fits curves
 *    to smooth edges rather than to the staircase of the original pixels.
 * 2. Trace the ink. A 3px blur first: the scan's dry-pen edges are rough, and
 *    describing that roughness exactly nearly doubled the path data (39KB to
 *    21KB) for detail that is invisible at the size the mark is shown.
 * 3. Thin the ink to a one-pixel skeleton (Zhang-Suen) and walk it into
 *    polylines. Junctions are found by crossing number, not neighbour count: a
 *    thinned line has diagonal "staircase" pixels with three neighbours that
 *    are not forks, and counting neighbours cut every stroke into hundreds of
 *    pieces. Short spurs that end in a free tip are pruned.
 * 4. Time the strokes as one pen at a constant speed, left to right, with a
 *    short lift across the gap between the two words.
 * 5. Cover what the skeleton misses. Thinning stops short of stroke tips, so a
 *    mask of centre lines alone leaves ~1% of the ink - the tips - never
 *    revealed. Each uncovered patch gets a dot, timed to when the pen passes it.
 *    The script then re-renders the finished mask and checks that it covers
 *    every ink pixel; that is what makes the written mark and the drawn one
 *    identical, which the preloader's gate hand-off depends on.
 *
 * ## Running it
 *
 * Needs `potrace`, which is not a project dependency - this runs once per new
 * scan, not on every build. Install it somewhere outside this project (into
 * this project's node_modules it would mix npm into a pnpm tree, which is
 * exactly how stale packages ended up shadowing the real ones here once):
 *
 *   mkdir ../trace-tools && cd ../trace-tools && npm i potrace@2.1.8
 *   cd - && POTRACE_PATH=../trace-tools/node_modules/potrace node scripts/build-signature.mjs
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import sharp from "sharp";

const require = createRequire(import.meta.url);
let potrace;
try {
	potrace = require(process.env.POTRACE_PATH ? resolve(process.env.POTRACE_PATH) : "potrace");
} catch {
	console.error("potrace not found - see the header of this script for how to install it.");
	process.exit(1);
}

const SRC = "photos/signature.png";
const OUT = "src/components/signature-data.ts";

// 1. Clean bitmap at 2x.
const flat = await sharp(SRC).flatten({ background: "#ffffff" }).greyscale().toBuffer();
const trimmed = await sharp(flat)
	.trim({ background: "#f7f7f7", threshold: 40 })
	.toBuffer({ resolveWithObject: true });
const PAD = 8;
const bw = await sharp(trimmed.data)
	.extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: "#ffffff" })
	.resize({ width: (trimmed.info.width + PAD * 2) * 2, kernel: "lanczos3" })
	.threshold(140)
	.png()
	.toBuffer();
const inkBitmap = await sharp(bw).greyscale().blur(3).threshold(128).png().toBuffer();
const smooth = await sharp(bw).greyscale().blur(5).threshold(128).png().toBuffer();

// 2. Trace the ink.
const tracedSvg = await new Promise((ok, fail) =>
	potrace.trace(
		inkBitmap,
		{ threshold: 128, turdSize: 20, optTolerance: 0.4, alphaMax: 1, color: "#000", background: "transparent" },
		(err, svg) => (err ? fail(err) : ok(svg)),
	),
);

// 3. Skeleton.
const { data, info } = await sharp(smooth).greyscale().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const img = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) img[i] = data[i] < 128 ? 1 : 0;

// Distance to the edge of the ink (chamfer approximation), to size the mask.
const dist = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) dist[i] = img[i] ? 1e9 : 0;
const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : dist[y * W + x]);
for (let y = 0; y < H; y++)
	for (let x = 0; x < W; x++) {
		const i = y * W + x;
		if (img[i]) dist[i] = Math.min(dist[i], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414);
	}
for (let y = H - 1; y >= 0; y--)
	for (let x = W - 1; x >= 0; x--) {
		const i = y * W + x;
		if (img[i]) dist[i] = Math.min(dist[i], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414);
	}

// Zhang-Suen thinning.
const s = img.slice();
const P = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : s[y * W + x]);
const ring = (x, y) => [P(x, y - 1), P(x + 1, y - 1), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1), P(x - 1, y + 1), P(x - 1, y), P(x - 1, y - 1)];
for (let changed = true, iter = 0; changed && iter < 200; iter++) {
	changed = false;
	for (const step of [0, 1]) {
		const del = [];
		for (let y = 1; y < H - 1; y++)
			for (let x = 1; x < W - 1; x++) {
				if (!s[y * W + x]) continue;
				const n = ring(x, y);
				const B = n.reduce((a, b) => a + b, 0);
				if (B < 2 || B > 6) continue;
				let A = 0;
				for (let k = 0; k < 8; k++) if (n[k] === 0 && n[(k + 1) % 8] === 1) A++;
				if (A !== 1) continue;
				const ok = step === 0
					? n[0] * n[2] * n[4] === 0 && n[2] * n[4] * n[6] === 0
					: n[0] * n[2] * n[6] === 0 && n[0] * n[4] * n[6] === 0;
				if (ok) del.push(y * W + x);
			}
		if (del.length) {
			changed = true;
			for (const i of del) s[i] = 0;
		}
	}
}

// Walk the skeleton into polylines between endpoints and junctions.
const N8 = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]];
const nb = (i) => {
	const x = i % W;
	const y = (i / W) | 0;
	const out = [];
	for (const [dx, dy] of N8) {
		const X = x + dx;
		const Y = y + dy;
		if (X >= 0 && Y >= 0 && X < W && Y < H && s[Y * W + X]) out.push(Y * W + X);
	}
	return out;
};
const cross = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++)
	if (s[i]) {
		const r = ring(i % W, (i / W) | 0);
		let c = 0;
		for (let k = 0; k < 8; k++) if (r[k] === 0 && r[(k + 1) % 8] === 1) c++;
		cross[i] = c;
	}
const isNode = (i) => cross[i] !== 2;
const used = new Set();
const key = (a, b) => (a < b ? `${a},${b}` : `${b},${a}`);
const walk = (start, next) => {
	const pts = [start];
	let prev = start;
	let cur = next;
	used.add(key(prev, cur));
	for (;;) {
		pts.push(cur);
		if (isNode(cur)) break;
		const nx = nb(cur).filter((n) => n !== prev && !used.has(key(cur, n)));
		if (!nx.length) break;
		prev = cur;
		cur = nx[0];
		used.add(key(prev, cur));
	}
	return pts;
};
const lines = [];
for (let i = 0; i < W * H; i++) if (s[i] && isNode(i)) for (const n of nb(i)) if (!used.has(key(i, n))) lines.push(walk(i, n));
for (let i = 0; i < W * H; i++) if (s[i] && cross[i] === 2) for (const n of nb(i)) if (!used.has(key(i, n))) lines.push(walk(i, n));

const xy = (i) => [i % W, (i / W) | 0];
const polyLen = (p) => {
	let L = 0;
	for (let k = 1; k < p.length; k++) L += Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]);
	return L;
};
let maxR = 0;
for (let i = 0; i < W * H; i++) if (s[i]) maxR = Math.max(maxR, dist[i]);
const rdp = (pts, eps) => {
	if (pts.length < 3) return pts;
	const [ax, ay] = pts[0];
	const [bx, by] = pts[pts.length - 1];
	let md = 0;
	let mi = 0;
	for (let k = 1; k < pts.length - 1; k++) {
		const [px, py] = pts[k];
		const d = Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / (Math.hypot(by - ay, bx - ax) || 1);
		if (d > md) {
			md = d;
			mi = k;
		}
	}
	return md > eps ? [...rdp(pts.slice(0, mi + 1), eps).slice(0, -1), ...rdp(pts.slice(mi), eps)] : [pts[0], pts[pts.length - 1]];
};
const polys = lines
	.map((l) => l.map(xy))
	.filter((p) => {
		const free = cross[p[0][1] * W + p[0][0]] === 1 || cross[p.at(-1)[1] * W + p.at(-1)[0]] === 1;
		const L = polyLen(p);
		return !(free && L < maxR * 2.2) && L > 3;
	})
	.map((p) => rdp(p[0][0] > p.at(-1)[0] ? p.reverse() : p, 1.2))
	.sort((a, b) => Math.min(...a.map((q) => q[0])) - Math.min(...b.map((q) => q[0])));

// 4. Timing: one pen, constant speed, a lift across the word gap.
const SW = maxR * 2.3;
const total = polys.reduce((a, p) => a + polyLen(p), 0);
let clock = 0;
let reach = Number.NEGATIVE_INFINITY;
const timed = [];
for (const p of polys) {
	const minX = Math.min(...p.map((q) => q[0]));
	if (reach > Number.NEGATIVE_INFINITY && minX - reach > maxR * 6) clock += total * 0.06;
	const L = polyLen(p);
	timed.push({ p, t0: clock, t1: clock + L });
	clock += L;
	reach = Math.max(reach, ...p.map((q) => q[0]));
}

// 5. Dots for what the centre lines miss, then prove full coverage.
const ink = await sharp(inkBitmap).greyscale().raw().toBuffer();
const polyline = (p) =>
	`<polyline fill="none" stroke="#fff" stroke-width="${SW}" stroke-linecap="round" stroke-linejoin="round" points="${p.map((q) => q.join(",")).join(" ")}"/>`;
const renderMask = async (shapes) =>
	sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/>${shapes}</svg>`))
		.greyscale()
		.raw()
		.toBuffer();
const lineMask = await renderMask(polys.map(polyline).join(""));
const dots = [];
const r = (SW / 2) * 0.9;
for (let i = 0; i < ink.length; i++) {
	if (ink[i] >= 128 || lineMask[i] >= 128) continue;
	const x = i % W;
	const y = (i / W) | 0;
	if (!dots.some(([dx, dy]) => (dx - x) ** 2 + (dy - y) ** 2 <= r * r)) dots.push([x, y]);
}
const dotTimes = dots.map(([x, y]) => {
	let best = Number.POSITIVE_INFINITY;
	let t = 0;
	for (const seg of timed) {
		let acc = 0;
		for (let k = 0; k < seg.p.length; k++) {
			if (k) acc += Math.hypot(seg.p[k][0] - seg.p[k - 1][0], seg.p[k][1] - seg.p[k - 1][1]);
			const d = (seg.p[k][0] - x) ** 2 + (seg.p[k][1] - y) ** 2;
			if (d < best) {
				best = d;
				t = seg.t0 + acc;
			}
		}
	}
	return { p: [[x, y]], t0: t, t1: t };
});
const all = [...timed, ...dotTimes];
const finished = await renderMask(
	all.map((x) => (x.p.length > 1 ? polyline(x.p) : `<circle cx="${x.p[0][0]}" cy="${x.p[0][1]}" r="${SW / 2}" fill="#fff"/>`)).join(""),
);
let missed = 0;
for (let i = 0; i < ink.length; i++) if (ink[i] < 128 && finished[i] < 128) missed++;
if (missed) {
	console.error(`The finished mask leaves ${missed} ink pixels uncovered - not writing a file.`);
	process.exit(1);
}

// Emit at 1x, the scan's own resolution.
const S = 0.5;
const f = (n) => +(n * S).toFixed(1);
const fill = tracedSvg.match(/ d="([^"]+)"/)[1].replace(/-?\d+(\.\d+)?/g, (n) => String(Math.round(+n * S)));
const toD = (p) => (p.length === 1 ? `M${f(p[0][0])} ${f(p[0][1])}h0` : `M${p.map((q) => `${f(q[0])} ${f(q[1])}`).join("L")}`);
const strokes = all
	.sort((a, b) => a.t0 - b.t0)
	.map((x) => [toD(x.p), +(x.t0 / clock).toFixed(4), +((x.t1 - x.t0) / clock).toFixed(4)]);

writeFileSync(
	OUT,
	`// Generated by scripts/build-signature.mjs from photos/signature.png - do not edit by hand.
//
// \`fill\` is the traced ink. \`strokes\` are the pen's centre lines, in the
// order it moves, each as [path, start, length] with start and length as
// fractions of the whole write; the zero-length ones are dots that cover stroke
// tips the centre lines stop short of. Stroked at \`maskWidth\` with round caps,
// all of them together cover every pixel of the fill.

export const SIGNATURE = {
	width: ${f(W)},
	height: ${f(H)},
	maskWidth: ${f(SW)},
	fill: "${fill}",
	strokes: ${JSON.stringify(strokes)} as [string, number, number][],
} as const;
`,
);
console.log(`${OUT}: ${polys.length} strokes + ${dots.length} dots, full coverage, ${f(W)}x${f(H)}`);
