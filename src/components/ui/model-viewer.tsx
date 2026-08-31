"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { cn } from "#/lib/utils";

/**
 * A small glTF/GLB viewer.
 *
 * Written because the Sketchfab embed puts its own player between the visitor
 * and the model: a grey backdrop that fights a dark page, the uploader's
 * branding bar, and a click-to-load poster gate. Loading the .glb directly
 * gives a transparent canvas that sits on the section's own field and turns by
 * itself.
 *
 * Costs are managed deliberately, since this page already carries several
 * canvases: the loop only runs while the model is on screen and the tab is
 * visible, and everything is disposed on unmount.
 */
export function ModelViewer({
	src,
	className,
	alt,
	autoRotateSpeed = 0.9,
	/** Vertical framing: >1 pulls the camera back, leaving more air. */
	zoom = 1,
}: {
	src: string;
	className?: string;
	/** Describes the model for anyone who cannot see the canvas. */
	alt: string;
	autoRotateSpeed?: number;
	zoom?: number;
}) {
	const hostRef = useRef<HTMLDivElement>(null);
	const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

	useEffect(() => {
		const host = hostRef.current;
		if (!host) return;

		const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let disposed = false;
		let raf = 0;

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			// Transparent, so the section's own background shows through instead of
			// the grey plate the embed painted.
			alpha: true,
			powerPreference: "low-power",
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.15;
		host.appendChild(renderer.domElement);
		renderer.domElement.style.width = "100%";
		renderer.domElement.style.height = "100%";
		renderer.domElement.style.display = "block";

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

		// A room environment gives the stylised covers real reflections without
		// shipping an HDR file.
		const pmrem = new THREE.PMREMGenerator(renderer);
		scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

		const key = new THREE.DirectionalLight(0xffffff, 2.1);
		key.position.set(2.5, 3.5, 2.5);
		scene.add(key);
		scene.add(new THREE.AmbientLight(0xffffff, 0.35));

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.06;
		controls.enablePan = false;
		controls.enableZoom = false;
		controls.autoRotate = !still;
		controls.autoRotateSpeed = autoRotateSpeed;

		const resize = () => {
			const { clientWidth: w, clientHeight: h } = host;
			if (!w || !h) return;
			renderer.setSize(w, h, false);
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		};

		let root: THREE.Object3D | null = null;
		new GLTFLoader().load(
			src,
			(gltf) => {
				if (disposed) return;
				root = gltf.scene;

				// Centre the model on the origin and frame it from its own bounding
				// sphere, so the component works for any model without hand-tuned
				// camera numbers.
				const box = new THREE.Box3().setFromObject(root);
				const sphere = box.getBoundingSphere(new THREE.Sphere());
				root.position.sub(sphere.center);
				scene.add(root);

				const fov = (camera.fov * Math.PI) / 180;
				const distance = (sphere.radius / Math.sin(fov / 2)) * zoom;
				camera.position.set(distance * 0.55, distance * 0.32, distance * 0.78);
				camera.near = distance / 100;
				camera.far = distance * 10;
				camera.updateProjectionMatrix();
				controls.target.set(0, 0, 0);
				controls.update();

				resize();
				// Paint once immediately. The animation loop is gated on an
				// IntersectionObserver, so without this a browser that delays or
				// never delivers that callback would leave a blank canvas where the
				// model should be. Failing to a still model beats failing to nothing.
				renderer.render(scene, camera);
				setState("ready");
			},
			undefined,
			() => {
				if (!disposed) setState("failed");
			},
		);

		// Only run while it is actually on screen and the tab is in front. This
		// page carries other canvases; an off-screen model does not need frames.
		let onScreen = false;
		let visible = document.visibilityState === "visible";
		const running = () => onScreen && visible && !disposed;

		const frame = () => {
			if (!running()) {
				raf = 0;
				return;
			}
			controls.update();
			renderer.render(scene, camera);
			raf = requestAnimationFrame(frame);
		};
		const wake = () => {
			if (running() && !raf) raf = requestAnimationFrame(frame);
		};

		const io = new IntersectionObserver((entries) => {
			onScreen = entries[0]?.isIntersecting ?? false;
			wake();
		});
		io.observe(host);

		const onVisibility = () => {
			visible = document.visibilityState === "visible";
			wake();
		};
		document.addEventListener("visibilitychange", onVisibility);

		const ro = new ResizeObserver(() => {
			resize();
			// Repaint once on resize even while paused, so a resized-but-idle
			// canvas is never left showing a stale frame.
			if (!raf) renderer.render(scene, camera);
		});
		ro.observe(host);
		resize();

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			io.disconnect();
			ro.disconnect();
			document.removeEventListener("visibilitychange", onVisibility);
			controls.dispose();
			if (root) {
				root.traverse((node) => {
					const mesh = node as THREE.Mesh;
					if (!mesh.isMesh) return;
					mesh.geometry?.dispose();
					const material = mesh.material;
					if (Array.isArray(material)) {
						for (const m of material) m.dispose();
					} else {
						material?.dispose();
					}
				});
			}
			scene.environment?.dispose();
			pmrem.dispose();
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, [src, autoRotateSpeed, zoom]);

	return (
		<div
			ref={hostRef}
			className={cn("relative", className)}
			role="img"
			aria-label={alt}
			data-state={state}
		>
			{state === "failed" ? (
				<p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/50">
					The 3D model could not be loaded.
				</p>
			) : null}
		</div>
	);
}
