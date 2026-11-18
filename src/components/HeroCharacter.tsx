import { RefObject, useEffect, useRef } from "react";
import halfSrc from "../assets/hero/fenil-half.webp";
import fullSrc from "../assets/hero/fenil-full.webp";

/**
 * Scroll-linked "camera pull-back" hero character.
 *
 * Both illustrations live in one shared "world" whose coordinates are the pixels of the
 * full-body image. The half-body image is registered to it by matching the eye line and
 * eye distance, so the face stays put while a virtual camera zooms out. A moving mask
 * wipes the blazer away from the bottom up, revealing the full-body character beneath.
 *
 * Once the camera has settled, the full-body image is split into stacked layers
 * (body / head / eyes) that follow the cursor with different spring strengths.
 */

// --- World geometry (pixels of the full-body source image) -------------------------
const FULL_W = 1199;
const FULL_H = 1312;
const EYE = { x: 609, y: 125 }; // eye midpoint in the full-body art
const HALF_EYE = { x: 662, y: 340 }; // eye midpoint in the half-body art
const HALF_SRC = { w: 1300, h: 1209 };
const K = 49 / 150; // half-body -> world scale (matches inter-eye distance)
const HALF_LEFT = EYE.x - K * HALF_EYE.x;
const HALF_TOP = EYE.y - K * HALF_EYE.y;
const HALF_W = HALF_SRC.w * K;
const HALF_H = HALF_SRC.h * K;
const HALF_BOTTOM = HALF_TOP + HALF_H;
const HALF_CX = HALF_LEFT + (HALF_SRC.w / 2) * K;
const HALF_VISIBLE_H = 1162 * K; // opaque height of the half-body art
const HALF_VISIBLE_W = 1218 * K;
const FIGURE_H = 1222;
const FIGURE_CX = 616;
const FIGURE_CY = 652;
const NECK = { x: 607, y: 245 }; // pivot where the head layer meets the body layer
const FEET_Y = 1240;
const HEAD_FOCUS = { x: 609, y: 150 };

// --- Math helpers ------------------------------------------------------------------
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeSine = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(t));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

type Spring = { x: number; v: number };
const spring = (s: Spring, target: number, k: number, c: number, dt: number) => {
  s.v += (k * (target - s.x) - c * s.v) * dt;
  s.x += s.v * dt;
};

// Achievement tags. Each is titled by what it is, never by a body part or garment, and the dot
// only marks a point on the figure so the line has somewhere to land. Every line is from the resume.
const CALLOUTS = [
  { id: "school", wx: 664, wy: 150, side: "right", title: "Newton School", text: "B.Tech CS (AI/ML), NST '29. Starts from what is broken." },
  { id: "cos", wx: 500, wy: 395, side: "left", title: "Chief of Staff", text: "E-Cell, 50+ members. Turns decisions into execution." },
  { id: "semzero", wx: 715, wy: 430, side: "right", title: "Semester Zero", text: "3 competitions, 10+ sessions, 600+ learners." },
  { id: "startup", wx: 480, wy: 800, side: "left", title: "Startup-Info", text: "30+ founders use it, without a single ad." },
  { id: "podiums", wx: 745, wy: 800, side: "right", title: "Podiums", text: "6+ nationals. BITS Pilani 2nd, IIT Roorkee top 5 of 300." }
] as const;

type Props = {
  /** Tall scroll track whose scroll progress (0..1) drives the transformation. */
  trackRef: RefObject<HTMLElement>;
};

export function HeroCharacter({ trackRef }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef<HTMLImageElement>(null);
  const upperRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLImageElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const calloutRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const camera = cameraRef.current;
    const half = halfRef.current;
    const upper = upperRef.current;
    const head = headRef.current;
    const eyes = eyesRef.current;
    const disc = discRef.current;
    if (!track || !stage || !camera || !half || !upper || !head || !eyes || !disc) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    const onMotion = () => (reduced = motionQuery.matches);
    motionQuery.addEventListener("change", onMotion);

    const stackedQuery = window.matchMedia("(max-width: 1024px)");
    let W = stage.clientWidth;
    let H = stage.clientHeight;
    const resize = new ResizeObserver(() => {
      W = stage.clientWidth;
      H = stage.clientHeight;
    });
    resize.observe(stage);

    // Cursor state
    const pointer = { x: -1, y: -1, active: false };
    let energy = 0;
    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      energy = 1;
    };
    const onLeave = () => (pointer.active = false);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    // Springs: [x, y] per layer. Head strongest, eyes fastest, body slowest.
    const sHead = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 } };
    const sEyes = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 } };
    const sBody = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 } };
    const sHalf = { x: { x: 0, v: 0 }, y: { x: 0, v: 0 } };

    let progress = -1;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    io.observe(track);

    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      raf = requestAnimationFrame(frame);

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      // --- Scroll progress (smoothed, fully reversible) ---------------------------
      const rect = track!.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const target = range > 0 ? clamp(-rect.top / range) : 0;
      progress = progress < 0 || reduced ? target : progress + (target - progress) * (1 - Math.exp(-dt * 9));
      const p = progress;
      track!.style.setProperty("--hero-p", p.toFixed(4));

      // --- Camera -----------------------------------------------------------------
      // Wide layouts: the bust starts centred between the copy and the proof points, then
      // glides to the right while the camera pulls back. Stacked layouts stay centred.
      const stacked = stackedQuery.matches;
      const S0 = stacked
        ? Math.min((0.86 * H) / HALF_VISIBLE_H, (0.98 * W) / HALF_VISIBLE_W)
        : Math.min((0.72 * H) / HALF_VISIBLE_H, (0.42 * W) / HALF_VISIBLE_W);
      const S1 = Math.min((0.84 * H) / FIGURE_H, (0.9 * W) / 460);
      const u = easeSine((p - 0.05) / 0.9);
      const slide = easeSine((p - 0.02) / 0.88);
      const S = Math.exp(lerp(Math.log(S0), Math.log(S1), u));
      const Fx = lerp(HALF_CX, FIGURE_CX, u);
      const Fy = lerp(HALF_BOTTOM, FIGURE_CY, u);
      const Cx = stacked ? W / 2 : lerp(W * 0.5, W * 0.7, slide);
      const Cy = lerp(H, H * 0.54, u);
      camera!.style.transform = `translate3d(${Cx - S * Fx}px, ${Cy - S * Fy}px, 0) scale(${S})`;

      // Sticker disc grows and settles behind the torso as the camera pulls back.
      disc!.style.transform = `translateY(${lerp(0, 90, u).toFixed(1)}px) scale(${lerp(0.63, 1, u).toFixed(4)})`;

      // Callout anchors follow the character through the camera.
      CALLOUTS.forEach((item, index) => {
        const node = calloutRefs.current[index];
        if (!node) return;
        node.style.transform = `translate3d(${(Cx + S * (item.wx - Fx)).toFixed(1)}px, ${(Cy + S * (item.wy - Fy)).toFixed(1)}px, 0)`;
      });

      // Only let the reveal zone take clicks once it has faded in.
      const revealed = p > 0.5 ? "1" : "0";
      if (track!.dataset.revealed !== revealed) track!.dataset.revealed = revealed;

      // Wipe: blazer dissolves bottom-up while the full body is revealed beneath.
      const ym = lerp(HALF_BOTTOM + 31, -40, easeSine((p - 0.05) / 0.75));
      camera!.style.setProperty("--ym", `${ym.toFixed(1)}px`);
      camera!.style.setProperty("--yf", `${Math.min(ym, 330).toFixed(1)}px`);

      // --- Cursor -> gaze ---------------------------------------------------------
      energy *= Math.exp(-dt / 1.4);
      const amp = 0.7 + 0.3 * energy; // settles to 70% but keeps facing the cursor
      const stageRect = stage!.getBoundingClientRect();
      const hx = stageRect.left + Cx + S * (HEAD_FOCUS.x - Fx);
      const hy = stageRect.top + Cy + S * (HEAD_FOCUS.y - Fy);
      let nx = 0;
      let ny = 0;
      if (pointer.active && !reduced) {
        nx = Math.tanh((pointer.x - hx) / (window.innerWidth * 0.3));
        ny = Math.tanh((pointer.y - hy) / (window.innerHeight * 0.3));
      }

      // Cursor tracking becomes fully active only once the pull-back has finished.
      const wFull = smooth(0.82, 1, p);
      const wHalf = (1 - smooth(0.04, 0.2, p)) * 0.5;

      spring(sHead.x, nx * wFull * amp, 60, 11, dt);
      spring(sHead.y, ny * wFull * amp, 60, 11, dt);
      spring(sEyes.x, nx * wFull * amp, 150, 18, dt);
      spring(sEyes.y, ny * wFull * amp, 150, 18, dt);
      spring(sBody.x, nx * wFull * amp, 24, 8, dt);
      spring(sBody.y, ny * wFull * amp, 24, 8, dt);
      spring(sHalf.x, nx * wHalf * amp, 30, 9, dt);
      spring(sHalf.y, ny * wHalf * amp, 30, 9, dt);

      // Body leans a hair around the feet, so the legs stay planted.
      upper!.style.transform = `translateX(${(sBody.x.x * 3).toFixed(3)}px) rotate(${(sBody.x.x * 0.35).toFixed(3)}deg)`;
      // Head turns around the neck. A skew anchored at the neck shifts the crown the most and
      // the collar not at all, so the seam against the body layer never opens up.
      head!.style.transform =
        `skewX(${(-sHead.x.x * 4).toFixed(3)}deg) scaleY(${(1 - sHead.y.x * 0.014).toFixed(4)}) ` +
        `perspective(600px) rotateY(${(sHead.x.x * 12).toFixed(3)}deg) ` +
        `rotateX(${(-sHead.y.x * 8).toFixed(3)}deg) rotate(${(sHead.x.x * 1.2).toFixed(3)}deg)`;
      // Eyes drift further and faster than the head, which sells the gaze.
      eyes!.style.transform = `translate(${(sEyes.x.x * 5).toFixed(3)}px, ${(sEyes.y.x * 3.2).toFixed(3)}px)`;

      // Half-body: gentle breathing + very subtle cursor parallax.
      const breathe = reduced ? 0 : Math.sin(t * 1.5) * (1 - smooth(0.04, 0.2, p));
      half!.style.transform =
        `translate(${(sHalf.x.x * 5).toFixed(3)}px, ${(breathe * 1.4 + sHalf.y.x * 3).toFixed(3)}px) ` +
        `rotate(${(sHalf.x.x * 0.5).toFixed(3)}deg) scale(${(1 + breathe * 0.0025).toFixed(5)})`;
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      resize.disconnect();
      motionQuery.removeEventListener("change", onMotion);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [trackRef]);

  return (
    <div
      ref={stageRef}
      className="hero-stage"
      role="img"
      aria-label="Illustrated portrait of Fenil Sata"
    >
      <div
        ref={cameraRef}
        className="hero-camera"
        style={
          {
            width: FULL_W,
            height: FULL_H,
            "--half-top": `${HALF_TOP}px`,
            "--neck-y": `${NECK.y}px`
          } as React.CSSProperties
        }
      >
        <div ref={discRef} className="hero-disc" />
        <div className="hero-full">
          <div
            ref={upperRef}
            className="hero-upper"
            style={{ transformOrigin: `${NECK.x}px ${FEET_Y}px` }}
          >
            <img className="hero-layer hero-body" src={fullSrc} alt="" draggable={false} decoding="async" />
            <div
              ref={headRef}
              className="hero-headgroup"
              style={{ transformOrigin: `${NECK.x}px ${NECK.y}px` }}
            >
              <img className="hero-layer hero-head" src={fullSrc} alt="" draggable={false} decoding="async" />
              <img
                ref={eyesRef}
                className="hero-layer hero-eyes"
                src={fullSrc}
                alt=""
                draggable={false}
                decoding="async"
              />
            </div>
          </div>
        </div>
        <img
          ref={halfRef}
          className="hero-half"
          src={halfSrc}
          alt=""
          draggable={false}
          // React 18 only knows the lowercase attribute
          {...({ fetchpriority: "high" } as Record<string, string>)}
          style={{
            left: HALF_LEFT,
            top: HALF_TOP,
            width: HALF_W,
            height: HALF_H,
            transformOrigin: `${HALF_W / 2}px ${HALF_H}px`
          }}
        />
      </div>
      {CALLOUTS.map((item, index) => (
        <div
          key={item.id}
          ref={(node) => {
            calloutRefs.current[index] = node;
          }}
          className="callout"
          data-side={item.side}
          style={{ "--i": index } as React.CSSProperties}
        >
          <span className="callout-dot" />
          <span className="callout-rule" />
          <p className="callout-text">
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
