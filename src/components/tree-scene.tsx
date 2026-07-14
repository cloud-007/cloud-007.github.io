"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Tree } from "@dgreenheck/ez-tree";

/**
 * Photoreal tree scene (three.js + EZ-Tree).
 *
 * A compact, broad-canopied tree above ground and a root system below it,
 * exposed against a dark soil cross-section. The roots are a second EZ-Tree —
 * leafless, gnarled, inverted — so they get the same PBR bark realism as the
 * trunk.
 *
 * The soil line lives at world y = SOIL_Y. Everything above it is sky;
 * everything below is earth. The join between trunk and roots is made
 * seamless three ways at once:
 *   1. trunk base radius and root crown radius are computed from ONE value,
 *   2. the roots are hard-clipped at the soil line (no tip can ever rise into
 *      the sky — a GPU guarantee, not a physics nudge), and
 *   3. a fading topsoil layer is drawn in FRONT of the trunk→root junction, so
 *      the exact transition is buried under earth the way a real trunk enters
 *      the ground, and the roots emerge from under it into the cross-section.
 *
 * Data mapping:
 * - trunk/root thickness grows with years lived
 * - canopy leaf density and tint follow vitality from the growth algorithm
 * - branch spread scales with journey chapters
 * - root spread scales with the number of named roots
 * - day/night from live weather drives the lighting rig
 *
 * This module is heavy (EZ-Tree bundles its PBR textures), so it is only ever
 * loaded via next/dynamic when the section approaches the viewport. The canopy
 * is generated and painted first; the roots are built a beat later in an idle
 * callback so the tree shows up fast.
 */

const SOIL_Y = 0;

export interface TreeSceneProps {
    seed: number;
    entriesCount: number;
    chaptersCount: number;
    rootsCount: number;
    years: number;
    vitality: number;
    isDay: boolean;
}

function lerpColor(a: number, b: number, t: number): number {
    const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
    const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
    return (
        (Math.round(ar + (br - ar) * t) << 16) |
        (Math.round(ag + (bg - ag) * t) << 8) |
        Math.round(ab + (bb - ab) * t)
    );
}

/** Deep soil cross-section backdrop, sitting behind the roots. */
function makeSoilTexture(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#3a2a1c");
    g.addColorStop(0.08, "#2c2015");
    g.addColorStop(0.5, "#191009");
    g.addColorStop(1, "#080503");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 512);
    // fine organic speckle — subtle, fading with depth
    for (let i = 0; i < 1800; i++) {
        const y = Math.random() * 512;
        const depth = y / 512;
        const l = 12 + Math.random() * 14;
        ctx.fillStyle = `hsla(${18 + Math.random() * 16}, ${16 + Math.random() * 16}%, ${l}%, ${0.16 - depth * 0.1})`;
        ctx.beginPath();
        ctx.arc(Math.random() * 1024, y, 0.4 + Math.random() * 1.2, 0, Math.PI * 2);
        ctx.fill();
    }
    // a few faint buried stones
    for (let i = 0; i < 40; i++) {
        const y = 40 + Math.random() * 460;
        ctx.fillStyle = `hsla(${20 + Math.random() * 14}, 12%, ${16 + Math.random() * 8}%, 0.1)`;
        ctx.beginPath();
        ctx.ellipse(
            Math.random() * 1024, y,
            3 + Math.random() * 9, 2 + Math.random() * 5,
            Math.random() * Math.PI, 0, Math.PI * 2
        );
        ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

/**
 * Topsoil surface layer drawn in FRONT of the trunk/root junction. Opaque at
 * the surface line, fading to transparent below so the roots emerge from under
 * it. The crisp top edge is the horizon; a soft dark band just beneath it reads
 * as the trunk's contact shadow on the ground.
 */
function makeTopsoilTexture(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    // Canvas y=0 is the top = the surface line. A THIN opaque band right at
    // the surface hides the trunk↔root junction; it fades quickly so the solid
    // root flare is revealed just beneath it.
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0.0, "rgba(60, 44, 29, 1)");    // surface line — opaque topsoil
    g.addColorStop(0.14, "rgba(42, 30, 20, 1)");   // narrow opaque band over the join
    g.addColorStop(0.34, "rgba(28, 19, 12, 0.5)"); // begin revealing the flare
    g.addColorStop(0.6, "rgba(16, 11, 6, 0.14)");
    g.addColorStop(1.0, "rgba(8, 5, 3, 0)");        // transparent — cross-section
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 512);
    // A soft highlight right at the surface line so it catches the sky light.
    const hl = ctx.createLinearGradient(0, 0, 0, 26);
    hl.addColorStop(0, "rgba(126, 100, 68, 0.55)");
    hl.addColorStop(1, "rgba(126, 100, 68, 0)");
    ctx.fillStyle = hl;
    ctx.fillRect(0, 0, 1024, 26);
    // Soft, wide contact shadow under the trunk — grounds it without a hard block.
    const sh = ctx.createRadialGradient(512, 24, 8, 512, 24, 320);
    sh.addColorStop(0, "rgba(0, 0, 0, 0.32)");
    sh.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = sh;
    ctx.fillRect(0, 0, 1024, 160);
    // grain
    for (let i = 0; i < 1000; i++) {
        const y = Math.random() * 150;
        ctx.fillStyle = `hsla(${20 + Math.random() * 18}, 22%, ${14 + Math.random() * 14}%, ${0.14 * (1 - y / 200)})`;
        ctx.beginPath();
        ctx.arc(Math.random() * 1024, y, 0.5 + Math.random() * 1.4, 0, Math.PI * 2);
        ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

export default function TreeScene({
    seed,
    entriesCount,
    chaptersCount,
    rootsCount,
    years,
    vitality,
    isDay,
}: TreeSceneProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const paramsRef = useRef({ vitality, isDay });
    const refreshRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        // Per-material clip planes keep the root system strictly underground.
        renderer.localClippingEnabled = true;
        container.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 600);

        // Shared radius drives BOTH the trunk base and the root crown, so the
        // two meshes are the same thickness where they meet the soil line.
        const baseRadius = 2.6 + (years / 27) * 0.9;

        // Roots render only below the soil line; canopy only above it.
        const belowSoil = new THREE.Plane(new THREE.Vector3(0, -1, 0), SOIL_Y);
        const aboveSoil = new THREE.Plane(new THREE.Vector3(0, 1, 0), -SOIL_Y + 1);

        const applyClip = (obj: THREE.Object3D, planes: THREE.Plane[]) => {
            obj.traverse((o) => {
                const mesh = o as THREE.Mesh;
                if (!mesh.material) return;
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((m) => {
                    m.clippingPlanes = planes;
                    m.clipShadows = true;
                });
            });
        };

        /* ── Lighting rig ── */
        const hemi = new THREE.HemisphereLight(0xbdd7f2, 0x2a1c10, 1);
        scene.add(hemi);
        const sun = new THREE.DirectionalLight(0xfff2dd, 1);
        sun.position.set(45, 90, 70);
        scene.add(sun);
        const fill = new THREE.DirectionalLight(0xa8c4e0, 0.35);
        fill.position.set(-60, 20, 40);
        scene.add(fill);
        // dim uplight so the root ball reads against the dark soil
        const rootLight = new THREE.PointLight(0xd8c4a0, 0.7, 160, 1.6);
        rootLight.position.set(0, -22, 46);
        scene.add(rootLight);

        /* ── Soil cross-section backdrop (behind the roots) ──
           Top edge sits exactly on the soil line so sky meets earth cleanly. */
        const soilTex = makeSoilTexture();
        const soilH = 260;
        const soil = new THREE.Mesh(
            new THREE.PlaneGeometry(620, soilH),
            new THREE.MeshBasicMaterial({ map: soilTex })
        );
        soil.position.set(0, SOIL_Y - soilH / 2, -30);
        scene.add(soil);

        /* ── Topsoil surface layer (in front of the junction) ──
           Buries the trunk→root transition and gives a crisp horizon line. */
        const topsoilTex = makeTopsoilTexture();
        const topsoilH = 18;
        const topsoil = new THREE.Mesh(
            new THREE.PlaneGeometry(620, topsoilH),
            new THREE.MeshBasicMaterial({
                map: topsoilTex,
                transparent: true,
                depthWrite: false,
            })
        );
        // Opaque top edge on the soil line; fades downward over the crown.
        topsoil.position.set(0, SOIL_Y - topsoilH / 2, 16);
        topsoil.renderOrder = 2;
        scene.add(topsoil);

        /* ── Canopy tree ── */
        const tree = new Tree();
        const applyTreeOptions = () => {
            const { vitality: vit } = paramsRef.current;
            tree.loadPreset("Oak Medium");
            tree.options.seed = seed;
            // Compact but broad: short stout trunk, wide strong limbs.
            tree.options.branch.length[0] = 22;
            tree.options.branch.radius[0] = baseRadius;
            tree.options.branch.taper[0] = 0.6;
            tree.options.branch.children[0] = Math.min(9, 5 + chaptersCount);
            tree.options.branch.children[1] = 5;
            tree.options.branch.angle[1] = 60;
            tree.options.branch.gnarliness[1] = 0.16;
            tree.options.branch.length[1] = 17;
            tree.options.branch.force.direction.y = 1;
            tree.options.branch.force.strength = 0.02;
            tree.options.leaves.count = Math.round(
                20 + Math.min(46, entriesCount * 1.6) + vit * 18
            );
            tree.options.leaves.size = 2.7;
            tree.options.leaves.sizeVariance = 0.7;
            // Healthy: warm bright green. Low vitality: dry olive.
            tree.options.leaves.tint = lerpColor(0xb8a860, 0xe6f7cc, vit);
            tree.generate();
        };
        applyTreeOptions();
        // Trunk base sits on the soil line; canopy clipped to stay above it.
        tree.position.y = SOIL_Y;
        applyClip(tree, [aboveSoil]);
        scene.add(tree);

        /* ── Root system: an inverted, leafless, gnarled tree ──
           Built lazily after the canopy paints so the tree appears fast. */
        const roots = new Tree();
        let rootsBuilt = false;
        const buildRoots = () => {
            if (rootsBuilt) return;
            rootsBuilt = true;
            roots.loadPreset("Oak Medium");
            roots.options.seed = seed + 7;
            roots.options.bark.type = "willow";
            roots.options.bark.tint = 0xcbb9a2;
            roots.options.branch.levels = 3;
            // Crown radius MATCHES the trunk base radius → no step at the join.
            // A tall crown so the solid flare fills the space right under the
            // surface and the system mirrors the canopy's mass.
            roots.options.branch.length[0] = 16;
            roots.options.branch.radius[0] = baseRadius;
            roots.options.branch.taper[0] = 0.74;
            // Fewer but thick primary roots that fan out into denser secondaries
            // — reads as a solid root ball, not spider legs.
            roots.options.branch.children[0] = Math.min(8, 5 + Math.round(rootsCount / 2));
            roots.options.branch.children[1] = 4;
            roots.options.branch.children[2] = 3;
            roots.options.branch.start[1] = 0.06;
            roots.options.branch.start[2] = 0.18;
            roots.options.branch.angle[1] = 44;
            roots.options.branch.angle[2] = 38;
            roots.options.branch.angle[3] = 32;
            roots.options.branch.gnarliness[1] = 0.24;
            roots.options.branch.gnarliness[2] = 0.28;
            roots.options.branch.gnarliness[3] = 0.24;
            roots.options.branch.length[1] = 21;
            roots.options.branch.length[2] = 15;
            roots.options.branch.length[3] = 9;
            roots.options.branch.force.direction.y = 1;
            roots.options.branch.force.strength = 0.07;
            roots.options.leaves.count = 0;
            roots.generate();
            if (roots.leavesMesh) roots.leavesMesh.visible = false;
            // Invert by rotation (not negative scale) so surface normals — and
            // therefore lighting — stay correct on the roots. A gently wider
            // spread than the trunk reads as a natural root flare.
            roots.rotation.x = Math.PI;
            roots.scale.set(1.22, 1.05, 1.22);
            // Push the crown up above the soil line; the clip then slices it off
            // exactly at the surface, exposing a full-width root cross-section
            // that meets the trunk base with no empty soil between them.
            roots.position.y = SOIL_Y + 6;
            // Hard-clip everything above the soil line; double-side so the
            // gnarled undersides still catch the uplight.
            roots.traverse((o) => {
                const mesh = o as THREE.Mesh;
                if (!mesh.material) return;
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                mats.forEach((m) => {
                    m.clippingPlanes = [belowSoil];
                    m.clipShadows = true;
                    (m as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
                });
            });
            scene.add(roots);
            renderFrame();
        };

        /* ── Framing ── */
        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.position.set(0, 5, 168);
            camera.lookAt(0, 5, 0);
            camera.updateProjectionMatrix();
        };

        const applyLighting = () => {
            const { isDay: day } = paramsRef.current;
            // Night keeps a lifted floor so the tree stays a legible silhouette
            // with a hint of green, rather than going near-black.
            hemi.intensity = day ? 1.4 : 0.6;
            hemi.color.set(day ? 0xbdd7f2 : 0x3a4a66);
            hemi.groundColor.set(day ? 0x2a1c10 : 0x241a2e);
            sun.intensity = day ? 1.7 : 0.3;
            sun.color.set(day ? 0xfff2dd : 0xaec2e6);
            fill.intensity = day ? 0.5 : 0.22;
            rootLight.intensity = day ? 0.95 : 0.5;
        };
        applyLighting();

        /* ── Animation ── */
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        let raf = 0;
        let running = false;
        // Manual delta (THREE.Clock is deprecated in favour of THREE.Timer,
        // which isn't a core export — a performance.now() delta avoids both).
        let last = performance.now();
        let elapsed = 0;

        const renderFrame = () => {
            renderer.render(scene, camera);
        };
        const loop = () => {
            const now = performance.now();
            elapsed += (now - last) / 1000;
            last = now;
            tree.update(elapsed); // built-in wind sway
            camera.position.x = Math.sin(elapsed * 0.1) * 2.2;
            camera.lookAt(0, 6, 0);
            renderFrame();
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (running || reducedMotion) return;
            running = true;
            last = performance.now();
            raf = requestAnimationFrame(loop);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(raf);
        };

        const ro = new ResizeObserver(() => {
            resize();
            renderFrame();
        });
        ro.observe(container);
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) start();
            else stop();
        });
        io.observe(container);

        resize();
        renderFrame(); // paint the canopy immediately
        start();

        // Build the (heavier) root system once the canopy is on screen.
        const idle =
            (window as unknown as { requestIdleCallback?: typeof requestIdleCallback })
                .requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 60));
        const rootsHandle = idle(() => buildRoots());

        refreshRef.current = () => {
            applyTreeOptions();
            tree.position.y = SOIL_Y;
            applyClip(tree, [aboveSoil]);
            applyLighting();
            renderFrame();
        };

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            const cancelIdle =
                (window as unknown as { cancelIdleCallback?: (h: number) => void })
                    .cancelIdleCallback;
            if (cancelIdle && typeof rootsHandle === "number") cancelIdle(rootsHandle);
            refreshRef.current = null;
            soilTex.dispose();
            topsoilTex.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
            scene.traverse((obj) => {
                const mesh = obj as THREE.Mesh;
                if (mesh.geometry) mesh.geometry.dispose();
                const mats = Array.isArray(mesh.material)
                    ? mesh.material
                    : mesh.material
                      ? [mesh.material]
                      : [];
                mats.forEach((m) => m.dispose());
            });
        };
        // Scene is rebuilt only for structural inputs; vitality/lighting
        // updates flow through refreshRef below.
    }, [seed, entriesCount, chaptersCount, rootsCount, years]);

    useEffect(() => {
        paramsRef.current = { vitality, isDay };
        refreshRef.current?.();
    }, [vitality, isDay]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            role="img"
            aria-label={`Photoreal growth tree with ${entriesCount} entries and a deep root system`}
        />
    );
}
