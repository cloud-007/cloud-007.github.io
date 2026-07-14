"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Tree } from "@dgreenheck/ez-tree";

/**
 * Photoreal tree scene (three.js + EZ-Tree).
 *
 * Composition mirrors the reference: a compact, broad-canopied tree above
 * ground and a root system almost as large as the canopy below it, exposed
 * against a dark soil cross-section. The roots are a second EZ-Tree —
 * leafless, gnarled, inverted — so they get the same PBR bark realism as
 * the trunk.
 *
 * Data mapping:
 * - trunk thickness grows with years lived
 * - canopy leaf density and tint follow vitality from the growth algorithm
 * - branch spread scales with journey chapters
 * - root spread scales with the number of named roots
 * - day/night from live weather drives the lighting rig
 *
 * This module is heavy (EZ-Tree bundles its PBR textures), so it is only
 * ever loaded via next/dynamic when the section approaches the viewport.
 */

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

/** Procedural soil-cross-section backdrop texture. */
function makeSoilTexture(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, "#2e2118");
    g.addColorStop(0.06, "#241a12");
    g.addColorStop(0.5, "#17100b");
    g.addColorStop(1, "#0b0805");
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
        container.appendChild(renderer.domElement);
        renderer.domElement.style.display = "block";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 600);

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
        const rootLight = new THREE.PointLight(0xd8c4a0, 0.7, 140, 1.6);
        rootLight.position.set(0, -18, 42);
        scene.add(rootLight);

        /* ── Soil cross-section backdrop ── */
        const soilTex = makeSoilTexture();
        const soil = new THREE.Mesh(
            new THREE.PlaneGeometry(520, 130),
            new THREE.MeshBasicMaterial({ map: soilTex })
        );
        // Top edge of the soil plane sits at world y = +3, so it buries the
        // root crown and the trunk→root transition on every aspect ratio.
        soil.position.set(0, -65 + 3, -26);
        scene.add(soil);

        /* ── Canopy tree ── */
        const tree = new Tree();
        const applyTreeOptions = () => {
            const { vitality: vit } = paramsRef.current;
            tree.loadPreset("Oak Medium");
            tree.options.seed = seed;
            // Compact but broad: short stout trunk, wide strong limbs.
            tree.options.branch.length[0] = 22;
            tree.options.branch.radius[0] = 2.4 + (years / 27) * 0.9;
            tree.options.branch.taper[0] = 0.62;
            tree.options.branch.children[0] = Math.min(8, 4 + chaptersCount);
            tree.options.branch.children[1] = 4;
            tree.options.branch.angle[1] = 62;
            tree.options.branch.gnarliness[1] = 0.18;
            tree.options.branch.length[1] = 16;
            tree.options.branch.force.direction.y = 1;
            tree.options.branch.force.strength = 0.02;
            tree.options.leaves.count = Math.round(
                12 + Math.min(34, entriesCount * 1.2) + vit * 12
            );
            tree.options.leaves.size = 2.6;
            tree.options.leaves.sizeVariance = 0.8;
            // Healthy: warm bright green. Low vitality: dry olive.
            tree.options.leaves.tint = lerpColor(0xb8a860, 0xe6f7cc, vit);
            tree.generate();
        };
        applyTreeOptions();
        scene.add(tree);

        /* ── Root system: an inverted, leafless, gnarled tree ── */
        const roots = new Tree();
        const applyRootOptions = () => {
            roots.loadPreset("Oak Medium");
            roots.options.seed = seed + 7;
            roots.options.bark.type = "willow";
            roots.options.bark.tint = 0xcbb9a2;
            roots.options.branch.levels = 3;
            // Short root crown: laterals must fan out right at the soil
            // line, not several units below it.
            roots.options.branch.length[0] = 9;
            roots.options.branch.radius[0] = 2.8 + (years / 27) * 0.9;
            roots.options.branch.taper[0] = 0.7;
            roots.options.branch.children[0] = Math.min(10, 4 + rootsCount);
            roots.options.branch.children[1] = 4;
            roots.options.branch.children[2] = 3;
            roots.options.branch.start[1] = 0.05;
            roots.options.branch.start[2] = 0.15;
            // Laterals dive down-and-out (45°) rather than splaying flat, so
            // no root tip curls back up above the soil line.
            roots.options.branch.angle[1] = 45;
            roots.options.branch.angle[2] = 40;
            roots.options.branch.angle[3] = 34;
            roots.options.branch.gnarliness[1] = 0.3;
            roots.options.branch.gnarliness[2] = 0.34;
            roots.options.branch.gnarliness[3] = 0.28;
            roots.options.branch.length[1] = 17;
            roots.options.branch.length[2] = 13;
            roots.options.branch.length[3] = 8;
            // Strong gravity bias (roots are inverted) pulls every level down
            // and keeps the whole system below the surface.
            roots.options.branch.force.direction.y = 1;
            roots.options.branch.force.strength = 0.09;
            roots.options.leaves.count = 0;
            roots.generate();
            // leaves.count is not always honored at generation time — make
            // sure the root system never sprouts foliage.
            if (roots.leavesMesh) roots.leavesMesh.visible = false;
        };
        applyRootOptions();
        roots.scale.set(1.25, -1.1, 1.25);
        roots.position.y = -0.5;
        scene.add(roots);

        /* ── Framing ── */
        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            // Frame trunk + canopy above y=0 and the root ball below it.
            camera.position.set(0, 5, 168);
            camera.lookAt(0, 5, 0);
            camera.updateProjectionMatrix();
        };

        const applyLighting = () => {
            const { isDay: day } = paramsRef.current;
            hemi.intensity = day ? 1.4 : 0.32;
            hemi.color.set(day ? 0xbdd7f2 : 0x33415c);
            sun.intensity = day ? 1.7 : 0.12;
            fill.intensity = day ? 0.5 : 0.1;
            rootLight.intensity = day ? 0.9 : 0.4;
        };
        applyLighting();

        /* ── Animation ── */
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        let raf = 0;
        let running = false;
        const clock = new THREE.Clock();
        let elapsed = 0;

        const renderFrame = () => {
            renderer.render(scene, camera);
        };
        const loop = () => {
            elapsed += clock.getDelta();
            tree.update(elapsed); // built-in wind sway
            // barely-perceptible parallax drift so the scene breathes
            camera.position.x = Math.sin(elapsed * 0.1) * 2.2;
            camera.lookAt(0, 6, 0);
            renderFrame();
            raf = requestAnimationFrame(loop);
        };
        const start = () => {
            if (running || reducedMotion) return;
            running = true;
            clock.start();
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
        renderFrame();
        start();

        refreshRef.current = () => {
            applyTreeOptions();
            applyLighting();
            renderFrame();
        };

        return () => {
            stop();
            ro.disconnect();
            io.disconnect();
            refreshRef.current = null;
            soilTex.dispose();
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
