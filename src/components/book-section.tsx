import { ArrowRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { ClientOnly, InView } from "#/components/ui/deferred";
import { Reveal } from "#/components/ui/scroll-reveal";
import { HERO_DEEP, SHADER_BLUE_BRIGHT } from "#/lib/palette";

const ModelViewer = lazy(() =>
	import("#/components/ui/model-viewer").then((m) => ({
		default: m.ModelViewer,
	})),
);

/**
 * The book, announced with a 3D model rather than a mockup.
 *
 * The model is "Stylized Book" by Kevin. It is rendered from the local .glb
 * rather than through Sketchfab's iframe: the embed ships its own player -
 * grey backdrop, uploader branding bar, and a click-to-play poster gate -
 * none of which belong on this field. Loading the file directly gives a
 * transparent canvas that turns on its own.
 *
 * Attribution, kept here rather than on the page: "Stylized Book" by Kevin,
 * https://sketchfab.com/3d-models/stylized-book-dfe34d6fe2404c67a70c3703bff3ba69,
 * licensed CC BY 4.0. The visible credit line was removed at the client's
 * request; CC-BY asks for attribution in a manner reasonable to the medium, so
 * if this ships publicly it is worth putting the line back somewhere - a
 * /credits page or the About copy - rather than leaving it only in source.
 *
 * Copy notes: no title, no date, no pre-order. There is no book yet, and
 * inventing a cover line or a ship date to fill the layout would be the exact
 * guru move this brand rules out. It says what is true - it is being written -
 * and points at the booking block for anyone who wants to hear when it lands.
 */
export function BookSection() {
	return (
		<section
			id="the-book"
			className="relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28"
			style={{ backgroundColor: HERO_DEEP }}
		>
			<div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
				<div>
					{/* A live status line rather than a bordered pill. The pill read as
					    a badge stuck on the layout; as type with a lit dot it belongs
					    to the copy and sits on the headline's own left edge. */}
					<Reveal>
						<p className="flex items-center gap-2.5 text-sm font-medium text-white/50">
							{/* A lit dot, not a pulsing one. "Momentum, never fidget" - a
							    perpetual ping next to the headline is exactly the ambient
							    wiggle the brand rules out. */}
							<span
								aria-hidden="true"
								className="h-2 w-2 rounded-full"
								style={{
									backgroundColor: SHADER_BLUE_BRIGHT,
									boxShadow: `0 0 10px 1px ${SHADER_BLUE_BRIGHT}80`,
								}}
							/>
							Writing now
						</p>
					</Reveal>

					{/* One colour, no grey second line. The hero and the reach block
					    already use the white-line/grey-line headline; a third would turn
					    a device into a tic. Here scale alone carries it. */}
					<Reveal delay={0.06}>
						<h2 className="mt-5 text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl lg:text-[clamp(2.8rem,4.4vw,4rem)]">
							The work, written down
						</h2>
					</Reveal>

					{/* One short deck instead of the previous run-on sentence, with the
					    caveats broken out below it - they are three separate facts and
					    read better counted than buried in a clause. */}
					<Reveal delay={0.12}>
						<p className="mt-6 max-w-[38ch] text-base leading-relaxed text-white/60 sm:text-lg">
							Case notes, method, and the parts that never make it into a
							syllabus.
						</p>
					</Reveal>

					<Reveal delay={0.16}>
						<ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/35">
							{["No title yet", "No date", "Nothing to pre-order"].map(
								(item, i) => (
									<li key={item} className="flex items-center gap-3">
										{i > 0 ? (
											<span aria-hidden="true" className="text-white/20">
												·
											</span>
										) : null}
										{item}
									</li>
								),
							)}
						</ul>
					</Reveal>

					<Reveal delay={0.2}>
						<a
							href="#book"
							className="mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
							// Inline colour: styles.css carries an unlayered `a { color }`
							// rule that beats Tailwind's layered utilities.
							style={{ backgroundColor: SHADER_BLUE_BRIGHT, color: "#ffffff" }}
						>
							Hear when it lands
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
						</a>
					</Reveal>
				</div>

				<Reveal delay={0.1} direction="left">
					{/* aspect-ratio rather than a fixed height, so the model keeps its
					    proportions from a phone up to a wide monitor. */}
					{/* three.js and the GLTF loader are the single heaviest import on
					    the page, for one decorative object below the fold. Loaded when
					    the section is approaching, and released again when it is well
					    behind - a WebGL context spinning for a book nobody is looking
					    at is what made the page feel like it was dragging. */}
					<ClientOnly fallback={<div className="aspect-[4/3] w-full" />}>
						<InView rootMargin="800px" className="aspect-[4/3] w-full">
							<Suspense fallback={<div className="size-full" />}>
								<ModelViewer
									src="/stylized_book.glb"
									alt="A stylised 3D book, slowly turning"
									zoom={1.15}
									className="size-full"
								/>
							</Suspense>
						</InView>
					</ClientOnly>
				</Reveal>
			</div>
		</section>
	);
}
