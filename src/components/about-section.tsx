import { CursorCard } from "#/components/ui/cursor-card";
import {
	type CarouselImage,
	CylinderCarousel,
} from "#/components/ui/cylinder-carousel";
import { HERO_DEEP } from "#/lib/palette";

/**
 * About, sitting under the hero.
 *
 * The background is a slowly turning cylinder of image cards, masked to fade
 * out at both edges so it reads as depth behind the copy rather than a widget
 * sitting on the page.
 */

/**
 * Placeholder photography, pulled from Unsplash and cropped to the 7:10 the
 * carousel enforces. These are stand-ins - they are third-party URLs on an
 * external host, so swap them for local files before this ships.
 */
const UNSPLASH = (id: string, w: number, h: number) =>
	`https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`;

/** The cards on the cylinder. CylinderCarousel has no placeholder mode. */
const RING_IMAGES: CarouselImage[] = [
	"1550751827-4bd374c3f58b",
	"1526374965328-7f61d4dc18c5",
	"1518770660439-4636190af475",
	"1510915361894-db8b60106cb1",
	"1504384308090-c894fdcc538d",
	"1517430816045-df4b7de11d1d",
	"1544197150-b99a580bb7a8",
	"1563986768609-322da13575f3",
].map((id) => ({ src: UNSPLASH(id, 560, 800), alt: "" }));

/** Previews for the hover cards. */
const CARD = {
	agencies: UNSPLASH("1563986768609-322da13575f3", 480, 300),
	press: UNSPLASH("1504384308090-c894fdcc538d", 480, 300),
	students: UNSPLASH("1523240795612-9a054b0db644", 480, 300),
};

/**
 * CursorCard ships with its own light-mode look - neutral-900 text on an
 * orange hover wash. Both are wrong on this field, and since the component
 * merges through `cn`, passing replacements here wins on the conflicting
 * utilities without touching the vendored file.
 *
 * `text-white!` carries the important flag on purpose. CursorCard renders an
 * <a>, and styles.css has an unlayered `a { color: var(--lagoon-deep) }`;
 * unlayered CSS beats Tailwind's layered utilities at any specificity, so a
 * plain `text-white` loses and the marks render teal. CursorCard exposes no
 * `style` prop to go around it, so the important flag is the way through.
 */
const MARK =
	"font-semibold text-white! hover:bg-white/10 dark:hover:bg-white/10 decoration-transparent";

/** The floating preview, restyled onto this page's field. See CursorCard's
 * `cardClassName` for why this cannot be done with its `dark:` variants. */
const MARK_CARD = "border-white/10 bg-[#02171f] text-white shadow-black/50";

export function AboutSection() {
	return (
		<section
			id="about"
			className="relative isolate flex min-h-screen items-center overflow-hidden px-6 py-20 sm:px-10"
			style={{ backgroundColor: HERO_DEEP }}
		>
			{/* pointer-events-none because this is scenery: the cylinder should
			    never eat a click or a text selection meant for the copy over it. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-20"
			>
				<CylinderCarousel
					images={RING_IMAGES}
					cardWidth={420}
					animationDuration={60}
					className="h-full"
					// Padding on the <img> shrinks its content box, so the photo sits
					// inset inside the card slot rather than filling it edge to edge.
					// The slot keeps its 420px footprint; only the picture gets smaller.
					cardClassName="border border-white/10 bg-white/[0.04]"
				/>
			</div>

			{/* A light, even veil - just enough to sit the carousel in the page's
			    key. This was a radial at 95% opacity dead centre, which is exactly
			    where the copy sits: it erased the photographs in the middle and left
			    them showing only around the edges. The copy is made readable by its
			    own panel instead, which keeps the images clear everywhere else. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 -z-10"
				style={{ backgroundColor: `${HERO_DEEP}40` }}
			/>

			<div className="relative mx-auto max-w-3xl rounded-3xl border border-white/10 bg-[#001219]/80 p-7 backdrop-blur-md sm:p-10">
				<p
					className="text-xs font-semibold uppercase tracking-[0.28em]"
					style={{ color: "#e9d8a6" }}
				>
					About
				</p>

				<h2 className="mt-5 text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
					Gautam Kumawat
				</h2>

				<div className="mt-6 space-y-4 text-base leading-relaxed text-white/70 sm:text-lg">
					<p>
						Gautam Kumawat is a PRO expert in the field of cybersecurity. If
						you're looking for an instructor with a deep understanding and even
						more importantly – with a proven record of working in top-level
						institutions, then you met your dream right here.
					</p>

					<p>
						Gautam has over seven years of experience serving in prestigious
						institutions both in India and the US. The list includes various{" "}
						<CursorCard
							image={CARD.agencies}
							description="Seven years across prestigious institutions in India and the US, training officials and solving cybercrimes of profound complexity."
							className={MARK}
							cardClassName={MARK_CARD}
						>
							law enforcement agencies
						</CursorCard>
						. His job included training officials and solving cybercrimes of
						profound complexity.
					</p>

					<p>
						Gautam Kumawat emphasizes that our world is getting more cyber,
						which naturally means that the rates of cybercrimes are increasing.
						And they are getting more complicated. The only way to stay
						protected is to get educated. Even if you're not working as a
						cybersecurity expert in a big company or an institution that keeps
						national secrets. He's been escalating the topic in global media,
						featured in names such as{" "}
						<CursorCard
							image={CARD.press}
							description="Featured in Thriveglobal, Hindustan Times, India Today, The Hindu, Times of India, Economic Times and many others."
							className={MARK}
							cardClassName={MARK_CARD}
						>
							Thriveglobal, Hindustan Times, India Today, The Hindu, Times of
							India, Economic Times
						</CursorCard>{" "}
						and many others.
					</p>

					<p>
						Learn the art of cybersecurity, ethical hacking, and all about the
						darknet from an experienced expert and trainer. Gautam Kumawat has
						already taught{" "}
						<CursorCard
							image={CARD.students}
							description="Over 41,000 students taught, from more than 162 countries."
							className={MARK}
							cardClassName={MARK_CARD}
						>
							over 41,000 students from more than 162 countries
						</CursorCard>
						!
					</p>
				</div>
			</div>
		</section>
	);
}
