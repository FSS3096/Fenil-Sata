import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type TickerProps = {
  items: string[];
  /** Base drift in percent of one loop per second; negative runs right-to-left reversed. */
  speed?: number;
  className?: string;
};

/** Endless strip whose speed follows scroll velocity and flips direction when you scroll back. */
export function Ticker({ items, speed = -4, className = "" }: TickerProps) {
  const reduced = usePrefersReducedMotion();
  const offset = useMotionValue(0);
  const direction = useRef(speed < 0 ? -1 : 1);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(offset, (value) => `${value}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const base = Math.abs(speed) * (delta / 1000);
    const push = boost.get();

    if (push < -0.05) direction.current = speed < 0 ? 1 : -1;
    else if (push > 0.05) direction.current = speed < 0 ? -1 : 1;

    let next = offset.get() + direction.current * base * (1 + Math.abs(push));
    // The track holds two identical halves, so wrap at one half.
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    offset.set(next);
  });

  const group = (suffix: string) =>
    items.map((item) => (
      <span className="ticker-item" key={`${suffix}-${item}`}>
        {item}
      </span>
    ));

  return (
    <div className={`ticker ${className}`} aria-hidden="true">
      <motion.div className="ticker-track" style={{ x }}>
        {group("a")}
        {group("b")}
      </motion.div>
    </div>
  );
}
