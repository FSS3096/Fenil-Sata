import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Podium, STEPS } from "../components/Podium";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

// Best result first. Every line comes from the resume.
const RESULTS = [...STEPS].reverse();

const TEXT_W = 8;
const TEXT_H = 4.4;

const VERT = /* glsl */ `
attribute float aSeed;
attribute float aSpeed;
uniform float uSize;
uniform float uPx;
uniform float uDist;
varying float vSeed;
varying float vSpeed;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPx * (0.8 + aSeed * 0.7) * (uDist / -mv.z);
  vSeed = aSeed;
  vSpeed = aSpeed;
}`;

const FRAG = /* glsl */ `
precision mediump float;
varying float vSeed;
varying float vSpeed;
uniform vec3 uA;
uniform vec3 uB;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.12, d);
  vec3 base = mix(uA, uB, step(0.74, vSeed));
  vec3 col = mix(base, vec3(1.0), clamp(vSpeed * 0.07, 0.0, 0.9));
  gl_FragColor = vec4(col, a);
}`;

/** Rasterise a word and turn its pixels into a cloud of target points, centred and fitted to the stage. */
function sampleWord(word: string, count: number, slots: Uint32Array): Float32Array {
  const W = 1400;
  const H = 600;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const out = new Float32Array(count * 3);

  if (!ctx) {
    return out;
  }

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '800 470px "Archivo", "Helvetica Neue", Arial, sans-serif';
  try {
    (ctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = "condensed";
  } catch {
    /* older browsers draw the normal width */
  }
  ctx.fillText(word, W / 2, H / 2);

  const { data } = ctx.getImageData(0, 0, W, H);
  const pts: number[] = [];
  let minX = W;
  let maxX = 0;
  let minY = H;
  let maxY = 0;

  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        pts.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const n = pts.length / 2;

  if (n === 0) {
    return out;
  }

  const scale = Math.min(TEXT_W / (maxX - minX), TEXT_H / (maxY - minY));
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  for (let i = 0; i < count; i++) {
    // Stratified pick so the letters stay evenly covered, then scattered across particle slots.
    const j = Math.min(n - 1, Math.floor(((i + Math.random()) * n) / count));
    const o = slots[i] * 3;
    out[o] = (pts[j * 2] - cx) * scale;
    out[o + 1] = -(pts[j * 2 + 1] - cy) * scale;
    out[o + 2] = (Math.random() - 0.5) * 1.6;
  }

  return out;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Wins stage: a cloud of particles that forms the rank of each result.
 * The cursor parts it, a click sends a shockwave through it, and picking a result
 * swirls it apart and rebuilds it as the next rank.
 */
export function WinsStage() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const [touched, setTouched] = useState(false);
  const mount = useRef<HTMLDivElement>(null);
  const retarget = useRef<((index: number) => void) | null>(null);
  const activeRef = useRef(0);
  const lastInteract = useRef(0);

  activeRef.current = active;

  const choose = (index: number) => {
    lastInteract.current = performance.now() / 1000;
    setActive(index);
  };

  useEffect(() => {
    retarget.current?.(active);
  }, [active]);

  useEffect(() => {
    const host = mount.current;

    if (reduced || failed || !host) {
      return;
    }

    let disposed = false;
    let teardown: () => void = () => {};

    const init = async () => {
      try {
        await Promise.race([
          document.fonts.load('800 200px "Archivo"'),
          new Promise((resolve) => setTimeout(resolve, 1500))
        ]);
      } catch {
        /* fall back to the system face */
      }

      if (disposed) {
        return;
      }

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const N = coarse ? 7000 : 14000;

      let renderer: THREE.WebGLRenderer;

      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      // particle slots are shuffled so every word is built from a mix of the whole cloud
      const slots = new Uint32Array(N);
      for (let i = 0; i < N; i++) slots[i] = i;
      for (let i = N - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = slots[i];
        slots[i] = slots[j];
        slots[j] = tmp;
      }

      const shapes = RESULTS.map((result) => sampleWord(result.rank, N, slots));

      const pos = new Float32Array(N * 3);
      const vel = new Float32Array(N * 3);
      const tgt = new Float32Array(N * 3);
      const seed = new Float32Array(N);
      const speed = new Float32Array(N);
      const delay = new Float32Array(N);
      const phase = new Float32Array(N);

      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        pos[i3] = (Math.random() - 0.5) * 30;
        pos[i3 + 1] = (Math.random() - 0.5) * 18;
        pos[i3 + 2] = (Math.random() - 0.5) * 14;
        seed[i] = Math.random();
        phase[i] = Math.random() * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      const posAttr = new THREE.BufferAttribute(pos, 3);
      const speedAttr = new THREE.BufferAttribute(speed, 1);
      posAttr.setUsage(THREE.DynamicDrawUsage);
      speedAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute("position", posAttr);
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      geometry.setAttribute("aSpeed", speedAttr);

      const uniforms = {
        uSize: { value: coarse ? 3.3 : 3.0 },
        uPx: { value: dpr },
        uDist: { value: 12 },
        uA: { value: new THREE.Color("#ffe24a") },
        uB: { value: new THREE.Color("#f8f9fb") }
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;

      const scene = new THREE.Scene();
      scene.add(points);

      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      let halfW = 5;
      let halfH = 4;

      const resize = () => {
        const w = Math.max(1, host.clientWidth);
        const h = Math.max(1, host.clientHeight);
        const aspect = w / h;

        renderer.setSize(w, h);
        camera.aspect = aspect;
        // fit the widest word with a margin, but never crop the height of the glyphs
        halfH = Math.max(5.2 / aspect, 3.3);
        halfW = halfH * aspect;
        const dist = halfH / tanHalf;
        camera.position.set(0, 0, dist);
        camera.updateProjectionMatrix();
        uniforms.uDist.value = dist;
      };

      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(host);

      // --- state -----------------------------------------------------------------------------
      let t = 0;
      let morphT0 = 0;
      let lastSwitch = 0;
      let current = activeRef.current;
      let visible = false;
      let started = false;
      let raf = 0;
      let last = 0;

      const pointer = { x: 0, y: 0, vx: 0, vy: 0, nx: 0, ny: 0, on: false, lx: 0, ly: 0, lt: 0 };
      const shocks: { x: number; y: number; t: number }[] = [];

      const setTarget = (index: number, assemble = false) => {
        current = index;
        tgt.set(shapes[index]);
        morphT0 = t;
        lastSwitch = t;
        const spread = assemble ? 0.7 : 0.5;
        for (let i = 0; i < N; i++) {
          delay[i] = Math.random() * spread;

          if (!assemble) {
            // the old word detonates before the new one is pulled together
            const i3 = i * 3;
            vel[i3] += (Math.random() - 0.5) * 22;
            vel[i3 + 1] += (Math.random() - 0.5) * 22;
            vel[i3 + 2] += (Math.random() - 0.5) * 26;
          }
        }
      };

      setTarget(current, true);
      retarget.current = (index) => {
        if (index !== current) setTarget(index);
      };

      const toWorld = (event: PointerEvent) => {
        const r = host.getBoundingClientRect();
        const nx = ((event.clientX - r.left) / r.width) * 2 - 1;
        const ny = -(((event.clientY - r.top) / r.height) * 2 - 1);
        return { x: nx * halfW, y: ny * halfH, nx, ny };
      };

      const onMove = (event: PointerEvent) => {
        const w = toWorld(event);
        const now = performance.now();
        const dtMs = Math.max(8, now - pointer.lt);

        if (pointer.on) {
          pointer.vx = clamp(((w.x - pointer.lx) / dtMs) * 1000, -40, 40);
          pointer.vy = clamp(((w.y - pointer.ly) / dtMs) * 1000, -40, 40);
        }

        pointer.x = w.x;
        pointer.y = w.y;
        pointer.nx = w.nx;
        pointer.ny = w.ny;
        pointer.lx = w.x;
        pointer.ly = w.y;
        pointer.lt = now;
        pointer.on = true;
        lastInteract.current = now / 1000;
        setTouched(true);
      };

      const onDown = (event: PointerEvent) => {
        onMove(event);
        shocks.push({ x: pointer.x, y: pointer.y, t });
        if (shocks.length > 4) shocks.shift();
      };

      const onLeave = () => {
        pointer.on = false;
        pointer.vx = 0;
        pointer.vy = 0;
      };

      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerdown", onDown);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointercancel", onLeave);

      // --- physics ---------------------------------------------------------------------------
      const R = 2.3;
      const R2 = R * R;

      const step = (dt: number) => {
        const damp = Math.exp(-4.2 * dt);
        const rise = t - morphT0;

        pointer.vx *= 0.9;
        pointer.vy *= 0.9;

        while (shocks.length && t - shocks[0].t > 1.9) shocks.shift();

        for (let i = 0; i < N; i++) {
          const i3 = i * 3;
          const px = pos[i3];
          const py = pos[i3 + 1];
          const pz = pos[i3 + 2];

          // spring toward the word; each particle starts pulling at its own moment
          const p = clamp((rise - delay[i]) / 0.9, 0, 1);
          const k = 4 + 17 * p * p;
          let ax = (tgt[i3] - px) * k;
          let ay = (tgt[i3 + 1] - py) * k;
          let az = (tgt[i3 + 2] - pz) * k;

          // vortex while the cloud rebuilds
          if (p < 1) {
            const sw = (1 - p) * 1.1;
            ax += -py * sw;
            ay += px * sw;
          }

          // a little breath so the letters never feel frozen
          const ph = phase[i];
          ax += Math.sin(t * 1.4 + ph) * 0.8;
          ay += Math.cos(t * 1.1 + ph) * 0.8;

          if (pointer.on) {
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < R2) {
              const d = Math.sqrt(d2) + 1e-4;
              const f = (1 - d / R) * (1 - d / R);
              // push outward, curl sideways (a whirlpool around the cursor) and drag along with the motion
              ax += (dx / d) * f * 120 - (dy / d) * f * 70 + pointer.vx * f * 1.8;
              ay += (dy / d) * f * 120 + (dx / d) * f * 70 + pointer.vy * f * 1.8;
              az += (seed[i] - 0.5) * f * 110;
            }
          }

          for (let s = 0; s < shocks.length; s++) {
            const age = t - shocks[s].t;
            const dx = px - shocks[s].x;
            const dy = py - shocks[s].y;
            const d = Math.sqrt(dx * dx + dy * dy) + 1e-4;
            const off = (d - age * 11) / 1.3;
            const ring = Math.exp(-off * off) * (1 - age / 1.9);

            if (ring > 0.01) {
              ax += (dx / d) * ring * 280;
              ay += (dy / d) * ring * 280;
              az += (seed[i] - 0.5) * ring * 200;
            }
          }

          const vx = (vel[i3] + ax * dt) * damp;
          const vy = (vel[i3 + 1] + ay * dt) * damp;
          const vz = (vel[i3 + 2] + az * dt) * damp;

          vel[i3] = vx;
          vel[i3 + 1] = vy;
          vel[i3 + 2] = vz;
          pos[i3] = px + vx * dt;
          pos[i3 + 1] = py + vy * dt;
          pos[i3 + 2] = pz + vz * dt;
          speed[i] = Math.sqrt(vx * vx + vy * vy + vz * vz);
        }

        posAttr.needsUpdate = true;
        speedAttr.needsUpdate = true;

        // the whole cloud leans toward the cursor so it reads as a solid object
        const tx = pointer.on ? pointer.nx * 0.4 : Math.sin(t * 0.5) * 0.24;
        const ty = pointer.on ? -pointer.ny * 0.25 : Math.sin(t * 0.37) * 0.09;
        points.rotation.y += (tx - points.rotation.y) * 0.06;
        points.rotation.x += (ty - points.rotation.x) * 0.06;
      };

      const loop = () => {
        raf = 0;

        if (!visible || disposed) {
          return;
        }

        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 1 / 20);
        last = now;
        t += dt;

        // with nobody touching it, walk through the results so the morph gets seen
        if (t - lastSwitch > 6 && now / 1000 - lastInteract.current > 8) {
          setActive((current + 1) % RESULTS.length);
        }

        step(dt);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };

      const io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;

          if (visible) {
            last = performance.now();

            if (!started) {
              started = true;
              morphT0 = t; // the assembly plays when the section scrolls into view
            }

            if (!raf) raf = requestAnimationFrame(loop);
          }
        },
        { threshold: 0.2 }
      );

      io.observe(host);

      teardown = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        observer.disconnect();
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerdown", onDown);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("pointercancel", onLeave);
        retarget.current = null;
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    void init();

    return () => {
      disposed = true;
      teardown();
    };
  }, [reduced, failed]);

  if (reduced || failed) {
    return <Podium />;
  }

  const hint = window.matchMedia("(pointer: coarse)").matches ? "Drag through it. Tap to burst it." : "Move through it. Click to burst it.";

  return (
    <div className="wins-stage">
      <div className="wins-canvas" ref={mount}>
        <p className="wins-hint" data-hidden={touched}>
          {hint}
        </p>
      </div>

      <div className="wins-chips" role="group" aria-label="Competition results">
        {RESULTS.map((result, index) => (
          <button
            key={result.rank}
            type="button"
            className="wins-chip"
            data-active={active === index}
            aria-pressed={active === index}
            onClick={() => choose(index)}
            onFocus={() => choose(index)}
            onPointerEnter={(event) => event.pointerType === "mouse" && choose(index)}
          >
            <b>{result.rank}</b>
            <span>{result.where}</span>
          </button>
        ))}
      </div>

      <p className="wins-caption" aria-live="polite">
        {RESULTS[active].detail}
      </p>
    </div>
  );
}
